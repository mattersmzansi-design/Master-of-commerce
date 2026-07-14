# Deployment

The project is set up to deploy on Vercel as a static Vite build, with `vercel.json` handling client-side routing.

## Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/master-of-commerce.git
git push -u origin main
```

(Skip this step if the repo is already on GitHub, as this one is.)

## Step 2 — Deploy on Vercel

1. Sign up at [vercel.com](https://vercel.com) with GitHub.
2. **Add New Project** → import the `master-of-commerce` repository.
3. Framework preset auto-detects as **Vite** — leave settings as-is.
4. Click **Deploy** — live in about 30 seconds.

## Step 3 — Add the Alpha Vantage key

1. Project → **Settings → Environment Variables**.
2. Add `VITE_AV_KEY` = your key.
3. **Redeploy** — NYSE live data activates.

See [Environment Variables](Environment-Variables.md) for what each key does.

## Step 4 — Custom domain

1. Project → **Settings → Domains**.
2. Enter your domain (e.g. `masterofcommerce.co.za`) → **Add**.
3. Add the DNS records Vercel shows at your registrar.
4. Wait 10–30 minutes for propagation.

## How routing works in production

`vercel.json` rewrites every path to `/index.html`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This is required because `react-router-dom`'s `BrowserRouter` handles routing client-side — without the rewrite, refreshing on `/crypto` or `/nyse` would 404 on Vercel's static host.

## Before deploying

Resolve the file-layout mismatch described in [Known Issues](Known-Issues.md) first — `npm run build` will fail to resolve imports otherwise.
