import { useEffect, useMemo, useState } from "react";
import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { fetchPredictionMarkets } from "../lib/predictions.js";

// Compliance: prediction markets are speculation on future events. Frame
// everything as *what the market is currently pricing* — information, not a
// recommendation to trade. The disclaimer text below is required and must
// stay visible on the page.
const DISCLAIMER =
  "Prediction markets show what participants are currently pricing for future events — an aggregate probability, not a forecast or a guarantee. This page is educational information only, not personal financial advice or a recommendation to trade on Polymarket or anywhere else.";

const CATS = {
  politics: { label: "Politics",   color: C.orange },
  crypto:   { label: "Crypto",     color: C.cyan   },
  business: { label: "Business",   color: C.gold   },
};

// USD money formatter — abbreviates so cards stay compact.
function fmtMoney(n) {
  if (!n || !Number.isFinite(n)) return "—";
  if (n >= 1_000_000_000) return `$${(n/1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `$${(n/1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `$${(n/1_000).toFixed(0)}k`;
  return `$${Math.round(n)}`;
}

function fmtEndDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const now = new Date();
    const days = Math.round((d - now) / (1000*60*60*24));
    if (days < 0)  return "Resolved";
    if (days === 0) return "Ends today";
    if (days === 1) return "Ends tomorrow";
    if (days < 30) return `Ends in ${days}d`;
    return `Ends ${d.toLocaleDateString("en-ZA", { day:"numeric", month:"short", year:"numeric" })}`;
  } catch { return "—"; }
}

// Pick the leading outcome (highest priced share) as the "market's view".
function leadingOutcome(m) {
  let bestIdx = 0;
  for (let i = 1; i < m.prices.length; i++) if (m.prices[i] > m.prices[bestIdx]) bestIdx = i;
  return { label: m.outcomes[bestIdx], probability: m.prices[bestIdx], index: bestIdx };
}

function probColor(pct) {
  if (pct >= 0.7)  return C.green;   // strong lean
  if (pct >= 0.55) return C.cyan;    // moderate lean
  if (pct >= 0.45) return C.gold;    // coin toss
  if (pct >= 0.30) return C.orange;  // moderate against
  return C.red;                      // strong against
}

function MarketCard({ market }) {
  const lead = leadingOutcome(market);
  const pct  = Math.round(lead.probability * 100);
  const color = probColor(lead.probability);
  const catMeta = CATS[(market.category || "").toLowerCase()] || { label: market.category || "Market", color: C.muted };
  const isBinary = market.outcomes.length === 2;

  return (
    <article style={{
      background: C.paper, border: `1px solid ${C.rule}`, padding: "18px 20px 16px",
      display: "flex", flexDirection: "column", gap: 14, minWidth: 0,
    }}>
      {/* category + end date */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
        <span style={{
          fontFamily: MONO, fontSize: 9, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: ".12em", color: catMeta.color,
        }}>{catMeta.label}</span>
        <span style={{ fontFamily: MONO, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em" }}>
          {fmtEndDate(market.endDate)}
        </span>
      </div>

      {/* question */}
      <h3 style={{
        fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: C.ink, lineHeight: 1.3, letterSpacing: "-.005em",
        minHeight: 42, // keep card heights aligned when questions vary in length
      }}>
        {market.question}
      </h3>

      {/* leading outcome — big number + bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ fontFamily: SANS, fontSize: 12, color: C.muted, fontWeight: 600 }}>
            Market pricing <span style={{ color: C.ink, fontWeight: 700 }}>{lead.label}</span>
          </span>
          <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>
            {pct}%
          </span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: C.rule2, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: color, transition: "width .3s" }} />
        </div>
      </div>

      {/* binary: also show the other side. Multi-outcome: show top 2 alternatives compact. */}
      {isBinary ? (
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 11, color: C.muted }}>
          <span>{market.outcomes[0]}: <strong style={{ color: C.ink }}>{Math.round(market.prices[0]*100)}%</strong></span>
          <span>{market.outcomes[1]}: <strong style={{ color: C.ink }}>{Math.round(market.prices[1]*100)}%</strong></span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {market.outcomes.slice(0, 3).map((o, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 11, color: i === lead.index ? C.ink : C.muted }}>
              <span>{o}</span>
              <strong>{Math.round(market.prices[i]*100)}%</strong>
            </div>
          ))}
          {market.outcomes.length > 3 && (
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, fontStyle: "italic" }}>
              + {market.outcomes.length - 3} more outcome{market.outcomes.length - 3 === 1 ? "" : "s"}
            </div>
          )}
        </div>
      )}

      {/* meta + link out */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
        borderTop: `1px solid ${C.rule2}`, paddingTop: 10, marginTop: "auto",
      }}>
        <span style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>
          Vol 24h: <strong style={{ color: C.ink }}>{fmtMoney(market.volume24hr)}</strong>
        </span>
        {market.url && (
          <a href={market.url} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color: C.blue, whiteSpace: "nowrap" }}>
            View on Polymarket →
          </a>
        )}
      </div>
    </article>
  );
}

