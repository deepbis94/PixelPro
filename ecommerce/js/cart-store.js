/**
 * Meridian cart — localStorage shared across shop pages
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "meridian-cart-v1";

  function read() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : { items: [] };
      if (!data || !Array.isArray(data.items)) return { items: [] };
      return data;
    } catch (e) {
      return { items: [] };
    }
  }

  function write(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    global.dispatchEvent(new CustomEvent("meridian:cart", { detail: cart }));
  }

  function countItems(cart) {
    return cart.items.reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);
  }

  function subtotal(cart) {
    return cart.items.reduce(function (sum, item) {
      return sum + item.price * item.qty;
    }, 0);
  }

  var Cart = {
    get: read,

    count: function () {
      return countItems(read());
    },

    subtotal: function () {
      return subtotal(read());
    },

    add: function (product, qty) {
      qty = Math.max(1, parseInt(qty, 10) || 1);
      var cart = read();
      var found = null;
      for (var i = 0; i < cart.items.length; i++) {
        if (cart.items[i].id === product.id) {
          found = cart.items[i];
          break;
        }
      }
      if (found) {
        found.qty += qty;
      } else {
        cart.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          qty: qty
        });
      }
      write(cart);
      return cart;
    },

    setQty: function (id, qty) {
      qty = parseInt(qty, 10) || 0;
      var cart = read();
      cart.items = cart.items
        .map(function (item) {
          if (item.id !== String(id)) return item;
          return Object.assign({}, item, { qty: qty });
        })
        .filter(function (item) {
          return item.qty > 0;
        });
      write(cart);
      return cart;
    },

    remove: function (id) {
      var cart = read();
      cart.items = cart.items.filter(function (item) {
        return item.id !== String(id);
      });
      write(cart);
      return cart;
    },

    clear: function () {
      write({ items: [] });
    },

    formatMoney: function (n) {
      return "$" + Number(n).toFixed(n % 1 === 0 ? 0 : 2);
    },

    syncBadge: function () {
      var badge = document.querySelector("[data-cart-badge]");
      var btn = document.querySelector("[data-cart-btn]");
      var n = countItems(read());
      if (badge) {
        badge.textContent = String(n);
        badge.classList.toggle("is-active", n > 0);
      }
      if (btn) {
        var label = "Cart, " + n + (n === 1 ? " item" : " items");
        if (btn.tagName === "A") {
          btn.setAttribute("aria-label", label);
        } else {
          btn.setAttribute("aria-label", label);
        }
      }
      return n;
    },

    bumpBadge: function () {
      var badge = document.querySelector("[data-cart-badge]");
      if (!badge) return;
      badge.classList.remove("is-bump");
      void badge.offsetWidth;
      badge.classList.add("is-bump");
    }
  };

  global.MeridianCart = Cart;

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    Cart.syncBadge();
  });

  global.addEventListener("meridian:cart", function () {
    Cart.syncBadge();
  });
})(window);
