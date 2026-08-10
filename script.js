let currentLang = "vi";
let currentSlide = 0;
let heroTimer = null;

const focusData = [
  {
    number: "01",
    image: "Hero-Image.png",
    altVi: "Hoạt động sản xuất thức ăn chăn nuôi ChampaSen",
    altEn: "ChampaSen animal feed production operations",
    titleVi: "Chất lượng thức ăn",
    titleEn: "Feed quality",
    descriptionVi:
      "Chúng tôi hỗ trợ các giải pháp thức ăn phù hợp nhằm nâng cao hiệu quả vận hành và sức khỏe vật nuôi.",
    descriptionEn:
      "We support practical feed solutions that improve operational efficiency and animal health."
  },
  {
    number: "02",
    image: "Truck export.jpg",
    altVi: "Xe tải vận chuyển và hậu cần ChampaSen",
    altEn: "ChampaSen delivery truck and logistics operations",
    titleVi: "Điều phối hậu cần",
    titleEn: "Logistics coordination",
    descriptionVi:
      "Chúng tôi phối hợp vận chuyển để hàng hóa đến đúng nơi, đúng thời điểm và hỗ trợ kế hoạch phân phối ổn định.",
    descriptionEn:
      "We coordinate deliveries to move products to the right destination at the right time and support reliable distribution planning."
  },
  {
    number: "03",
    image: "Animal feed exporter.webp",
    altVi: "Hoạt động xuất khẩu thức ăn chăn nuôi",
    altEn: "Animal feed export operations",
    titleVi: "Đối tác trang trại",
    titleEn: "Farm partnerships",
    descriptionVi:
      "ChampaSen hợp tác cùng trang trại, nhà phân phối và đối tác để xây dựng giá trị bền vững trong toàn chuỗi cung ứng.",
    descriptionEn:
      "ChampaSen works with farms, distributors, and partners to build lasting value across the supply chain."
  },
  {
    number: "04",
    image: "animal-feed-manufacturers-in-vietnam-5.webp",
    altVi: "Sản xuất thức ăn chăn nuôi tại Việt Nam",
    altEn: "Animal feed manufacturing in Vietnam",
    titleVi: "Tăng trưởng bền vững",
    titleEn: "Sustainable growth",
    descriptionVi:
      "Chúng tôi hướng tới chất lượng ổn định, vận hành hiệu quả và các mối quan hệ hợp tác lâu dài cho tương lai nông nghiệp.",
    descriptionEn:
      "We focus on consistent quality, efficient operations, and long-term partnerships for the future of agriculture."
  }
];

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupLanguageControls();
  initHeroSlider();
  initFocusAreas();
  setupContactForm();
  applyLanguage("vi");
});

