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

const H = 50; // masthead band height

const SQUARE = {
  background:C.orange, border:"none", borderRadius:12,
  height:H, width:H, flexShrink:0,
  display:"inline-flex", alignItems:"center", justifyContent:"center",
};

// Free form-to-email relay: each signup lands in the site inbox as an email.
// Swap this endpoint for a Mailchimp/Buttondown URL when the list outgrows it.
const SIGNUP_URL = "https://formsubmit.co/ajax/mattersmzansi@gmail.com";

function BurgerIcon() {
  return (
    <svg width="22" height="17" viewBox="0 0 22 17" aria-hidden="true">
      <g stroke="#fff" strokeWidth="2.7" strokeLinecap="round">
        <line x1="1.6" y1="1.6"  x2="20.4" y2="1.6"/>
        <line x1="1.6" y1="8.5"  x2="20.4" y2="8.5"/>
        <line x1="1.6" y1="15.4" x2="20.4" y2="15.4"/>
      </g>
    </svg>
  );
}

function MailIcon({ size = 23, stroke = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>
    </svg>
  );
}

function GlassIcon({ stroke = "#5A727C" }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2"
      strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/>
    </svg>
  );
}

function Badge({ fill = false }) {
  return (
    <Link to="/" style={{ flex: fill ? 1 : "0 0 auto", minWidth:0, display:"flex" }}>
      <div style={{ flex: fill ? 1 : "0 0 auto", minWidth:0, height:H, background:BRAND_GRAD, borderRadius:12,
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
  );
}

export default function Nav() {
  const { pathname } = useLocation();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [subOpen,    setSubOpen]    = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [email,      setEmail]      = useState("");
  const [status,     setStatus]     = useState("idle"); // idle | sending | ok | err

  function openSub()    { setSubOpen(o => !o);    setMenuOpen(false); setSearchOpen(false); }
  function openMenu()   { setMenuOpen(o => !o);   setSubOpen(false);  setSearchOpen(false); }
  function openSearch() { setSearchOpen(o => !o); setSubOpen(false);  setMenuOpen(false); }

  async function subscribe(e) {
    e.preventDefault();
    if (!email.trim() || status === "sending") return;
    setStatus("sending");
    try {
      const r = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          _subject: "New Mzansi Money Matters newsletter signup",
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      await r.json();
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("err");
    }
  }

  return (
    <header style={{ background:C.paper, borderBottom:`2px solid ${C.ink}` }}>
      {/* Mobile masthead — orange menu square · brand badge · orange subscribe square */}
      <div className="mc-mob-only" style={{ padding:"13px 14px", alignItems:"stretch", gap:10 }}>
        <button aria-label="Open menu" aria-expanded={menuOpen} onClick={openMenu} style={SQUARE}>
          <BurgerIcon/>
        </button>
        <Badge fill/>
        <button aria-label="Subscribe to the newsletter" aria-expanded={subOpen} onClick={openSub} style={SQUARE}>
          <MailIcon/>
        </button>
      </div>

      {/* Desktop masthead — full-bleed, badge in the left corner, subscribe in the right */}
      <div className="mc-desk-only" style={{ padding:"14px 14px", alignItems:"center", gap:14 }}>
        <Badge/>
        <nav style={{ display:"flex", alignItems:"center", gap:15, marginLeft:2, flexShrink:0 }}>
          {LINKS.map(l => {
            const active = pathname === l.path;
            return (
              <Link key={l.label} to={l.path} style={{
                fontFamily:SANS, fontSize:12.5, fontWeight: active ? 700 : 500,
                color: active ? C.ink : C.muted, whiteSpace:"nowrap",
              }}>{l.label}</Link>
            );
          })}
        </nav>
        <div style={{ flex:1 }} />
        <button aria-label="Search" aria-expanded={searchOpen} onClick={openSearch}
          style={{ width:H, height:H, border:`1.5px solid ${C.rule}`, borderRadius:12, background:"#FBF6EF",
            display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <GlassIcon/>
        </button>
        <button aria-label="Subscribe to the newsletter" aria-expanded={subOpen} onClick={openSub}
          style={{ height:H, background:C.orange, border:"none", borderRadius:12, padding:"0 16px",
            display:"inline-flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <MailIcon size={19}/>
          <span style={{ fontFamily:SANS, fontWeight:700, fontSize:13.5, color:"#fff", whiteSpace:"nowrap" }}>Subscribe</span>
        </button>
      </div>

      {/* Search panel — opens from the search icon on desktop */}
      {searchOpen && (
        <div style={{ borderTop:`1px solid ${C.rule}`, background:C.paper }}>
          <div style={{ padding:"12px 14px", display:"flex", gap:8, alignItems:"center" }}>
            <div style={{ flex:1, height:44, border:`1.5px solid ${C.rule}`, borderRadius:12, background:"#FBF6EF",
              display:"flex", alignItems:"center", gap:9, padding:"0 14px" }}>
              <GlassIcon/>
              <input autoFocus placeholder="Search markets, tickers, news…" aria-label="Search"
                style={{ flex:1, height:"100%", border:"none", background:"transparent", outline:"none",
                  fontFamily:SANS, fontSize:14, color:C.ink }} />
            </div>
            <button onClick={() => setSearchOpen(false)} aria-label="Close search"
              style={{ height:44, padding:"0 14px", border:`1.5px solid ${C.rule}`, borderRadius:12,
                background:"#fff", fontFamily:SANS, fontWeight:600, fontSize:13, color:C.muted }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Newsletter signup — opens from the ✉ button on both mobile and desktop */}
      {subOpen && (
        <div style={{ borderTop:`1px solid ${C.rule}`, background:C.paper }}>
          <div style={{ padding:"16px 14px 20px" }}>
            <div style={{ fontFamily:SANS, fontWeight:800, fontSize:15, color:C.ink, textTransform:"uppercase", letterSpacing:".03em" }}>
              Get the newsletter
            </div>
            <div style={{ fontFamily:SANS, fontSize:12.5, color:C.muted, marginTop:3 }}>
              Market news &amp; money matters in your inbox — free.
            </div>
            {status === "ok" ? (
              <div style={{ fontFamily:SANS, fontWeight:700, fontSize:14, color:C.green, marginTop:12 }}>
                ✓ You're on the list — thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={subscribe} style={{ display:"flex", gap:8, marginTop:12, maxWidth:520 }}>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com" aria-label="Email address"
                  style={{ flex:1, minWidth:0, height:46, border:`1.5px solid ${C.rule}`, borderRadius:12,
                    padding:"0 14px", fontFamily:SANS, fontSize:14, color:C.ink, background:"#FFFDFA", outline:"none" }} />
                <button type="submit" disabled={status === "sending"}
                  style={{ background:C.orange, border:"none", borderRadius:12, height:46, padding:"0 18px",
                    fontFamily:SANS, fontWeight:700, fontSize:14, color:"#fff", flexShrink:0,
                    opacity: status === "sending" ? .6 : 1 }}>
                  {status === "sending" ? "Sending…" : "Subscribe"}
                </button>
              </form>
            )}
            {status === "err" && (
              <div style={{ fontFamily:SANS, fontSize:12.5, color:C.red, marginTop:8 }}>
                Something went wrong — please try again, or email{" "}
                <a href="mailto:mattersmzansi@gmail.com?subject=Subscribe" style={{ fontWeight:700, textDecoration:"underline" }}>
                  mattersmzansi@gmail.com
                </a>.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu — the burger carries all section links */}
      {menuOpen && (
        <nav className="mc-mob-only" style={{ borderTop:`1px solid ${C.rule}`, background:C.paper, flexDirection:"column", padding:"4px 14px 10px" }}>
          {LINKS.map(l => {
            const active = pathname === l.path;
            return (
              <Link key={l.label} to={l.path} onClick={() => setMenuOpen(false)} style={{
                display:"block", padding:"12px 6px",
                fontFamily:SANS, fontSize:14, fontWeight:active?700:500,
                color: active ? C.ink : C.muted,
                borderBottom:`1px solid ${C.rule2}`,
              }}>
                {l.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
