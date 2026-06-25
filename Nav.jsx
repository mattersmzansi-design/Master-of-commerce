import { Link, useLocation } from "react-router-dom";
import { C, SERIF, MONO, SANS } from "../theme";

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
  const today = new Date().toLocaleDateString("en-ZA",{ weekday:"long", year:"numeric", month:"long", day:"numeric" });

  return (
    <header style={{ background:C.paper, borderBottom:`2px solid ${C.ink}` }}>
      {/* Masthead */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"18px 28px 14px", display:"flex", justifyContent:"space-between", alignItems:"flex-end", borderBottom:`1px solid ${C.rule}` }}>
        <div>
          <div style={{ fontFamily:MONO, fontSize:10, color:C.muted, letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 }}>Est. 2026 · South Africa & The World</div>
          <Link to="/" style={{ display:"block" }}>
            <h1 style={{ fontFamily:SERIF, fontSize:"clamp(26px,3.5vw,40px)", fontWeight:700, color:C.ink, letterSpacing:"-.01em", lineHeight:1 }}>
              Master of Commerce
            </h1>
          </Link>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:MONO, fontSize:10, color:C.muted, marginBottom:8, letterSpacing:".04em" }}>{today}</div>
          <div style={{ display:"flex", gap:10 }}>
            <button style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:C.ink, border:`1px solid ${C.rule}`, padding:"6px 16px" }}>Sign In</button>
            <button style={{ fontFamily:SANS, fontSize:12, fontWeight:700, background:C.ink, color:C.bg, padding:"6px 16px" }}>Subscribe</button>
          </div>
        </div>
      </div>
      {/* Section nav */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 28px", display:"flex", gap:0, overflowX:"auto" }}>
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
