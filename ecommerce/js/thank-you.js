/**
 * Meridian thank-you page
 */
(function () {
  "use strict";

  var thanks = document.querySelector("[data-thanks]");
  var empty = document.querySelector("[data-thanks-empty]");
  var orderIdEl = document.querySelector("[data-order-id]");
  var metaEl = document.querySelector("[data-order-meta]");
  var itemsEl = document.querySelector("[data-order-items]");

  var order = null;
  try {
    order = JSON.parse(sessionStorage.getItem("meridian-last-order") || "null");
  } catch (e) {
    order = null;
  }

  if (!order || !order.items || !order.items.length) {
    thanks.hidden = true;
    empty.hidden = false;
    return;
  }

  thanks.hidden = false;
  empty.hidden = true;

  orderIdEl.textContent = "#" + order.id;
  metaEl.textContent =
    "Confirmation sent to " +
    order.email +
    " · Total " +
    MeridianCart.formatMoney(order.total);

  itemsEl.innerHTML = order.items
    .map(function (item) {
      return (
        "<li>" +
        "<span>" +
        item.qty +
        " × " +
        item.name +
        "</span>" +
        "<span>" +
        MeridianCart.formatMoney(item.price * item.qty) +
        "</span>" +
        "</li>"
      );
    })
    .join("");

  document.querySelectorAll(".reveal").forEach(function (el) {
    el.classList.add("is-visible");
  });
})();
