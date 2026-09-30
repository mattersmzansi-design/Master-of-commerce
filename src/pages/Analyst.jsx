import { useEffect, useMemo, useState } from "react";
import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageMeta from "../components/PageMeta";
import TradingViewWidget from "../components/TradingViewWidget";
import { fetchAnalysis, SUGGESTED_TICKERS, tradingViewSymbol } from "../lib/analyst.js";

const DISCLAIMER =
  "This analysis is AI-generated from live public market data, for educational purposes only. It is not personal financial advice and does not constitute a recommendation to buy or sell any security or asset.";

const KIND_LABEL = { jse: "JSE", us: "US Market", crypto: "Crypto" };
const KIND_COLOR = { jse: "#F0B400", us: "#00D2F0", crypto: "#F24E01" };

// Simple pill for a "kind" tag.
function KindPill({ kind }) {
  const color = KIND_COLOR[kind] || C.muted;
  const label = KIND_LABEL[kind] || "Market";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      height: 20, padding: "0 10px", borderRadius: 10,
      background: `${color}22`, color,
      fontFamily: MONO, fontSize: 9.5, fontWeight: 700,
      letterSpacing: ".14em", textTransform: "uppercase",
    }}>{label}</span>
  );
}

function DisclaimerBanner() {
  return (
    <div style={{
      background: "#FFF3E5", border: `1px solid rgba(242,78,1,0.25)`, borderLeft: `4px solid ${C.orange}`,
      padding: "14px 18px", marginBottom: 24,
    }}>
      <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>
        AI-generated · Educational only · Not financial advice
      </div>
      <p style={{ fontFamily: SANS, fontSize: 12.5, color: C.ink, lineHeight: 1.6, margin: 0 }}>
        {DISCLAIMER}
      </p>
    </div>
  );
}