function DisclaimerBanner() {
  return (
    <div style={{
      background: "#FFF3E5", border: `1px solid rgba(242,78,1,0.25)`, borderLeft: `4px solid ${C.orange}`,
      padding: "14px 18px", marginBottom: 26,
    }}>
      <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>
        Educational content · Not financial advice
      </div>
      <p style={{ fontFamily: SANS, fontSize: 12.5, color: C.ink, lineHeight: 1.6, margin: 0 }}>
        {DISCLAIMER}
      </p>
    </div>
  );
}

export default function PredictionsPage() {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [markets, setMarkets] = useState([]);
  const [tab,     setTab]     = useState("All");

  const load = () => {
    setLoading(true);
    setError(null);
    fetchPredictionMarkets().then(({ markets, error }) => {
      setMarkets(markets);
      setError(error);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const categoriesPresent = useMemo(() => {
    const s = new Set();
    for (const m of markets) if (m.category) s.add(m.category.toLowerCase());
    return ["All", ...[...s].filter(c => CATS[c]).map(c => CATS[c].label)];
  }, [markets]);

  const filtered = useMemo(() => {
    if (tab === "All") return markets;
    return markets.filter(m => {
      const meta = CATS[(m.category || "").toLowerCase()];
      return meta && meta.label === tab;
    });
  }, [markets, tab]);

  return (
    <div style={{ background: C.bg }}>
      <Nav />

      {/* page header — matches Sectors / NYSE / Crypto */}
      <div className="mc-pad" style={{ background: C.paper, borderBottom: `2px solid ${C.ink}`, padding: "22px 28px 18px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, letterSpacing: ".06em", marginBottom: 10 }}>
            Markets / <span style={{ color: C.ink }}>Prediction Markets</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: C.ink, letterSpacing: "-.01em", marginBottom: 6 }}>
                Prediction Markets
              </h1>
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted, maxWidth: 620, lineHeight: 1.6 }}>
                What the world is pricing right now for economics, crypto and political outcomes — sourced live from Polymarket, ranked by 24-hour trading volume.
              </div>
            </div>
            <button onClick={load} disabled={loading} style={{
              fontFamily: SANS, fontSize: 11, fontWeight: 700, color: C.blue,
              background: "none", border: "none", cursor: "pointer", opacity: loading ? .5 : 1,
            }}>↻ Refresh</button>
          </div>

          {/* category tabs */}
          {categoriesPresent.length > 1 && (
            <div style={{ display: "flex", gap: 0, marginTop: 16, overflowX: "auto" }}>
              {categoriesPresent.map(c => (
                <button key={c} onClick={() => setTab(c)} style={{
                  fontFamily: SANS, fontSize: 12, fontWeight: tab === c ? 700 : 500,
                  color: tab === c ? C.ink : C.muted,
                  padding: "9px 16px", background: "none", border: "none", cursor: "pointer",
                  borderBottom: tab === c ? `2px solid ${C.ink}` : "2px solid transparent",
                  marginBottom: "-2px", whiteSpace: "nowrap",
                }}>{c}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* body */}
      <section className="mc-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 28px 60px" }}>
        <DisclaimerBanner />

        {loading && (
          <div style={{ padding: "60px 0", textAlign: "center", fontFamily: MONO, fontSize: 12, color: C.muted }}>
            Loading prediction markets…
          </div>
        )}

        {!loading && error && (
          <div style={{
            padding: "24px 20px", background: "#FDECE1", border: `1px solid rgba(194,69,31,0.3)`, borderLeft: `4px solid ${C.red}`,
            fontFamily: SANS, fontSize: 13.5, color: C.ink, lineHeight: 1.6,
          }}>
            <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>
              Couldn't load markets
            </div>
            {error}
            <div style={{ marginTop: 12 }}>
              <button onClick={load} style={{
                fontFamily: SANS, fontSize: 12, fontWeight: 700, background: C.ink, color: C.bg,
                border: "none", padding: "8px 16px", cursor: "pointer",
              }}>Try again</button>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ padding: "60px 20px", textAlign: "center", background: C.paper, border: `1px solid ${C.rule}` }}>
            <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
              Nothing to show right now
            </div>
            <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.muted, lineHeight: 1.6, maxWidth: 420, margin: "0 auto" }}>
              No active markets matched our filters for this category. Try "All" or refresh.
            </div>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="mc-collapse-sm" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
            {filtered.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
        )}

        {/* Bottom-of-body disclaimer restate */}
        {!loading && filtered.length > 0 && (
          <div style={{ marginTop: 40, padding: "18px 20px", background: C.paper, border: `1px solid ${C.rule2}`, borderLeft: `3px solid ${C.orange}` }}>
            <p style={{ fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: C.ink }}>Reminder:</strong> {DISCLAIMER}
            </p>
          </div>
        )}
      </section>

      <Footer note="Prediction market data via Polymarket · Educational only" />
    </div>
  );
}
