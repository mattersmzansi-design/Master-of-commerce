import { Link } from "react-router-dom";
import { C, SERIF, MONO, SANS } from "../theme";
import { SOCIALS, CONTACT_EMAIL, SocialIcon } from "../lib/socials.jsx";

const COLS = [
  { title:"Markets",  links:[{l:"JSE Stocks",path:"/jse"},{l:"Sector Health",path:"/sectors"},{l:"NYSE Stocks",path:"/nyse"},{l:"Crypto",path:"/crypto"},{l:"Predictions",path:"/predictions"}] },
  { title:"News",     links:[{l:"Business News",path:"/news"},{l:"SA Economy",path:"/news"},{l:"Global Markets",path:"/news"},{l:"Commodities",path:"/news"}] },
  { title:"Tools",    links:[{l:"Economic Calendar",path:"/calendar"},{l:"Market Screener",path:"/crypto"},{l:"Portfolio",path:"/"}] },
];

export default function Footer({ note, children }) {
  return (
    <footer style={{ background:C.ink, color:C.bg }}>
      <div className="mc-pad" style={{ maxWidth:1200, margin:"0 auto", padding:"48px 28px 0" }}>
        <div className="mc-footer" style={{ borderBottom:`1px solid rgba(255,255,255,.12)`, paddingBottom:36, marginBottom:36, display:"grid", gridTemplateColumns:"1.4fr repeat(3,1fr)", gap:32 }}>
          <div className="mc-footer-brand">
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <img src="/logo-mark.png" alt="Mzansi Money Matters logo"
                style={{ width:46, height:46, borderRadius:11, objectFit:"cover", objectPosition:"center 12%", flexShrink:0 }} />
              <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
                <span style={{ fontFamily:SANS, fontWeight:800, fontSize:16, letterSpacing:".005em", textTransform:"uppercase" }}>Mzansi Money Matters</span>
                <span style={{ fontFamily:SANS, fontWeight:800, fontSize:9, color:C.cyan, letterSpacing:".28em", textTransform:"uppercase", marginTop:4 }}>Markets · News · Data</span>
              </div>
            </div>
            <p style={{ fontFamily:SANS, fontSize:13, color:"rgba(255,255,255,.5)", lineHeight:1.7, maxWidth:220 }}>Your daily brief for South African &amp; global markets — news, live data and sector commentary.</p>

            {/* Socials + contact */}
            <div style={{ marginTop:18, display:"flex", flexWrap:"wrap", gap:10 }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label} title={s.label}
                  style={{ width:36, height:36, borderRadius:9, background:"rgba(255,255,255,.08)", color:"#fff",
                    display:"inline-flex", alignItems:"center", justifyContent:"center", transition:"background .15s" }}>
                  <SocialIcon name={s.icon} size={18} />
                </a>
              ))}
              <a href={`mailto:${CONTACT_EMAIL}`}
                aria-label="Email us" title={CONTACT_EMAIL}
                style={{ width:36, height:36, borderRadius:9, background:C.orange, color:"#fff",
                  display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                <SocialIcon name="email" size={18} />
              </a>
            </div>
            <a href={`mailto:${CONTACT_EMAIL}`}
              style={{ display:"inline-block", marginTop:12, fontFamily:SANS, fontSize:12, color:"rgba(255,255,255,.7)" }}>
              {CONTACT_EMAIL}
            </a>
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
        <div style={{ paddingBottom:24, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12, alignItems:"center" }}>
          <div style={{ fontFamily:MONO, fontSize:11, color:"rgba(255,255,255,.35)" }}>© 2026 Mzansi Money Matters. Educational only — not financial advice.</div>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            <Link to="/legal#disclaimer" style={{ fontFamily:MONO, fontSize:11, color:"rgba(255,255,255,.55)" }}>Disclaimer</Link>
            <Link to="/legal#terms"      style={{ fontFamily:MONO, fontSize:11, color:"rgba(255,255,255,.55)" }}>Terms</Link>
            <Link to="/legal#privacy"    style={{ fontFamily:MONO, fontSize:11, color:"rgba(255,255,255,.55)" }}>Privacy</Link>
          </div>
          <div style={{ fontFamily:MONO, fontSize:11, color:"rgba(255,255,255,.35)" }}>{note || "Crypto via CoinGecko"}</div>
        </div>
      </div>
    </footer>
  );
}
