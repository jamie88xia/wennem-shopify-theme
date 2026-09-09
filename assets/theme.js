const selectors = {
  openCart: "[data-open-cart]",
  closeCart: "[data-close-cart]",
  cartDrawer: "[data-cart-drawer]",
  openSearch: "[data-open-search]",
  closeSearch: "[data-close-search]",
  searchOverlay: "[data-search-overlay]",
  openMenu: "[data-open-menu]",
  closeMenu: "[data-close-menu]",
  mobileMenu: "[data-mobile-menu]",
  quickView: "[data-quick-view]",
  closeQuickView: "[data-close-quick-view]",
  quickViewOverlay: "[data-quick-view-overlay]",
  quantity: "[data-quantity]",
  quickAdd: ".quick-add-form",
  signupPopup: "[data-signup-popup]",
  closeSignupPopup: "[data-signup-popup-close]",
  openSignupPopup: "[data-open-signup-popup]",
  zoomOverlay: "[data-zoom-overlay]",
  closeZoom: "[data-zoom-close]",
};

function trapEscape(element, close) {
  element.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function trapFocus(element, close) {
  element.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
    if (event.key !== "Tab") return;

    const focusable = [...element.querySelectorAll("a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])")]
      .filter((node) => !node.hasAttribute("disabled"));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function openLayer(layer) {
  if (!layer) return;
  layer.classList.add("is-open");
  layer.removeAttribute("hidden");
  document.documentElement.style.overflow = "hidden";
  const focusTarget = layer.querySelector("button, a, input, select, textarea");
  if (focusTarget) focusTarget.focus({ preventScroll: true });
}

function closeLayer(layer) {
  if (!layer) return;
  layer.classList.remove("is-open");
  layer.setAttribute("hidden", "");
  document.documentElement.style.overflow = "";
}

const cartDrawer = document.querySelector(selectors.cartDrawer);
const searchOverlay = document.querySelector(selectors.searchOverlay);
const quickViewOverlay = document.querySelector(selectors.quickViewOverlay);
const mobileMenu = document.querySelector(selectors.mobileMenu);
const signupPopup = document.querySelector(selectors.signupPopup);
const zoomOverlay = document.querySelector(selectors.zoomOverlay);

document.querySelectorAll(selectors.openCart).forEach((button) => {
  button.addEventListener("click", () => openLayer(cartDrawer));
});

// Delegated so close still works after refreshCart() replaces the drawer's markup.
if (cartDrawer) {
  cartDrawer.addEventListener("click", (event) => {
    if (event.target.closest(selectors.closeCart)) closeLayer(cartDrawer);
  });
}

async function refreshCart() {
  if (!cartDrawer || !window.fetch) return;

  const root = window.Shopify.routes.root;
  const [sectionResponse, cartResponse] = await Promise.all([
    fetch(`${root}?sections=cart-drawer`),
    fetch(`${root}cart.js`),
  ]);

  const sections = await sectionResponse.json();
  const cart = await cartResponse.json();

  const markup = sections["cart-drawer"];
  if (markup) {
    const fresh = new DOMParser().parseFromString(markup, "text/html").querySelector(selectors.cartDrawer);
    if (fresh) cartDrawer.innerHTML = fresh.innerHTML;
  }

  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = cart.item_count;
    node.toggleAttribute("hidden", cart.item_count === 0);
  });
}

document.querySelectorAll(selectors.openSearch).forEach((button) => {
  button.addEventListener("click", () => openLayer(searchOverlay));
});

document.querySelectorAll(selectors.closeSearch).forEach((button) => {
  button.addEventListener("click", () => closeLayer(searchOverlay));
});

document.querySelectorAll(selectors.openMenu).forEach((button) => {
  button.addEventListener("click", () => openLayer(mobileMenu));
});

document.querySelectorAll(selectors.closeMenu).forEach((button) => {
  button.addEventListener("click", () => closeLayer(mobileMenu));
});

document.querySelectorAll(selectors.quickView).forEach((button) => {
  button.addEventListener("click", () => openLayer(quickViewOverlay));
});

