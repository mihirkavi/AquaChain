# README images

Images used by the root `README.md`.

| File | What it is | How it was made |
| --- | --- | --- |
| `banner-light.png`, `banner-dark.png` | README banner for light and dark mode | Rendered from [`source/banner.html`](source/banner.html) with headless Chrome (26 October 2026) |
| `hero.png` | Dashboard overview on desktop and phone | Real screenshot of this code running locally, framed with headless Chrome |
| `screenshots/sensors.png` | Sensor Management view | Real local screenshot |
| `screenshots/readings.png` | Water Quality Readings view | Real local screenshot |
| `screenshots/ledger.png` | Blockchain Records view | Real local screenshot |
| `screenshots/landing.png` | Landing page | Real local screenshot |

Notes:

- All screenshots use the built-in demo account and the server's **simulated** sensor readings and randomly generated record hashes. They show no real people, places or measurements.
- Screenshots must only ever show public or demo data. Retake them with the demo account if the UI changes.

## Visual identity

Water-monitoring and IoT dashboards lean on clean technical sans-serifs, blue and cyan, and data read-outs. The banner reuses the client's own blue-to-cyan gradient so the README matches the screenshots below it.

- **Fonts:** **Manrope** (display, 800) and **Inter** (body; the React client already uses Inter), with **JetBrains Mono** for small sensor labels.
- **Colours:** `#0066cc` primary blue and `#00b8d4` cyan (both from `client/src/index.css`), `#00d4aa` aqua accent, `#023652` deep navy from the logo, `#f4f8fc` light background and `#061a2c` dark background.
- **Motif:** three linked "record" cards that show the real alert thresholds from `server/routes/dashboard.js` (pH 6.5 to 8.5, TDS up to 500 ppm, quality score 50% or more) above water waves on a faint sensor grid, plus a droplet-and-chain mark drawn after the logo in `client/public/AquaChain.png`.

The README badges use the same colours. To change the banner, edit [`source/banner.html`](source/banner.html) and follow [`source/README.md`](source/README.md) to re-render both PNGs.
