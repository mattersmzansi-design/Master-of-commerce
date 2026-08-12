import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import TradingViewWidget from "../components/TradingViewWidget";

// Top JSE tickers — displayed in the ticker tape at the top of the page and
// in the watchlist grid. Add/remove symbols here to reshape the page.
const JSE_WATCHLIST = [
  { proName: "JSE:J203",  title: "JSE All Share" },
  { proName: "JSE:NPN",   title: "Naspers" },
  { proName: "JSE:PRX",   title: "Prosus" },
  { proName: "JSE:MTN",   title: "MTN Group" },
  { proName: "JSE:SBK",   title: "Standard Bank" },
  { proName: "JSE:FSR",   title: "FirstRand" },
  { proName: "JSE:AGL",   title: "Anglo American" },
  { proName: "JSE:GLN",   title: "Glencore" },
  { proName: "JSE:SHP",   title: "Shoprite" },
  { proName: "JSE:BHP",   title: "BHP" },
];

export default function JSEPage() {
  return (
    <div style={{ background: C.bg }}>
      <Nav />

      {/* header */}
      <div className="mc-pad" style={{ background: C.paper, borderBottom: `2px solid ${C.ink}`, padding: "22px 28px 18px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, letterSpacing: ".06em", marginBottom: 10 }}>
            Markets / <span style={{ color: C.ink }}>Johannesburg Stock Exchange</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: C.ink, letterSpacing: "-.01em", marginBottom: 6 }}>
                JSE Stocks
              </h1>
              <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>
                Live prices from TradingView · 15-min delayed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ticker tape strip */}
      <div style={{ background: C.paper, borderBottom: `1px solid ${C.rule}` }}>
        <TradingViewWidget
          kind="ticker-tape"
          height={46}
          config={{
            symbols: JSE_WATCHLIST.map(({ proName, title }) => ({ proName, title })),
            showSymbolLogo: true,
            displayMode: "adaptive",
          }}
        />
      </div>

      {/* body */}
      <section className="mc-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 28px 60px" }}>

        {/* hero: JSE All Share advanced chart */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: C.orange, marginBottom: 4 }}>
                Benchmark
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 700, color: C.ink, letterSpacing: "-.005em" }}>
                JSE All Share Index
              </h2>
            </div>
          </div>
          <TradingViewWidget
            kind="advanced-chart"
            height={480}
            config={{
              symbol: "JSE:J203",
              interval: "D",
              timezone: "Africa/Johannesburg",
              style: "3",
              hide_top_toolbar: false,
              hide_legend: false,
              allow_symbol_change: true,
              save_image: false,
              details: true,
            }}
          />
        </div>

        {/* top JSE stocks — mini chart grid */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ borderTop: `2px solid ${C.ink}`, paddingTop: 20, marginBottom: 16, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: C.ink, letterSpacing: "-.005em" }}>
              Top JSE tickers
            </h2>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em" }}>
              Tap a card for full chart
            </div>
          </div>
          <div className="mc-collapse-sm" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {JSE_WATCHLIST.slice(1).map(({ proName, title }) => (
              <div key={proName} style={{ background: "#FFFFFF", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.rule}` }}>
                <TradingViewWidget
                  kind="mini-symbol-overview"
                  height={220}
                  config={{
                    symbol: proName,
                    width: "100%",
                    height: "100%",
                    dateRange: "3M",
                    trendLineColor: "#00D2F0",
                    underLineColor: "rgba(0, 210, 240, 0.15)",
                    underLineBottomColor: "rgba(0, 210, 240, 0)",
                    chartOnly: false,
                    noTimeScale: false,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* market screener — full JSE market */}
        <div>
          <div style={{ borderTop: `2px solid ${C.ink}`, paddingTop: 20, marginBottom: 16 }}>
            <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: C.ink, letterSpacing: "-.005em" }}>
              JSE market screener
            </h2>
          </div>
          <TradingViewWidget
            kind="screener"
            height={540}
            config={{
              market: "za",
              showToolbar: true,
              defaultColumn: "overview",
              defaultScreen: "general",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </section>

      <Footer note="JSE data via TradingView · Prices may be delayed 15 minutes" />
    </div>
  );
}
