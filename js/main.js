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

//Phone Number Formatter
function formatAsYouType(value) {
  if (!value) return value;

  // Clean the input to keep only numbers
  const cleaned = value.replace(/\D/g, '');
  const len = cleaned.length;

  // Progressively add formatting based on character count
  if (len < 4) return cleaned;
  if (len < 7) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
}

// Attach the formatter to your input element
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    e.target.value = formatAsYouType(e.target.value);
  });
}

// Open a <details> accordion when a same-page link jumps to it
function openDetailsTarget(hash) {
  if (!hash || hash.length < 2) return;
  const target = document.querySelector(hash);
  if (target && target.tagName === "DETAILS") {
    target.open = true;
  }
}

document.querySelectorAll('a[href*="#"]').forEach((link) => {
  const hash = link.hash;
  if (!hash) return;
  link.addEventListener("click", () => openDetailsTarget(hash));
});

if (window.location.hash) {
  openDetailsTarget(window.location.hash);
}

// Animated accordion open/close for .group <details> elements.
// The CSS-only grid-template-rows 0fr/1fr trick only reliably re-animates
// once per element in Chromium desktop when the track size comes from
// intrinsic content, so height is driven from measured pixel values here
// instead. The CSS rule stays in place as a no-JS fallback (instant, not animated).
document.querySelectorAll("details.group").forEach((details) => {
  const summary = details.querySelector(":scope > summary");
  const wrap = details.querySelector(":scope > .group-body-wrap");
  const inner = wrap ? wrap.querySelector(":scope > .group-body-inner") : null;
  if (!summary || !wrap || !inner) return;

  let animating = false;

  summary.addEventListener("click", (event) => {
    event.preventDefault();
    if (animating) return;
    animating = true;

    const reset = () => {
      wrap.style.transition = "";
      wrap.style.gridTemplateRows = "";
      animating = false;
    };

    // Measured from .group-body-inner (not the wrap): it carries its own
    // overflow: hidden, so its scrollHeight is always the content's true
    // full height, unaffected by the wrap's currently-animating track size.
    if (details.open) {
      const height = inner.scrollHeight;
      wrap.style.transition = "none";
      wrap.style.gridTemplateRows = `${height}px`;
      wrap.getBoundingClientRect();
      wrap.style.transition = "";
      requestAnimationFrame(() => {
        wrap.style.gridTemplateRows = "0px";
      });
      wrap.addEventListener("transitionend", () => {
        details.open = false;
        reset();
      }, { once: true });
    } else {
      details.open = true;
      const height = inner.scrollHeight;
      wrap.style.transition = "none";
      wrap.style.gridTemplateRows = "0px";
      wrap.getBoundingClientRect();
      wrap.style.transition = "";
      requestAnimationFrame(() => {
        wrap.style.gridTemplateRows = `${height}px`;
      });
      wrap.addEventListener("transitionend", reset, { once: true });
    }
  });
});

//Infinite Scroller
const scrollers = document.querySelectorAll(".scroller");

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addAnimation();
}

function addAnimation() {
  scrollers.forEach(scroller => {
    scroller.setAttribute("data-animated", true);

    const scrollerInner = scroller.querySelector(".scroller__inner");
    const scrollerContent = Array.from(scrollerInner.children);

    scrollerContent.forEach(item => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    })
  })
}

// Photo gallery lightbox
const lightbox = document.querySelector("#lightbox");
if (lightbox) {
  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  let lastFocused = null;

  const openLightbox = (src, alt) => {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.setAttribute("data-open", "true");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.setAttribute("data-open", "false");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  };

  document.querySelectorAll(".photo-item").forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      openLightbox(img.src, img.alt);
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.getAttribute("data-open") === "true") {
      closeLightbox();
    }
  });
}

// Google reviews — rendered from a static JSON file that
// fetch-google-reviews.mjs regenerates by hand; never a live API call.
function starRatingHtml(rating) {
  const safeRating = Math.max(0, Math.min(5, rating || 0));
  const pct = (safeRating / 5) * 100;
  return (
    `<span class="star-rating" role="img" aria-label="${safeRating} out of 5 stars">` +
    `<span class="star-rating-bg" aria-hidden="true">★★★★★</span>` +
    `<span class="star-rating-fg" aria-hidden="true" style="width:${pct}%">★★★★★</span>` +
    `</span>`
  );
}

