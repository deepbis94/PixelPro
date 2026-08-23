/**
 * Meridian cart page
 */
(function () {
  "use strict";

  var linesEl = document.querySelector("[data-cart-lines]");
  var emptyEl = document.querySelector("[data-cart-empty]");
  var filledEl = document.querySelector("[data-cart-filled]");
  var subtotalEl = document.querySelector("[data-cart-subtotal]");
  var totalEl = document.querySelector("[data-cart-total]");
  var shippingEl = document.querySelector("[data-cart-shipping]");
  var summaryText = document.querySelector("[data-cart-summary]");
  var checkoutLink = document.querySelector("[data-checkout-link]");

  function render() {
    var cart = MeridianCart.get();
    var count = MeridianCart.count();

    if (!cart.items.length) {
      emptyEl.hidden = false;
      filledEl.hidden = true;
      if (summaryText) summaryText.textContent = "Your cart is empty.";
      return;
    }

    emptyEl.hidden = true;
    filledEl.hidden = false;
    if (summaryText) {
      summaryText.textContent =
        count + (count === 1 ? " item" : " items") + " ready for checkout.";
    }

    linesEl.innerHTML = cart.items
      .map(function (item) {
        return (
          '<li class="cart-line" data-id="' +
          item.id +
          '">' +
          '<a class="cart-line__media" href="product.html?id=' +
          item.id +
          '">' +
          '<img src="' +
          item.image +
          '" alt="" width="120" height="150" loading="lazy">' +
          "</a>" +
          '<div class="cart-line__body">' +
          '<a class="cart-line__name" href="product.html?id=' +
          item.id +
          '">' +
          item.name +
          "</a>" +
          '<p class="cart-line__meta">' +
          item.category +
          " · " +
          MeridianCart.formatMoney(item.price) +
          "</p>" +
          '<div class="cart-line__controls">' +
          '<div class="qty qty--sm">' +
          '<button class="qty__btn" type="button" data-line-minus aria-label="Decrease quantity">−</button>' +
          '<input class="qty__input" type="number" min="1" max="20" value="' +
          item.qty +
          '" data-line-qty aria-label="Quantity for ' +
          item.name +
          '">' +
          '<button class="qty__btn" type="button" data-line-plus aria-label="Increase quantity">+</button>' +
          "</div>" +
          '<button class="cart-line__remove" type="button" data-line-remove>Remove</button>' +
          "</div>" +
          "</div>" +
          '<p class="cart-line__total">' +
          MeridianCart.formatMoney(item.price * item.qty) +
          "</p>" +
          "</li>"
        );
      })
      .join("");

    var sub = MeridianCart.subtotal();
    var shipping = sub >= 100 ? 0 : 8;
    subtotalEl.textContent = MeridianCart.formatMoney(sub);
    if (shippingEl) {
      shippingEl.textContent =
        shipping === 0 ? "Free" : MeridianCart.formatMoney(shipping) + " (free over $100)";
    }
    totalEl.textContent = MeridianCart.formatMoney(sub + shipping);
    if (checkoutLink) checkoutLink.setAttribute("aria-disabled", "false");
  }

  linesEl.addEventListener("click", function (e) {
    var line = e.target.closest(".cart-line");
    if (!line) return;
    var id = line.getAttribute("data-id");
    var qtyInput = line.querySelector("[data-line-qty]");
    var qty = parseInt(qtyInput.value, 10) || 1;

    if (e.target.closest("[data-line-minus]")) {
      MeridianCart.setQty(id, qty - 1);
      render();
    } else if (e.target.closest("[data-line-plus]")) {
      MeridianCart.setQty(id, Math.min(20, qty + 1));
      render();
    } else if (e.target.closest("[data-line-remove]")) {
      MeridianCart.remove(id);
      render();
    }
  });

  linesEl.addEventListener("change", function (e) {
    if (!e.target.matches("[data-line-qty]")) return;
    var line = e.target.closest(".cart-line");
    MeridianCart.setQty(line.getAttribute("data-id"), e.target.value);
    render();
  });

  render();

  document.querySelectorAll(".reveal").forEach(function (el) {
    el.classList.add("is-visible");
  });
})();