document.querySelectorAll(selectors.closeQuickView).forEach((button) => {
  button.addEventListener("click", () => closeLayer(quickViewOverlay));
});

document.querySelectorAll(selectors.closeZoom).forEach((button) => {
  button.addEventListener("click", () => closeLayer(zoomOverlay));
});

[cartDrawer, searchOverlay, quickViewOverlay, mobileMenu, signupPopup, zoomOverlay].forEach((layer) => {
  if (!layer) return;
  trapEscape(layer, () => closeLayer(layer));
  trapFocus(layer, () => closeLayer(layer));
  layer.addEventListener("click", (event) => {
    if (event.target.matches("[data-layer-backdrop]")) closeLayer(layer);
  });
});

if (signupPopup) {
  const DISMISS_KEY = "wennem:signup-popup-dismissed-at";
  const SUBMIT_FLAG_KEY = "wennem:signup-popup-submitting";
  const dismissDays = Number(signupPopup.dataset.dismissDays || 7);
  const delaySeconds = Number(signupPopup.dataset.delaySeconds || 6);

  // Shopify's `form.posted_successfully?` is shared across every {% form 'customer' %}
  // on the page (footer, homepage newsletter, this popup), so data-posted alone can't
  // tell us THIS form was the one submitted. Flag intent client-side before the native
  // submit navigates away, then only trust data-posted if that flag survived the redirect.
  const justSubmittedPopup = window.sessionStorage.getItem(SUBMIT_FLAG_KEY) === "1";
  window.sessionStorage.removeItem(SUBMIT_FLAG_KEY);
  const wasPosted = signupPopup.dataset.posted === "true" && justSubmittedPopup;

  const popupForm = signupPopup.closest("form");
  if (popupForm) {
    popupForm.addEventListener("submit", () => {
      window.sessionStorage.setItem(SUBMIT_FLAG_KEY, "1");
    });
  }

  function recordDismissal() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  }

  function isWithinDismissWindow() {
    const storedAt = Number(localStorage.getItem(DISMISS_KEY));
    if (!storedAt) return false;
    const elapsedDays = (Date.now() - storedAt) / (1000 * 60 * 60 * 24);
    return elapsedDays < dismissDays;
  }

  document.querySelectorAll(selectors.closeSignupPopup).forEach((button) => {
    button.addEventListener("click", () => {
      closeLayer(signupPopup);
      recordDismissal();
    });
  });

  document.querySelectorAll(selectors.openSignupPopup).forEach((button) => {
    button.addEventListener("click", () => openLayer(signupPopup));
  });

  signupPopup.addEventListener("click", (event) => {
    if (event.target.matches("[data-layer-backdrop]")) recordDismissal();
  });
  trapEscape(signupPopup, () => recordDismissal());

  if (wasPosted) {
    openLayer(signupPopup);
    recordDismissal();
  } else if (!isWithinDismissWindow()) {
    window.setTimeout(() => openLayer(signupPopup), delaySeconds * 1000);
  }
}


document.querySelectorAll("[data-product-gallery]").forEach((gallery) => {
  const slides = [...gallery.querySelectorAll("[data-gallery-slide]")];
  const thumbs = [...gallery.querySelectorAll("[data-gallery-thumb]")];
  if (slides.length <= 1) return;

  function showSlide(index) {
    slides.forEach((slide) => {
      const isActive = slide.dataset.galleryIndex === index;
      slide.classList.toggle("is-active", isActive);
      slide.toggleAttribute("hidden", !isActive);
    });

    thumbs.forEach((thumb) => {
      const isActive = thumb.dataset.galleryIndex === index;
      thumb.classList.toggle("is-active", isActive);
      thumb.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => showSlide(thumb.dataset.galleryIndex));
  });
});

const zoomImage = zoomOverlay ? zoomOverlay.querySelector("[data-zoom-image]") : null;
const zoomStage = zoomOverlay ? zoomOverlay.querySelector("[data-zoom-stage]") : null;

