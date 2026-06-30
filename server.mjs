import { createReadStream, existsSync, readFileSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const publicDir = __dirname;
const maxBodyBytes = 64 * 1024;
const rateWindowMs = 60 * 1000;
const rateLimit = 12;
const rateStore = new Map();

loadLocalEnv();

const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    const isApiRoute = url.pathname.startsWith("/api/");

    if (isApiRoute) {
      addCorsHeaders(request, response);

      if (!isOriginAllowed(request)) {
        return sendJson(response, 403, {
          ok: false,
          message: "Origin is not allowed",
        });
      }

      if (request.method === "OPTIONS") {
        return sendEmpty(response, 204);
      }
    }

    if (request.method === "GET" && url.pathname === "/healthz") {
      return sendJson(response, 200, {
        ok: true,
        service: "yossa-site",
        telegramConfigured: isTelegramConfigured(),
        dryRun: isDryRun(),
      });
    }

    if (request.method === "POST" && url.pathname === "/api/lead") {
      return handleLead(request, response);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return sendJson(response, 405, { ok: false, message: "Method not allowed" });
    }

    return serveStatic(url.pathname, response, request.method === "HEAD");
  } catch (error) {
    console.error(error);
    return sendJson(response, 500, { ok: false, message: "Server error" });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`YOSSA site is running on port ${port}`);
  if (!isTelegramConfigured() && !isDryRun()) {
    console.warn("Telegram env vars are missing. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.");
  }
});

async function handleLead(request, response) {
  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp)) {
    return sendJson(response, 429, {
      ok: false,
      message: "Слишком много заявок. Попробуйте чуть позже.",
    });
  }

  const body = await readJsonBody(request);
  const lead = normalizeLead(body, request);

  if (lead.website) {
    return sendJson(response, 200, { ok: true });
  }

  if (!lead.name || !lead.phone) {
    return sendJson(response, 400, {
      ok: false,
      message: "Заполните имя и телефон.",
    });
  }

  const message = formatTelegramMessage(lead);
  await sendTelegramMessage(message);

  return sendJson(response, 200, {
    ok: true,
    message: "Спасибо, заявка принята. Администратор свяжется с вами для подбора времени.",
  });
}

async function serveStatic(pathname, response, headOnly = false) {
  const decodedPath = decodeURIComponent(pathname);
  const requestPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const normalizedPath = normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, normalizedPath);
  const rel = relative(publicDir, filePath);

  if (rel.startsWith("..") || rel === "server.mjs" || rel === "package.json" || rel.startsWith(".")) {
    return sendText(response, 404, "Not found");
  }

  if (!existsSync(filePath)) {
    return sendText(response, 404, "Not found");
  }

  const fileStat = await stat(filePath);
  if (!fileStat.isFile()) {
    return sendText(response, 404, "Not found");
  }

  const type = mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
  response.writeHead(200, {
    "Content-Type": type,
    "Content-Length": fileStat.size,
    "Cache-Control": isAssetPath(filePath) ? "public, max-age=31536000, immutable" : "no-cache",
  });

  if (headOnly) {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";

    request.on("data", (chunk) => {
      raw += chunk;
      if (Buffer.byteLength(raw) > maxBodyBytes) {
        request.destroy();
        reject(new Error("Request body too large"));
      }
    });

    request.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    request.on("error", reject);
  });
}

function normalizeLead(body, request) {
  const headers = request.headers;
  const host = headers.host || "";

  return {
    name: clean(body.name, 80),
    phone: clean(body.phone, 40),
    interest: clean(body.interest, 80) || "Гостевой визит",
    website: clean(body.website, 120),
    page: clean(body.page, 240),
    source: clean(body.source, 80) || process.env.LEAD_SOURCE || "YOSSA site",
    userAgent: clean(headers["user-agent"], 200),
    ip: getClientIp(request),
    host,
    createdAt: new Date().toISOString(),
  };
}

