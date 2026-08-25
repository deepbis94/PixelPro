/**
 * Meridian checkout
 */
(function () {
  "use strict";

  var emptyEl = document.querySelector("[data-checkout-empty]");
  var filledEl = document.querySelector("[data-checkout-filled]");
  var form = document.querySelector("[data-checkout-form]");
  var linesEl = document.querySelector("[data-checkout-lines]");
  var subEl = document.querySelector("[data-checkout-subtotal]");
  var shipEl = document.querySelector("[data-checkout-shipping]");
  var totalEl = document.querySelector("[data-checkout-total]");

  function shippingFor(sub) {
    return sub >= 100 ? 0 : 8;
  }

  function renderSummary() {
    var cart = MeridianCart.get();
    if (!cart.items.length) {
      emptyEl.hidden = false;
      filledEl.hidden = true;
      return false;
    }
    emptyEl.hidden = true;
    filledEl.hidden = false;

    linesEl.innerHTML = cart.items
      .map(function (item) {
        return (
          '<li class="checkout-mini__item">' +
          "<span>" +
          item.qty +
          " × " +
          item.name +
          "</span>" +
          "<strong>" +
          MeridianCart.formatMoney(item.price * item.qty) +
          "</strong>" +
          "</li>"
        );
      })
      .join("");

    var sub = MeridianCart.subtotal();
    var ship = shippingFor(sub);
    subEl.textContent = MeridianCart.formatMoney(sub);
    shipEl.textContent = ship === 0 ? "Free" : MeridianCart.formatMoney(ship);
    totalEl.textContent = MeridianCart.formatMoney(sub + ship);
    return true;
  }

  function setError(input, errorId, show) {
    var err = document.getElementById(errorId);
    if (!err) return;
    err.hidden = !show;
    input.classList.toggle("is-invalid", show);
    input.setAttribute("aria-invalid", show ? "true" : "false");
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  if (!renderSummary()) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!MeridianCart.count()) {
      renderSummary();
      return;
    }

    var email = form.querySelector("#email");
    var first = form.querySelector("#first-name");
    var last = form.querySelector("#last-name");
    var address = form.querySelector("#address");
    var city = form.querySelector("#city");
    var region = form.querySelector("#region");
    var postal = form.querySelector("#postal");
    var cardName = form.querySelector("#card-name");
    var cardNumber = form.querySelector("#card-number");
    var cardExp = form.querySelector("#card-exp");
    var cardCvc = form.querySelector("#card-cvc");

    var digits = String(cardNumber.value).replace(/\D/g, "");
    var valid = true;

    function req(input, errorId, ok) {
      setError(input, errorId, !ok);
      if (!ok) valid = false;
    }

    req(email, "email-error", isEmail(email.value.trim()));
    req(first, "first-name-error", first.value.trim().length > 0);
    req(last, "last-name-error", last.value.trim().length > 0);
    req(address, "address-error", address.value.trim().length > 0);
    req(city, "city-error", city.value.trim().length > 0);
    req(region, "region-error", region.value.trim().length > 0);
    req(postal, "postal-error", postal.value.trim().length > 0);
    req(cardName, "card-name-error", cardName.value.trim().length > 0);
    req(cardNumber, "card-number-error", digits.length >= 12);
    req(cardExp, "card-exp-error", /^\d{2}\/\d{2}$/.test(cardExp.value.trim()));
    req(cardCvc, "card-cvc-error", /^\d{3,4}$/.test(cardCvc.value.trim()));

    if (!valid) {
      var firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var cart = MeridianCart.get();
    var sub = MeridianCart.subtotal();
    var ship = shippingFor(sub);
    var order = {
      id: "MRD-" + String(Date.now()).slice(-6),
      email: email.value.trim(),
      name: first.value.trim() + " " + last.value.trim(),
      items: cart.items,
      subtotal: sub,
      shipping: ship,
      total: sub + ship,
      createdAt: new Date().toISOString()
    };

    try {
      sessionStorage.setItem("meridian-last-order", JSON.stringify(order));
    } catch (err) {}

    MeridianCart.clear();
    window.location.href = "thank-you.html";
  });

  document.querySelectorAll(".reveal").forEach(function (el) {
    el.classList.add("is-visible");
  });
})();