function initial(name) {
  return (name || "?").trim().charAt(0).toUpperCase();
}

function escapeHtml(value) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value ?? "").replace(/[&<>"']/g, (c) => map[c]);
}

const googleReviewsGrid = document.querySelector("#google-reviews-grid");
if (googleReviewsGrid) {
  fetch("/assets/reviews/google-reviews.json")
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error("bad response"))))
    .then((data) => {
      const reviews = Array.isArray(data.reviews) ? data.reviews : [];

      const summaryEl = document.querySelector("#google-reviews-summary");
      if (summaryEl && data.rating) {
        summaryEl.innerHTML =
          starRatingHtml(data.rating) +
          `<span class="review-summary-count">${data.rating.toFixed(1)}</span>` +
          `<span>(${data.total} review${data.total === 1 ? "" : "s"})</span>`;
      }

      const linkEl = document.querySelector("#google-reviews-link");
      if (linkEl && data.mapsUrl) {
        linkEl.href = data.mapsUrl;
      }

      if (reviews.length === 0) {
        googleReviewsGrid.innerHTML =
          '<p class="reviews-empty">Google reviews haven’t been connected yet — run <code>npm run fetch-reviews</code> once a Places API key is set up to load them here.</p>';
        return;
      }

      googleReviewsGrid.innerHTML = reviews
        .map((r) => {
          const author = escapeHtml(r.author);
          const avatar = r.photoUrl
            ? `<img class="review-avatar" src="${escapeHtml(r.photoUrl)}" alt="" width="40" height="40">`
            : `<span class="review-avatar-fallback" aria-hidden="true">${escapeHtml(initial(r.author))}</span>`;
          return (
            `<div class="review-card">` +
            `<div class="review-card-meta">${avatar}<div><p class="review-card-author">${author}</p>` +
            `<p class="review-card-date">${escapeHtml(r.relativeTime)}</p></div></div>` +
            starRatingHtml(r.rating) +
            `<p class="review-card-text">${escapeHtml(r.text)}</p>` +
            `</div>`
          );
        })
        .join("");
    })
    .catch(() => {
      googleReviewsGrid.innerHTML =
        '<p class="reviews-empty">Google reviews haven’t been connected yet — run <code>npm run fetch-reviews</code> once a Places API key is set up to load them here.</p>';
    });
}

// Expand/collapse toggle for long reviews. Animates between the real
// collapsed and full content heights (measured, not an arbitrary large
// max-height) — an oversized ceiling makes the eased transition reach the
// true height almost instantly on expand while collapse crawls through the
// same curve's slow tail, so expand and collapse end up looking asymmetric.
document.querySelectorAll(".review-expand-toggle").forEach((btn) => {
  const body = btn.previousElementSibling;
  if (!body || !body.hasAttribute("data-expandable")) return;

  // Captured while still in its default collapsed state at page load —
  // matches the CSS-defined collapsed max-height without duplicating it.
  // scrollHeight is safe to read here too: it always reports the full
  // unclipped content height regardless of the current max-height.
  const collapsedHeight = body.getBoundingClientRect().height;
  const fullHeight = body.scrollHeight;

  // A fixed transition-duration makes a short reveal and a much longer one
  // travel very different pixel distances in the same clock time, so a long
  // review's card visibly snaps open faster than a short one's. Scale the
  // duration with how far this specific card actually travels — calibrated
  // so a ~134px reveal lands on the original 420ms, capped so a very long
  // review never feels sluggish to open.
  const delta = fullHeight - collapsedHeight;
  const duration = Math.min(650, Math.round(250 + delta * 1.27));
  body.style.transitionDuration = `${duration}ms`;

  btn.addEventListener("click", () => {
    const expanded = body.getAttribute("data-expanded") === "true";
    body.style.maxHeight = expanded ? `${collapsedHeight}px` : `${fullHeight}px`;
    body.setAttribute("data-expanded", String(!expanded));
    btn.setAttribute("aria-expanded", String(!expanded));
    btn.textContent = expanded ? "Read more" : "Show less";
  });
});