// Prerender every route in public/sitemap.xml to real HTML.
//
// WHY: Vite+React ships a 3KB empty <div id="root"> as the HTML — Googlebot
// has nothing to index, so every route sits in GSC's "Discovered — not
// indexed" bucket. We fix that by writing per-route index.html files with
// hand-crafted preview content (headings, intro paragraph, keywords Google
// cares about) baked into the body. React's createRoot() replaces the
// content when the browser hydrates, so real users see the full live app.
//
// WHY NOT a headless browser: Playwright/Puppeteer need system libs that
// aren't present on Vercel's build container. First attempt failed silently
// and the site reverted to the pre-prerender deploy. Hand-written content
// has zero dependencies and always runs.

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');
const BASE = 'https://www.mzansimoneymatters.co.za';

// One entry per sitemap route. `preview` is the HTML Google will index — write
// it like a mini landing page for the route: real headings, a two-sentence
// intro, and the primary keywords readers would search for. React replaces
// this at hydration time with the live app.
const ROUTES = [
  {
    path: '/',
    title: "Today's Brief — Mzansi Money Matters",
    description: "South African & global markets, live JSE, NYSE and crypto prices, weekly sector commentary, business news and the economic calendar — one place, free, educational.",
    preview: `
      <h1>Mzansi Money Matters — Today's Brief</h1>
      <p><strong>Your daily brief for South African &amp; global markets.</strong> Live prices from the JSE, NYSE and crypto, the latest business news, a weekly health score for every JSE sector, prediction-market odds, and the week's upcoming economic data releases — one place, free, educational.</p>
      <h2>Live markets</h2>
      <ul>
        <li>JSE All Share, Top 40 and the biggest Johannesburg Stock Exchange tickers.</li>
        <li>NYSE: Apple, Microsoft, NVIDIA, Tesla, Amazon, Meta and the S&amp;P 500.</li>
        <li>Crypto: Bitcoin (BTC), Ethereum (ETH) and the top 100 coins by market cap, via CoinGecko.</li>
        <li>USD/ZAR, Gold (XAU) and other key macro tiles.</li>
      </ul>
      <h2>South African business news</h2>
      <p>Top story, side headlines and bottom-row stories — every headline links straight through to the full report. SA Economy, JSE, Crypto, NYSE and Global categories, updated through the day.</p>
      <h2>Weekly sector commentary &amp; prediction markets</h2>
      <p>Educational-only commentary on the health of every JSE-listed sector — tailwinds, headwinds and what to watch — plus live Polymarket odds on politics, crypto and business events.</p>
    `,
  },
  {
    path: '/news',
    title: "Business News — Mzansi Money Matters",
    description: "Breaking South African and global business news — JSE results, Reserve Bank decisions, Rand updates, crypto moves, Fed news and more. Educational coverage, not advice.",
    preview: `
      <h1>Business News</h1>
      <p><strong>The latest business, markets and economy headlines for South Africa and the world.</strong> Live wire stories from Reuters, Bloomberg, Business Day, Fin24 and more, plus Ntokozo's own weekly commentary from Substack.</p>
      <h2>Latest stories</h2>
      <ul>
        <li><strong>SA Economy</strong> — Reserve Bank rate decisions, CPI, unemployment, Rand strength and the National Treasury.</li>
        <li><strong>JSE</strong> — Naspers, Prosus, MTN, Standard Bank, Shoprite, Anglo American, Sasol and all Top-40 earnings and corporate news.</li>
        <li><strong>Crypto</strong> — Bitcoin, Ethereum, Solana, ETF inflows and institutional moves.</li>
        <li><strong>NYSE &amp; Global</strong> — NVIDIA, Apple, Microsoft, the Fed, ECB and major macro events.</li>
      </ul>
      <h2>Ntokozo's take</h2>
      <p>Weekly long-form commentary from Ntokozo Cele's Substack, syndicated here as a dedicated "Ntokozo's take" section with click-through to the full post.</p>
    `,
  },
  {
    path: '/sectors',
    title: "JSE Sector Health — Mzansi Money Matters",
    description: "Weekly educational commentary on the health of every JSE sector — tailwinds, headwinds, cycle position and what to watch next. Not financial advice.",
    preview: `
      <h1>JSE Sector Health</h1>
      <p><strong>Weekly educational commentary on the health of JSE-listed sectors</strong> — tailwinds, headwinds, cycle position and what to watch next. Each sector carries a 0–100 health score, a short narrative explaining the number, and the key stories moving the sector this week.</p>
      <h2>Sectors covered</h2>
      <ul>
        <li>Financials — banks, insurers and the broader South African credit cycle.</li>
        <li>Resources — mining, oil &amp; gas, metals and commodity exposure.</li>
        <li>Retail &amp; Consumer — grocers, apparel, consumer staples and SA household spend.</li>
        <li>Industrials &amp; Property — construction, logistics, REITs and infrastructure.</li>
        <li>Tech &amp; Telecoms — Naspers, Prosus, MTN, Vodacom and SA's tech ecosystem.</li>
      </ul>
      <p><em>This content is general market commentary for educational purposes only, not personal financial advice. It does not constitute a recommendation to buy or sell any security.</em></p>
    `,
  },
  {
    path: '/predictions',
    title: "Prediction Markets — Mzansi Money Matters",
    description: "Live Polymarket odds on politics, crypto and business — what the betting markets actually think the probability of each outcome is. Educational, not financial advice.",
    preview: `
      <h1>Prediction Markets</h1>
      <p><strong>What the betting markets actually think.</strong> Live Polymarket odds on politics, crypto and business events — curated to serious markets only, with sports, celebrity and tasteless markets filtered out.</p>
      <h2>Categories tracked</h2>
      <ul>
        <li><strong>Politics</strong> — US elections, SA elections, geopolitical events.</li>
        <li><strong>Crypto</strong> — Bitcoin and Ethereum price targets, ETF approvals, on-chain milestones.</li>
        <li><strong>Business &amp; Economy</strong> — Fed rate decisions, M&amp;A outcomes, earnings surprises.</li>
      </ul>
      <p>Each market shows the leading outcome as a colour-graded probability, the full YES/NO split (or top-3 for multi-outcome markets), 24-hour trading volume, and a direct link to Polymarket if you want to dig deeper.</p>
      <p><em>Market pricing information for educational purposes only — not a recommendation to trade or bet.</em></p>
    `,
  },
  {
    path: '/analyst',
    title: "AI Analyst — Mzansi Money Matters",
    description: "Claude-powered educational breakdown of any JSE, NYSE or crypto ticker — snapshot, what the business does, what the numbers suggest, what to watch. Not financial advice.",
    preview: `
      <h1>AI Analyst</h1>
      <p><strong>A Claude-powered educational breakdown of any stock or crypto ticker.</strong> Paste a symbol — Naspers (NPN), Apple (AAPL), Bitcoin (BTC), any JSE/NYSE listing or top crypto — and the AI Analyst pulls a live quote, company fundamentals and recent news, then returns a structured plain-English analysis.</p>
      <h2>Every report covers</h2>
      <ul>
        <li><strong>Snapshot</strong> — current price, 24-hour move, market cap, key ratios.</li>
        <li><strong>What the business does</strong> — the company in two sentences, written for a reader not a textbook.</li>
        <li><strong>What the numbers suggest</strong> — what the quote and fundamentals imply about where things stand.</li>
        <li><strong>What to watch</strong> — the next catalysts, earnings dates and sector-level risks.</li>
      </ul>
      <p>Share-ready: each report has a one-click "Share to Facebook" button that posts the summary + a canonical deep link that re-runs the same analysis.</p>
      <p><em>Educational breakdown for information purposes only — not personal financial advice, not a recommendation to buy or sell.</em></p>
    `,
  },
  {
    path: '/jse',
    title: "JSE Stocks — Mzansi Money Matters",
    description: "Live JSE prices, All Share index chart and top Johannesburg Stock Exchange tickers — Naspers, Prosus, MTN, Standard Bank, Anglo American, Shoprite and more.",
    preview: `
      <h1>JSE — Johannesburg Stock Exchange</h1>
      <p><strong>Live JSE All Share index chart, top-10 ticker tape and the biggest Johannesburg Stock Exchange stocks</strong> at a glance. Price, chart, and recent news for every major South African listed company.</p>
      <h2>Tracked tickers</h2>
      <ul>
        <li><strong>JSE:J203</strong> — JSE All Share Index</li>
        <li><strong>NPN</strong> — Naspers</li>
        <li><strong>PRX</strong> — Prosus</li>
        <li><strong>MTN</strong> — MTN Group</li>
        <li><strong>SBK</strong> — Standard Bank</li>
        <li><strong>FSR</strong> — FirstRand</li>
        <li><strong>AGL</strong> — Anglo American</li>
        <li><strong>GLN</strong> — Glencore</li>
        <li><strong>SHP</strong> — Shoprite</li>
        <li><strong>BHP</strong> — BHP Group</li>
      </ul>
      <p>Powered by TradingView widgets with real-time Johannesburg Stock Exchange data. Click any ticker for the AI Analyst's full breakdown.</p>
    `,
  },
  {
    path: '/nyse',
    title: "NYSE Stocks — Mzansi Money Matters",
    description: "Live NYSE prices and charts for Apple, Microsoft, NVIDIA, Tesla, Amazon, Meta and the S&P 500 — the global stocks that move the JSE too.",
    preview: `
      <h1>NYSE — New York Stock Exchange</h1>
      <p><strong>Live NYSE and Nasdaq prices for the US stocks that move the whole world — and the JSE too.</strong> Chart, latest quote and recent news for every major American listing.</p>
      <h2>Top tickers</h2>
      <ul>
        <li><strong>AAPL</strong> — Apple</li>
        <li><strong>MSFT</strong> — Microsoft</li>
        <li><strong>NVDA</strong> — NVIDIA</li>
        <li><strong>TSLA</strong> — Tesla</li>
        <li><strong>AMZN</strong> — Amazon</li>
        <li><strong>META</strong> — Meta Platforms</li>
        <li><strong>GOOGL</strong> — Alphabet</li>
        <li><strong>SPX</strong> — S&amp;P 500 Index</li>
      </ul>
      <p>Prices via Alpha Vantage and TradingView. Click any ticker to get the AI Analyst's structured take.</p>
    `,
  },
  {
    path: '/crypto',
    title: "Live Crypto Prices — Mzansi Money Matters",
    description: "Live prices for Bitcoin, Ethereum, Solana, XRP, Cardano and the top 100 cryptocurrencies by market cap. Educational, powered by CoinGecko.",
    preview: `
      <h1>Live Crypto Prices</h1>
      <p><strong>Live prices for Bitcoin, Ethereum, Solana and the top 100 cryptocurrencies by market cap</strong>, powered by CoinGecko. 24-hour change, market cap, trading volume and a mini sparkline chart for every coin — plus category filters for L1s, DeFi, memes and more.</p>
      <h2>Top coins tracked</h2>
      <ul>
        <li><strong>BTC</strong> — Bitcoin</li>
        <li><strong>ETH</strong> — Ethereum</li>
        <li><strong>SOL</strong> — Solana</li>
        <li><strong>XRP</strong> — XRP</li>
        <li><strong>ADA</strong> — Cardano</li>
        <li><strong>DOGE</strong> — Dogecoin</li>
        <li>…and the top 100 by market cap.</li>
      </ul>
      <p>Click any coin for the AI Analyst's educational breakdown — snapshot, what the project does, what the numbers suggest, what to watch next.</p>
    `,
  },
  {
    path: '/calendar',
    title: "Economic Calendar — Mzansi Money Matters",
    description: "Upcoming South African and global data releases — CPI, GDP, rate decisions, unemployment, retail sales. Dates, times, forecasts and prior readings.",
    preview: `
      <h1>Economic Calendar</h1>
      <p><strong>Upcoming data releases, central bank decisions and market-moving events</strong> for South Africa and the world. CPI, GDP, unemployment, retail sales, PMI, Fed/SARB/ECB rate decisions — dates, times, forecasts and prior readings in one place.</p>
      <h2>Coverage</h2>
      <ul>
        <li><strong>South Africa</strong> — SARB MPC rate decisions, CPI, GDP, trade balance, SARS tax collections, unemployment.</li>
        <li><strong>United States</strong> — Fed FOMC, Non-Farm Payrolls, CPI, retail sales, PCE, GDP.</li>
        <li><strong>Eurozone &amp; United Kingdom</strong> — ECB and BoE rate decisions, ZEW sentiment, inflation prints.</li>
        <li><strong>China &amp; Japan</strong> — PMI, GDP, trade and central bank meetings.</li>
      </ul>
      <p>Filter by country, impact (high / medium / low) and date range. Educational calendar for information, not a trading signal.</p>
    `,
  },
  {
    path: '/legal',
    title: "Legal &amp; Compliance — Mzansi Money Matters",
    description: "Financial disclaimer, terms of use and POPIA-aligned privacy policy for Mzansi Money Matters.",
    preview: `
      <h1>Legal &amp; Compliance</h1>
      <p>The rules of the road for using Mzansi Money Matters — a financial disclaimer, the site's terms of use, and how we treat your personal information under POPIA.</p>
      <h2>Financial Disclaimer</h2>
      <p>Mzansi Money Matters is <strong>not a licensed financial services provider</strong>. The site publishes market news, live and delayed price data, sector commentary, prediction-market snapshots and the personal writing of its editor — all for general information and education only. Nothing on this site constitutes personal financial advice, a recommendation, or a solicitation to buy or sell any security.</p>
      <h2>Terms of Use</h2>
      <p>Permitted and prohibited use, intellectual property, limitation of liability and governing law (South Africa).</p>
      <h2>Privacy Policy (POPIA)</h2>
      <p>What we collect (anonymous analytics, newsletter signups via Substack, emails you send us), what we don't (no cookies, no personally identifiable tracking), and your rights under POPIA — access, correction, deletion, objection and complaint to the Information Regulator.</p>
    `,
  },
];

