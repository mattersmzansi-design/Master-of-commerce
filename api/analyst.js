// Vercel serverless function — the "AI Analyst" endpoint.
//
// Flow:
//   1. Client sends /api/analyst?symbol=NPN
//   2. We figure out the market (JSE / NYSE / crypto)
//   3. Fetch live quote + fundamentals from TwelveData / FMP / CoinGecko
//   4. Fetch a few recent news headlines from FMP
//   5. Hand the whole data blob to Claude with a strict system prompt
//   6. Claude returns a structured JSON analysis
//   7. Cache the response at Vercel's edge for 24 hours (identical to a
//      newspaper reissuing the same profile — analyses don't need to be
//      real-time; the chart already is)
//
// Compliance guardrail is baked into the prompt: no buy/sell/recommend
// language, always educational framing.

import Anthropic from "@anthropic-ai/sdk";

const TWELVEDATA_KEY = process.env.TWELVEDATA_API_KEY;
const FMP_KEY        = process.env.FMP_API_KEY;
const ANTHROPIC_KEY  = process.env.ANTHROPIC_API_KEY;

// Which Claude model to use. Anthropic changed model naming after early 2026
// and removed some "-latest" aliases, so we pin a specific version by default.
// To upgrade to a newer / different model (e.g. Claude Sonnet 4, Opus 4, or
// whatever's current), set CLAUDE_MODEL in Vercel env vars — check the
// current list at https://docs.anthropic.com/en/docs/about-claude/models
const MODEL = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-20241022";

// ── ticker classification ───────────────────────────────────────────────────
// Given a user-typed symbol, guess whether it's a JSE / NYSE / crypto ticker.
// Users can also disambiguate with explicit prefixes (e.g. "JSE:NPN", "BTC/USD").
function classify(raw) {
  const s = raw.trim().toUpperCase();
  // Explicit prefix
  if (s.startsWith("JSE:")) return { kind: "jse",    symbol: s.slice(4) };
  if (s.startsWith("NYSE:") || s.startsWith("NASDAQ:")) return { kind: "us", symbol: s.split(":")[1] };
  // Common crypto pattern (BTC, ETH, SOL, DOGE, USDT, etc.)
  const CRYPTOS = new Set(["BTC","ETH","SOL","BNB","XRP","ADA","DOGE","TRX","USDT","USDC","AVAX","DOT","LINK","MATIC","LTC","BCH","SHIB","ATOM","NEAR","APT"]);
  if (CRYPTOS.has(s)) return { kind: "crypto", symbol: s.toLowerCase() };
  // JSE tickers are typically 3-letter (NPN, SBK, MTN, AGL, etc.). If short and
  // matches a common JSE ticker, treat as JSE; otherwise assume US.
  const JSE_TICKERS = new Set(["NPN","PRX","SBK","FSR","MTN","AGL","GLN","SHP","BHP","VOD","SOL","IMP","AMS","ANH","CFR","SLM","DSY","REM","REI","BID","OMU","INL","INP","NED","ABG","CPI","WHL","MRP","TBS","BVT","SPP","CLS","TFG","PIK","BAT"]);
  if (JSE_TICKERS.has(s) && s.length <= 4) return { kind: "jse", symbol: s };
  return { kind: "us", symbol: s };
}

// ── fetchers ────────────────────────────────────────────────────────────────

async function fetchJson(url, opts) {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error(`${url.replace(/apikey=[^&]+/, "apikey=***")} → HTTP ${r.status}`);
  return r.json();
}

async function fetchStockData(kind, symbol) {
  // TwelveData symbol format: US just "AAPL"; JSE needs ".JSE" suffix.
  const tdSymbol = kind === "jse" ? `${symbol}.JSE` : symbol;
  // FMP symbol format: US just "AAPL"; JSE needs ".JO" suffix (their convention).
  const fmpSymbol = kind === "jse" ? `${symbol}.JO` : symbol;

  const [quote, profile, news] = await Promise.allSettled([
    TWELVEDATA_KEY
      ? fetchJson(`https://api.twelvedata.com/quote?symbol=${encodeURIComponent(tdSymbol)}&apikey=${TWELVEDATA_KEY}`)
      : Promise.reject(new Error("no twelvedata key")),
    FMP_KEY
      ? fetchJson(`https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(fmpSymbol)}?apikey=${FMP_KEY}`)
      : Promise.reject(new Error("no fmp key")),
    FMP_KEY
      ? fetchJson(`https://financialmodelingprep.com/api/v3/stock_news?tickers=${encodeURIComponent(fmpSymbol)}&limit=4&apikey=${FMP_KEY}`)
      : Promise.reject(new Error("no fmp key")),
  ]);

  return {
    quote:   quote.status   === "fulfilled" ? quote.value : null,
    profile: profile.status === "fulfilled" && Array.isArray(profile.value) ? profile.value[0] : null,
    news:    news.status    === "fulfilled" && Array.isArray(news.value) ? news.value.slice(0, 4) : [],
    errors:  [quote, profile, news].filter(x => x.status === "rejected").map(x => x.reason?.message).filter(Boolean),
  };
}