function AnalysisCard({ title, color = C.ink, children }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.rule}`, padding: "20px 22px" }}>
      <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".14em", color, marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function BulletList({ items, color }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted, fontStyle: "italic" }}>None flagged.</div>;
  }
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((t, i) => (
        <li key={i} style={{ fontFamily: SERIF, fontSize: 15, color: C.ink, lineHeight: 1.65, paddingLeft: 16, position: "relative" }}>
          <span style={{ position: "absolute", left: 0, top: "0.6em", width: 6, height: 6, borderRadius: 3, background: color }} />
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function AnalystPage() {
  const [input,   setInput]   = useState("");
  const [symbol,  setSymbol]  = useState("");   // committed ticker (submits trigger this)
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [result,  setResult]  = useState(null);

  function submit(e) {
    if (e) e.preventDefault();
    const s = input.trim();
    if (!s) return;
    setSymbol(s);
  }
  function pickSuggestion(sym) {
    setInput(sym);
    setSymbol(sym);
  }

  // Whenever a new symbol commits, fetch the analysis.
  useEffect(() => {
    if (!symbol) return;
    setLoading(true); setError(null); setResult(null);
    fetchAnalysis(symbol).then(({ data, error }) => {
      setResult(data);
      setError(error);
      setLoading(false);
    });
  }, [symbol]);

  const chartSymbol = useMemo(() => {
    if (!result) return null;
    return tradingViewSymbol(result.kind, result.symbol);
  }, [result]);

  return (
    <div style={{ background: C.bg }}>
      <PageMeta title="AI Analyst" description="Ask Mzansi Money Matters' AI analyst for a plain-English read on any JSE, NYSE or crypto ticker — live data, educational only." path="/analyst" />
      <Nav />

      {/* header */}
      <div className="mc-pad" style={{ background: C.paper, borderBottom: `2px solid ${C.ink}`, padding: "22px 28px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, letterSpacing: ".06em", marginBottom: 10 }}>
            Markets / <span style={{ color: C.ink }}>AI Analyst</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: C.ink, letterSpacing: "-.01em", marginBottom: 6 }}>
            Ask the AI Analyst
          </h1>
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted, lineHeight: 1.6, maxWidth: 620 }}>
            Type any JSE, NYSE or crypto ticker below. Our AI reads the live data + recent news and writes a plain-English read for you — company, key numbers, bull case, bear case, what to watch.
          </div>

          {/* search form */}
          <form onSubmit={submit} style={{ display: "flex", gap: 8, marginTop: 20, maxWidth: 560 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a ticker — e.g. NPN, AAPL, BTC"
              autoFocus
              style={{
                flex: 1, minWidth: 0, height: 50,
                border: `1.5px solid ${C.rule}`, borderRadius: 12, padding: "0 16px",
                fontFamily: MONO, fontSize: 15, color: C.ink, background: "#FFFDFA",
                outline: "none", textTransform: "uppercase", letterSpacing: ".06em",
              }}
            />
            <button type="submit" disabled={loading || !input.trim()} style={{
              background: C.orange, color: "#fff", border: "none", borderRadius: 12,
              height: 50, padding: "0 22px", fontFamily: SANS, fontWeight: 700, fontSize: 14,
              cursor: input.trim() ? "pointer" : "not-allowed", opacity: loading ? .6 : 1,
              flexShrink: 0,
            }}>
              {loading ? "Analysing…" : "Analyse"}
            </button>
          </form>

          {/* suggestion chips */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>
              Try one
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SUGGESTED_TICKERS.map(t => (
                <button key={t.symbol} onClick={() => pickSuggestion(t.symbol)} style={{
                  background: symbol === t.symbol ? C.ink : C.paper,
                  color:       symbol === t.symbol ? C.bg  : C.ink,
                  border: `1px solid ${symbol === t.symbol ? C.ink : C.rule}`,
                  borderRadius: 8, padding: "6px 12px",
                  fontFamily: MONO, fontSize: 11, fontWeight: 600, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}>
                  <strong>{t.symbol}</strong>
                  <span style={{ opacity: .6, fontFamily: SANS, fontWeight: 500 }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* body */}
      <section className="mc-pad" style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 28px 60px" }}>
        <DisclaimerBanner />

        {/* Empty state — before user has searched */}
        {!symbol && !loading && (
          <div style={{ padding: "60px 20px", textAlign: "center", background: C.paper, border: `1px solid ${C.rule}` }}>
            <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
              Type a ticker to start
            </div>
            <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.muted, lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
              The AI takes about 10–15 seconds to read the data and write its analysis. Cached for 24 hours, so subsequent requests for the same ticker are instant.
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: MONO, fontSize: 12, color: C.muted, marginBottom: 6 }}>ANALYSING {symbol.toUpperCase()}…</div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.dim }}>Fetching live data and writing analysis. This takes about 10–15 seconds.</div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{
            padding: "24px 20px", background: "#FDECE1", border: `1px solid rgba(194,69,31,0.3)`, borderLeft: `4px solid ${C.red}`,
            fontFamily: SANS, fontSize: 13.5, color: C.ink, lineHeight: 1.6,
          }}>
            <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>
              Couldn't analyse {symbol}
            </div>
            {error}
          </div>
        )}

        {/* Result */}
        {!loading && result && result.analysis && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* result header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <h2 style={{ fontFamily: SERIF, fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, color: C.ink, letterSpacing: "-.005em" }}>
                  {result.symbol}
                </h2>
                <KindPill kind={result.kind} />
                {result.analysis.confidence && (
                  <span style={{ fontFamily: MONO, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: ".1em" }}>
                    · confidence: <strong style={{ color: C.ink }}>{result.analysis.confidence}</strong>
                  </span>
                )}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}>
                Generated {new Date(result.generatedAt).toLocaleString("en-ZA", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })}
              </div>
            </div>

            {/* live chart */}
            {chartSymbol && (
              <div style={{ borderTop: `1px solid ${C.rule}`, paddingTop: 8 }}>
                <TradingViewWidget
                  kind="advanced-chart"
                  height={380}
                  config={{
                    symbol: chartSymbol,
                    interval: result.kind === "crypto" ? "60" : "D",
                    timezone: "Africa/Johannesburg",
                    style: "3",
                    allow_symbol_change: true,
                    details: true,
                    hide_top_toolbar: false,
                    save_image: false,
                  }}
                />
              </div>
            )}

            {/* AI cards */}
            {result.analysis.company && (
              <AnalysisCard title="Company · What it does" color={C.ink}>
                <p style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.75, color: C.ink }}>{result.analysis.company}</p>
              </AnalysisCard>
            )}

            {result.analysis.numbers && (
              <AnalysisCard title="The numbers" color={C.blue}>
                <p style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.75, color: C.ink }}>{result.analysis.numbers}</p>
              </AnalysisCard>
            )}

            <div className="mc-collapse-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <AnalysisCard title="Bull case" color={C.green}>
                <BulletList items={result.analysis.bull} color={C.green} />
              </AnalysisCard>
              <AnalysisCard title="Bear case" color={C.red}>
                <BulletList items={result.analysis.bear} color={C.red} />
              </AnalysisCard>
            </div>

            {result.analysis.watch && (
              <AnalysisCard title="What to watch next" color={C.cyan}>
                <p style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.75, color: C.ink }}>{result.analysis.watch}</p>
              </AnalysisCard>
            )}

            {/* Reminder disclaimer at bottom */}
            <div style={{
              marginTop: 8, padding: "18px 20px", background: C.paper,
              border: `1px solid ${C.rule2}`, borderLeft: `3px solid ${C.orange}`,
            }}>
              <p style={{ fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: C.ink }}>Reminder:</strong> {DISCLAIMER}
              </p>
            </div>
          </div>
        )}
      </section>

      <Footer note="AI analyst powered by Claude · Data via TwelveData, FMP & CoinGecko" />
    </div>
  );
}
