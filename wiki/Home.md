# Master of Commerce — Wiki

Your daily brief for global markets, live crypto, business news, an economic calendar, and soccer betting — built as a React + Vite single-page app.

This wiki is the project's reference documentation: how to run it, how it's put together, and what's still mock data versus live.

## Pages

| Page | What's in it |
|---|---|
| [Getting Started](Getting-Started.md) | Install, run locally, add your API key |
| [Project Structure](Project-Structure.md) | File layout and how the app boots |
| [Pages & Routes](Pages-and-Routes.md) | Every route, its data source, and component |
| [Theming](Theming.md) | The "Ledger" design system — colors, fonts |
| [Environment Variables](Environment-Variables.md) | All `VITE_*` keys the app reads |
| [Deployment](Deployment.md) | Shipping to Vercel with a custom domain |
| [Known Issues](Known-Issues.md) | Things that need fixing before this builds cleanly |
| [Roadmap](Roadmap.md) | Mock data → live data, JSE feed, next steps |

## At a glance

- **Stack**: React 19, React Router 7, Recharts, Vite 8
- **Live data today**: crypto prices/charts via CoinGecko (no key needed), NYSE quotes via Alpha Vantage (key required, falls back to mock)
- **Mock data today**: Business News, Economic Calendar, Soccer Betting odds — all structured so a real API can be dropped in later
- **Not built yet**: JSE Stocks (`/jse` shows a "Coming soon" screen)

See [Getting Started](Getting-Started.md) to run it locally.
