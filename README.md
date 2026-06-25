# Master of Commerce

Your daily brief for global markets, live crypto, business news, economic calendar and soccer betting.

## Quick start (run locally)

You need Node.js 18+ from nodejs.org.

```bash
npm install
npm run dev
```

Open the link it prints — usually http://localhost:5173

## Add your Alpha Vantage key (NYSE live data)

1. Get a free key at https://www.alphavantage.co/support
2. Rename `.env.example` to `.env`
3. Replace the placeholder with your key:

```
VITE_AV_KEY=your_key_here
```

4. Restart the dev server — NYSE live quotes activate automatically.

## Deploy to Vercel (step by step)

### Step 1 — Push to GitHub
1. Create a free account at github.com
2. Click the + icon → "New repository"
3. Name it `master-of-commerce`, keep it private, click "Create repository"
4. Open a terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/master-of-commerce.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Create a free account at vercel.com (sign up with GitHub)
2. Click "Add New Project"
3. Import your `master-of-commerce` repository
4. Framework preset will auto-detect as **Vite** — leave all settings as-is
5. Click "Deploy" — your site goes live in about 30 seconds

### Step 3 — Add your API key on Vercel
1. Go to your project → Settings → Environment Variables
2. Add: `VITE_AV_KEY` = your Alpha Vantage key
3. Click "Redeploy" — NYSE live data activates

### Step 4 — Add your custom domain
1. Go to your project → Settings → Domains
2. Type your domain (e.g. masterofcommerce.co.za) → Add
3. Vercel shows you the DNS records to add at your domain registrar
4. Add those records, wait 10–30 minutes — your site is live on your domain

## Pages

| Page | Route | Data source |
|---|---|---|
| Home | / | Live crypto (CoinGecko) |
| Business News | /news | Mock — ready for NewsAPI |
| Crypto Markets | /crypto | Live (CoinGecko, free) |
| Economic Calendar | /calendar | 26 curated events |
| NYSE Stocks | /nyse | Mock + live (Alpha Vantage key) |
| Soccer Betting | /betting | Mock — ready for Odds API |
| JSE Stocks | /jse | Coming soon |

## Project layout

```
src/
  pages/      — one file per page
  components/ — shared Nav and Footer
  theme.js    — colors and fonts
  App.jsx     — routes
index.css     — global styles
vercel.json   — routing config for deployment
.env.example  — copy to .env and add your keys
```
