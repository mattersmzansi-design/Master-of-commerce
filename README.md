# Master of Commerce

Your daily home base for running a business: tasks, cash flow, invoices and
inventory, alongside global markets, live crypto, business news, economic
calendar and soccer betting. Sign in and your dashboard — and its data —
syncs across every device you use.

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

## Set up Supabase (sign-in + cross-device sync)

Tasks, Cash Flow, Invoices, Inventory and your dashboard layout all need a
Supabase project — it's free and takes about five minutes.

1. Create a free account and project at https://supabase.com
2. In your project, go to the **SQL Editor** → New query, paste the contents
   of `supabase/schema.sql` from this repo, and run it. This creates the
   tables and row-level security policies so each user only ever sees their
   own data.
3. Go to **Project Settings → API** and copy the **Project URL** and
   **anon public** key.
4. Rename `.env.example` to `.env` (if you haven't already) and add:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

5. Restart the dev server. Click **Sign In** in the top right to create an
   account — by default Supabase requires email confirmation, so check your
   inbox after signing up.
6. Visit **Settings** (in the nav) to show, hide and reorder widgets on your
   home page. Everything saves automatically and follows you to any device
   you sign into.

Without Supabase configured, the app still runs — the new widgets show a
"sign in to sync" message and the rest of the site (markets, news, calendar,
betting) works as before.

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

### Step 3 — Add your API keys on Vercel
1. Go to your project → Settings → Environment Variables
2. Add: `VITE_AV_KEY` = your Alpha Vantage key
3. Add: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` = your Supabase project values
4. Click "Redeploy" — NYSE live data and sign-in activate

### Step 4 — Add your custom domain
1. Go to your project → Settings → Domains
2. Type your domain (e.g. masterofcommerce.co.za) → Add
3. Vercel shows you the DNS records to add at your domain registrar
4. Add those records, wait 10–30 minutes — your site is live on your domain

## Home page widgets

The home page is a customizable dashboard. Each widget below can be shown,
hidden and reordered from **Settings** once you're signed in.

| Widget | Data source | Requires sign-in |
|---|---|---|
| Today's Tasks | Supabase (per-user) | Yes |
| Cash Flow | Supabase (per-user) | Yes |
| Invoices | Supabase (per-user) | Yes |
| Inventory | Supabase (per-user) | Yes |
| Business News | Mock — ready for NewsAPI | No |
| Markets (JSE/NYSE/Crypto) | Mock + live (CoinGecko, Alpha Vantage) | No |
| Economic Calendar | Curated events | No |
| Soccer Betting | Mock — ready for Odds API | No |
| Cryptocurrency | Live (CoinGecko, free) | No |

## Other pages

| Page | Route | Data source |
|---|---|---|
| Business News | /news | Mock — ready for NewsAPI |
| Crypto Markets | /crypto | Live (CoinGecko, free) |
| Economic Calendar | /calendar | Curated events |
| NYSE Stocks | /nyse | Mock + live (Alpha Vantage key) |
| Soccer Betting | /betting | Mock — ready for Odds API |
| JSE Stocks | /jse | Coming soon |
| Settings | /settings | Customize your dashboard |

## Project layout

```
src/
  pages/            — one file per page
  components/       — shared Nav, Footer, AuthModal
  components/widgets/ — one file per home-page widget
  lib/              — Supabase client, auth context, data hooks
  theme.js          — colors and fonts
  App.jsx           — routes
  index.css         — global styles
public/             — static assets (favicon, icons)
supabase/schema.sql — run once in your Supabase project's SQL editor
vercel.json         — routing config for deployment
.env.example        — copy to .env and add your keys
```
