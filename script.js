const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");

const closeMenu = () => {
  menu?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "메뉴 열기");
  document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menu?.classList.toggle("is-open", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute("aria-label", willOpen ? "메뉴 닫기" : "메뉴 열기");
  document.body.classList.toggle("menu-open", willOpen);
});

menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

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
  revealItems.forEach((item) => observer.observe(item));
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

const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

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
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "문의 내용을 보내지 못했습니다.");
    contactForm.reset();
    formStatus.classList.add("is-success");
    formStatus.textContent = "문의가 전송되었습니다. 확인 후 연락드리겠습니다.";
  } catch (error) {
    const subject = encodeURIComponent(`[ELC 강의 문의] ${payload.name}`);
    const body = encodeURIComponent(`이름: ${payload.name}\n연락처: ${payload.phone}\n이메일: ${payload.email}\n\n강의 의뢰 내용:\n${payload.message}`);
    formStatus.classList.add("is-error");
    formStatus.innerHTML = `${error.message} <a href="mailto:jennylee3769@gmail.com?subject=${subject}&body=${body}">메일 앱으로 보내기</a>`;
  } finally {
    submitButton.disabled = false;
  }
});