function openZoomImage(src, alt) {
  if (!zoomOverlay || !zoomImage || !src) return;
  zoomImage.src = src;
  zoomImage.alt = alt || "";
  if (zoomStage) zoomStage.classList.remove("is-zoomed");
  openLayer(zoomOverlay);
}

if (zoomStage) {
  zoomStage.addEventListener("click", () => zoomStage.classList.toggle("is-zoomed"));

  // Mouse users pan by moving the cursor; touch users keep native scroll/drag.
  zoomStage.addEventListener("pointermove", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    if (!zoomStage.classList.contains("is-zoomed")) return;

    const rect = zoomStage.getBoundingClientRect();
    const ratioX = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    const ratioY = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);

    zoomStage.scrollLeft = ratioX * (zoomStage.scrollWidth - zoomStage.clientWidth);
    zoomStage.scrollTop = ratioY * (zoomStage.scrollHeight - zoomStage.clientHeight);
  });
}

const supportsHoverZoom = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const ZOOM_LOUPE_FACTOR = 1.7;

document.querySelectorAll("[data-zoom-trigger]").forEach((trigger) => {
  const src = trigger.dataset.zoomSrc;

  trigger.addEventListener("click", () => {
    const image = trigger.querySelector("img");
    openZoomImage(src, image ? image.alt : "");
  });

  if (!supportsHoverZoom || !src) return;

  const loupe = document.createElement("span");
  loupe.className = "product-gallery__loupe";
  loupe.setAttribute("aria-hidden", "true");
  loupe.style.backgroundImage = `url("${src}")`;
  trigger.appendChild(loupe);

  trigger.addEventListener("pointermove", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    const rect = trigger.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    loupe.style.left = `${x}px`;
    loupe.style.top = `${y}px`;
    loupe.style.backgroundSize = `${rect.width * ZOOM_LOUPE_FACTOR}px ${rect.height * ZOOM_LOUPE_FACTOR}px`;
    loupe.style.backgroundPosition = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
    loupe.classList.add("is-active");
  });

  trigger.addEventListener("pointerleave", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    loupe.classList.remove("is-active");
  });
});


document.querySelectorAll("[data-story-slider]").forEach((slider) => {
  const slides = [...slider.querySelectorAll("[data-story-slide]")];
  const dots = [...slider.querySelectorAll("[data-story-dot]")];
  const previous = slider.querySelector("[data-story-prev]");
  const next = slider.querySelector("[data-story-next]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const interval = Number(slider.dataset.interval || 10000);
  let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
  let timer;

  if (slides.length <= 1) return;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.toggleAttribute("hidden", !isActive);
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function stopTimer() {
    window.clearInterval(timer);
  }

  function startTimer() {
    if (prefersReducedMotion) return;
    stopTimer();
    timer = window.setInterval(() => showSlide(activeIndex + 1), interval);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startTimer();
    });
  });

  if (previous) {
    previous.addEventListener("click", () => {
      showSlide(activeIndex - 1);
      startTimer();
    });
  }

  if (next) {
    next.addEventListener("click", () => {
      showSlide(activeIndex + 1);
      startTimer();
    });
  }

  slider.addEventListener("mouseenter", stopTimer);
  slider.addEventListener("mouseleave", startTimer);
  slider.addEventListener("focusin", stopTimer);
  slider.addEventListener("focusout", startTimer);
  startTimer();
});

document.querySelectorAll(selectors.quantity).forEach((quantity) => {
  const input = quantity.querySelector("input");
  quantity.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.quantityButton === "plus" ? 1 : -1;
      input.value = Math.max(1, Number(input.value || 1) + direction);
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
});

document.querySelectorAll(selectors.quickAdd).forEach((form) => {
  form.addEventListener("submit", async (event) => {
    if (!window.fetch) return;
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;

    try {
      await fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form),
      });
      await refreshCart();
      openLayer(cartDrawer);
    } catch (error) {
      form.submit();
    } finally {
      button.disabled = false;
    }
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(".fade-in").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".fade-in").forEach((element) => element.classList.add("is-visible"));
}
