// Client-side fetch for the AI analyst endpoint.
// Returns { data, error } — never throws.

export async function fetchAnalysis(symbol) {
  if (!symbol || !symbol.trim()) return { data: null, error: null };
  try {
    const r = await fetch(`/api/analyst?symbol=${encodeURIComponent(symbol.trim())}`);
    const body = await r.json().catch(() => ({}));
    if (!r.ok) return { data: null, error: body.error || `Request failed (${r.status})` };
    return { data: body, error: body.error || null };
  } catch (e) {
    return { data: null, error: e.message || "Network error" };
  }
}

// Popular tickers we offer as one-click suggestions on the search box.
// Mix of JSE / NYSE / crypto so users see the breadth immediately.
export const SUGGESTED_TICKERS = [
  { symbol: "NPN",  label: "Naspers",       kind: "jse"    },
  { symbol: "SBK",  label: "Standard Bank", kind: "jse"    },
  { symbol: "MTN",  label: "MTN Group",     kind: "jse"    },
  { symbol: "AGL",  label: "Anglo",         kind: "jse"    },
  { symbol: "SHP",  label: "Shoprite",      kind: "jse"    },
  { symbol: "AAPL", label: "Apple",         kind: "us"     },
  { symbol: "NVDA", label: "Nvidia",        kind: "us"     },
  { symbol: "TSLA", label: "Tesla",         kind: "us"     },
  { symbol: "MSFT", label: "Microsoft",     kind: "us"     },
  { symbol: "BTC",  label: "Bitcoin",       kind: "crypto" },
  { symbol: "ETH",  label: "Ethereum",      kind: "crypto" },
  { symbol: "SOL",  label: "Solana",        kind: "crypto" },
];

// Map our internal "kind" to a TradingView symbol so we can render a chart for
// whatever the user picked.
export function tradingViewSymbol(kind, symbol) {
  if (kind === "crypto") return `COINBASE:${symbol.toUpperCase()}USD`;
  if (kind === "jse")    return `JSE:${symbol.toUpperCase()}`;
  return symbol.toUpperCase();  // US default; TradingView autoroutes to NYSE/NASDAQ
}
