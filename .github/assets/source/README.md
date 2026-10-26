# Banner source

`banner.html` is the self-contained source of the README banner (`../banner-light.png` and `../banner-dark.png`). One file holds both themes: a `@media (prefers-color-scheme: dark)` block swaps the colours.

## Identity

- **Fonts:** **Manrope** (display, 800) and **Inter** (body; the React client already uses Inter), with **JetBrains Mono** for small sensor labels, loaded from Google Fonts.
- **Colours:** `#0066cc` primary blue and `#00b8d4` cyan (both from `client/src/index.css`), `#00d4aa` aqua accent, `#023652` deep navy from the logo, `#f4f8fc` light background and `#061a2c` dark background.
- **Motif:** three linked "record" cards that show the real alert thresholds from `server/routes/dashboard.js` (pH 6.5 to 8.5, TDS up to 500 ppm, quality score 50% or more) above water waves on a faint sensor grid, plus a droplet-and-chain mark drawn after the logo in `client/public/AquaChain.png`.
- The droplet mark is redrawn as inline SVG; no image file is embedded.

## Re-render

From the repository root:

```bash
export CHROME_PATH="<path to a Chrome or Chromium binary>"
node render-html.mjs .github/assets/source/banner.html .github/assets/banner-light.png --scheme light
node render-html.mjs .github/assets/source/banner.html .github/assets/banner-dark.png --scheme dark
```

`render-html.mjs` is a small Playwright script (not in this repository) that opens the page at 1600 x 600, waits for fonts, and saves a 2x screenshot with the given `prefers-color-scheme`. Any headless browser that screenshots a 1600 x 600 viewport at 2x, once in light and once in dark mode, gives the same result.

## Notes for agents

- Keep the banner honest: no invented numbers, users, partners or results. Status words in the banner must match the README's "Honest status" section.
- Check both PNGs after rendering for overflow, clipped text and weak contrast.
