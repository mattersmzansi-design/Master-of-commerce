# Roadmap

Rough list of what's mock today and what it'd take to make it live, based on comments and structure already in the code.

## Fix the build first

Everything below is moot until the file layout is reconciled — see [Known Issues](Known-Issues.md).

## News (`/news`)

- Currently a static `ARTICLES` array in `News.jsx` (category, headline, dek, source, time, read length).
- README suggests **NewsAPI** as the intended source.
- The mock shape (category tags, source attribution, relative time) maps fairly directly onto a real news API response — swapping the data source shouldn't require UI changes.

## Soccer Betting (`/betting`)

- Currently a static `FIXTURES` array (league, teams, kickoff/live state, score, 1X2/over-under/BTTS odds).
- README suggests **The Odds API** as the intended source.
- Live fixtures would also need a live-score feed if the "Live Now" state (current behavior: hardcoded `liveMin`) is to update in real time.

## Economic Calendar (`/calendar`)

- Currently 26 hand-curated `EVENTS` covering SA, US, EU, UK, and DE releases.
- No specific provider suggested in the README yet — candidates would be a dedicated econ-calendar API (e.g. Trading Economics, which is also floated for JSE below) or a forex-calendar provider.

## NYSE (`/nyse`)

- Already live when `VITE_AV_KEY` is set (Alpha Vantage). Mock `MOCK_STOCKS` is the fallback, not the only path.
- Alpha Vantage's free tier is rate-limited — worth checking real-world call volume against the 20-symbol mock list before relying on it in production.

## JSE Stocks (`/jse`)

- Not built — shows `ComingSoon.jsx` with a blurb pointing at **Profile Data (profiledata.co.za)** or **Trading Economics** as candidate data feeds (see `App.jsx`).
- Once a feed is chosen, this would follow the same pattern as `NYSE.jsx`: a page component + mock fallback + live fetch gated on an API key.

## Smaller items

- `.env.example` doesn't exist yet — add one documenting `VITE_AV_KEY` (see [Environment Variables](Environment-Variables.md)).
- The legacy `C_DARK` theme in `theme.js` is unused — either wire up a theme toggle or remove it.
- The stray root-level `Public` file (see [Known Issues](Known-Issues.md)) should be resolved one way or the other.
