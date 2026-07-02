// ── About accordion ──
document.querySelectorAll(".about-trigger").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".about-item");
    if (!item) return;
    const isOpen = item.classList.contains("is-open");
    document.querySelectorAll(".about-item").forEach((t) => {
      t.classList.remove("is-open");
      t.querySelector(".about-trigger")?.setAttribute("aria-expanded","false");
    });
    if (!isOpen) { item.classList.add("is-open"); btn.setAttribute("aria-expanded","true"); }
  });
});

// ── Cert reveal ──
const certCards = document.querySelectorAll(".cert-card");
if ("IntersectionObserver" in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); }});
  }, { threshold: 0.18, rootMargin:"0px 0px -8% 0px" });
  certCards.forEach(c => obs.observe(c));
} else { certCards.forEach(c => c.classList.add("is-visible")); }

// ── Project modal data ──
const projectData = {
  moodmap: {
    coverClass: "modal-cover-moodmap",
    title: "MÖÖDMAP",
    meta: [
      { label:"프로젝트", value:"UIUXDesign_무드맵" },
      { label:"기간", value:"2026.02 – 2026.03" },
      { label:"도구", value:"Figma · Photoshop" },
      { label:"유형", value:"교과 프로젝트 · 1515 진어진" },
    ],
    desc: "흘러간 하루에 좌표를 찍다. 감정을 지도 위에 기록하는 UI/UX 서비스입니다. 단순히 위치를 저장하는 앱이 아니라, 그날의 기분을 태그하고 일기를 쓰며 방문 기록이 쌓이도록 설계한 감정 아카이브 서비스입니다.",
    tags: ["#감정기록","#지도기반UX","#개인화아카이브","#일상데이터기록","#UIUX"],
    slideKey: "moodmap",
    slideLabel: "MÖÖDMAP 슬라이드",
  },
  gui: {
    coverClass: "modal-cover-gui",
    title: "GUI Icon Design",
    titleDark: true,
    meta: [
      { label:"프로젝트", value:"GUI 스타일별 아이콘을 제작" },
      { label:"기간", value:"교과 프로젝트" },
      { label:"도구", value:"Illustrator · Figma" },
      { label:"유형", value:"교과 프로젝트" },
    ],
    desc: "번역 앱의 성격에 맞는 GUI 스타일별 아이콘을 제작하며 화면의 분위기와 사용성에 따라 시각 언어를 조절하는 경험을 쌓았습니다. 플랫, 라인, 필드 등 다양한 스타일의 아이콘 표현 방식을 탐구했습니다.",
    tags: ["#아이콘디자인","#GUI","#시각언어","#번역앱","#Illustrator"],
    slideKey: "gui",
    slideLabel: "GUI 아이콘 슬라이드",
  },
  woosun: {
    coverClass: "modal-cover-woosun",
    title: "우선",
    meta: [
      { label:"프로젝트", value:"UIUXDesign_우선" },
      { label:"기간", value:"2025" },
      { label:"도구", value:"Figma · Photoshop" },
      { label:"유형", value:"동아리 프로젝트 (CODEUS)" },
    ],
    desc: "나와 맞는 친구를 발견하고 새로운 관계에 '헨'을 그어보는 소셜 서비스입니다. 친구 연결, 관계 형성, 친밀도 시스템, 인간관계 아카이브를 핵심 키워드로 사용자 중심의 UI/UX를 설계했습니다.",
    tags: ["#친구연결","#관계형성","#친밀도시스템","#인간관계","#UIUX"],
    slideKey: "woosun",
    slideLabel: "우선 슬라이드",
  },
};

// ── Modal ──
const backdrop = document.getElementById("modal-backdrop");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

