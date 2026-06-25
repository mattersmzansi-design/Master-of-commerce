import { Link } from "react-router-dom";
import { C, SERIF, MONO, SANS } from "../theme";

const COLS = [
  { title:"Markets",  links:[{l:"JSE Stocks",path:"/jse"},{l:"NYSE Stocks",path:"/nyse"},{l:"Crypto",path:"/crypto"},{l:"Forex",path:"/"}] },
  { title:"News",     links:[{l:"Business News",path:"/news"},{l:"SA Economy",path:"/news"},{l:"Global Markets",path:"/news"},{l:"Commodities",path:"/news"}] },
  { title:"Tools",    links:[{l:"Economic Calendar",path:"/calendar"},{l:"Market Screener",path:"/crypto"},{l:"Portfolio",path:"/"}] },
  { title:"Betting",  links:[{l:"Soccer Fixtures",path:"/betting"},{l:"Live Odds",path:"/betting"},{l:"Results",path:"/betting"}] },
];

export default function Footer({ note, children }) {
  return (
    <footer style={{ background:C.ink, color:C.bg }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"48px 28px 0" }}>
        <div style={{ borderBottom:`1px solid rgba(255,255,255,.12)`, paddingBottom:36, marginBottom:36, display:"grid", gridTemplateColumns:"1.4fr repeat(4,1fr)", gap:32, flexWrap:"wrap" }}>
          <div>
            <h2 style={{ fontFamily:SERIF, fontSize:22, fontWeight:700, marginBottom:10 }}>Master of Commerce</h2>
            <p style={{ fontFamily:SANS, fontSize:13, color:"rgba(255,255,255,.5)", lineHeight:1.7, maxWidth:200 }}>Your daily brief for global markets, live data and soccer betting.</p>
          </div>
          {COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily:SANS, fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"rgba(255,255,255,.5)", marginBottom:14 }}>{col.title}</div>
              {col.links.map(lk => (
                <div key={lk.l} style={{ marginBottom:8 }}>
                  <Link to={lk.path} style={{ fontFamily:SANS, fontSize:13, color:"rgba(255,255,255,.7)" }}>{lk.l}</Link>
                </div>
              ))}
            </div>
          ))}
        </div>
        {children && (
          <div style={{ paddingBottom:24, textAlign:"center" }}>{children}</div>
        )}
        <div style={{ paddingBottom:24, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div style={{ fontFamily:MONO, fontSize:11, color:"rgba(255,255,255,.35)" }}>© 2026 Master of Commerce. Financial data for informational purposes only.</div>
          <div style={{ fontFamily:MONO, fontSize:11, color:"rgba(255,255,255,.35)" }}>{note || "Crypto prices via CoinGecko API"}</div>
        </div>
      </div>
    </footer>
  );
}
