const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.setAttribute("data-open", String(!isOpen));
    document.body.style.overflow = !isOpen ? "hidden" : "";
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.setAttribute("data-open", "false");
      document.body.style.overflow = "";
    });
  });
}

// Signature vein-divider draw-in
const veinDivider = document.querySelector(".vein-divider");
if (veinDivider && !reduceMotion) {
  requestAnimationFrame(() => veinDivider.classList.add("is-drawn"));
} else if (veinDivider) {
  veinDivider.classList.add("is-drawn");
}
