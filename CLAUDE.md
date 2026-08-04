# Master of Commerce — project brief

A Vite + React (React Router) finance site for South Africa & global markets:
business news, JSE (coming soon), NYSE, crypto, an economic calendar, and soccer
betting. Data is live where possible, with seeded sample data as a fallback.

## How to run
```bash
npm install
npm run dev      # local dev server (Vite) → http://localhost:5173
npm run build    # production build → dist/
```

## Project layout
- `src/main.jsx` → `src/App.jsx` (routes) → `src/pages/*` (Home, News, NYSE, Crypto, Calendar, Betting, ComingSoon)
- Shared UI: `src/components/Nav.jsx`, `src/components/Footer.jsx`
- **`src/theme.js` is the single source of truth for colours + fonts** — change the
  brand here and it propagates everywhere. Components import `{ C, SERIF, MONO, SANS }`.
- Responsive helpers live in `src/index.css` (`mc-pad`, `mc-collapse`, `mc-collapse-sm`,
  `mc-footer`, `mc-scroll`) — CSS classes with `!important` media queries that override the
  components' inline desktop styles only on small screens. Tag a container with one of these
  to make it responsive without editing its JS.
- Brand logo assets: `public/logo-mark.png` (icon mark) and `public/logo-mark-128.png` (favicon).

## Branding
- Brand is **Mzansi Money Matters** — orange `#F24E01`, cyan `#00D2F0`, gold `#F0B400`,
  dark teal `#012030` text, warm off-white `#FFF8F0` background; fonts **Lora** (display) +
  **Poppins** (body), IBM Plex Mono for numeric tickers.
- The full brand spec + logo files live in the `brand-theme` skill.

## Deploy
- The live site is on **Vercel** and auto-redeploys from the **`main`** branch.
- Feature work happens on `claude/open-link-hzomlc`, then merges into `main` to go live.

## API keys
- **Alpha Vantage** (NYSE stock prices/charts) needs env var **`VITE_AV_KEY`**
  (free key at alphavantage.co, 25 req/day). Add it in Vercel → Settings → Environment
  Variables, or a local `.env` file. Not committed.
- **CoinGecko** (crypto) needs no key.

## Working style (owner preference)
Explain briefly *as we build* — a sentence or two of plain-English "what this is / why it
matters" at the moment it's relevant, so the owner learns the *why*, not just the result.
Flag the "at scale this means… (cost / security / speed)" angle where useful. Keep it short,
no jargon dumps. The owner can say "go deeper" for the full picture or "just do it" for
results only.
