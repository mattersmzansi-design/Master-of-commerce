import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

// ─── data ───────────────────────────────────────────────────────────────────

const JSE = [
  { symbol:"NPN",  name:"Naspers",        price:3284.50, chg: 2.34  },
  { symbol:"MTN",  name:"MTN Group",      price: 142.60, chg:-1.12  },
  { symbol:"SBK",  name:"Standard Bank",  price: 213.40, chg: 0.87  },
  { symbol:"AGL",  name:"Anglo American", price: 524.30, chg:-0.45  },
  { symbol:"SHP",  name:"Shoprite",       price: 287.90, chg: 1.56  },
  { symbol:"SOL",  name:"Sasol",          price: 189.20, chg:-2.31  },
];

const NYSE = [
  { symbol:"AAPL",  name:"Apple",    price:213.45, chg: 0.89 },
  { symbol:"MSFT",  name:"Microsoft",price:428.30, chg: 1.24 },
  { symbol:"NVDA",  name:"NVIDIA",   price:875.60, chg: 3.21 },
  { symbol:"TSLA",  name:"Tesla",    price:248.90, chg:-1.87 },
  { symbol:"AMZN",  name:"Amazon",   price:198.40, chg: 0.56 },
  { symbol:"META",  name:"Meta",     price:524.10, chg: 2.10 },
];

const NEWS = [
  { id:1, cat:"SA Economy", featured:true,
    title:"South Africa's Reserve Bank Holds Rate as Rand Strengthens on Improving Outlook",
    dek:"The MPC voted 5–2 to keep the benchmark rate at 8.25%, citing easing inflation but warning that global uncertainty remains elevated.",
    src:"Reuters", time:"1h ago" },
  { id:2, cat:"JSE",
    title:"Naspers Reports Strong H1 Results as Tencent Stake Gains Value",
    dek:"First-half earnings beat analyst expectations, driven by the group's Tencent holding and operational improvements in e-commerce.",
    src:"Business Day", time:"2h ago" },
  { id:3, cat:"Crypto",
    title:"Bitcoin Breaks $75,000 as Institutional Demand Surges",
    dek:"Spot ETF inflows hit a weekly record, with pension and sovereign funds accounting for the majority of fresh allocations.",
    src:"CoinDesk", time:"5h ago" },
  { id:4, cat:"NYSE",
    title:"NVIDIA Hits All-Time High on AI Chip Demand Outlook",
    dek:"The chipmaker guided for record data-centre revenue in the coming quarter, sending shares to fresh highs in early trading.",
    src:"Bloomberg", time:"8h ago" },
  { id:5, cat:"Global",
    title:"Fed Minutes Show Growing Split Over Pace of Rate Cuts",
    dek:"Several officials flagged sticky services inflation as a reason to move cautiously, complicating the path to easing.",
    src:"Reuters", time:"10h ago" },
  { id:6, cat:"JSE",
    title:"MTN Group Expands Mobile Banking Across Three New Markets",
    dek:"MoMo now serves 11 African markets after the group completed its latest rollout, targeting 50 million users by year-end.",
    src:"Fin24", time:"12h ago" },
];

const CALENDAR = [
  { date:"Mon 16 Jun", time:"10:00", flag:"🇿🇦", event:"SA Consumer Price Index (May)",  impact:"high",   forecast:"4.8%",  prev:"4.7%"  },
  { date:"Mon 16 Jun", time:"14:30", flag:"🇺🇸", event:"US Retail Sales (MoM)",           impact:"high",   forecast:"0.3%",  prev:"0.1%"  },
  { date:"Tue 17 Jun", time:"09:00", flag:"🇪🇺", event:"Eurozone ZEW Economic Sentiment", impact:"medium", forecast:"18.5",  prev:"17.2"  },
  { date:"Wed 18 Jun", time:"11:00", flag:"🇿🇦", event:"SA Unemployment Rate Q1",         impact:"high",   forecast:"32.1%", prev:"32.9%" },
];

const MATCHES = [
  { league:"PSL",            home:"Mamelodi Sundowns", away:"Orlando Pirates",  time:"15:00", odds:{h:1.85,d:3.40,a:4.20} },
  { league:"PSL",            home:"Kaizer Chiefs",     away:"SuperSport Utd",   time:"17:30", odds:{h:2.10,d:3.10,a:3.50} },
  { league:"Premier League", home:"Arsenal",           away:"Manchester City",  time:"17:30", odds:{h:2.40,d:3.20,a:2.95} },
  { league:"La Liga",        home:"Real Madrid",       away:"Barcelona",        time:"20:00", odds:{h:2.10,d:3.30,a:3.40} },
];

const IMPACT = { high:C.red, medium:C.amber, low:C.green };
const LEAGUE_CLR = { "PSL":C.green, "Premier League":C.blue, "La Liga":C.amber, "Champions League":C.gold };