async function fetchCryptoData(id) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
  return fetchJson(url);
}

// ── prompt builder ──────────────────────────────────────────────────────────

function buildPrompt(classified, raw, data) {
  const facts = JSON.stringify(data, null, 2).slice(0, 6000); // trim to keep token count sane
  const marketLabel =
    classified.kind === "jse"    ? `JSE (Johannesburg Stock Exchange) ticker ${classified.symbol}` :
    classified.kind === "us"     ? `US-listed ticker ${classified.symbol}` :
    `Crypto asset ${classified.symbol.toUpperCase()}`;

  return `You are the analyst for Mzansi Money Matters, a South-Africa-focused financial-media publication. Your job is to write a plain-English educational analysis of a security or asset, based ONLY on the live data provided below.

The subject: ${marketLabel} (user typed: "${raw}").

Live data pulled just now:
\`\`\`json
${facts}
\`\`\`

Write your response as strict JSON matching this schema:

{
  "company": "one paragraph — what the company/asset actually does, in plain SA English (not marketing fluff)",
  "numbers": "one paragraph summarising the key figures visible in the live data (current price, market cap, P/E, dividend yield, 52-week range where available). If a figure is missing say so honestly — don't invent numbers.",
  "bull": ["3 to 4 bullet points on reasons the market might view this positively, each 1-2 sentences"],
  "bear": ["3 to 4 bullet points on reasons for caution, each 1-2 sentences"],
  "watch": "one paragraph on what to watch next — upcoming earnings, catalysts, structural risks",
  "confidence": "low | medium | high — how confident you are given the data available"
}

Rules — do NOT break these:
- Use plain English. No jargon dumps.
- NEVER use the words "buy", "sell", "recommend", "target price", "guarantee", or any similar prescriptive language.
- Frame everything as *educational context*, not advice.
- If data is missing or thin, say so honestly. Don't invent facts.
- All amounts in the currency the data is in (USD for US/crypto, ZAR for JSE).
- Write for a curious South African reader who's learning, not a Wall Street analyst.
- Output ONLY the JSON. No preamble, no code fences.`;
}

function extractJson(text) {
  // Claude usually returns clean JSON but sometimes wraps in fences — strip them.
  const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(cleaned);
}

// ── handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  const raw = (req.query.symbol || "").toString();
  if (!raw.trim()) {
    res.status(400).json({ error: "Please pass ?symbol=<ticker>" });
    return;
  }
  if (!ANTHROPIC_KEY) {
    res.status(500).json({ error: "AI analyst not configured. Set ANTHROPIC_API_KEY in Vercel." });
    return;
  }

  try {
    const classified = classify(raw);

    // Pull the live data
    let data;
    if (classified.kind === "crypto") {
      const c = await fetchCryptoData(classified.symbol);
      data = {
        name:              c.name,
        symbol:            c.symbol?.toUpperCase(),
        description:       c.description?.en?.slice(0, 600),
        current_price_usd: c.market_data?.current_price?.usd,
        market_cap_usd:    c.market_data?.market_cap?.usd,
        market_cap_rank:   c.market_cap_rank,
        high_24h_usd:      c.market_data?.high_24h?.usd,
        low_24h_usd:       c.market_data?.low_24h?.usd,
        change_24h_pct:    c.market_data?.price_change_percentage_24h,
        change_7d_pct:     c.market_data?.price_change_percentage_7d,
        change_30d_pct:    c.market_data?.price_change_percentage_30d,
        change_1y_pct:     c.market_data?.price_change_percentage_1y,
        ath_usd:           c.market_data?.ath?.usd,
        atl_usd:           c.market_data?.atl?.usd,
        circulating:       c.market_data?.circulating_supply,
        max_supply:        c.market_data?.max_supply,
      };
    } else {
      data = await fetchStockData(classified.kind, classified.symbol);
    }

    const prompt = buildPrompt(classified, raw, data);
    const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
    const msg = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1400,
      messages: [{ role: "user", content: prompt }],
    });

    const text = msg.content?.[0]?.type === "text" ? msg.content[0].text : "";
    let analysis;
    try {
      analysis = extractJson(text);
    } catch {
      throw new Error("AI returned a response we couldn't parse");
    }

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=172800");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).json({
      symbol:     classified.symbol.toUpperCase(),
      kind:       classified.kind,
      raw:        raw.toUpperCase(),
      generatedAt: new Date().toISOString(),
      analysis,
    });
  } catch (err) {
    res.setHeader("Cache-Control", "s-maxage=60");
    res.status(502).json({ error: err.message });
  }
}