function openModal(key) {
  const d = projectData[key];
  if (!d) return;
  const titleStyle = d.titleDark ? "color:var(--ink)" : "color:#fff";
  modalBody.innerHTML = `
    <div class="modal-cover ${d.coverClass}">
      <h2 class="modal-cover-title" style="${titleStyle}">${d.title}</h2>
    </div>
    <div class="modal-meta-row">
      ${d.meta.map(m=>`<div class="modal-meta-item"><span class="modal-meta-label">${m.label}</span><span class="modal-meta-value">${m.value}</span></div>`).join("")}
    </div>
    <p class="modal-section-title">PROJECT OVERVIEW</p>
    <p class="modal-desc">${d.desc}</p>
    <div class="modal-tags">${d.tags.map(t=>`<span>${t}</span>`).join("")}</div>
    <button class="modal-slide-btn" id="modal-slide-btn" data-key="${key}">슬라이드로 보기 →</button>
  `;
  backdrop.classList.add("is-open");
  backdrop.removeAttribute("aria-hidden");
  document.body.style.overflow = "hidden";

  document.getElementById("modal-slide-btn")?.addEventListener("click", (e) => {
    closeModal();
    openSlide(e.currentTarget.dataset.key);
  });
}

function closeModal() {
  backdrop.classList.remove("is-open");
  backdrop.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".proj-card").forEach(card => {
  card.addEventListener("click", () => openModal(card.dataset.project));
});
modalClose.addEventListener("click", closeModal);
backdrop.addEventListener("click", e => { if (e.target === backdrop) closeModal(); });

// ── Slide viewer ──
const slideBackdrop = document.getElementById("slide-backdrop");
const slideImg = document.getElementById("slide-img");
const slideCounter = document.getElementById("slide-counter");
const slideTitleLabel = document.getElementById("slide-title-label");
const slideDots = document.getElementById("slide-dots");
const slidePrev = document.getElementById("slide-prev");
const slideNext = document.getElementById("slide-next");
const slideClose = document.getElementById("slide-close");

let currentSlides = [];
let currentSlideIdx = 0;

function renderSlide() {
  slideImg.src = currentSlides[currentSlideIdx];
  slideCounter.textContent = `${currentSlideIdx + 1} / ${currentSlides.length}`;
  slideDots.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.toggle("active", i === currentSlideIdx);
  });
  slidePrev.style.opacity = currentSlideIdx === 0 ? "0.3" : "1";
  slideNext.style.opacity = currentSlideIdx === currentSlides.length - 1 ? "0.3" : "1";
}

function buildDots(count) {
  slideDots.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const d = document.createElement("button");
    d.className = "dot";
    d.setAttribute("aria-label", `슬라이드 ${i+1}`);
    d.addEventListener("click", () => { currentSlideIdx = i; renderSlide(); });
    slideDots.appendChild(d);
  }
}

function openSlide(key) {
  const d = projectData[key];
  if (!d || !SLIDE_DATA[d.slideKey]) return;
  currentSlides = SLIDE_DATA[d.slideKey];
  currentSlideIdx = 0;
  slideTitleLabel.textContent = d.slideLabel;
  buildDots(currentSlides.length);
  renderSlide();
  slideBackdrop.classList.add("is-open");
  slideBackdrop.removeAttribute("aria-hidden");
  document.body.style.overflow = "hidden";
}

function closeSlide() {
  slideBackdrop.classList.remove("is-open");
  slideBackdrop.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  slideImg.src = "";
}

slidePrev.addEventListener("click", () => {
  if (currentSlideIdx > 0) { currentSlideIdx--; renderSlide(); }
});
slideNext.addEventListener("click", () => {
  if (currentSlideIdx < currentSlides.length - 1) { currentSlideIdx++; renderSlide(); }
});
slideClose.addEventListener("click", closeSlide);
slideBackdrop.addEventListener("click", e => { if (e.target === slideBackdrop) closeSlide(); });

document.addEventListener("keydown", e => {
  if (slideBackdrop.classList.contains("is-open")) {
    if (e.key === "ArrowLeft" && currentSlideIdx > 0) { currentSlideIdx--; renderSlide(); }
    if (e.key === "ArrowRight" && currentSlideIdx < currentSlides.length-1) { currentSlideIdx++; renderSlide(); }
    if (e.key === "Escape") closeSlide();
  } else if (backdrop.classList.contains("is-open")) {
    if (e.key === "Escape") closeModal();
  }
});
