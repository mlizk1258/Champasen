let currentLang = "vi";
let currentSlide = 0;
let heroTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  const langToggle = document.getElementById("langToggle");
  const langCurrent = document.getElementById("langCurrent");
  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");
  const menuOverlay = document.getElementById("menuOverlay");
  const siteHeader = document.getElementById("siteHeader");

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      currentLang = currentLang === "vi" ? "en" : "vi";
      if (langCurrent) langCurrent.textContent = currentLang.toUpperCase();
      applyLanguage(currentLang);
    });
  }

  if (menuToggle && menuOverlay) {
    menuToggle.addEventListener("click", () => openMenu());
  }

  if (menuClose && menuOverlay) {
    menuClose.addEventListener("click", () => closeMenu());
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const headerOffset = 96;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
      closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const focusButtons = [...document.querySelectorAll(".focus-item")];
  focusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updateFocusArea(Number(button.dataset.focus));
    });
  });

  window.addEventListener("scroll", () => {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  });

  initHeroSlider();
  updateFocusArea(0);
  applyLanguage(currentLang);
});

function openMenu() {
  const menuOverlay = document.getElementById("menuOverlay");
  const menuToggle = document.getElementById("menuToggle");
  if (!menuOverlay || !menuToggle) return;

  menuOverlay.classList.add("is-open");
  menuOverlay.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  const menuOverlay = document.getElementById("menuOverlay");
  const menuToggle = document.getElementById("menuToggle");
  if (!menuOverlay || !menuToggle) return;

  menuOverlay.classList.remove("is-open");
  menuOverlay.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

function applyLanguage(language) {
  document.documentElement.lang = language;

  document.querySelectorAll("[data-en][data-vi]").forEach((el) => {
    const text = el.getAttribute(`data-${language}`);
    if (text !== null) el.textContent = text;
  });
}

function initHeroSlider() {
  const slides = [...document.querySelectorAll(".hero-slide")];
  const indicators = [...document.querySelectorAll(".hero-indicator")];

  if (!slides.length || !indicators.length) return;

  const showSlide = (index) => {
    currentSlide = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    indicators.forEach((indicator, i) => {
      const progress = indicator.querySelector(".hero-progress");
      indicator.classList.toggle("active", i === index);
      if (progress) {
        progress.classList.remove("anim");
        void progress.offsetWidth;
      }
    });

    const activeProgress = indicators[index].querySelector(".hero-progress");
    if (activeProgress) activeProgress.classList.add("anim");
  };

  const startHeroTimer = () => {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => {
      showSlide((currentSlide + 1) % slides.length);
    }, 7000);
  };

  indicators.forEach((indicator) => {
    indicator.addEventListener("click", () => {
      showSlide(Number(indicator.dataset.target));
      startHeroTimer();
    });
  });

  showSlide(0);
  startHeroTimer();
}

const focusData = [
  {
    image: "Hero-Image.png",
    altVi: "Hoạt động sản xuất thức ăn chăn nuôi ChampaSen",
    altEn: "ChampaSen animal feed production operations",
    titleVi: "Chất lượng thức ăn",
    titleEn: "Feed quality",
    descVi:
      "Chúng tôi hỗ trợ các giải pháp thức ăn phù hợp nhằm nâng cao hiệu quả vận hành và sức khỏe vật nuôi.",
    descEn:
      "We support practical feed solutions that improve operational efficiency and animal health."
  },
  {
    image: "Truck export.jpg",
    altVi: "Xe tải vận chuyển và hậu cần ChampaSen",
    altEn: "ChampaSen delivery truck and logistics operations",
    titleVi: "Điều phối hậu cần",
    titleEn: "Logistics coordination",
    descVi:
      "Chúng tôi phối hợp vận chuyển để hàng hóa đến đúng nơi, đúng thời điểm và hỗ trợ kế hoạch phân phối ổn định.",
    descEn:
      "We coordinate deliveries to move products to the right destination at the right time and support reliable distribution planning."
  },
  {
    image: "Animal feed exporter.webp",
    altVi: "Hoạt động xuất khẩu thức ăn chăn nuôi",
    altEn: "Animal feed export operations",
    titleVi: "Đối tác trang trại",
    titleEn: "Farm partnerships",
    descVi:
      "ChampaSen hợp tác cùng trang trại, nhà phân phối và đối tác để xây dựng giá trị bền vững trong toàn chuỗi cung ứng.",
    descEn:
      "ChampaSen works with farms, distributors, and partners to build lasting value across the supply chain."
  },
  {
    image: "animal-feed-manufacturers-in-vietnam-5.webp",
    altVi: "Sản xuất thức ăn chăn nuôi tại Việt Nam",
    altEn: "Animal feed manufacturing in Vietnam",
    titleVi: "Tăng trưởng bền vững",
    titleEn: "Sustainable growth",
    descVi:
      "Chúng tôi hướng tới chất lượng ổn định, vận hành hiệu quả và các mối quan hệ hợp tác lâu dài cho tương lai nông nghiệp.",
    descEn:
      "We focus on consistent quality, efficient operations, and long-term partnerships for the future of agriculture."
  }
];

function updateFocusArea(index) {
  const data = focusData[index];
  if (!data) return;

  const focusImage = document.getElementById("focusImage");
  const focusNumber = document.getElementById("focusNumber");
  const focusTitle = document.getElementById("focusTitle");
  const focusDescription = document.getElementById("focusDescription");
  const buttons = [...document.querySelectorAll(".focus-item")];

  if (focusImage) {
    focusImage.style.opacity = "0";
    setTimeout(() => {
      focusImage.src = data.image;
      focusImage.alt = currentLang === "vi" ? data.altVi : data.altEn;
      focusImage.style.opacity = "1";
    }, 120);
  }

  if (focusNumber) focusNumber.textContent = String(index + 1).padStart(2, "0");
  if (focusTitle) focusTitle.textContent = currentLang === "vi" ? data.titleVi : data.titleEn;
  if (focusDescription) focusDescription.textContent = currentLang === "vi" ? data.descVi : data.descEn;

  buttons.forEach((btn, i) => {
    const active = i === index;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });
}