/**
 * Meridian listing — filters, add to cart, scroll reveals
 */
(function () {
  "use strict";

  var statusEl = document.querySelector("[data-status]");
  var resultCount = document.querySelector("[data-result-count]");
  var emptyEl = document.querySelector("[data-empty]");
  var products = Array.prototype.slice.call(document.querySelectorAll(".product"));
  var filterRoot = document.querySelector("[data-filters]");
  var filterToggle = document.querySelector("[data-filter-toggle]");
  var filterClose = document.querySelector("[data-filter-close]");
  var filterReset = document.querySelector("[data-filter-reset]");

  function announce(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  function addProductFromEl(productEl) {
    var id = productEl.getAttribute("data-id");
    var product = window.MeridianCatalog && window.MeridianCatalog.byId(id);
    if (!product) {
      product = {
        id: id,
        name: productEl.getAttribute("data-name"),
        price: parseFloat(productEl.getAttribute("data-price"), 10),
        image: productEl.getAttribute("data-image"),
        category: productEl.getAttribute("data-category")
      };
    }
    MeridianCart.add(product, 1);
    MeridianCart.bumpBadge();
    announce("Added " + product.name + " to cart.");
  }

  /* ----- Filters ----- */
  function getSelectedCategories() {
    return Array.prototype.slice
      .call(document.querySelectorAll('[data-filter="category"]:checked'))
      .map(function (el) {
        return el.value;
      });
  }

  function getSelectedPrice() {
    var el = document.querySelector('[data-filter="price"]:checked');
    return el ? el.value : "all";
  }

  function priceMatches(price, band) {
    if (band === "all") return true;
    if (band === "under-50") return price < 50;
    if (band === "50-100") return price >= 50 && price <= 100;
    if (band === "over-100") return price > 100;
    return true;
  }

  function applyFilters() {
    var cats = getSelectedCategories();
    var band = getSelectedPrice();
    var visible = 0;

    products.forEach(function (product) {
      var cat = product.getAttribute("data-category");
      var price = parseFloat(product.getAttribute("data-price"), 10);
      var catOk = cats.length === 0 || cats.indexOf(cat) !== -1;
      var priceOk = priceMatches(price, band);
      var show = catOk && priceOk;
      product.hidden = !show;
      if (show) visible += 1;
    });

    if (resultCount) {
      resultCount.textContent = visible + (visible === 1 ? " product" : " products");
    }
    if (emptyEl) emptyEl.hidden = visible !== 0;
  }

  if (filterRoot) {
    filterRoot.addEventListener("change", applyFilters);
  }

  if (filterReset) {
    filterReset.addEventListener("click", function () {
      document.querySelectorAll('[data-filter="category"]').forEach(function (el) {
        el.checked = false;
      });
      var allPrice = document.querySelector('[data-filter="price"][value="all"]');
      if (allPrice) allPrice.checked = true;
      applyFilters();
    });
  }

  function setFiltersOpen(open) {
    if (!filterRoot || !filterToggle) return;
    filterRoot.classList.toggle("is-open", open);
    filterToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("is-filters-open", open);
  }

  if (filterToggle) {
    filterToggle.addEventListener("click", function () {
      setFiltersOpen(filterToggle.getAttribute("aria-expanded") !== "true");
    });
  }

  if (filterClose) {
    filterClose.addEventListener("click", function () {
      setFiltersOpen(false);
      if (filterToggle) filterToggle.focus();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && filterRoot && filterRoot.classList.contains("is-open")) {
      setFiltersOpen(false);
      if (filterToggle) filterToggle.focus();
    }
  });

  document.querySelectorAll("[data-add-cart]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      addProductFromEl(btn.closest(".product"));
    });
  });

  /* ----- Scroll reveals ----- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  }

  applyFilters();
})();
