// Client-side fetch for prediction-market data. Talks to /api/predictions
// (our Vercel serverless function), which fetches + filters Polymarket
// server-side so we can keep the front-end fast and category-safe.

export async function fetchPredictionMarkets() {
  try {
    const r = await fetch("/api/predictions");
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return { markets: [], error: data.error || `Request failed (${r.status})` };
    return {
      markets: Array.isArray(data.markets) ? data.markets : [],
      error:   data.error || null,
    };
  } catch (e) {
    return { markets: [], error: e.message || "Network error" };
  }
}