// Read the Vite-built template and keep its asset script references intact.
const template = readFileSync(join(DIST, 'index.html'), 'utf8');

const results = [];

for (const route of ROUTES) {
  const canonical = BASE + route.path;
  let html = template
    // Replace <title>
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    // Replace the top-of-head description (the one hard-coded in index.html)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${route.description}">`
    )
    // Replace og:title + og:description + og:url
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${route.title}">`
    )
    .replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${route.description}">`
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${canonical}">`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${route.title}">`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${route.description}">`
    )
    // Inject canonical before </head> (none exists in the template)
    .replace('</head>', `  <link rel="canonical" href="${canonical}">\n  </head>`)
    // Inject the preview content into the root. React's createRoot() will
    // replace this on hydration — see src/main.jsx — so real users never
    // see the preview, only Googlebot and link-preview crawlers do.
    .replace(
      '<div id="root"></div>',
      `<div id="root"><div style="max-width:900px;margin:0 auto;padding:40px 24px;font-family:system-ui,-apple-system,sans-serif;color:#012030;line-height:1.6">${route.preview}</div></div>`
    );

  const outPath = route.path === '/'
    ? join(DIST, 'index.html')
    : join(DIST, route.path.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  const size = (Buffer.byteLength(html) / 1024).toFixed(1);
  results.push(`  ✓ ${route.path.padEnd(14)} → ${outPath.replace(DIST, 'dist')}  (${size} KB)`);
}

console.log(`→ Prerendering ${ROUTES.length} routes with static templates (no browser)`);
console.log(results.join('\n'));
console.log(`\n✓ Prerender complete — ${ROUTES.length}/${ROUTES.length} routes written`);
