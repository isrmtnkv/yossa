const galleries = {
  entrance: {
    title: "Входная группа",
    text: "Ресепшн, мягкий свет, лаунж и первый визуальный контакт с клубом.",
    images: ["assets/entrance.jpg", "assets/entrance-02.jpg", "assets/entrance-04.jpg"]
  },
  gym: {
    title: "Тренажерный зал",
    text: "Силовая зона, функциональное оборудование и пространства для персональной работы.",
    images: ["assets/gym-pilates-01.jpg", "assets/gym-pilates-10.jpg", "assets/gym-pilates-16.jpg"]
  },
  pilates: {
    title: "Пилатес Reformer",
    text: "Зоны для точной, внимательной и спокойной работы с телом.",
    images: ["assets/gym-pilates-04.jpg", "assets/gym-pilates-06.jpg", "assets/gym-pilates-07.jpg"]
  },
  group: {
    title: "Групповые студии",
    text: "Студии для групповых тренировок, растяжки, йоги и аэро-направлений.",
    images: ["assets/group.jpg", "assets/group-03.jpg", "assets/group-05.jpg"]
  },
  hammam: {
    title: "Хамам",
    text: "Теплая зона восстановления с мягкими материалами и спокойной геометрией.",
    images: ["assets/hammam.jpg", "assets/hammam-04.jpg"]
  },
  massage: {
    title: "Массажный кабинет",
    text: "Кабинеты для массажа и персональных процедур восстановления.",
    images: ["assets/massage-01.jpg", "assets/massage-03.jpg"]
  },
  locker: {
    title: "Раздевалка",
    text: "Чистая, светлая зона с продуманным хранением и комфортной навигацией.",
    images: ["assets/locker.jpg"]
  },
  shower: {
    title: "Душевая",
    text: "Душевые пространства с выразительной теплой палитрой и приватными кабинами.",
    images: ["assets/shower.jpg"]
  }
};

const directions = {
  pilates: {
    title: "Пилатес Reformer",
    text: "Спокойная силовая работа на реформере: выстраиваем осанку, контроль, гибкость и точную работу мышц без лишней нагрузки.",
    images: ["assets/gym-pilates-04.jpg", "assets/gym-pilates-06.jpg", "assets/gym-pilates-07.jpg"],
    bullets: ["Индивидуальная настройка нагрузки", "Глубокая работа с корпусом", "Подходит для восстановления и тонуса"]
  },
  functional: {
    title: "Функциональный тренинг",
    text: "Динамичные тренировки для силы, выносливости и уверенного движения в повседневной жизни.",
    images: ["assets/gym-pilates-12.jpg", "assets/gym-pilates-10.jpg", "assets/gym-pilates-16.jpg"],
    bullets: ["Силовые и кардио-блоки", "Работа с техникой", "Подходит для регулярного прогресса"]
  },
  stretching: {
    title: "Растяжка",
    text: "Мягкая работа с подвижностью, дыханием и снятием напряжения после насыщенного дня или силовой тренировки.",
    images: ["assets/group-03.jpg", "assets/group-04.jpg", "assets/group-07.jpg"],
    bullets: ["Гибкость без перегруза", "Спокойный темп", "Комфортное восстановление"]
  },
  yoga: {
    title: "Йога",
    text: "Практики для баланса, концентрации и бережной силы тела в эстетичном пространстве клуба.",
    images: ["assets/group-05.jpg", "assets/group-02.jpg", "assets/group-06.jpg"],
    bullets: ["Баланс тела и дыхания", "Подходит разному уровню", "Мягкая работа с вниманием"]
  },
  aero: {
    title: "Аэро",
    text: "Воздушные тренировки с гамаком: развиваем гибкость, координацию и красивую амплитуду движения.",
    images: ["assets/group.jpg", "assets/group-01.jpg", "assets/group-04.jpg"],
    bullets: ["Работа с гамаком", "Легкость и координация", "Эффектная нагрузка без рутины"]
  },
  personal: {
    title: "Персональные тренировки",
    text: "Индивидуальный план под вашу цель: от уверенного старта до точной работы над формой и техникой.",
    images: ["assets/gym-pilates-16.jpg", "assets/gym-pilates-01.jpg", "assets/gym-pilates-15.jpg"],
    bullets: ["Тренер ведет процесс", "Цель и нагрузка подбираются лично", "Быстрая обратная связь по технике"]
  }
};

