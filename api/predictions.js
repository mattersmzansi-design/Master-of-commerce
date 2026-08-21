// Vercel serverless function — fetches active prediction markets from
// Polymarket's public Gamma API, filters to on-brand categories, and returns
// a curated JSON payload.
//
// Polymarket Gamma API is a public read-only endpoint (no auth). We fetch
// server-side so we can:
//   1) filter out sports / celebrity / tasteless markets before they hit the
//      client (keeps the site on-brand),
//   2) normalise the messy stringified fields into a clean shape,
//   3) cache at the edge so the front-end is fast.
//
// Cached 5 min at edge · stale-while-revalidate 15 min.

const GAMMA_URL = "https://gamma-api.polymarket.com/markets";

// Only surface these categories. "Politics" covers elections & policy, "Crypto"
// covers price/ETF milestones, "Business" covers Fed rate decisions & econ data.
// Add "Science" or "Middle East" here later if the site's coverage widens.
const ALLOWED_CATEGORIES = new Set([
  "politics", "crypto", "business", "economics", "finance", "world",
]);

// Explicit blocklist as a safety net (Polymarket sometimes miscategorises).
// Anything containing these tokens in the question text is skipped even if
// the category passes.
const BLOCKED_TOKENS = [
  "assassinat", "die by", "will die", "death of", "arrested",
  "kanye", "kardashian", "taylor swift", "grammy", "oscar",
  "super bowl", "world cup", "nba", "nfl", "premier league",
  "champions league", "mma", "ufc", "boxing", "tennis", "cricket",
  "olympics",
];

// Positive keyword rescue — if a market has no usable category tag, we look
// at the question text. If it mentions any of these finance/politics/crypto
// signals, we treat it as on-topic. Catches markets Polymarket puts in
// unusual buckets or leaves uncategorised.
const POSITIVE_KEYWORDS = [
  "election", "president", "cabinet", "congress", "parliament", "senate",
  "supreme court", "cabinet", "prime minister", "cabinet reshuffle",
  "fed ", "sarb", "ecb", "bank of england", "boj",
  "rate cut", "rate hike", "interest rate", "inflation", "cpi", "gdp", "recession",
  "bitcoin", "btc", "ethereum", "eth", "crypto", "coinbase", "binance", "solana", "xrp",
  "etf", "ipo", "s&p", "nasdaq", "dow ", "tesla", "nvidia", "apple ",
  "usd", "eur", "gbp", "zar", "yuan", "yen",
];

// Polymarket returns outcomes and outcomePrices as JSON-encoded strings
// (e.g. '["Yes","No"]' and '["0.62","0.38"]'). This safely decodes them.
function parseJsonMaybe(v, fallback = null) {
  if (Array.isArray(v)) return v;
  if (typeof v !== "string") return fallback;
  try { return JSON.parse(v); } catch { return fallback; }
}

function tokenSet(m) {
  // Everywhere Polymarket might stash a category/tag.
  const bag = [];
  const push = v => { if (v) bag.push(String(v).toLowerCase()); };
  push(m.category);
  push(m.categoryLabel);
  push(m.groupItemTitle);
  if (m.events && Array.isArray(m.events)) {
    for (const e of m.events) {
      push(e?.category);
      push(e?.title);
      if (Array.isArray(e?.tags)) for (const t of e.tags) push(t?.label || t?.slug || t);
    }
  }
  if (Array.isArray(m.tags)) for (const t of m.tags) push(t?.label || t?.slug || t);
  return bag;
}

function passesFilters(m) {
  const q = (m.question || "").toLowerCase();
  for (const bad of BLOCKED_TOKENS) if (q.includes(bad)) return false;

  // 1) Any category-ish tag that matches our allowlist? Accept.
  const tokens = tokenSet(m);
  for (const t of tokens) if (ALLOWED_CATEGORIES.has(t)) return true;

  // 2) Question text mentions a finance/politics/crypto signal? Accept.
  for (const kw of POSITIVE_KEYWORDS) if (q.includes(kw)) return true;

  return false;
}

function inferCategory(m) {
  // Best-effort tagging so the front-end pill + filter tabs still work.
  const tokens = tokenSet(m).join(" ");
  const q = (m.question || "").toLowerCase();
  const hay = `${tokens} ${q}`;
  if (/(bitcoin|btc|ethereum|eth|crypto|solana|xrp|coinbase|binance|etf)/.test(hay)) return "crypto";
  if (/(election|president|congress|parliament|supreme court|senate|prime minister|cabinet)/.test(hay)) return "politics";
  return "business";  // catch-all for Fed/rates/inflation/econ etc.
}

function normalise(m) {
  const outcomes  = parseJsonMaybe(m.outcomes, []) || [];
  const priceStrs = parseJsonMaybe(m.outcomePrices, []) || [];
  const prices    = priceStrs.map(p => Number(p)).filter(n => !Number.isNaN(n));

  return {
    id:          m.id || m.conditionId || m.slug,
    slug:        m.slug,
    question:    m.question,
    description: m.description ? String(m.description).slice(0, 400) : null,
    category:    inferCategory(m),
    endDate:     m.endDate || m.end_date_iso || null,
    volume24hr:  Number(m.volume24hr || m.volume24Hr || m.volumeNum24hr || 0),
    volumeTotal: Number(m.volume || m.volumeNum || 0),
    liquidity:   Number(m.liquidity || m.liquidityNum || 0),
    outcomes,
    prices,     // parallel to outcomes; e.g. [0.62, 0.38]
    url:        m.slug ? `https://polymarket.com/market/${m.slug}` : null,
  };
}

export default async function handler(req, res) {
  try {
    // Grab the highest-volume active markets, then filter/normalise/trim on
    // our side. Overfetch so filtering doesn't leave us short.
    const params = new URLSearchParams({
      active:    "true",
      closed:    "false",
      archived:  "false",
      order:     "volume24hr",
      ascending: "false",
      limit:     "60",
    });
    const r = await fetch(`${GAMMA_URL}?${params.toString()}`, {
      headers: { "User-Agent": "MzansiMoneyMatters/1.0 (+https://mzansimoneymatters.co.za)" },
    });
    if (!r.ok) throw new Error(`Polymarket returned HTTP ${r.status}`);
    const raw = await r.json();
    const list = Array.isArray(raw) ? raw : (raw.data || raw.markets || []);

    // Debug mode — hit /api/predictions?debug=1 to inspect the raw shape and
    // see how many markets pass each filter step. Never cached.
    if (req.query && req.query.debug) {
      const passedFilter = list.filter(passesFilters);
      const afterNormalise = passedFilter.map(normalise);
      const afterShape = afterNormalise.filter(m => m.outcomes.length >= 2 && m.prices.length === m.outcomes.length);
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json({
        rawCount:       list.length,
        passedFilter:   passedFilter.length,
        passedShape:    afterShape.length,
        firstRaw:       list[0] || null,
        firstPassed:    passedFilter[0] || null,
        sampleQuestions: list.slice(0, 12).map(m => ({
          q:        m.question,
          category: m.category,
          tokens:   tokenSet(m),
        })),
      });
      return;
    }

    const cleaned = list
      .filter(passesFilters)
      .map(normalise)
      .filter(m => m.outcomes.length >= 2 && m.prices.length === m.outcomes.length)
      .slice(0, 24);

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).json({ markets: cleaned });
  } catch (err) {
    res.setHeader("Cache-Control", "s-maxage=60");
    res.status(502).json({ error: err.message, markets: [] });
  }
}
