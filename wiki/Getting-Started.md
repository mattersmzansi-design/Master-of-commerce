# Getting Started

## Prerequisites

- Node.js 18+ (from [nodejs.org](https://nodejs.org))

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints — usually `http://localhost:5173`.

> Before this will actually boot, read [Known Issues](Known-Issues.md) — the current file layout doesn't match the import paths the components use, so `npm run dev` will fail to resolve modules until that's fixed.

## Add your Alpha Vantage key (NYSE live data)

The NYSE page works with mock data out of the box, but switches to live quotes once a key is present.

1. Get a free key at [alphavantage.co/support](https://www.alphavantage.co/support)
2. Rename `.env.example` to `.env` (create `.env` if the example file doesn't exist yet)
3. Set the key:

   ```
   VITE_AV_KEY=your_key_here
   ```

4. Restart the dev server.

See [Environment Variables](Environment-Variables.md) for the full list of keys the app reads.

## Other scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the project |

## Next steps

- [Project Structure](Project-Structure.md) — how the code is organized
- [Pages & Routes](Pages-and-Routes.md) — what each route does
- [Deployment](Deployment.md) — ship it to Vercel
