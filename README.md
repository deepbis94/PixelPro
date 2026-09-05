# PixelPro

Portfolio showcase of pixel-perfect HTML/CSS conversion — three production-style landing demos plus a hub, built with **pure HTML5, CSS3, and vanilla JavaScript** (no frameworks, no build step).

## Demos

| Path | Name | Highlights |
|------|------|------------|
| [`saas/`](saas/) | **Orbit** | Sticky nav, mobile menu, gradient hero, features, pricing toggle, FAQ accordion |
| [`ecommerce/`](ecommerce/) | **Meridian** | Product grid, filters, PDP, cart, checkout, thank-you (cart via `localStorage`) |
| [`agency/`](agency/) | **Studio Kline** | Dark theme, masonry work, alternating sections, stats counter, contact form |

Hub: [`index.html`](index.html)

## Quick start

Open the hub in a browser:

```bash
open index.html
```

Or serve locally (recommended for full asset loading):

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## Project structure

```
pixelpro/
├── index.html              # Hub linking all demos
├── css/ / js/              # Hub styles & scroll reveals
├── favicon.svg / .ico
├── assets/                 # Unsplash images (see CREDITS.txt)
├── saas/
├── ecommerce/              # listing → product → cart → checkout → thank-you
└── agency/
```

## Implementation notes

- Semantic HTML5, CSS custom properties, Grid + Flexbox, BEM naming
- Responsive breakpoints: ~320px / 768px / 1024px
- Scroll reveals via Intersection Observer (`prefers-reduced-motion` respected)
- Accessibility: skip links, ARIA, keyboard support, visible focus states
- Meridian cart persists across pages in `localStorage`

## Photos

Product and portfolio imagery from [Unsplash](https://unsplash.com). Photographer credits: [`assets/CREDITS.txt`](assets/CREDITS.txt).

## License

Demo project for portfolio use. Unsplash photos remain under the [Unsplash License](https://unsplash.com/license).