function formatTelegramMessage(lead) {
  const lines = [
    "<b>Новая заявка YÖSSA</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> <code>${escapeHtml(lead.phone)}</code>`,
    `<b>Интерес:</b> ${escapeHtml(lead.interest)}`,
    `<b>Источник:</b> ${escapeHtml(lead.source)}`,
  ];

  if (lead.page) {
    lines.push(`<b>Страница:</b> ${escapeHtml(lead.page)}`);
  }

  lines.push(
    `<b>Время:</b> ${escapeHtml(formatDate(lead.createdAt))}`,
    `<b>IP:</b> ${escapeHtml(lead.ip)}`
  );

  return lines.join("\n");
}

async function sendTelegramMessage(text) {
  if (isDryRun()) {
    console.log("[TELEGRAM_DRY_RUN]", getTelegramChatIds().join(", ") || "no chat ids", text);
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = getTelegramChatIds();

  if (!token || chatIds.length === 0) {
    throw new Error("Telegram is not configured");
  }

  const deliveries = await Promise.allSettled(
    chatIds.map((chatId) => sendTelegramToChat(token, chatId, text))
  );
  const failedChatIds = deliveries
    .map((result, index) => (result.status === "rejected" ? chatIds[index] : ""))
    .filter(Boolean);

  if (failedChatIds.length > 0) {
    throw new Error(`Telegram sendMessage failed for chat id(s): ${failedChatIds.join(", ")}`);
  }
}

async function sendTelegramToChat(token, chatId, text) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };

  if (process.env.TELEGRAM_THREAD_ID && chatId.startsWith("-")) {
    payload.message_thread_id = Number(process.env.TELEGRAM_THREAD_ID);
  }

  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await telegramResponse.json().catch(() => ({}));

  if (!telegramResponse.ok || result.ok === false) {
    throw new Error(`Telegram sendMessage failed: ${result.description || telegramResponse.status}`);
  }
}

function getTelegramChatIds() {
  return String(process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID || "")
    .split(",")
    .map((chatId) => chatId.trim())
    .filter(Boolean);
}

function sendJson(response, status, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  response.end(body);
}

function sendText(response, status, text) {
  response.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": Buffer.byteLength(text),
  });
  response.end(text);
}

function sendEmpty(response, status) {
  response.writeHead(status);
  response.end();
}

function addCorsHeaders(request, response) {
  const origin = request.headers.origin;
  const allowedOrigin = getAllowedOrigin(origin);

  if (allowedOrigin) {
    response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }

  response.setHeader("Vary", "Origin");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Max-Age", "86400");
}

function isOriginAllowed(request) {
  const origin = request.headers.origin;
  if (!origin) return true;
  return Boolean(getAllowedOrigin(origin));
}

function getAllowedOrigin(origin) {
  if (!origin) return "";

  const allowedOrigins = String(process.env.ALLOWED_ORIGINS || "*")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (allowedOrigins.includes("*")) {
    return "*";
  }

  return allowedOrigins.includes(origin) ? origin : "";
}

function clean(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getClientIp(request) {
  const forwardedFor = request.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.socket.remoteAddress || "unknown";
}

function checkRateLimit(key) {
  const now = Date.now();
  const current = rateStore.get(key) || { count: 0, resetAt: now + rateWindowMs };

  if (current.resetAt < now) {
    rateStore.set(key, { count: 1, resetAt: now + rateWindowMs });
    return true;
  }

  current.count += 1;
  rateStore.set(key, current);
  return current.count <= rateLimit;
}

function isAssetPath(filePath) {
  return relative(publicDir, filePath).startsWith("assets/");
}

function isTelegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && getTelegramChatIds().length > 0);
}

function isDryRun() {
  return process.env.TELEGRAM_DRY_RUN === "true";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Moscow",
  }).format(new Date(value));
}

function loadLocalEnv() {
  const envPath = join(publicDir, ".env");
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
