/**
 * Orbit SaaS demo — nav, pricing toggle, FAQ, scroll reveals
 */
(function () {
  "use strict";

  /* ----- Sticky header shadow ----- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----- Mobile hamburger nav ----- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  var navLinks = nav ? nav.querySelectorAll("a") : [];

  function setNavOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("is-nav-open", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && nav) {
    if (!toggle.getAttribute("aria-label")) {
      toggle.setAttribute("aria-label", "Open menu");
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = toggle.getAttribute("aria-expanded") !== "true";
      setNavOpen(open);
      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      } else {
        toggle.focus();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNavOpen(false);
        toggle.focus();
      }
    });
  }

  /* ----- Pricing billing toggle ----- */
  var billingToggle = document.querySelector("[data-billing-toggle]");
  var priceEls = document.querySelectorAll(".plan__amount");
  var monthlyLabel = document.querySelector('[data-billing-label="monthly"]');
  var annualLabel = document.querySelector('[data-billing-label="annual"]');

  function applyBilling(annual) {
    if (billingToggle) {
      billingToggle.setAttribute("aria-checked", annual ? "true" : "false");
    }
    if (monthlyLabel) monthlyLabel.classList.toggle("is-active", !annual);
    if (annualLabel) annualLabel.classList.toggle("is-active", annual);

    priceEls.forEach(function (el) {
      var value = annual ? el.getAttribute("data-price-annual") : el.getAttribute("data-price-monthly");
      el.textContent = "$" + value;
    });
  }

  if (billingToggle) {
    applyBilling(false);
    billingToggle.addEventListener("click", function () {
      var annual = billingToggle.getAttribute("aria-checked") !== "true";
      applyBilling(annual);
    });
    billingToggle.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        billingToggle.click();
      }
    });
  }

  /* ----- FAQ accordion (one open at a time, keyboard friendly) ----- */
  var accordion = document.querySelector("[data-accordion]");
  if (accordion) {
    var triggers = accordion.querySelectorAll(".accordion__trigger");

    triggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        var panelId = btn.getAttribute("aria-controls");
        var panel = document.getElementById(panelId);

        triggers.forEach(function (other) {
          var otherPanel = document.getElementById(other.getAttribute("aria-controls"));
          other.setAttribute("aria-expanded", "false");
          if (otherPanel) otherPanel.hidden = true;
        });

        if (!expanded && panel) {
          btn.setAttribute("aria-expanded", "true");
          panel.hidden = false;
        }
      });
    });
  }

  /* ----- Intersection Observer reveals ----- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.1 }
  );

  reveals.forEach(function (el) {
    io.observe(el);
  });
})();