// ─── helpers ────────────────────────────────────────────────────────────────

const chgColor = n => n >= 0 ? C.green : C.red;
const chgLabel = n => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
const fmtPrice  = (n, prefix="") => `${prefix}${n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;

// ─── page ───────────────────────────────────────────────────────────────────

export default function Home() {
  const [crypto, setCrypto]   = useState([]);
  const [mktTab, setMktTab]   = useState("JSE");
  const [picks, setPicks]     = useState({});

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false&price_change_percentage=24h")
      .then(r => r.json()).then(d => Array.isArray(d) && setCrypto(d)).catch(() => {});
  }, []);

  const featuredArticle = NEWS.find(a => a.featured);
  const sideArticles    = NEWS.filter(a => !a.featured).slice(0,3);
  const bottomArticles  = NEWS.filter(a => !a.featured).slice(3);

  const btc = crypto.find(c => c.id==="bitcoin");
  const eth = crypto.find(c => c.id==="ethereum");

  const MARKET_SUMMARY = [
    { label:"JSE All Share",  value:"84,234",  unit:"pts",   chg: 1.34,  link:"/jse"    },
    { label:"NYSE Composite", value:"19,872",  unit:"pts",   chg: 0.89,  link:"/nyse"   },
    { label:"Bitcoin (BTC)",  value: btc ? `$${btc.current_price.toLocaleString("en-US",{maximumFractionDigits:0})}` : "$74,842", unit:"", chg: btc?.price_change_percentage_24h ?? 2.14, link:"/crypto" },
    { label:"Ethereum (ETH)", value: eth ? `$${eth.current_price.toLocaleString("en-US",{maximumFractionDigits:0})}` : "$3,521",  unit:"", chg: eth?.price_change_percentage_24h ?? 1.76, link:"/crypto" },
    { label:"USD / ZAR",      value:"18.42",   unit:"",      chg:-0.23,  link:"/nyse"   },
    { label:"Gold (XAU)",     value:"$2,312",  unit:"/oz",   chg: 0.54,  link:"/"       },
  ];

  const mktData = mktTab==="JSE" ? JSE : mktTab==="NYSE" ? NYSE :
    crypto.slice(0,6).map(c => ({ symbol:c.symbol.toUpperCase(), name:c.name, price:c.current_price, chg:c.price_change_percentage_24h??0 }));
  const mktPrefix = mktTab==="JSE" ? "R " : "$ ";

  return (
    <div style={{ background:C.bg }}>
      <Nav />

      {/* ── Market Index Strip ── */}
      <div style={{ background:C.ink, overflowX:"auto" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 28px", display:"flex", gap:0 }}>
          {MARKET_SUMMARY.map(m => (
            <Link to={m.link} key={m.label} style={{ display:"flex", flexDirection:"column", justifyContent:"center", padding:"7px 20px 7px 0", marginRight:20, borderRight:`1px solid rgba(255,255,255,.1)`, minWidth:120, flexShrink:0 }}>
              <div style={{ fontFamily:MONO, fontSize:9, color:"rgba(255,255,255,.45)", letterSpacing:".06em", textTransform:"uppercase", marginBottom:3 }}>{m.label}</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                <span style={{ fontFamily:MONO, fontSize:12, fontWeight:600, color:"#fff" }}>{m.value}<span style={{ fontSize:9, color:"rgba(255,255,255,.45)", marginLeft:2 }}>{m.unit}</span></span>
                <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color: m.chg>=0 ? "#5EDB90" : "#F47E7E" }}>{chgLabel(m.chg)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Hero / Lead section ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"44px 28px 0", borderBottom:`1px solid ${C.rule}` }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:36, alignItems:"start" }}>

          {/* Lead story */}
          {featuredArticle && (
            <div style={{ paddingRight:36, borderRight:`1px solid ${C.rule}` }}>
              <div style={{ fontFamily:MONO, fontSize:10, color:C.red, textTransform:"uppercase", letterSpacing:".1em", fontWeight:600, marginBottom:12 }}>
                Top Story · {featuredArticle.cat}
              </div>
              <h2 style={{ fontFamily:SERIF, fontSize:"clamp(26px,2.8vw,40px)", fontWeight:700, lineHeight:1.12, color:C.ink, marginBottom:14, letterSpacing:"-.01em" }}>
                {featuredArticle.title}
              </h2>
              <p style={{ fontFamily:SERIF, fontStyle:"italic", fontSize:17, lineHeight:1.65, color:C.muted, marginBottom:18 }}>
                {featuredArticle.dek}
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:16, paddingTop:14, borderTop:`1px solid ${C.rule}` }}>
                <span style={{ fontFamily:MONO, fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:".06em" }}>{featuredArticle.src}</span>
                <span style={{ color:C.rule }}>·</span>
                <span style={{ fontFamily:MONO, fontSize:10, color:C.muted }}>{featuredArticle.time}</span>
                <Link to="/news" style={{ marginLeft:"auto", fontFamily:SANS, fontSize:12, fontWeight:600, color:C.blue }}>Read more →</Link>
              </div>
            </div>
          )}

          {/* Side stories */}
          <div>
            <div style={{ fontFamily:MONO, fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", fontWeight:700, marginBottom:14, paddingBottom:8, borderBottom:`1px solid ${C.rule}` }}>Also in Today's Brief</div>
            {sideArticles.map((a,i) => (
              <div key={a.id} style={{ paddingBottom:14, marginBottom:14, borderBottom: i<sideArticles.length-1 ? `1px solid ${C.rule2}` : "none" }}>
                <div style={{ fontFamily:MONO, fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>{a.cat} · {a.time}</div>
                <h3 style={{ fontFamily:SERIF, fontSize:15, fontWeight:600, lineHeight:1.35, color:C.ink, marginBottom:5 }}>{a.title}</h3>
                <p style={{ fontFamily:SANS, fontSize:12, color:C.muted, lineHeight:1.55 }}>{a.dek}</p>
              </div>
            ))}
            <Link to="/news" style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:C.blue }}>All business news →</Link>
          </div>
        </div>

        {/* bottom article row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, paddingTop:28, paddingBottom:28, marginTop:12, borderTop:`1px solid ${C.rule}` }}>
          {bottomArticles.map(a => (
            <div key={a.id}>
              <div style={{ fontFamily:MONO, fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>{a.cat} · {a.time}</div>
              <h4 style={{ fontFamily:SERIF, fontSize:14, fontWeight:600, lineHeight:1.35, color:C.ink, marginBottom:4 }}>{a.title}</h4>
              <p style={{ fontFamily:SANS, fontSize:12, color:C.muted, lineHeight:1.55 }}>{a.dek.slice(0,90)}…</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Markets ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"36px 28px", borderBottom:`1px solid ${C.rule}` }}>
        <SectionHead title="Markets" sub="Live Prices" link="/crypto" />
        <div style={{ display:"flex", gap:0, marginBottom:0, borderBottom:`1px solid ${C.ink}` }}>
          {["JSE","NYSE","Crypto"].map(t => (
            <button key={t} onClick={() => setMktTab(t)} style={{
              fontFamily:SANS, fontSize:12, fontWeight: mktTab===t ? 700 : 500,
              color: mktTab===t ? C.ink : C.muted,
              padding:"8px 20px", borderBottom: mktTab===t ? `2px solid ${C.ink}` : "2px solid transparent",
              marginBottom:"-1px", background:"none",
            }}>{t}</button>
          ))}
        </div>
        <table style={{ width:"100%" }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.rule}` }}>
              {["Symbol","Name","Price","Change 24H"].map(h => (
                <th key={h} style={{ fontFamily:MONO, fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", padding:"10px 12px", textAlign:"left", fontWeight:600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mktData.slice(0,5).map((s,i) => {
              const up = s.chg >= 0;
              return (
                <tr key={s.symbol} style={{ borderBottom:`1px solid ${C.rule2}` }}
                  onMouseEnter={e => e.currentTarget.style.background="#FFF3E5"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <td style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:C.ink, padding:"12px 12px" }}>{s.symbol}</td>
                  <td style={{ fontFamily:SANS, fontSize:13, color:C.muted, padding:"12px 12px" }}>{s.name}</td>
                  <td style={{ fontFamily:MONO, fontSize:13, fontWeight:600, color:C.ink, padding:"12px 12px" }}>{mktPrefix}{fmtPrice(s.price)}</td>
                  <td style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color: chgColor(s.chg), padding:"12px 12px" }}>{chgLabel(s.chg)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ paddingTop:12 }}>
          <Link to={mktTab==="JSE"?"/jse":mktTab==="NYSE"?"/nyse":"/crypto"} style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:C.blue }}>Full {mktTab} data →</Link>
        </div>
      </section>

      {/* ── Calendar + Betting side by side ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"36px 28px", borderBottom:`1px solid ${C.rule}`, display:"grid", gridTemplateColumns:"1fr 1fr", gap:48 }}>
        {/* Economic Calendar */}
        <div>
          <SectionHead title="Economic Calendar" sub="Upcoming Events" link="/calendar" />
          <table style={{ width:"100%" }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.rule}` }}>
                {["Date","Event","Impact","Forecast"].map(h => (
                  <th key={h} style={{ fontFamily:MONO, fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:".07em", padding:"8px 8px", textAlign:"left", fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CALENDAR.map((e,i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${C.rule2}` }}>
                  <td style={{ fontFamily:MONO, fontSize:11, color:C.muted, padding:"10px 8px", whiteSpace:"nowrap" }}>{e.flag} {e.date}</td>
                  <td style={{ fontFamily:SANS, fontSize:12, color:C.ink, padding:"10px 8px", lineHeight:1.3 }}>{e.event}</td>
                  <td style={{ padding:"10px 8px" }}><span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:IMPACT[e.impact] }} /></td>
                  <td style={{ fontFamily:MONO, fontSize:12, fontWeight:600, color:C.ink, padding:"10px 8px" }}>{e.forecast}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ paddingTop:12 }}>
            <Link to="/calendar" style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:C.blue }}>Full calendar →</Link>
          </div>
        </div>

        {/* Soccer Betting */}
        <div>
          <SectionHead title="Today's Fixtures" sub="Soccer Betting" link="/betting" />
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {MATCHES.map((m,i) => {
              const lc = LEAGUE_CLR[m.league] || C.muted;
              const picked = picks[i];
              return (
                <div key={i} style={{ padding:"12px 0", borderBottom:`1px solid ${C.rule2}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontFamily:MONO, fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:lc }}>{m.league}</span>
                    <span style={{ fontFamily:MONO, fontSize:10, color:C.muted }}>{m.time}</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:10, alignItems:"center", marginBottom:8 }}>
                    <span style={{ fontFamily:SERIF, fontSize:13, fontWeight:600, color:C.ink }}>{m.home}</span>
                    <span style={{ fontFamily:MONO, fontSize:11, color:C.muted }}>vs</span>
                    <span style={{ fontFamily:SERIF, fontSize:13, fontWeight:600, color:C.ink, textAlign:"right" }}>{m.away}</span>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    {[["H",m.odds.h,"h"],["D",m.odds.d,"d"],["A",m.odds.a,"a"]].map(([lbl,odd,key]) => (
                      <button key={key} onClick={() => setPicks(p => ({...p,[i]:p[i]===key?null:key}))} style={{
                        flex:1, border:`1px solid ${picks[i]===key ? C.ink : C.rule}`,
                        background: picks[i]===key ? C.ink : "transparent",
                        color: picks[i]===key ? C.bg : C.ink,
                        fontFamily:MONO, fontSize:11, fontWeight:700, padding:"5px 0", textAlign:"center",
                      }}>
                        <div style={{ fontSize:9, marginBottom:2, opacity:.7 }}>{lbl}</div>
                        <div>{odd.toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {Object.values(picks).filter(Boolean).length > 0 && (
            <div style={{ marginTop:14, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", border:`1px solid ${C.ink}`, background:C.ink }}>
              <span style={{ fontFamily:SANS, fontSize:12, color:C.bg, fontWeight:600 }}>{Object.values(picks).filter(Boolean).length} selection{Object.values(picks).filter(Boolean).length>1?"s":""} added</span>
              <Link to="/betting" style={{ fontFamily:SANS, fontSize:12, fontWeight:700, color:"#FFF3E5" }}>View bet slip →</Link>
            </div>
          )}
          <div style={{ paddingTop:12 }}>
            <Link to="/betting" style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:C.blue }}>All fixtures →</Link>
          </div>
        </div>
      </section>

      {/* ── Crypto snapshot ── */}
      {crypto.length > 0 && (
        <section style={{ maxWidth:1200, margin:"0 auto", padding:"36px 28px", borderBottom:`1px solid ${C.rule}` }}>
          <SectionHead title="Cryptocurrency" sub="Live Prices via CoinGecko" link="/crypto" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:1, background:C.rule }}>
            {crypto.slice(0,6).map(c => {
              const up = (c.price_change_percentage_24h??0) >= 0;
              return (
                <Link to="/crypto" key={c.id} style={{ background:C.paper, padding:"14px 16px", display:"block" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <img src={c.image} alt={c.name} style={{ width:22, height:22, borderRadius:"50%" }} />
                    <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color:C.ink }}>{c.symbol.toUpperCase()}</span>
                  </div>
                  <div style={{ fontFamily:MONO, fontSize:14, fontWeight:600, color:C.ink, marginBottom:3 }}>
                    ${c.current_price.toLocaleString("en-US",{maximumFractionDigits:2})}
                  </div>
                  <div style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color: up?C.green:C.red }}>
                    {chgLabel(c.price_change_percentage_24h??0)}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function SectionHead({ title, sub, link }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:18 }}>
      <div>
        <div style={{ fontFamily:MONO, fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:".1em", marginBottom:4 }}>{sub}</div>
        <h2 style={{ fontFamily:SERIF, fontSize:24, fontWeight:700, color:C.ink, letterSpacing:"-.01em" }}>{title}</h2>
      </div>
      {link && <Link to={link} style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:C.blue }}>View all →</Link>}
    </div>
  );
}
