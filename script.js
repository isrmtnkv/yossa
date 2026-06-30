const programData = {
  gym: {
    eyebrow: "Для силы и тонуса",
    title: "Тренажерный зал",
    image: "assets/training-gym.jpg",
    imageAlt: "Тренажерный зал YÖSSA",
    caption: "Светлый зал с кардио, силовой зоной и приватным ритмом занятий.",
    text:
      "Работа с оборудованием, кардио и функциональные упражнения для тонуса, осанки и уверенного прогресса без лишнего давления.",
    list: ["силовая база", "кардио и функциональные блоки", "сопровождение тренера"],
  },
  pilates: {
    eyebrow: "Для осанки и контроля",
    title: "Пилатес",
    image: "assets/training-gym.jpg",
    imageAlt: "Зона пилатеса YÖSSA",
    caption: "Зона для точной работы с корпусом, осанкой и контролем движения.",
    text:
      "Мягкая, но глубокая нагрузка на мышцы кора, мобильность и осанку. Подходит, когда хочется собранного тела без перегруза.",
    list: ["Reformer и mat-практики", "контроль движения", "бережная нагрузка"],
  },
  aerial: {
    eyebrow: "Для легкости и растяжки",
    title: "Aerial и гамаки",
    image: "assets/aerial-group.jpg",
    imageAlt: "Групповая студия YÖSSA с гамаками",
    caption: "Студия с гамаками для воздушных классов, растяжки и мягкого вытяжения.",
    text:
      "Воздушные занятия в гамаках помогают снять зажимы, вытянуть позвоночник и почувствовать движение легче.",
    list: ["занятия в малых группах", "гамаки", "мягкая декомпрессия"],
  },
  stretch: {
    eyebrow: "Для гибкости и восстановления",
    title: "Stretch",
    image: "assets/aerial-group.jpg",
    imageAlt: "Студия групповых занятий YÖSSA",
    caption: "Мягкое пространство для растяжки, мобильности и спокойной работы с телом.",
    text:
      "Спокойные классы на растяжку и мобильность после рабочего дня или силовой нагрузки.",
    list: ["мобильность суставов", "растяжка", "снятие напряжения"],
  },
  recovery: {
    eyebrow: "Для восстановления",
    title: "Recovery",
    image: "assets/hamam.jpg",
    imageAlt: "Хамам YÖSSA",
    caption: "Теплая зона восстановления после нагрузки, массажа и ухода за телом.",
    text:
      "Хамам, массаж и ритуалы ухода закрывают тренировку восстановлением, расслаблением и вниманием к телу.",
    list: ["хамам", "массаж", "ритуалы восстановления"],
  },
};

const tabs = document.querySelectorAll("[data-program]");
const eyebrow = document.querySelector("[data-program-eyebrow]");
const title = document.querySelector("[data-program-title]");
const text = document.querySelector("[data-program-text]");
const list = document.querySelector("[data-program-list]");
const programImage = document.querySelector("[data-program-image]");
const programCaption = document.querySelector("[data-program-caption]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const data = programData[tab.dataset.program];
    if (!data) return;

    tabs.forEach((item) => {
      const isCurrent = item === tab;
      item.classList.toggle("is-active", isCurrent);
      item.setAttribute("aria-selected", String(isCurrent));
    });

    eyebrow.textContent = data.eyebrow;
    title.textContent = data.title;
    text.textContent = data.text;
    programImage.src = data.image;
    programImage.alt = data.imageAlt;
    programCaption.textContent = data.caption;
    list.replaceChildren(...data.list.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }));
  });
});

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!isOpen));
    hamburger.classList.toggle("is-open", !isOpen);
    mobileMenu.classList.toggle("is-open", !isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.classList.remove("is-open");
      mobileMenu.classList.remove("is-open");
    });
  });
}

document.querySelectorAll("[data-horizontal-scroll]").forEach((slider) => {
  slider.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    slider.scrollLeft += event.deltaY;
  }, { passive: false });
});

const revealItems = document.querySelectorAll(
  "main > section, .feature-strip, .program-photo, .program-card, .contact-form, .contact-list, .map-card"
);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  revealItems.forEach((item) => item.classList.add("reveal"));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const form = document.querySelector(".contact-form");
const message = document.querySelector(".form-message");

if (form && message) {
  const submitButton = form.querySelector("[type='submit']");
  const defaultButtonText = submitButton ? submitButton.textContent : "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const interest = String(formData.get("interest") || "Гостевой визит").trim();
    const website = String(formData.get("website") || "").trim();
    const endpoint = getLeadEndpoint();

    message.classList.remove("is-ok");

    if (!name || !phone) {
      message.textContent = "Заполните имя и телефон, чтобы администратор смог связаться с вами.";
      return;
    }

    if (window.location.protocol === "file:" && endpoint.startsWith("/")) {
      message.textContent = "Форма готова. Для отправки заявки откройте сайт через GitHub Pages, Railway или локальный сервер.";
      return;
    }

    setFormPending(submitButton, true, defaultButtonText);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          interest,
          website,
          page: window.location.href,
          source: "YOSSA site",
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.ok === false) {
        throw new Error(payload.message || "Lead request failed");
      }

      message.classList.add("is-ok");
      message.textContent = payload.message || "Спасибо, заявка принята. Администратор свяжется с вами для подбора времени.";
      form.reset();
    } catch (error) {
      console.error(error);
      message.textContent = "Не получилось отправить заявку. Напишите в Telegram или попробуйте позже.";
    } finally {
      setFormPending(submitButton, false, defaultButtonText);
    }
  });
}

function getLeadEndpoint() {
  const configuredUrl = String(window.YOSSA_API_URL || "").trim();

  if (!configuredUrl) {
    return "/api/lead";
  }

  if (configuredUrl.endsWith("/api/lead")) {
    return configuredUrl;
  }

  return `${configuredUrl.replace(/\/+$/, "")}/api/lead`;
}

function setFormPending(button, isPending, defaultText) {
  if (!button) return;

  button.disabled = isPending;
  button.setAttribute("aria-busy", String(isPending));
  button.textContent = isPending ? "Отправляем..." : defaultText;
}
