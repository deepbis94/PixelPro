/**
 * Meridian product catalog
 */
window.MeridianCatalog = [
  {
    id: "1",
    name: "Canvas Weekender",
    category: "bags",
    price: 128,
    image: "../assets/shop/weekender.jpg",
    desc: "Heavyweight canvas with leather straps and a wipeable liner. Built for overnight trips.",
    details: "16L capacity, YKK zippers, padded laptop sleeve up to 15\". Spot clean only."
  },
  {
    id: "2",
    name: "Wool Field Shirt",
    category: "apparel",
    price: 64,
    image: "../assets/shop/shirt.jpg",
    desc: "Brushed merino blend with corozo buttons. Soft enough for travel, sturdy enough for work.",
    details: "Regular fit. 70% merino / 30% nylon. Machine wash cold, lay flat to dry."
  },
  {
    id: "3",
    name: "Stoneware Mug Set",
    category: "home",
    price: 42,
    image: "../assets/shop/mugs.jpg",
    desc: "Set of two handmade mugs with a speckled glaze. Dishwasher safe.",
    details: "12 oz each. Food-safe glaze. Slight variation is part of the craft."
  },
  {
    id: "4",
    name: "Crossbody Sling",
    category: "bags",
    price: 86,
    image: "../assets/shop/sling.jpg",
    desc: "Water-resistant nylon with a hidden zip pocket and adjustable webbing strap.",
    details: "Fits a compact camera, keys, and a slim wallet. Water-resistant shell."
  },
  {
    id: "5",
    name: "Organic Tee",
    category: "apparel",
    price: 38,
    image: "../assets/shop/tee.jpg",
    desc: "Midweight cotton jersey with a relaxed shoulder. Pre-washed to minimize shrink.",
    details: "100% organic cotton. Garment-washed. True to size."
  },
  {
    id: "6",
    name: "Linen Throw",
    category: "home",
    price: 54,
    image: "../assets/shop/throw.jpg",
    desc: "Stonewashed Belgian linen, 50×70. Softens with every wash.",
    details: "50\" × 70\". Machine wash warm, tumble low. Gets better with age."
  },
  {
    id: "7",
    name: "Utility Overshirt",
    category: "apparel",
    price: 118,
    image: "../assets/shop/overshirt.jpg",
    desc: "Garment-dyed cotton twill with dual chest pockets and horn buttons.",
    details: "Unlined. Wear alone or layered. Expect subtle dye variation."
  },
  {
    id: "8",
    name: "Cedar Desk Tray",
    category: "home",
    price: 72,
    image: "../assets/shop/tray.jpg",
    desc: "Solid cedar catchall with a felt base. Holds keys, pens, and daily carry.",
    details: "Hand-finished. Natural cedar scent fades gently over time."
  }
];

window.MeridianCatalog.byId = function (id) {
  id = String(id);
  for (var i = 0; i < window.MeridianCatalog.length; i++) {
    if (window.MeridianCatalog[i].id === id) return window.MeridianCatalog[i];
  }
  return null;
};
