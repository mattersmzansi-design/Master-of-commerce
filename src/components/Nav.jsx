import { Link, useLocation } from "react-router-dom";
import { C, SANS } from "../theme";

const BRAND_GRAD = "radial-gradient(130% 150% at 28% 28%, #FBC02D 0%, #F7941E 46%, #F24E01 100%)";

const LINKS = [
  { label:"Business News",    path:"/news"     },
  { label:"JSE",              path:"/jse"      },
  { label:"NYSE",             path:"/nyse"     },
  { label:"Crypto",           path:"/crypto"   },
  { label:"Economic Calendar",path:"/calendar" },
  { label:"Soccer Betting",   path:"/betting"  },
];

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <header style={{ background:C.paper, borderBottom:`2px solid ${C.ink}` }}>
      {/* Masthead — seamless brand badge + actions, all on one row */}
      <div className="mc-pad" style={{ maxWidth:1200, margin:"0 auto", padding:"12px 28px", display:"flex", alignItems:"center", gap:8, borderBottom:`1px solid ${C.rule}` }}>
        <Link to="/" style={{ display:"flex", minWidth:0, flex:"0 1 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, minWidth:0,
            background:BRAND_GRAD, borderRadius:14, overflow:"hidden", paddingRight:14,
            boxShadow:"0 2px 8px rgba(1,32,48,.18)" }}>
            <img src="/logo-mark.png" alt="Mzansi Money Matters logo"
              style={{ width:54, height:54, objectFit:"cover", objectPosition:"center 12%", flexShrink:0, display:"block",
                WebkitMaskImage:"linear-gradient(to right,#000 58%,transparent 100%)",
                maskImage:"linear-gradient(to right,#000 58%,transparent 100%)" }} />
            <span style={{ fontFamily:SANS, fontWeight:800, fontSize:"clamp(13px,2.6vw,22px)", lineHeight:1.03, color:"#fff", letterSpacing:".01em", textTransform:"uppercase" }}>
              Mzansi<br/>Money Matters
            </span>
          </div>
        </Link>
        <div style={{ display:"flex", gap:6, marginLeft:"auto", flexShrink:0 }}>
          <button style={{ fontFamily:SANS, fontSize:"clamp(11px,1.6vw,13px)", fontWeight:700, color:"#C2410C", background:"#FADFC9", borderRadius:11, padding:"8px 14px", whiteSpace:"nowrap" }}>Sign In</button>
          <button style={{ fontFamily:SANS, fontSize:"clamp(11px,1.6vw,13px)", fontWeight:700, color:"#fff", background:C.orange, borderRadius:11, padding:"8px 14px", whiteSpace:"nowrap" }}>Subscribe</button>
        </div>
      </div>
      {/* Section nav */}
      <div className="mc-pad" style={{ maxWidth:1200, margin:"0 auto", padding:"0 28px", display:"flex", gap:0, overflowX:"auto" }}>
        {LINKS.map(l => {
          const active = pathname === l.path;
          return (
            <Link key={l.label} to={l.path} style={{
              fontFamily:SANS, fontSize:12, fontWeight:active?700:500,
              color: active ? C.ink : C.muted,
              padding:"10px 16px", whiteSpace:"nowrap",
              borderBottom: active ? `2px solid ${C.ink}` : "2px solid transparent",
              marginBottom:"-2px",
            }}>
              {l.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
