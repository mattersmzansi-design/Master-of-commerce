# Environment Variables

Vite only exposes env vars prefixed `VITE_` to client code, via `import.meta.env`.

| Variable | Required? | Used in | Purpose |
|---|---|---|---|
| `VITE_AV_KEY` | Optional | `NYSE.jsx` | Alpha Vantage API key for live NYSE quotes. Without it, the NYSE page falls back to the built-in `MOCK_STOCKS` data. |

## Setting it locally

1. Copy or create `.env` at the repo root (the README references a `.env.example` template — create one from the table above if it isn't present).
2. Add:

   ```
   VITE_AV_KEY=your_key_here
   ```

3. Restart `npm run dev` — Vite only reads `.env` at startup.

## Setting it on Vercel

Project → **Settings → Environment Variables** → add `VITE_AV_KEY` → redeploy. See [Deployment](Deployment.md) for the full flow.

## Adding a new key later

Following the same pattern (as News, Calendar, and Betting move off mock data — see [Roadmap](Roadmap.md)):

1. Prefix it `VITE_` so Vite exposes it to the browser.
2. Read it with `import.meta.env.VITE_YOUR_KEY`.
3. Document it here and add it to `.env.example`.

Since these are `VITE_`-prefixed variables, they're bundled into client-side JS and are **not** secret at runtime — don't use this pattern for keys that must stay server-side.