const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileNav.hidden = isOpen;
  });

  mobileNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
    }
  });
}

const heroPanel = document.querySelector(".hero-panel");
const heroImage = document.querySelector(".hero-image");
const heroButtons = [...document.querySelectorAll(".hero-page")];
const heroSlides = heroButtons.map((button) => button.dataset.hero).filter(Boolean);
let currentHeroIndex = 0;
let heroTimer;

const switchHero = (index) => {
  if (!heroImage || !heroPanel || heroSlides.length === 0) return;

  currentHeroIndex = (index + heroSlides.length) % heroSlides.length;
  const nextImage = heroSlides[currentHeroIndex];

  if (!nextImage || heroImage.getAttribute("src") === nextImage) return;

  heroButtons.forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === currentHeroIndex);
  });
  heroPanel.classList.add("is-changing");

  const loader = new Image();
  loader.onload = () => {
    heroImage.src = nextImage;
    window.setTimeout(() => heroPanel.classList.remove("is-changing"), 160);
  };
  loader.src = nextImage;
};

const restartHeroTimer = () => {
  window.clearInterval(heroTimer);
  heroTimer = window.setInterval(() => switchHero(currentHeroIndex + 1), 5000);
};

heroButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    switchHero(index);
    restartHeroTimer();
  });
});

if (heroSlides.length > 1) restartHeroTimer();

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const spacesSection = document.querySelector(".spaces-section");
const programsSection = document.querySelector(".programs-plans");
const galleryBlock = document.querySelector(".gallery-block");
let motionFrame = null;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const updateScrollMotion = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = clamp(scrollTop / maxScroll, 0, 1);

  root.style.setProperty("--scroll-progress", progress.toFixed(4));
  root.style.setProperty("--journey-progress", progress.toFixed(4));

  if (!reduceMotion.matches) {
    root.style.setProperty("--hero-shift", Math.min(180, scrollTop * 0.16).toFixed(2));

    if (spacesSection) {
      const rect = spacesSection.getBoundingClientRect();
      const sectionProgress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
      root.style.setProperty("--orbit-x", ((sectionProgress - 0.5) * 70).toFixed(2));
      root.style.setProperty("--orbit-y", ((0.5 - sectionProgress) * 94).toFixed(2));
      root.style.setProperty("--orbit-rotate", (sectionProgress * 320).toFixed(2));
    }

    if (programsSection) {
      const rect = programsSection.getBoundingClientRect();
      const sectionProgress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
      root.style.setProperty("--program-shift", ((sectionProgress - 0.5) * 160).toFixed(2));
      root.style.setProperty("--program-rotate", (sectionProgress * 420).toFixed(2));
    }

    if (galleryBlock) {
      const rect = galleryBlock.getBoundingClientRect();
      const sectionProgress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
      root.style.setProperty("--gallery-shift", ((sectionProgress - 0.5) * 180).toFixed(2));
    }
  }

  motionFrame = null;
};

const requestScrollMotion = () => {
  if (motionFrame) return;
  motionFrame = window.requestAnimationFrame(updateScrollMotion);
};

window.addEventListener("scroll", requestScrollMotion, { passive: true });
window.addEventListener("resize", requestScrollMotion);
updateScrollMotion();

if (!reduceMotion.matches && window.matchMedia("(hover: hover)").matches) {
  document
    .querySelectorAll(".space-card, .direction-card, .plan-card, .gallery-mosaic button, .review-card")
    .forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-y", (x * 4.8).toFixed(2));
        card.style.setProperty("--tilt-x", (-y * 4.8).toFixed(2));
      });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-y", "0");
        card.style.setProperty("--tilt-x", "0");
      });
    });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const dialog = document.querySelector(".gallery-dialog");
const dialogImage = document.querySelector(".dialog-image");
const dialogTitle = document.querySelector(".dialog-title");
const dialogText = document.querySelector(".dialog-text");
const dialogKicker = document.querySelector(".dialog-kicker");
const dialogThumbs = document.querySelector(".dialog-thumbs");
const dialogClose = document.querySelector(".dialog-close");
const directionDialog = document.querySelector(".direction-dialog");
const directionDialogClose = document.querySelector(".direction-dialog-close");
const directionDialogImage = document.querySelector(".direction-dialog-image");
const directionDialogTitle = document.querySelector(".direction-dialog-title");
const directionDialogText = document.querySelector(".direction-dialog-text");
const directionDialogList = document.querySelector(".direction-dialog-list");
const directionDialogThumbs = document.querySelector(".direction-dialog-thumbs");

