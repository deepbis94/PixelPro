/**
 * Meridian product detail page
 */
(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var product = window.MeridianCatalog && window.MeridianCatalog.byId(id);

  var missing = document.querySelector("[data-pdp-missing]");
  var content = document.querySelector("[data-pdp-content]");
  var statusEl = document.querySelector("[data-pdp-status]");
  var live = document.querySelector("[data-status]");

  function announce(msg) {
    if (live) live.textContent = msg;
  }

  if (!product) {
    if (missing) missing.hidden = false;
    if (content) content.hidden = true;
    document.title = "Product not found — Meridian";
    return;
  }

  if (missing) missing.hidden = true;
  if (content) content.hidden = false;

  document.title = product.name + " — Meridian | PixelPro";
  document.querySelector("[data-pdp-crumb]").textContent = product.name;
  document.querySelector("[data-pdp-category]").textContent = product.category;
  document.querySelector("[data-pdp-title]").textContent = product.name;
  document.querySelector("[data-pdp-price]").textContent = MeridianCart.formatMoney(product.price);
  document.querySelector("[data-pdp-desc]").textContent = product.desc;
  document.querySelector("[data-pdp-details]").textContent = product.details;

  var img = document.querySelector("[data-pdp-image]");
  img.src = product.image;
  img.alt = product.name;

  var qtyInput = document.querySelector("[data-qty-input]");
  var form = document.querySelector("[data-pdp-form]");

  function clampQty(n) {
    n = parseInt(n, 10) || 1;
    return Math.min(20, Math.max(1, n));
  }

  document.querySelector("[data-qty-minus]").addEventListener("click", function () {
    qtyInput.value = clampQty(Number(qtyInput.value) - 1);
  });

  document.querySelector("[data-qty-plus]").addEventListener("click", function () {
    qtyInput.value = clampQty(Number(qtyInput.value) + 1);
  });

  qtyInput.addEventListener("change", function () {
    qtyInput.value = clampQty(qtyInput.value);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var qty = clampQty(qtyInput.value);
    MeridianCart.add(product, qty);
    MeridianCart.bumpBadge();
    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = "Added " + qty + " × " + product.name + " to cart.";
    }
    announce("Added to cart.");
  });

  /* reveals */
  document.querySelectorAll(".reveal").forEach(function (el) {
    el.classList.add("is-visible");
  });
})();
