/**
 * Studio Kline agency — nav, stats counter, form validation, reveals
 */
(function () {
  "use strict";

  /* ----- Mobile nav ----- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function setNavOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("is-nav-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNavOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.querySelectorAll("a").forEach(function (link) {
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

  /* ----- Stats counter (Intersection Observer) ----- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var counters = document.querySelectorAll("[data-count]");

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 1400;
    var start = null;

    function frame(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // Ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  if ("IntersectionObserver" in window) {
    var countIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) {
      countIo.observe(el);
    });
  } else {
    counters.forEach(animateCount);
  }

  /* ----- Contact form validation ----- */
  var form = document.querySelector("[data-contact-form]");
  var success = document.querySelector("[data-form-success]");

  function setError(input, errorId, show) {
    var err = document.getElementById(errorId);
    if (!err) return;
    err.hidden = !show;
    input.classList.toggle("is-invalid", show);
    input.setAttribute("aria-invalid", show ? "true" : "false");
    if (show) {
      input.setAttribute("aria-describedby", errorId);
    } else {
      input.removeAttribute("aria-describedby");
    }
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var message = form.querySelector("#message");
      var valid = true;

      if (!name.value.trim()) {
        setError(name, "name-error", true);
        valid = false;
      } else {
        setError(name, "name-error", false);
      }

      if (!isEmail(email.value.trim())) {
        setError(email, "email-error", true);
        valid = false;
      } else {
        setError(email, "email-error", false);
      }

      if (!message.value.trim()) {
        setError(message, "message-error", true);
        valid = false;
      } else {
        setError(message, "message-error", false);
      }

      if (!valid) {
        var firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (success) {
        success.hidden = false;
      }
      form.reset();
    });
  }

  /* ----- Scroll reveals ----- */
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
