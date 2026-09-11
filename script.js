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
