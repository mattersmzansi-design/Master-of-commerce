# Project briefer — where we are today

> A one-glance status of the site. This file is the **source of truth** for the
> branded `mzansi-briefer.pdf` alongside it — edit the lists below, then run
> `node docs/render-pdfs.mjs` to rebuild the PDF.
>
> **Last updated:** 2026-08-13 · Codename: Genesis 🧬

---

## Live & working

- **New masthead — mobile & desktop** — Full-bleed bar with the brand badge (logo + MZANSI MONEY MATTERS + cyan tagline), menu on the left, ✉ Subscribe on the right. Same design language across phone and laptop.
- **Substack integration** — Ntokozo's latest 3 posts pull from `ntokozocele.substack.com/feed` (via a Vercel serverless function) and show as a "Ntokozo's take" section on the News page, brand-styled, click-through to Substack. Substack posts also appear in site-wide search tagged "SUBSTACK".
- **Socials + contact** — Instagram, X and Facebook icons in the footer + mobile burger menu, plus the `info@mzansimoneymatters.co.za` email as an orange button. Handles live in one file (`src/lib/socials.jsx`) so adding TikTok / LinkedIn / YouTube / WhatsApp later is a one-line edit.
- **TradingView widgets** — The `/jse` page is now a real live page (JSE All Share chart + top-10 ticker tape + 9 mini charts + ZA market screener). NYSE and Crypto pages have live TradingView hero charts (S&P 500 and BTCUSD) above their existing content.
- **Sector Health page** — `/sectors` renders weekly JSE sector commentary from Supabase (`sector_summary_public` view). Each card has a color-graded 0–100 health gauge, cycle position, expandable narrative, tailwinds/headwinds bullet lists, and "what to watch next". Data flows client → `/api/sectors` (Vercel serverless function) → Supabase, cached 10 min at edge. Compliance-strict: prominent "educational only, not financial advice" disclaimer at top and bottom; no buy/sell language anywhere.
- **Newsletter signup via Substack** — The ✉ Subscribe button on both mobile and desktop now links straight to Ntokozo's Substack signup (no more FormSubmit relay). One list, one place to write from, one place to send campaigns.
- **Site-wide search** — Search icon opens a live filter across news articles, NYSE stocks, top cryptos, calendar events, fixtures and the pages themselves. Click a result to jump.
- **Live NYSE prices** — Alpha Vantage feeds ticker data on the NYSE page. Sample data shows when the daily API quota is used up.
- **Live crypto data** — CoinGecko powers the Crypto page — no key needed, generous free tier.
- **Live soccer odds** — The Odds API powers the Betting fixtures + 1X2 odds. Falls back to sample data if the key is missing.
- **Economic Calendar (seed data)** — 26 upcoming global data releases across 8 countries. Ready to swap for a live feed when we pick one.
- **Home "Today's brief"** — Rate-holds top story, JSE/NYSE/BTC snapshot, matches strip, calendar peek — the front-page recap of everything.
- **Auto-deploy on Vercel** — Every push to main goes live at www.mzansimoneymatters.co.za within a minute.

## Not there yet

- **Deep links from search results** — Search jumps to the right page but doesn't scroll to or highlight the exact item. Needs anchor IDs + scrollIntoView.
- **Search on mobile** — We removed it to keep the header clean. Desktop only for now — a phone-friendly version (icon in menu?) is on the list.
- **Alpha Vantage rate limit** — Free tier is 25 requests/day. On a busy day the NYSE page falls back to sample data. A paid tier or a caching layer fixes it.
- **Live economic calendar** — Currently hard-coded. Trading Economics / FMP would give a live feed but both charge past a small free tier.
- **Bundle size** — >500kb single JS chunk (build warns). Code-splitting per route will speed up first paint on 3G.
- **Analytics & error tracking** — No Google Analytics / Plausible / Sentry yet. We're flying blind on traffic and crashes.
- **Legal footer** — No T&Cs, privacy notice, or POPIA/GDPR cookie disclosure yet — required before we drive real traffic.
- **Contact details** — No contact page, footer email/WhatsApp, or socials yet. Quick win; needs owner to decide what to expose (email only, or WhatsApp / Instagram / X too?).
- **Embedded widgets** — No TradingView charts on JSE/NYSE/Crypto yet, no YouTube analysis videos, no live X/Twitter finance feed. All are free-to-embed and would make the pages feel much more alive.

## Next up (my picks)

- **Strategy layer (next session)** — owner wants to wire "whether buy / sell" onto the market pages: signals, indicators, or a personal thesis framework. Scope this out at the start of the next session — options range from TradingView's Technical Analysis widget (0 effort, generic signals) to a bespoke "Ntokozo's rating" per ticker (real work, real value).
- **Start writing regularly on Substack** — everything's wired up; the platform now needs actual voice + posts landing weekly.
- Deep-link search results to the exact item (article/ticker/fixture).
- Add a lightweight analytics tag (Plausible is privacy-first & POPIA-friendly).
- Ship a footer with T&Cs / privacy / contact.
