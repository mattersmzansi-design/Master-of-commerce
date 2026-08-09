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
      <div className="mc-pad" style={{ maxWidth:1200, margin:"0 auto", padding:"16px 28px 14px", display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12, borderBottom:`1px solid ${C.rule}` }}>
        <Link to="/" style={{ display:"flex", alignItems:"center", gap:12 }}>
          <img src="/logo-mark.png" alt="Mzansi Money Matters logo"
            style={{ width:54, height:54, borderRadius:13, objectFit:"cover", objectPosition:"center 12%", flexShrink:0, boxShadow:"0 2px 8px rgba(1,32,48,.18)" }} />
          <div style={{ display:"flex", flexDirection:"column", lineHeight:1,
            background:"radial-gradient(130% 150% at 28% 28%, #FBC02D 0%, #F7941E 44%, #F24E01 100%)",
            borderRadius:13, padding:"9px 18px", boxShadow:"0 2px 8px rgba(1,32,48,.18)" }}>
            <span style={{ fontFamily:SANS, fontWeight:800, fontSize:"clamp(17px,2.7vw,24px)", color:"#fff", letterSpacing:".005em", textTransform:"uppercase" }}>
              Mzansi Money Matters
            </span>
            <span style={{ fontFamily:SANS, fontWeight:800, fontSize:"clamp(9px,1.1vw,10.5px)", color:C.cyan, letterSpacing:".30em", textTransform:"uppercase", marginTop:5 }}>
              Markets · News · Data
            </span>
          </div>
        </Link>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:MONO, fontSize:10, color:C.muted, marginBottom:8, letterSpacing:".04em" }}>{today}</div>
          <div style={{ display:"flex", gap:10 }}>
            <button style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:C.ink, border:`1px solid ${C.rule}`, padding:"6px 16px" }}>Sign In</button>
            <button style={{ fontFamily:SANS, fontSize:12, fontWeight:700, background:C.orange, color:"#fff", padding:"6px 16px" }}>Subscribe</button>
          </div>
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
