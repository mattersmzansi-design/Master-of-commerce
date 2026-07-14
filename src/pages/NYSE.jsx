import { useState, useEffect, useMemo, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

// ─── Alpha Vantage key ───────────────────────────────────────────────────────
// Add your free key from alphavantage.co to .env as VITE_AV_KEY=your_key_here
const AV_KEY = import.meta.env.VITE_AV_KEY || null;
const AV_BASE = "https://www.alphavantage.co/query";

// ─── mock data ───────────────────────────────────────────────────────────────
const SECTORS = ["Technology","Finance","Healthcare","Consumer","Energy","Industrial"];

const MOCK_STOCKS = [
  { symbol:"AAPL",  name:"Apple Inc.",            sector:"Technology",  price:213.45, chg:0.89,  chgAmt:1.88,  open:212.10, high:214.80, low:211.90, vol:58200000,  mktCap:3280000000000, pe:34.2, wk52h:237.23, wk52l:164.08, desc:"Consumer electronics, software and online services. Maker of iPhone, Mac, iPad and Apple Watch." },
  { symbol:"MSFT",  name:"Microsoft Corp.",        sector:"Technology",  price:428.30, chg:1.24,  chgAmt:5.24,  open:424.90, high:429.50, low:423.10, vol:22100000,  mktCap:3180000000000, pe:36.8, wk52h:468.35, wk52l:349.67, desc:"Cloud computing (Azure), enterprise software (Office 365), gaming (Xbox) and AI infrastructure." },
  { symbol:"NVDA",  name:"NVIDIA Corp.",           sector:"Technology",  price:875.60, chg:3.21,  chgAmt:27.23, open:852.40, high:879.20, low:850.10, vol:41500000,  mktCap:2150000000000, pe:69.4, wk52h:974.00, wk52l:395.58, desc:"Graphics processors, AI accelerators and data centre computing. Dominant supplier of AI training chips." },
  { symbol:"GOOGL", name:"Alphabet Inc.",          sector:"Technology",  price:189.20, chg:-0.34, chgAmt:-0.65, open:190.10, high:191.40, low:188.60, vol:24800000,  mktCap:2310000000000, pe:26.1, wk52h:207.05, wk52l:151.95, desc:"Google Search, YouTube, Google Cloud and the Android mobile operating system." },
  { symbol:"AMZN",  name:"Amazon.com Inc.",        sector:"Consumer",    price:198.40, chg:0.56,  chgAmt:1.11,  open:197.50, high:199.80, low:196.90, vol:34600000,  mktCap:2080000000000, pe:55.3, wk52h:242.52, wk52l:151.61, desc:"E-commerce, AWS cloud services, Prime Video streaming and Alexa AI assistant." },
  { symbol:"META",  name:"Meta Platforms",         sector:"Technology",  price:524.10, chg:2.10,  chgAmt:10.80, open:515.20, high:526.30, low:514.00, vol:15200000,  mktCap:1320000000000, pe:29.7, wk52h:602.95, wk52l:352.16, desc:"Facebook, Instagram, WhatsApp and Oculus VR. Largest global social networking company." },
  { symbol:"TSLA",  name:"Tesla Inc.",             sector:"Consumer",    price:248.90, chg:-1.87, chgAmt:-4.74, open:254.20, high:255.10, low:247.60, vol:92400000,  mktCap:793000000000,  pe:52.1, wk52h:364.45, wk52l:138.80, desc:"Electric vehicles, energy storage and solar products. World's largest EV manufacturer by revenue." },
  { symbol:"JPM",   name:"JPMorgan Chase",         sector:"Finance",     price:234.70, chg:0.34,  chgAmt:0.80,  open:233.80, high:235.50, low:232.90, vol:10100000,  mktCap:672000000000,  pe:12.8, wk52h:263.00, wk52l:183.01, desc:"Largest US bank by assets. Investment banking, commercial banking, credit cards and asset management." },
  { symbol:"BRK.B", name:"Berkshire Hathaway",     sector:"Finance",     price:442.60, chg:0.18,  chgAmt:0.78,  open:441.90, high:443.80, low:441.20, vol:3800000,   mktCap:965000000000,  pe:10.2, wk52h:496.91, wk52l:351.33, desc:"Warren Buffett's diversified holding company. Insurance, BNSF Railway, Berkshire Hathaway Energy and dozens of subsidiaries." },
  { symbol:"V",     name:"Visa Inc.",              sector:"Finance",     price:278.40, chg:0.62,  chgAmt:1.72,  open:277.10, high:279.20, low:276.80, vol:6200000,   mktCap:567000000000,  pe:31.4, wk52h:290.96, wk52l:225.63, desc:"Global payments technology. Processes over 200 billion transactions per year across 200+ countries." },
  { symbol:"JNJ",   name:"Johnson & Johnson",      sector:"Healthcare",  price:158.20, chg:-0.42, chgAmt:-0.67, open:158.90, high:159.40, low:157.80, vol:6800000,   mktCap:381000000000,  pe:22.1, wk52h:168.85, wk52l:143.13, desc:"Pharmaceutical, medical devices and consumer health products. Notable brands include Tylenol and Band-Aid." },
  { symbol:"UNH",   name:"UnitedHealth Group",     sector:"Healthcare",  price:512.30, chg:-0.89, chgAmt:-4.60, open:517.10, high:518.20, low:511.40, vol:3400000,   mktCap:472000000000,  pe:19.8, wk52h:630.73, wk52l:418.04, desc:"Largest US health insurer. Operates UnitedHealthcare insurance and Optum health services." },
  { symbol:"WMT",   name:"Walmart Inc.",           sector:"Consumer",    price:68.40,  chg:0.29,  chgAmt:0.20,  open:68.10,  high:68.70,  low:67.90,  vol:18200000,  mktCap:549000000000,  pe:38.6, wk52h:94.37,  wk52l:59.71,  desc:"World's largest retailer by revenue. Operates Walmart stores, Sam's Club and Walmart.com globally." },
  { symbol:"XOM",   name:"ExxonMobil Corp.",       sector:"Energy",      price:112.40, chg:-0.65, chgAmt:-0.73, open:113.20, high:113.60, low:111.90, vol:14800000,  mktCap:453000000000,  pe:14.2, wk52h:126.34, wk52l:95.77,  desc:"Largest US integrated oil and gas company. Upstream production, downstream refining and chemical operations." },
  { symbol:"CVX",   name:"Chevron Corp.",          sector:"Energy",      price:148.60, chg:-0.31, chgAmt:-0.46, open:149.10, high:149.80, low:148.20, vol:8900000,   mktCap:278000000000,  pe:13.8, wk52h:167.11, wk52l:130.36, desc:"Major integrated energy company with global upstream oil and gas and downstream refining operations." },
  { symbol:"CAT",   name:"Caterpillar Inc.",       sector:"Industrial",  price:342.80, chg:1.12,  chgAmt:3.80,  open:340.20, high:344.10, low:339.80, vol:4200000,   mktCap:163000000000,  pe:17.4, wk52h:418.00, wk52l:312.74, desc:"World's largest construction and mining equipment manufacturer. Also produces diesel engines and turbines." },
  { symbol:"BA",    name:"Boeing Co.",             sector:"Industrial",  price:178.40, chg:-1.45, chgAmt:-2.63, open:181.20, high:181.80, low:177.90, vol:9600000,   mktCap:115000000000,  pe:null, wk52h:267.54, wk52l:159.70, desc:"Commercial aircraft, defence and space systems. Maker of 737, 747, 777 and 787 Dreamliner jets." },
  { symbol:"MA",    name:"Mastercard Inc.",        sector:"Finance",     price:476.20, chg:0.84,  chgAmt:3.98,  open:472.80, high:477.40, low:471.90, vol:3100000,   mktCap:436000000000,  pe:38.2, wk52h:510.93, wk52l:384.96, desc:"Global payments network processing transactions in 150+ currencies. Operates the Mastercard brand globally." },
  { symbol:"PFE",   name:"Pfizer Inc.",            sector:"Healthcare",  price:26.80,  chg:-0.52, chgAmt:-0.14, open:27.10,  high:27.20,  low:26.70,  vol:42100000,  mktCap:152000000000,  pe:102, wk52h:32.20,  wk52l:24.48,  desc:"Major pharmaceutical company. Products include Paxlovid, Eliquis, Ibrance and various vaccines." },
  { symbol:"HD",    name:"Home Depot Inc.",        sector:"Consumer",    price:348.60, chg:0.46,  chgAmt:1.59,  open:347.10, high:349.80, low:346.40, vol:3800000,   mktCap:344000000000,  pe:24.8, wk52h:395.11, wk52l:274.52, desc:"World's largest home improvement retailer. Serves DIY consumers and professional contractors." },
];

const INDICES = [
  { symbol:"S&P 500",   value:"5,447.21", chg: 0.62, ytd: 14.4 },
  { symbol:"NASDAQ",    value:"17,689.53",chg: 0.94, ytd: 18.2 },
  { symbol:"Dow Jones", value:"38,932.11",chg: 0.28, ytd: 4.8  },
  { symbol:"VIX",       value:"13.24",    chg:-3.21, ytd:null   },
  { symbol:"USD Index", value:"104.62",   chg:-0.14, ytd:null   },
];

function genSpark(base, pts=40) {
  return Array.from({length:pts},(_,i)=> Math.max(0, base + (Math.random()-0.49)*base*0.025 + Math.sin(i*0.5)*base*0.01));
}

// Market hours: NYSE 9:30-16:00 EST = 15:30-22:00 SAST
function getMarketStatus() {
  const now = new Date();
  const sast = new Date(now.toLocaleString("en-US",{timeZone:"Africa/Johannesburg"}));
  const h=sast.getHours(), m=sast.getMinutes();
  const day=sast.getDay();
  if (day===0||day===6) return { open:false, label:"Closed — Weekend", color:C.red };
  const mins=h*60+m;
  if (mins>=935&&mins<1320) return { open:true,  label:`Open · Closes ${22-(Math.floor((1320-mins)/60))}:${String(59-((1320-mins)%60)).padStart(2,"0")} SAST`, color:C.green };
  if (mins<935) return { open:false, label:`Pre-Market · Opens 15:30 SAST`, color:C.amber };
  return { open:false, label:"After-Hours · Closed 22:00 SAST", color:C.amber };
}

function fmt(n) { return n==null?"—":`$${n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`; }
function pct(n)  { return n==null?"—":`${n>=0?"+":""}${n.toFixed(2)}%`; }
function compact(n) {
  if (n==null) return "—";
  if (n>=1e12) return `$${(n/1e12).toFixed(2)}T`;
  if (n>=1e9)  return `$${(n/1e9).toFixed(2)}B`;
  if (n>=1e6)  return `$${(n/1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}
const chgColor = n => (n??0)>=0 ? C.green : C.red;

function ChartTip({active,payload}) {
  if(!active||!payload?.length) return null;
  return <div style={{background:C.paper,border:`1px solid ${C.rule}`,padding:"5px 10px",fontFamily:MONO,fontSize:11,color:C.ink}}>{fmt(payload[0].value)}</div>;
}

// ─── page ────────────────────────────────────────────────────────────────────
export default function NYSEPage() {
  const [stocks,    setStocks]    = useState(MOCK_STOCKS.map(s=>({...s, spark:genSpark(s.price)})));
  const [liveData,  setLiveData]  = useState({});
  const [fetching,  setFetching]  = useState(false);
  const [fetchErr,  setFetchErr]  = useState(false);
  const [sector,    setSector]    = useState("All");
  const [search,    setSearch]    = useState("");
  const [sortKey,   setSortKey]   = useState("mktCap");
  const [sortDir,   setSortDir]   = useState("desc");
  const [visible,   setVisible]   = useState(10);
  const [selected,  setSelected]  = useState(null);
  const [rdData,    setRdData]    = useState({});
  const [rdLoad,    setRdLoad]    = useState(false);
  const [status]                  = useState(getMarketStatus);

  // Fetch a small batch of live quotes from Alpha Vantage
  const fetchLive = useCallback(async () => {
    if (!AV_KEY) return;
    setFetching(true);
    // Fetch top 5 to stay well within 25/day free limit
    const symbols = ["AAPL","MSFT","NVDA","AMZN","TSLA"];
    try {
      const results = await Promise.allSettled(
        symbols.map(sym =>
          fetch(`${AV_BASE}?function=GLOBAL_QUOTE&symbol=${sym}&apikey=${AV_KEY}`)
            .then(r=>r.json())
        )
      );
      const live = {};
      results.forEach((r,i) => {
        if (r.status==="fulfilled" && r.value["Global Quote"]) {
          const q = r.value["Global Quote"];
          live[symbols[i]] = {
            price:    parseFloat(q["05. price"]),
            chg:      parseFloat(q["10. change percent"]),
            chgAmt:   parseFloat(q["09. change"]),
            high:     parseFloat(q["03. high"]),
            low:      parseFloat(q["04. low"]),
            open:     parseFloat(q["02. open"]),
            vol:      parseInt(q["06. volume"]),
          };
        }
      });
      setLiveData(live);
      if (Object.keys(live).length===0) setFetchErr(true);
    } catch { setFetchErr(true); }
    setFetching(false);
  },[]);

  const fetchChart = useCallback(async (sym) => {
    if (!AV_KEY || rdData[sym]) return;
    setRdLoad(true);
    try {
      const r = await fetch(`${AV_BASE}?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${sym}&outputsize=compact&apikey=${AV_KEY}`);
      const j = await r.json();
      const ts = j["Time Series (Daily)"];
      if (ts) {
        const prices = Object.entries(ts).slice(0,30).reverse().map(([,v])=>parseFloat(v["4. close"]));
        setRdData(p=>({...p,[sym]:prices}));
      }
    } catch {} setRdLoad(false);
  },[rdData]);

  useEffect(()=>{ fetchLive(); },[fetchLive]);

  const merged = useMemo(()=> stocks.map(s=>({
    ...s,
    ...(liveData[s.symbol]||{}),
  })),[stocks, liveData]);

  const filtered = useMemo(()=>{
    let base = sector==="All" ? merged : merged.filter(s=>s.sector===sector);
    if (search.trim()) { const q=search.toLowerCase(); base=base.filter(s=>s.symbol.toLowerCase().includes(q)||s.name.toLowerCase().includes(q)); }
    return [...base].sort((a,b)=>{
      const av=a[sortKey]??-Infinity, bv=b[sortKey]??-Infinity;
      return sortDir==="asc"?av-bv:bv-av;
    });
  },[merged,sector,search,sortKey,sortDir]);

  const gainers = [...merged].sort((a,b)=>(b.chg??-999)-(a.chg??-999)).slice(0,3);
  const losers  = [...merged].sort((a,b)=>(a.chg??999)-(b.chg??999)).slice(0,3);
  const sel     = merged.find(s=>s.symbol===selected)||null;
  const chartPrices = sel ? (rdData[sel.symbol]||sel.spark||[]) : [];
  const chartData   = chartPrices.map((p,i)=>({i,price:p}));
  const chartUp     = chartPrices.length>1 && chartPrices[chartPrices.length-1]>=chartPrices[0];

  const handleSort = (key) => {
    if (sortKey===key) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sectorCounts = useMemo(()=>{
    const c={};
    merged.forEach(s=>{ c[s.sector]=(c[s.sector]||0)+1; });
    return c;
  },[merged]);

  return (
    <div style={{background:C.bg}}>
      <Nav/>

      {/* header */}
      <div style={{background:C.paper,borderBottom:`2px solid ${C.ink}`,padding:"22px 28px 18px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{fontFamily:MONO,fontSize:10,color:C.muted,letterSpacing:".06em",marginBottom:10}}>
            Markets / <span style={{color:C.ink}}>NYSE & NASDAQ</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12,marginBottom:16}}>
            <div>
              <h1 style={{fontFamily:SERIF,fontSize:"clamp(24px,3.5vw,38px)",fontWeight:700,color:C.ink,letterSpacing:"-.01em",marginBottom:6}}>
                US Stock Markets
              </h1>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:status.color,display:"inline-block",animation:status.open?"pulse 2s infinite":"none"}}/>
                <span style={{fontFamily:MONO,fontSize:11,color:status.color,fontWeight:700}}>{status.label}</span>
                {AV_KEY && !fetching && !fetchErr && Object.keys(liveData).length>0 && (
                  <span style={{fontFamily:MONO,fontSize:10,color:C.green}}>· Live quotes for AAPL, MSFT, NVDA, AMZN, TSLA</span>
                )}
                {fetching && <span style={{fontFamily:MONO,fontSize:10,color:C.muted}}>· Fetching live quotes…</span>}
              </div>
            </div>
            {!AV_KEY && (
              <div style={{background:"rgba(31,92,75,0.06)",border:`1px solid rgba(31,92,75,0.2)`,padding:"10px 14px",maxWidth:340}}>
                <div style={{fontFamily:MONO,fontSize:9,textTransform:"uppercase",letterSpacing:".08em",color:C.green,marginBottom:4}}>Add Your Free API Key</div>
                <div style={{fontFamily:SANS,fontSize:11,color:C.muted,lineHeight:1.6}}>Get a free key at <span style={{color:C.blue}}>alphavantage.co</span> (25 requests/day free) and add it to your <span style={{fontFamily:MONO}}>/.env</span> file as <span style={{fontFamily:MONO}}>VITE_AV_KEY=your_key</span></div>
              </div>
            )}
          </div>

          {/* index strip */}
          <div style={{display:"flex",gap:0,borderTop:`1px solid ${C.rule}`,paddingTop:14,overflowX:"auto"}}>
            {INDICES.map(idx=>(
              <div key={idx.symbol} style={{paddingRight:24,marginRight:24,borderRight:`1px solid ${C.rule}`,flexShrink:0}}>
                <div style={{fontFamily:MONO,fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>{idx.symbol}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                  <span style={{fontFamily:MONO,fontSize:14,fontWeight:700,color:C.ink}}>{idx.value}</span>
                  <span style={{fontFamily:MONO,fontSize:11,fontWeight:700,color:chgColor(idx.chg)}}>{pct(idx.chg)}</span>
                  {idx.ytd!=null&&<span style={{fontFamily:MONO,fontSize:10,color:C.dim}}>YTD {idx.ytd>0?"+":""}{idx.ytd}%</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* body */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"32px 28px 60px"}}>

        {/* top movers */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:32}}>
          {[{label:"Top Gainers",list:gainers,color:C.green},{label:"Top Losers",list:losers,color:C.red}].map(({label,list,color})=>(
            <div key={label} style={{border:`1px solid ${C.rule}`,background:C.paper}}>
              <div style={{fontFamily:MONO,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color,padding:"10px 16px",borderBottom:`1px solid ${C.rule}`}}>{label} · Today</div>
              {list.map(s=>(
                <div key={s.symbol} onClick={()=>{setSelected(s.symbol);fetchChart(s.symbol);}}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 16px",borderBottom:`1px solid ${C.rule2}`,cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#FFF3E5"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div>
                    <div style={{fontFamily:MONO,fontSize:12,fontWeight:700,color:C.ink}}>{s.symbol}</div>
                    <div style={{fontFamily:SANS,fontSize:11,color:C.muted}}>{s.name}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:MONO,fontSize:12,fontWeight:600,color:C.ink}}>{fmt(s.price)}</div>
                    <div style={{fontFamily:MONO,fontSize:11,fontWeight:700,color}}>{pct(s.chg)}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* sector tabs */}
        <div style={{display:"flex",gap:0,borderBottom:`1px solid ${C.ink}`,marginBottom:20,overflowX:"auto"}}>
          {["All",...SECTORS].map(s=>(
            <button key={s} onClick={()=>{setSector(s);setVisible(10);}}
              style={{fontFamily:SANS,fontSize:12,fontWeight:sector===s?700:500,
                color:sector===s?C.ink:C.muted,padding:"9px 18px",background:"none",
                borderBottom:sector===s?`2px solid ${C.ink}`:"2px solid transparent",
                marginBottom:"-1px",whiteSpace:"nowrap"}}>
              {s}{s!=="All"&&sectorCounts[s]?` (${sectorCounts[s]})`:s==="All"?` (${merged.length})`:""}
            </button>
          ))}
        </div>

        {/* toolbar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:16}}>
          <input value={search} onChange={e=>{setSearch(e.target.value);setVisible(10);}}
            placeholder="Search by symbol or name…"
            style={{fontFamily:SANS,fontSize:13,background:C.paper,border:`1px solid ${C.rule}`,padding:"8px 14px",color:C.ink,width:260,outline:"none"}}/>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontFamily:MONO,fontSize:10,color:C.muted}}>Sort by:</span>
            {[["mktCap","Mkt Cap"],["chg","24H %"],["price","Price"],["vol","Volume"]].map(([k,l])=>(
              <button key={k} onClick={()=>handleSort(k)}
                style={{fontFamily:SANS,fontSize:11,fontWeight:sortKey===k?700:500,
                  border:`1px solid ${sortKey===k?C.ink:C.rule}`,padding:"6px 12px",
                  background:sortKey===k?C.ink:"transparent",
                  color:sortKey===k?C.bg:C.muted}}>
                {l}{sortKey===k?(sortDir==="desc"?" ↓":" ↑"):""}
              </button>
            ))}
          </div>
        </div>

        {/* main table */}
        <div style={{border:`1px solid ${C.rule}`,background:C.paper,marginBottom:16}}>
          {/* header row */}
          <div style={{display:"grid",gridTemplateColumns:"80px 1fr 110px 90px 110px 110px 90px",gap:0,borderBottom:`2px solid ${C.ink}`,padding:"9px 16px"}}>
            {["Symbol","Company","Price","24H %","Market Cap","Volume","Sector"].map(h=>(
              <div key={h} style={{fontFamily:MONO,fontSize:9,textTransform:"uppercase",letterSpacing:".07em",color:C.muted,fontWeight:600}}>{h}</div>
            ))}
          </div>
          {filtered.slice(0,visible).map((s,i)=>{
            const up=(s.chg??0)>=0;
            const isLive=!!liveData[s.symbol];
            return (
              <div key={s.symbol} onClick={()=>{setSelected(s.symbol);fetchChart(s.symbol);}}
                style={{display:"grid",gridTemplateColumns:"80px 1fr 110px 90px 110px 110px 90px",gap:0,
                  padding:"12px 16px",borderBottom:i<filtered.slice(0,visible).length-1?`1px solid ${C.rule2}`:"none",cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background="#FFF3E5"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div>
                  <div style={{fontFamily:MONO,fontSize:13,fontWeight:700,color:C.ink}}>{s.symbol}</div>
                  {isLive&&<div style={{fontFamily:MONO,fontSize:8,color:C.green,textTransform:"uppercase",letterSpacing:".06em"}}>live</div>}
                </div>
                <div>
                  <div style={{fontFamily:SANS,fontSize:13,color:C.ink,fontWeight:500}}>{s.name}</div>
                </div>
                <div style={{fontFamily:MONO,fontSize:13,fontWeight:600,color:C.ink}}>{fmt(s.price)}</div>
                <div>
                  <div style={{fontFamily:MONO,fontSize:12,fontWeight:700,color:chgColor(s.chg)}}>{pct(s.chg)}</div>
                  <div style={{fontFamily:MONO,fontSize:10,color:chgColor(s.chgAmt)}}>{s.chgAmt>=0?"+":""}{s.chgAmt?.toFixed(2)}</div>
                </div>
                <div style={{fontFamily:MONO,fontSize:12,color:C.muted}}>{compact(s.mktCap)}</div>
                <div style={{fontFamily:MONO,fontSize:12,color:C.muted}}>{s.vol?`${(s.vol/1e6).toFixed(1)}M`:"—"}</div>
                <div style={{fontFamily:SANS,fontSize:11,color:C.muted}}>{s.sector}</div>
              </div>
            );
          })}
          {filtered.length===0&&<div style={{padding:"36px",textAlign:"center",fontFamily:MONO,fontSize:13,color:C.muted}}>No stocks match your filter.</div>}
        </div>
        {visible<filtered.length&&(
          <div style={{textAlign:"center"}}>
            <button onClick={()=>setVisible(v=>v+10)}
              style={{fontFamily:SANS,fontSize:13,fontWeight:600,border:`1px solid ${C.rule}`,padding:"10px 28px",color:C.ink,background:C.paper}}>
              Show 10 more
            </button>
          </div>
        )}
      </section>

      <Footer note="US market data via Alpha Vantage. Prices delayed 15–20 minutes on free tier."/>

      {/* detail panel */}
      {sel&&(
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",justifyContent:"flex-end"}}>
          <div onClick={()=>setSelected(null)} style={{position:"absolute",inset:0,background:"rgba(26,42,58,0.55)"}}/>
          <div style={{position:"relative",width:440,maxWidth:"92vw",height:"100%",background:C.paper,borderLeft:`2px solid ${C.ink}`,overflowY:"auto",padding:"28px 26px",animation:"slideIn .22s ease-out"}}>
            <button onClick={()=>setSelected(null)} style={{position:"absolute",top:20,right:22,fontSize:18,color:C.muted,fontFamily:MONO}}>✕</button>

            <div style={{marginBottom:16}}>
              <div style={{fontFamily:MONO,fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>{sel.sector}</div>
              <div style={{fontFamily:SERIF,fontSize:22,fontWeight:700,color:C.ink,lineHeight:1.15,marginBottom:2}}>{sel.name}</div>
              <div style={{fontFamily:MONO,fontSize:12,color:C.muted}}>{sel.symbol}</div>
            </div>

            <div style={{fontFamily:MONO,fontSize:28,fontWeight:700,color:C.ink,marginBottom:4}}>{fmt(sel.price)}</div>
            <div style={{display:"flex",gap:10,alignItems:"baseline",marginBottom:20}}>
              <span style={{fontFamily:MONO,fontSize:14,fontWeight:700,color:chgColor(sel.chg)}}>{pct(sel.chg)}</span>
              <span style={{fontFamily:MONO,fontSize:12,color:chgColor(sel.chgAmt)}}>{sel.chgAmt>=0?"+":""}{sel.chgAmt?.toFixed(2)}</span>
              <span style={{fontFamily:MONO,fontSize:10,color:C.muted}}>Today</span>
              {liveData[sel.symbol]&&<span style={{fontFamily:MONO,fontSize:9,color:C.green,textTransform:"uppercase"}}>· Live</span>}
            </div>

            {/* chart */}
            <div style={{height:180,marginBottom:22}}>
              {rdLoad?<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontFamily:MONO,fontSize:11,color:C.muted}}>Loading chart…</div>
              :chartData.length>1?(
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{top:6,right:4,left:0,bottom:0}}>
                    <defs><linearGradient id="nyseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartUp?C.green:C.red} stopOpacity={.2}/>
                      <stop offset="100%" stopColor={chartUp?C.green:C.red} stopOpacity={0}/>
                    </linearGradient></defs>
                    <XAxis dataKey="i" hide/>
                    <YAxis domain={["auto","auto"]} tick={{fill:C.muted,fontSize:10}} tickFormatter={v=>`$${v.toFixed(0)}`} width={56} axisLine={false} tickLine={false}/>
                    <Tooltip content={<ChartTip/>}/>
                    <Area type="monotone" dataKey="price" stroke={chartUp?C.green:C.red} strokeWidth={1.5} fill="url(#nyseGrad)"/>
                  </AreaChart>
                </ResponsiveContainer>
              ):<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontFamily:MONO,fontSize:11,color:C.muted}}>
                {AV_KEY?"Chart loading…":"Add AV key for 30-day chart"}
              </div>}
            </div>
            {!AV_KEY&&<div style={{fontFamily:MONO,fontSize:9,color:C.muted,textAlign:"center",marginBottom:16,marginTop:-14}}>Chart shows simulated data — add VITE_AV_KEY for real 30-day history</div>}

            {/* stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.rule,border:`1px solid ${C.rule}`,marginBottom:16}}>
              {[["Open",fmt(sel.open)],["Prev Close",fmt(sel.price-(sel.chgAmt||0))],["Day High",fmt(sel.high)],["Day Low",fmt(sel.low)],["Volume",sel.vol?`${(sel.vol/1e6).toFixed(1)}M`:"—"],["Market Cap",compact(sel.mktCap)],["P/E Ratio",sel.pe?sel.pe.toFixed(1):"N/A"],["52W High",fmt(sel.wk52h)]].map(([l,v])=>(
                <div key={l} style={{background:C.paper,padding:"11px 14px"}}>
                  <div style={{fontFamily:MONO,fontSize:9,textTransform:"uppercase",letterSpacing:".06em",color:C.muted,marginBottom:3}}>{l}</div>
                  <div style={{fontFamily:MONO,fontSize:13,fontWeight:600,color:C.ink}}>{v}</div>
                </div>
              ))}
            </div>

            {/* 52-week range bar */}
            <div style={{marginBottom:18}}>
              <div style={{fontFamily:MONO,fontSize:9,textTransform:"uppercase",letterSpacing:".07em",color:C.muted,marginBottom:8}}>52-Week Range</div>
              <div style={{display:"flex",justifyContent:"space-between",fontFamily:MONO,fontSize:11,color:C.muted,marginBottom:6}}>
                <span>{fmt(sel.wk52l)}</span><span>{fmt(sel.wk52h)}</span>
              </div>
              <div style={{height:4,background:C.rule,borderRadius:2,position:"relative"}}>
                <div style={{position:"absolute",top:"-3px",
                  left:`${Math.max(0,Math.min(100,((sel.price-sel.wk52l)/(sel.wk52h-sel.wk52l))*100))}%`,
                  transform:"translateX(-50%)",width:10,height:10,borderRadius:"50%",background:C.ink,border:`2px solid ${C.paper}`}}/>
              </div>
            </div>

            {/* description */}
            {sel.desc&&(
              <div style={{borderTop:`1px solid ${C.rule}`,paddingTop:14}}>
                <div style={{fontFamily:MONO,fontSize:9,textTransform:"uppercase",letterSpacing:".07em",color:C.muted,marginBottom:8}}>About</div>
                <p style={{fontFamily:SERIF,fontStyle:"italic",fontSize:13,color:C.muted,lineHeight:1.7}}>{sel.desc}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
