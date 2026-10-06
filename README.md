# Champasen

Live demo: https://mlizk1258.github.io/Champasen/ (Vietnamese by default; add `?lang=en` for English)

Marketing website for Champasen, a producer and exporter of animal feed for poultry, livestock and aquaculture.

## Run locally

It is a static site with no build step. Serve the folder with any static server, for example:

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Structure

- `index.html` — page markup
- `css/style.css` — styles and brand tokens (purple `#482E87`, green `#13A052`, gold `#E9A631`)
- `js/main.js` — interactions (GSAP + ScrollTrigger, loaded from cdnjs)
- `js/i18n.js` — all site text in Vietnamese and English
- `assets/logo/` — logo variants
- `assets/img/` — photography

## Before launch

Replace the placeholder content: the stats, the export-market split, the address and email, the news stories, and the `#` links.
