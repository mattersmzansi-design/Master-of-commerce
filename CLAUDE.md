# Mzansi Money Matters — project brief

> **Public name: Mzansi Money Matters** (live at www.mzansimoneymatters.co.za) —
> matches the logo and domains. The old placeholder name "Master of Commerce" has
> been retired. **Codename: Genesis** 🧬 — after the Bitcoin genesis block (block 0,
> mined 3 Jan 2009), the origin every other block is built on: the owner's genesis,
> the first block of something bigger. The git repo folder is still named
> `Master-of-commerce` (repo rename is optional/cosmetic).

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
- **Supabase** (`/sectors` page — weekly JSE sector commentary) uses env vars
  `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Read server-side
  only in `api/sectors.js`, so the Next.js-style prefix works fine on this Vite
  site (Vite would need `VITE_*` for client-side, but we never expose the anon
  key to the browser). The page queries the `sector_summary_public` view.

## Working style (owner preference)
Explain briefly *as we build* — a sentence or two of plain-English "what this is / why it
matters" at the moment it's relevant, so the owner learns the *why*, not just the result.
Flag the "at scale this means… (cost / security / speed)" angle where useful. Keep it short,
no jargon dumps. The owner can say "go deeper" for the full picture or "just do it" for
results only.

More owner preferences we've learned:
- **Mockups before code for any design change.** Owner asks with "give me three" — build
  three side-by-side variants in a scratchpad HTML rendered via Playwright (see the pattern
  in earlier commits: badge · burger · subscribe). Do not touch `src/` until the owner picks
  one. Number the variants (P1/P2/P3, A/B/C) so they can reference them precisely.
- **Deploy only when told.** Feature work lives on `claude/open-link-hzomlc`. Merge to `main`
  and push only when the owner says "deploy", "push it live", or "merge to main".
- **Send a screenshot with anything visual.** Verify UI changes with a real screenshot
  (Playwright) before reporting done — type-checks and tests don't confirm the UI works.
- **Full-bleed masthead.** The current header (`src/components/Nav.jsx`) is deliberately
  full-bleed (no container gutters) with badge in the left corner and Subscribe in the right —
  the owner asked for this explicitly. Do not re-introduce a centred `max-width:1200` on it
  without checking first.
- **Owner-facing docs live in `docs/`.** See "Session-end ritual" below.

## Session-end ritual — keep the docs in sync
At the end of every session, update the two owner-facing docs so they reflect what shipped:

1. **Edit `docs/briefer.md`** — move any newly-live features into the "Live & working" list,
   move anything new that surfaced onto the "Not there yet" list, and refresh "Next up" if
   the priorities shifted. Update the "Last updated" line to today.
2. **Rebuild the PDF:** `node docs/render-pdfs.mjs` → regenerates
   `docs/mzansi-briefer.pdf` from the markdown.
3. **Only edit `docs/prompts.md` + `docs/mzansi-prompt-guide.pdf`** if we changed how we
   actually work together (a new "magic word", a workflow that stuck). It doesn't need
   touching most sessions.
4. **Commit** the updates on the feature branch with a message like
   `docs: refresh session briefer (YYYY-MM-DD)`. Merge to `main` only if the owner asks.

The `docs/render-pdfs.mjs` script is self-contained — fonts are bundled in `docs/fonts/`
and it uses whichever Playwright it can find (system-wide or in `node_modules`).
