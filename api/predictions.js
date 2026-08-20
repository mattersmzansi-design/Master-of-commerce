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
  "politics", "crypto", "business",
]);

// Explicit blocklist as a safety net (Polymarket sometimes miscategorises).
// Anything containing these tokens in the question text is skipped even if
// the category passes.
const BLOCKED_TOKENS = [
  "assassinat", "die by", "will die", "death", "arrested",
  "kanye", "kardashian", "taylor swift", "grammy",
  "oscar", "super bowl", "world cup", "nba", "nfl", "premier league",
];

function parseJsonMaybe(v, fallback = null) {
  if (Array.isArray(v)) return v;
  if (typeof v !== "string") return fallback;
  try { return JSON.parse(v); } catch { return fallback; }
}

function passesFilters(m) {
  const cat = (m.category || m.categoryLabel || "").toLowerCase();
  if (!ALLOWED_CATEGORIES.has(cat)) return false;
  const q = (m.question || "").toLowerCase();
  for (const bad of BLOCKED_TOKENS) if (q.includes(bad)) return false;
  return true;
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
    category:    m.category || null,
    endDate:     m.endDate || m.end_date_iso || null,
    volume24hr:  Number(m.volume24hr || 0),
    volumeTotal: Number(m.volume || m.volumeNum || 0),
    liquidity:   Number(m.liquidity || 0),
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
