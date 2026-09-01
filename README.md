# Abdul Al Rohan — Portfolio

A single-page personal portfolio for an SEO specialist. Static HTML, CSS and vanilla
JavaScript — **no framework, no build step, no runtime dependencies.**

```
index.html              the whole page (semantic HTML + JSON-LD)
robots.txt
sitemap.xml
assets/
  css/main.css          design tokens, layout, components, responsive rules
  js/main.js            ~200 lines: nav, scroll spy, reveal, counters, tabs
  fonts/*.woff2         self-hosted variable fonts (Space Grotesk, Inter — latin subset)
  img/                  WebP imagery, favicon.svg, apple-touch-icon.png, og-cover.png
```

## Run it

Any static file server works. From this folder:

```bash
python3 -m http.server 8000      # then open http://localhost:8000
# or
npx serve .
```

Opening `index.html` directly via `file://` also works, though relative font/image
paths are better exercised over HTTP.

## Deploy

The site is plain static files — drop the folder on GitHub Pages, Netlify, Vercel,
Cloudflare Pages or any host. No build command, no output directory.

**One thing to change when the domain changes:** the canonical URL
`https://rohan-jitu.github.io/portfolio/` appears in `index.html` (canonical link,
Open Graph / Twitter tags, JSON-LD), in `robots.txt` and in `sitemap.xml`. Search
and replace it in those three files.

## Editing content

Everything lives in `index.html` — there is no CMS or data file to keep in sync.

- **Social + booking links** are centralised in the `SOCIAL` map at the top of
  `assets/js/main.js`. Markup uses `data-social="linkedin|github|facebook|instagram|whatsapp|calendly"`
  and the href is filled in at runtime, so a link only ever changes in one place.
- **Contact form** posts to [FormSubmit](https://formsubmit.co) at
  `https://formsubmit.co/rohanabdulal@gmail.com`. The first submission from a new
  deployment must be confirmed via the activation email FormSubmit sends. A hidden
  `_honey` field provides basic spam filtering.
- **Colours, spacing, radii and fonts** are CSS custom properties in `:root`
  (`assets/css/main.css`). Every translucent value in the sheet is written against
  three channel triplets — `--ink-rgb` (overlay ink for surfaces and hairlines),
  `--shell-rgb` (glass panels and inputs) and `--accent-rgb` — so re-theming means
  editing tokens, never rules.
- **Case-study metrics** are transcribed from the Google Search Console screenshots in
  `assets/img/work/`. Keep the two in sync if a screenshot is replaced.

## Themes

Dark is the default and the brand identity. The header toggle switches to a light
theme and the choice is stored in `localStorage` under `theme`; an inline script in
`<head>` re-applies it before first paint, so there is no flash. The `theme-color`
meta tag follows the active theme.

The light palette lives in one `[data-theme="light"]` block at the top of
`main.css` and overrides tokens only. Its accent stops are darkened
(jade `#00795e`, teal `#0a6f96`, indigo `#5848d6`) so accent text, gradient
headings and the white-on-gradient button all clear 4.5:1 on white.

## Brand mark

`assets/img/favicon.svg` is an original **R** monogram — one stroked path for the
stem and bowl plus a rising leg, on a rounded gradient tile. It is pure geometry so
it stays legible at 16px. The header uses the same paths inline, filled with the
theme's accent tokens, so the mark recolours with the page.
`apple-touch-icon.png` is the full-bleed raster twin (iOS applies its own corner
mask). Both are generated from the same coordinates; `og-cover.png` reuses the mark.

## Signature elements

Four deliberate moments carry the visual identity, each doing a different job:

- **Closing CTA ribbon** — display-scale "Book a call" alternating solid and
  outlined, running edge to edge above the footer. It is the whole page's single
  loud moment, and it is a link, not decoration.
- **Outlined step numerals** — the process section's 01–04 set in oversized
  outlined type, giving it a register of its own next to the services grid.
  Both it and the ribbon draw their outline from one `--stroke` token, tuned per
  theme because a hairline that reads on black disappears on white.
- **Self-drawing timeline rail** — the experience rail scales in from the top as
  the section arrives. The motion is the chronology, which is why it earns it.
- **Film grain** — one inline SVG turbulence tile over the backdrop at
  `--grain` opacity. It removes banding from the large dark washes and stops flat
  surfaces reading as dead space.

## Accessibility & motion

Semantic landmarks, a skip link, visible focus rings, labelled form fields and
`aria-*` state on the nav toggle and the engagement tabs. Everything is readable
without JavaScript — scroll-reveal only hides content once the `js` class is set on
`<html>`. `prefers-reduced-motion: reduce` disables the marquee, count-ups, reveals
and smooth scrolling.

## Performance notes

- Two self-hosted variable font files (~95 KB total), preloaded, `font-display: swap`.
- All imagery is WebP with explicit `width`/`height` to avoid layout shift; the hero
  portrait uses `fetchpriority="high"`, everything else is `loading="lazy"`.
- The animated background is pure CSS (`transform`/`opacity` only) with no canvas or
  library.
- Total page weight is roughly 250 KB on first load.
