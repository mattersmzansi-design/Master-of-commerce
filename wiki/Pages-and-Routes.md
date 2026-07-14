# Pages & Routes

All routes are declared in `App.jsx` using `react-router-dom`.

| Page | Route | Component | Data source |
|---|---|---|---|
| Home | `/` | `Home.jsx` | Live crypto snapshot (CoinGecko) |
| Crypto Markets | `/crypto` | `Crypto.jsx` | Live (CoinGecko, no key required) with mock fallback |
| Business News | `/news` | `News.jsx` | Mock articles — categorized JSE / NYSE / Crypto / SA Economy / Global |
| Economic Calendar | `/calendar` | `Calendar.jsx` | 26 curated events grouped Today / Tomorrow / This Week |
| NYSE Stocks | `/nyse` | `NYSE.jsx` | Mock quotes, switches to live Alpha Vantage data when `VITE_AV_KEY` is set |
| Soccer Betting | `/betting` | `Betting.jsx` | Mock fixtures with odds, grouped Live Now / Today / Tomorrow / This Weekend |
| JSE Stocks | `/jse` | `ComingSoon.jsx` | Not built — placeholder screen |
| Anything else | `*` | `ComingSoon.jsx` | 404 placeholder ("Page not found") |

## Shared chrome

`Nav.jsx` and `Footer.jsx` are rendered by each page individually (there's no shared layout route) — every page component includes `<Nav/>` at the top and `<Footer/>` at the bottom.

Nav's section links (`Nav.jsx`):

- Business News → `/news`
- JSE → `/jse`
- NYSE → `/nyse`
- Crypto → `/crypto`
- Economic Calendar → `/calendar`
- Soccer Betting → `/betting`

## Per-page notes

**Crypto** (`Crypto.jsx`) — fetches live prices and sparklines from CoinGecko; ships with a hardcoded `MOCK` array as a fallback if the fetch fails or is rate-limited.

**NYSE** (`NYSE.jsx`) — ships with a 20-stock `MOCK_STOCKS` array (symbol, sector, price, 52-week range, market cap, P/E, description) plus a set of index quotes (S&P 500, NASDAQ, etc). Reads `import.meta.env.VITE_AV_KEY`; when present, calls the Alpha Vantage API (`https://www.alphavantage.co/query`) for live quotes.

**News** (`News.jsx`) — mock `ARTICLES` array with category, headline, dek, source, and read time. Structured to be a drop-in target for a real news API (README suggests NewsAPI).

**Betting** (`Betting.jsx`) — mock `FIXTURES` array with league, teams, kickoff time/live minute, score, and 1X2 / over-under / BTTS odds. Structured for something like The Odds API.

**Calendar** (`Calendar.jsx`) — mock `EVENTS` array with country flag, category, impact level, and previous/forecast/actual values for each economic release.

**JSE** (`/jse` via `ComingSoon.jsx`) — the blurb in `App.jsx` points at Profile Data (profiledata.co.za) or Trading Economics as candidate data feeds once this is built out.

See [Roadmap](Roadmap.md) for what it'd take to move News, Calendar, Betting, and JSE from mock to live data.