function setupNavigation() {
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mainNav = document.getElementById("mainNav");
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");

      mobileToggle.setAttribute("aria-expanded", String(isOpen));
      mobileToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });
  }

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      const headerOffset = 96;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      if (mainNav) {
        mainNav.classList.remove("is-open");
      }

      if (mobileToggle) {
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.setAttribute("aria-label", "Open navigation");
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && mainNav && mobileToggle) {
      mainNav.classList.remove("is-open");
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

function setupLanguageControls() {
  const viButton = document.getElementById("lang-vi");
  const enButton = document.getElementById("lang-en");

  if (viButton) {
    viButton.addEventListener("click", () => applyLanguage("vi"));
  }

  if (enButton) {
    enButton.addEventListener("click", () => applyLanguage("en"));
  }
}

function applyLanguage(language) {
  currentLang = language;
  document.documentElement.lang = language;

  const viButton = document.getElementById("lang-vi");
  const enButton = document.getElementById("lang-en");

  if (viButton && enButton) {
    viButton.classList.toggle("active", language === "vi");
    enButton.classList.toggle("active", language === "en");
  }

  document.title =
    language === "vi"
      ? "ChampaSen | Thức ăn chăn nuôi & Hậu cần"
      : "ChampaSen | Animal Feed & Logistics";

  document.querySelectorAll("[data-en][data-vi]").forEach((element) => {
    const translatedText = element.getAttribute(`data-${language}`);

    if (translatedText !== null) {
      element.textContent = translatedText;
    }
  });

  document
    .querySelectorAll("[data-placeholder-en][data-placeholder-vi]")
    .forEach((element) => {
      element.placeholder = element.getAttribute(
        `data-placeholder-${language}`
      );
    });

  const activeFocus = document.querySelector(".focus-item.active");

  if (activeFocus) {
    updateFocusArea(Number(activeFocus.dataset.focus));
  }
}

function initHeroSlider() {
  const slides = [...document.querySelectorAll(".hero-slide")];
  const indicators = [...document.querySelectorAll(".hero-indicator")];

  if (!slides.length || !indicators.length) {
    return;
  }

  function showSlide(index) {
    currentSlide = index;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === currentSlide);
    });

    indicators.forEach((indicator, indicatorIndex) => {
      const progress = indicator.querySelector(".hero-progress");

      indicator.classList.toggle("active", indicatorIndex === currentSlide);

      if (progress) {
        progress.classList.remove("anim");
        void progress.offsetWidth;
      }
    });

    const activeProgress =
      indicators[currentSlide].querySelector(".hero-progress");

    if (activeProgress) {
      activeProgress.classList.add("anim");
    }
  }

  function startHeroTimer() {
    if (heroTimer) {
      clearInterval(heroTimer);
    }

    heroTimer = setInterval(() => {
      const nextSlide = (currentSlide + 1) % slides.length;
      showSlide(nextSlide);
    }, 7000);
  }

  indicators.forEach((indicator) => {
    indicator.addEventListener("click", () => {
      const targetSlide = Number(indicator.dataset.target);

      showSlide(targetSlide);
      startHeroTimer();
    });
  });

  showSlide(0);
  startHeroTimer();
}

function initFocusAreas() {
  const focusButtons = [...document.querySelectorAll(".focus-item")];

  if (!focusButtons.length) {
    return;
  }

  focusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updateFocusArea(Number(button.dataset.focus));
    });

    button.addEventListener("keydown", (event) => {
      const currentIndex = Number(button.dataset.focus);

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();

        const nextIndex = (currentIndex + 1) % focusButtons.length;

        focusButtons[nextIndex].focus();
        updateFocusArea(nextIndex);
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();

        const previousIndex =
          (currentIndex - 1 + focusButtons.length) % focusButtons.length;

        focusButtons[previousIndex].focus();
        updateFocusArea(previousIndex);
      }
    });
  });

  updateFocusArea(0);
}

function updateFocusArea(index) {
  const selectedFocus = focusData[index];

  if (!selectedFocus) {
    return;
  }

  const focusImage = document.getElementById("focusImage");
  const focusNumber = document.getElementById("focusNumber");
  const focusTitle = document.getElementById("focusTitle");
  const focusDescription = document.getElementById("focusDescription");
  const focusButtons = [...document.querySelectorAll(".focus-item")];

  if (focusImage) {
    focusImage.style.opacity = "0";

    window.setTimeout(() => {
      focusImage.src = selectedFocus.image;
      focusImage.alt =
        currentLang === "vi" ? selectedFocus.altVi : selectedFocus.altEn;
      focusImage.style.opacity = "1";
    }, 130);
  }

  if (focusNumber) {
    focusNumber.textContent = selectedFocus.number;
  }

  if (focusTitle) {
    focusTitle.textContent =
      currentLang === "vi"
        ? selectedFocus.titleVi
        : selectedFocus.titleEn;
  }

  if (focusDescription) {
    focusDescription.textContent =
      currentLang === "vi"
        ? selectedFocus.descriptionVi
        : selectedFocus.descriptionEn;
  }

  focusButtons.forEach((button, buttonIndex) => {
    const isActive = buttonIndex === index;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function setupContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) {
    return;
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const privacyCheckbox = document.getElementById("privacy");

    if (!contactForm.checkValidity() || !privacyCheckbox.checked) {
      contactForm.reportValidity();
      return;
    }

    const successMessage =
      currentLang === "vi"
        ? "Cảm ơn bạn! ChampaSen sẽ liên hệ lại với bạn sớm."
        : "Thank you! ChampaSen will get back to you soon.";

    alert(successMessage);
    contactForm.reset();
  });
}