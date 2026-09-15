const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
const mobileWidth = window.matchMedia("(max-width: 760px)");
const backgroundAreas = [...document.querySelectorAll("main, .site-footer, .mobile-actions")];
const closeMenu = (restoreFocus = false) => {
  menu?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "메뉴 열기");
  document.body.classList.remove("menu-open");
  backgroundAreas.forEach((area) => { area.inert = false; });
  if (restoreFocus) menuButton?.focus();
};
menuButton?.addEventListener("click", () => {
  if (menuButton.getAttribute("aria-expanded") === "true") return closeMenu(true);
  menu?.classList.add("is-open");
  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "메뉴 닫기");
  document.body.classList.add("menu-open");
  backgroundAreas.forEach((area) => { area.inert = true; });
  menu?.querySelector("a")?.focus();
});
menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  closeMenu();
  if (link.hash) {
    const target = document.querySelector(link.hash);
    if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
  }
}));
document.addEventListener("keydown", (event) => {
  if (menuButton?.getAttribute("aria-expanded") !== "true") return;
  if (event.key === "Escape") { event.preventDefault(); closeMenu(true); }
  if (event.key === "Tab") {
    const focusable = [menuButton, ...menu.querySelectorAll("a")];
    const current = focusable.indexOf(document.activeElement);
    event.preventDefault();
    focusable[(current + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length].focus();
  }
});
mobileWidth.addEventListener("change", () => { if (!mobileWidth.matches) closeMenu(); });

const syncHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 18);
syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6%" },
  );
  revealItems.forEach((item) => {
    if (item.getBoundingClientRect().top > window.innerHeight) item.classList.add("reveal-pending");
    observer.observe(item);
  });
}

document.querySelectorAll("[data-year]").forEach((item) => {
  item.textContent = String(new Date().getFullYear());
});

const topdown = document.querySelector("[data-topdown]");
const topdownTabs = [...(topdown?.querySelectorAll('[role="tab"]') ?? [])];
const topdownPanels = [...(topdown?.querySelectorAll('[role="tabpanel"]') ?? [])];

const selectTopdownTab = (selectedTab) => {
  topdownTabs.forEach((tab) => {
    const selected = tab === selectedTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  topdownPanels.forEach((panel) => {
    panel.hidden = panel.dataset.panelContent !== selectedTab.dataset.panel;
  });
};

topdownTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTopdownTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + topdownTabs.length) % topdownTabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % topdownTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = topdownTabs.length - 1;
    selectTopdownTab(topdownTabs[nextIndex]);
    topdownTabs[nextIndex].focus();
  });
});

let submitting = false;
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (submitting || !contactForm.reportValidity()) return;
  submitting = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());
  submitButton.disabled = true;
  formStatus.className = "form-status";
  formStatus.textContent = "문의 내용을 보내고 있습니다…";

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok !== true) throw new Error(typeof result.error === "string" ? result.error : "접수 결과를 확인하지 못했습니다. 전화로 확인해 주세요.");
    contactForm.reset();
    formStatus.classList.add("is-success");
    formStatus.textContent = "문의가 전송되었습니다. 확인 후 연락드리겠습니다.";
  } catch (error) {
    const subject = encodeURIComponent(`[ELC 영어 학습 상담] ${payload.name}`);
    const body = encodeURIComponent(`이름: ${payload.name}\n연락처: ${payload.phone}\n이메일: ${payload.email}\n\n영어 학습 상담 내용:\n${payload.message}`);
    formStatus.classList.add("is-error");
    const errorText = error.name === "AbortError"
      ? "접수 결과 확인이 지연되고 있습니다. 같은 내용으로 다시 시도하거나 전화로 확인해 주세요."
      : error.message;
    formStatus.textContent = errorText + " ";
    const mailLink = document.createElement("a");
    mailLink.href = `mailto:jennylee3769@gmail.com?subject=${subject}&body=${body}`;
    mailLink.textContent = "메일 앱으로 문의하기";
    formStatus.append(mailLink);
  } finally {
    clearTimeout(timeout);
    submitting = false;
    submitButton.disabled = false;
  }
});
