import { useState } from "react";
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

const H = 50; // masthead band: burger, badge and mail button all share this height

const SQUARE = {
  background:C.orange, border:"none", borderRadius:12,
  height:H, width:H, flexShrink:0,
  display:"inline-flex", alignItems:"center", justifyContent:"center",
};

export default function Nav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header style={{ background:C.paper, borderBottom:`2px solid ${C.ink}` }}>
      {/* Masthead — orange menu square · brand badge · orange subscribe square */}
      <div className="mc-pad" style={{ maxWidth:1200, margin:"0 auto", padding:"13px 16px", display:"flex", alignItems:"stretch", gap:10 }}>
        <button aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(o => !o)} style={SQUARE}>
          <svg width="22" height="17" viewBox="0 0 22 17" aria-hidden="true">
            <g stroke="#fff" strokeWidth="2.7" strokeLinecap="round">
              <line x1="1.6" y1="1.6"  x2="20.4" y2="1.6"/>
              <line x1="1.6" y1="8.5"  x2="20.4" y2="8.5"/>
              <line x1="1.6" y1="15.4" x2="20.4" y2="15.4"/>
            </g>
          </svg>
        </button>

        <Link to="/" style={{ flex:1, minWidth:0, display:"flex" }}>
          <div style={{ flex:1, minWidth:0, height:H, background:BRAND_GRAD, borderRadius:12,
            display:"flex", alignItems:"center", overflow:"hidden",
            boxShadow:"0 2px 8px rgba(1,32,48,.18)" }}>
            <img src="/logo-mark.png" alt="Mzansi Money Matters logo"
              style={{ width:H, height:H, objectFit:"cover", objectPosition:"center 12%", flexShrink:0, display:"block",
                WebkitMaskImage:"linear-gradient(to right,#000 55%,transparent 100%)",
                maskImage:"linear-gradient(to right,#000 55%,transparent 100%)" }} />
            <div style={{ minWidth:0, paddingRight:12, paddingLeft:2 }}>
              <span style={{ display:"block", fontFamily:SANS, fontWeight:800, color:C.ink,
                fontSize:"clamp(11px,3.35vw,21px)", lineHeight:1, whiteSpace:"nowrap",
                textTransform:"uppercase", letterSpacing:".015em" }}>
                Mzansi Money Matters
              </span>
              <span style={{ display:"block", fontFamily:SANS, fontWeight:700, color:C.cyan,
                fontSize:"clamp(7.5px,2.2vw,11px)", lineHeight:1, marginTop:4,
                whiteSpace:"nowrap", letterSpacing:".18em" }}>
                NEWS&nbsp; · &nbsp;DATA&nbsp; · &nbsp;SPORTS
              </span>
            </div>
          </div>
        </Link>

        <a aria-label="Subscribe by email" href="mailto:mattersmzansi@gmail.com?subject=Subscribe" style={SQUARE}>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>
          </svg>
        </a>
      </div>

      {/* Menu — the burger now carries all section links */}
      {open && (
        <nav style={{ borderTop:`1px solid ${C.rule}`, background:C.paper }}>
          <div className="mc-pad" style={{ maxWidth:1200, margin:"0 auto", padding:"4px 16px 10px" }}>
            {LINKS.map(l => {
              const active = pathname === l.path;
              return (
                <Link key={l.label} to={l.path} onClick={() => setOpen(false)} style={{
                  display:"block", padding:"12px 6px",
                  fontFamily:SANS, fontSize:14, fontWeight:active?700:500,
                  color: active ? C.ink : C.muted,
                  borderBottom:`1px solid ${C.rule2}`,
                }}>
                  {l.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
