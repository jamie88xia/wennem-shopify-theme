const selectors = {
  openCart: "[data-open-cart]",
  closeCart: "[data-close-cart]",
  cartDrawer: "[data-cart-drawer]",
  openSearch: "[data-open-search]",
  closeSearch: "[data-close-search]",
  searchOverlay: "[data-search-overlay]",
  quickView: "[data-quick-view]",
  closeQuickView: "[data-close-quick-view]",
  quickViewOverlay: "[data-quick-view-overlay]",
  quantity: "[data-quantity]",
  quickAdd: ".quick-add-form",
};

function trapEscape(element, close) {
  element.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
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

document.querySelectorAll(selectors.openCart).forEach((button) => {
  button.addEventListener("click", () => openLayer(cartDrawer));
});

document.querySelectorAll(selectors.closeCart).forEach((button) => {
  button.addEventListener("click", () => closeLayer(cartDrawer));
});

document.querySelectorAll(selectors.openSearch).forEach((button) => {
  button.addEventListener("click", () => openLayer(searchOverlay));
});

document.querySelectorAll(selectors.closeSearch).forEach((button) => {
  button.addEventListener("click", () => closeLayer(searchOverlay));
});

document.querySelectorAll(selectors.quickView).forEach((button) => {
  button.addEventListener("click", () => openLayer(quickViewOverlay));
});

document.querySelectorAll(selectors.closeQuickView).forEach((button) => {
  button.addEventListener("click", () => closeLayer(quickViewOverlay));
});

[cartDrawer, searchOverlay, quickViewOverlay].forEach((layer) => {
  if (!layer) return;
  trapEscape(layer, () => closeLayer(layer));
  layer.addEventListener("click", (event) => {
    if (event.target.matches("[data-layer-backdrop]")) closeLayer(layer);
  });
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