const setModalOrigin = (modal, trigger) => {
  if (!modal || !trigger || reduceMotion.matches) {
    modal?.style.removeProperty("--dialog-enter-x");
    modal?.style.removeProperty("--dialog-enter-y");
    return;
  }

  const rect = trigger.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const viewportX = window.innerWidth / 2;
  const viewportY = window.innerHeight / 2;

  modal.style.setProperty("--dialog-enter-x", `${(originX - viewportX) * 0.46}px`);
  modal.style.setProperty("--dialog-enter-y", `${(originY - viewportY) * 0.46}px`);
};

const openModal = (modal, trigger) => {
  if (!modal) return;
  const scrollY = window.scrollY;
  setModalOrigin(modal, trigger);

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }

  document.body.classList.add("is-locked");
  window.requestAnimationFrame(() => window.scrollTo(0, scrollY));
};

const closeModal = (modal) => {
  if (!modal) return;
  if (typeof modal.close === "function") {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }
  if (!document.querySelector("dialog[open]")) document.body.classList.remove("is-locked");
};

document.querySelectorAll("dialog").forEach((modal) => {
  modal.addEventListener("close", () => {
    if (!document.querySelector("dialog[open]")) document.body.classList.remove("is-locked");
  });
});

const setDialogImage = (gallery, image, index) => {
  dialogImage.src = image;
  dialogImage.alt = `${gallery.title}, кадр ${index + 1}`;
  dialogThumbs.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.index) === index);
  });
};

const openGallery = (key, trigger) => {
  const gallery = galleries[key];
  if (!gallery || !dialog) return;

  dialogTitle.textContent = gallery.title;
  dialogText.textContent = gallery.text;
  dialogKicker.textContent = `${gallery.images.length} фото`;
  dialogThumbs.replaceChildren();

  gallery.images.forEach((image, index) => {
    const button = document.createElement("button");
    const thumb = document.createElement("img");
    button.type = "button";
    button.dataset.index = String(index);
    thumb.src = image;
    thumb.alt = `${gallery.title}, миниатюра ${index + 1}`;
    thumb.loading = "lazy";
    button.append(thumb);
    button.addEventListener("click", () => setDialogImage(gallery, image, index));
    dialogThumbs.append(button);
  });

  setDialogImage(gallery, gallery.images[0], 0);

  openModal(dialog, trigger);
};

document.querySelectorAll("[data-gallery]").forEach((item) => {
  item.addEventListener("click", () => openGallery(item.dataset.gallery, item));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGallery(item.dataset.gallery, item);
    }
  });
});

const closeDialog = () => {
  closeModal(dialog);
};

dialogClose?.addEventListener("click", closeDialog);

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && dialog?.open) {
    document.body.classList.remove("is-locked");
  }
});

const setDirectionImage = (image, index) => {
  if (!directionDialogImage || !directionDialogThumbs) return;
  directionDialogImage.src = image;
  directionDialogImage.alt = `${directionDialogTitle.textContent}, фото ${index + 1}`;
  directionDialogThumbs.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.index) === index);
  });
};

const openDirection = (key, trigger) => {
  const direction = directions[key];
  if (!direction || !directionDialog) return;

  directionDialogTitle.textContent = direction.title;
  directionDialogText.textContent = direction.text;
  directionDialogList.replaceChildren();
  directionDialogThumbs.replaceChildren();

  direction.bullets.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    directionDialogList.append(li);
  });

  direction.images.forEach((image, index) => {
    const button = document.createElement("button");
    const thumb = document.createElement("img");
    button.type = "button";
    button.dataset.index = String(index);
    thumb.src = image;
    thumb.alt = `${direction.title}, миниатюра ${index + 1}`;
    button.append(thumb);
    button.addEventListener("click", () => setDirectionImage(image, index));
    directionDialogThumbs.append(button);
  });

  setDirectionImage(direction.images[0], 0);
  openModal(directionDialog, trigger);
};

document.querySelectorAll("[data-direction]").forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();
    openDirection(card.dataset.direction, card);
  });
});

directionDialogClose?.addEventListener("click", () => closeModal(directionDialog));

directionDialog?.addEventListener("click", (event) => {
  if (event.target === directionDialog) closeModal(directionDialog);
});

