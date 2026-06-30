# YOSSA: GitHub Pages + Railway + Telegram

Схема:

```text
GitHub Pages -> Railway API -> Telegram bot
```

Секреты хранятся только в Railway. На GitHub лежит статический сайт и публичный адрес Railway API.

## 1. Telegram

1. Откройте `@BotFather` в Telegram.
2. Создайте бота командой `/newbot`.
3. Скопируйте токен в переменную Railway `TELEGRAM_BOT_TOKEN`.
4. Добавьте бота в чат или группу, куда должны приходить заявки.
5. Напишите любое сообщение в этот чат.
6. Откройте ссылку:

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates
```

7. Найдите `message.chat.id` и сохраните его в Railway как `TELEGRAM_CHAT_ID`.
8. Если получателей несколько, укажите их через запятую.

## 2. Railway

Railway нужен только для API заявок и отправки в Telegram.

Если деплоите весь репозиторий, укажите root directory:

```text
outputs/yossa-site
```

Если в GitHub-репозитории лежит только содержимое папки `outputs/yossa-site`, root directory указывать не нужно.

Start command:

```bash
npm start
```

Переменные окружения Railway:

```text
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=1581774364,964317402
LEAD_SOURCE=YOSSA GitHub Pages
ALLOWED_ORIGINS=https://yossafitness.ru,http://yossafitness.ru,https://www.yossafitness.ru,http://www.yossafitness.ru,https://isrmtnkv.github.io
```

После включения HTTPS можно оставить только HTTPS-домены:

```text
ALLOWED_ORIGINS=https://yossafitness.ru,https://www.yossafitness.ru,https://isrmtnkv.github.io
```

Опционально для Telegram-групп с темами:

```text
TELEGRAM_THREAD_ID=...
```

`PORT` в Railway не задавайте вручную. Railway передаст его приложению сам.

## 3. GitHub Pages

1. Загрузите содержимое папки `outputs/yossa-site` в GitHub-репозиторий.
2. В настройках репозитория включите GitHub Pages.
3. После деплоя Railway скопируйте публичный URL Railway.
4. В файле `config.js` укажите Railway URL без слеша на конце:

```js
window.YOSSA_API_URL = "https://your-railway-app.up.railway.app";
```

В репозитории уже есть `CNAME` для `yossafitness.ru`. Если GitHub Pages включен, сайт будет открываться на `https://yossafitness.ru/`.

После этого форма на GitHub Pages будет отправлять заявки на:

```text
https://your-railway-app.up.railway.app/api/lead
```

## 4. Локальная проверка

```bash
cd outputs/yossa-site
cp .env.example .env
npm run dev
```

Откройте:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/healthz
```

В режиме `TELEGRAM_DRY_RUN=true` сервер печатает Telegram-сообщение в терминал вместо реальной отправки.

## 5. Важно перед запуском

- Уберите `TELEGRAM_DRY_RUN=true` в Railway или поставьте `TELEGRAM_DRY_RUN=false`.
- Замените тестовые Telegram-ссылки в `index.html`, если у клуба уже есть реальные аккаунты.
- Не публикуйте `.env`: он добавлен в `.gitignore`.