directionDialog?.querySelector(".button")?.addEventListener("click", () => closeModal(directionDialog));

const reviewCards = [...document.querySelectorAll(".review-card")];
const reviewTrack = document.querySelector(".reviews-track");
const reviewButtons = document.querySelectorAll("[data-review-direction]");
const reviewDots = [...document.querySelectorAll(".review-dots span")];
const reviewsPerPage = 3;
let reviewPage = 0;

const showReviewPage = (page, direction = "next", animate = true) => {
  if (reviewCards.length === 0) return;

  const pageCount = Math.ceil(reviewCards.length / reviewsPerPage);
  reviewPage = (page + pageCount) % pageCount;
  const start = reviewPage * reviewsPerPage;
  const end = start + reviewsPerPage;

  if (animate && reviewTrack) {
    reviewTrack.classList.remove("is-animating-next", "is-animating-prev");
    void reviewTrack.offsetWidth;
    reviewTrack.classList.add(direction === "prev" ? "is-animating-prev" : "is-animating-next");
  }

  reviewCards.forEach((card, index) => {
    card.classList.toggle("is-visible", index >= start && index < end);
  });

  reviewDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === reviewPage);
  });

  if (reviewTrack) {
    window.setTimeout(() => {
      reviewTrack.classList.remove("is-animating-next", "is-animating-prev");
    }, 520);
  }
};

reviewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.reviewDirection === "next" ? "next" : "prev";
    showReviewPage(reviewPage + (direction === "next" ? 1 : -1), direction);
  });
});

showReviewPage(0, "next", false);

const forms = document.querySelectorAll(".lead-form, .plan-form");
const planDialog = document.querySelector(".plan-dialog");
const planDialogClose = document.querySelector(".plan-dialog-close");
const planDialogTitle = document.querySelector(".plan-dialog-title");
let selectedPlan = "";

const saveLocalLead = (lead) => {
  const current = JSON.parse(localStorage.getItem("fitnessWellnessLeads") || "[]");
  current.push(lead);
  localStorage.setItem("fitnessWellnessLeads", JSON.stringify(current.slice(-30)));
};

document.querySelectorAll("[data-plan]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedPlan = button.dataset.plan;
    const planInput = planDialog?.querySelector("input[name='plan']");
    const planStatus = planDialog?.querySelector(".form-status");

    if (planDialogTitle) planDialogTitle.textContent = `Абонемент ${selectedPlan}`;
    if (planInput) planInput.value = selectedPlan;
    if (planStatus) planStatus.textContent = "";

    openModal(planDialog, button);
  });
});

const closePlanDialog = () => {
  closeModal(planDialog);
};

planDialogClose?.addEventListener("click", closePlanDialog);

planDialog?.addEventListener("click", (event) => {
  if (event.target === planDialog) closePlanDialog();
});

const submitLeadForm = async (form, event) => {
  event.preventDefault();
  const formStatus = form.querySelector(".form-status");

  if (!form.checkValidity()) {
    form.reportValidity();
    if (formStatus) formStatus.textContent = "Заполните имя, телефон и направление.";
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  const defaultButtonText = submitButton.textContent;
  const lead = {
    ...Object.fromEntries(new FormData(form).entries()),
    page: window.location.href,
    createdAt: new Date().toISOString()
  };
  lead.plan = lead.plan || selectedPlan;

  submitButton.disabled = true;
  submitButton.textContent = "Отправляем...";
  if (formStatus) formStatus.textContent = "";

  try {
    if (window.location.protocol === "file:") {
      throw new Error("Local preview");
    }

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead)
    });

    if (!response.ok) throw new Error("Lead endpoint error");

    form.reset();
    selectedPlan = "";
    if (formStatus) formStatus.textContent = "Заявка отправлена. Мы скоро свяжемся с вами.";
    if (form.classList.contains("plan-form")) {
      window.setTimeout(closePlanDialog, 900);
    }
  } catch (error) {
    saveLocalLead(lead);
    form.reset();
    if (formStatus) {
      formStatus.textContent =
        "Заявка сохранена в локальном предпросмотре. После деплоя подключим отправку в Telegram.";
    }
    if (form.classList.contains("plan-form")) {
      window.setTimeout(closePlanDialog, 1100);
    }
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = defaultButtonText;
  }
};

forms.forEach((form) => {
  form.addEventListener("submit", (event) => submitLeadForm(form, event));
});
