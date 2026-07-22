import { useState, useEffect, useMemo, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

// ─── helpers ────────────────────────────────────────────────────────────────
function formatPrice(n) {
  if (n == null) return "—";
  if (n >= 1000) return `$${n.toLocaleString("en-US",{maximumFractionDigits:0})}`;
  if (n >= 1)    return `$${n.toFixed(2)}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(6)}`;
}
function compactNum(n) {
  if (n == null) return "—";
  if (n >= 1e12) return `$${(n/1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `$${(n/1e9).toFixed(2)}B`;
  if (n >= 1e6)  return `$${(n/1e6).toFixed(2)}M`;
  return `$${n.toLocaleString("en-US",{maximumFractionDigits:2})}`;
}
function pct(n) { return n == null ? "—" : `${n>=0?"+":""}${n.toFixed(2)}%`; }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}) : "—"; }
function genSpark(start,end,pts=40){ return Array.from({length:pts},(_,i)=>{ const t=i/(pts-1); return Math.max(0,start+(end-start)*t+Math.sin(i*1.7)*0.012*start); }); }

const chgColor = n => n >= 0 ? C.green : C.red;

// ─── mock fallback ───────────────────────────────────────────────────────────
const MOCK = [
  { id:"bitcoin",  symbol:"btc", name:"Bitcoin",  image:"https://assets.coingecko.com/coins/images/1/large/bitcoin.png",   current_price:74842, market_cap:1470000000000, market_cap_rank:1, total_volume:32000000000, high_24h:75600, low_24h:73100, price_change_percentage_24h:2.14, circulating_supply:19780000, max_supply:21000000, ath:108200, ath_change_percentage:-30.8, ath_date:"2025-01-20T00:00:00.000Z", atl:67.81, atl_change_percentage:110200, atl_date:"2013-07-06T00:00:00.000Z", sparkline_in_7d:{price:genSpark(71500,74842,168)} },
  { id:"ethereum", symbol:"eth", name:"Ethereum", image:"https://assets.coingecko.com/coins/images/279/large/ethereum.png", current_price:3521,  market_cap:423000000000, market_cap_rank:2, total_volume:18000000000, high_24h:3580, low_24h:3440, price_change_percentage_24h:1.76, circulating_supply:120280000, max_supply:null, ath:4878, ath_change_percentage:-27.8, ath_date:"2021-11-10T00:00:00.000Z", atl:0.43, atl_change_percentage:818000, atl_date:"2015-10-20T00:00:00.000Z", sparkline_in_7d:{price:genSpark(3400,3521,168)} },
  { id:"solana",   symbol:"sol", name:"Solana",   image:"https://assets.coingecko.com/coins/images/4128/large/solana.png", current_price:182.4, market_cap:86000000000,  market_cap_rank:5, total_volume:3800000000,  high_24h:188.2,low_24h:176.5, price_change_percentage_24h:3.45, circulating_supply:471000000, max_supply:null, ath:294, ath_change_percentage:-37.9, ath_date:"2024-11-23T00:00:00.000Z", atl:0.50, atl_change_percentage:36380, atl_date:"2020-05-11T00:00:00.000Z", sparkline_in_7d:{price:genSpark(168,182.4,168)} },
  { id:"binancecoin",symbol:"bnb",name:"BNB",    image:"https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",current_price:612, market_cap:88000000000,  market_cap_rank:4, total_volume:1900000000,  high_24h:618, low_24h:598, price_change_percentage_24h:-0.62, circulating_supply:143700000, max_supply:200000000, ath:793, ath_change_percentage:-22.8, ath_date:"2024-06-05T00:00:00.000Z", atl:0.096, atl_change_percentage:637400, atl_date:"2017-10-19T00:00:00.000Z", sparkline_in_7d:{price:genSpark(620,612,168)} },
  { id:"ripple",   symbol:"xrp", name:"XRP",     image:"https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",current_price:2.18,market_cap:126000000000,market_cap_rank:6,total_volume:4200000000,high_24h:2.24,low_24h:2.09,price_change_percentage_24h:-1.34,circulating_supply:57800000000,max_supply:100000000000,ath:3.40,ath_change_percentage:-35.9,ath_date:"2025-01-16T00:00:00.000Z",atl:0.0028,atl_change_percentage:77700,atl_date:"2014-05-22T00:00:00.000Z",sparkline_in_7d:{price:genSpark(2.25,2.18,168)} },
  { id:"cardano",  symbol:"ada", name:"Cardano", image:"https://assets.coingecko.com/coins/images/975/large/cardano.png", current_price:0.72, market_cap:25800000000,  market_cap_rank:8, total_volume:780000000,   high_24h:0.745,low_24h:0.698,price_change_percentage_24h:-2.18,circulating_supply:35900000000,max_supply:45000000000,ath:3.10,ath_change_percentage:-76.8,ath_date:"2021-09-02T00:00:00.000Z",atl:0.017,atl_change_percentage:4135,atl_date:"2020-03-13T00:00:00.000Z",sparkline_in_7d:{price:genSpark(0.74,0.72,168)} },
  { id:"dogecoin", symbol:"doge",name:"Dogecoin",image:"https://assets.coingecko.com/coins/images/5/large/dogecoin.png", current_price:0.198,market_cap:29200000000,  market_cap_rank:9, total_volume:1400000000,  high_24h:0.206,low_24h:0.189,price_change_percentage_24h:4.02,circulating_supply:147500000000,max_supply:null,ath:0.732,ath_change_percentage:-72.9,ath_date:"2021-05-08T00:00:00.000Z",atl:0.00008685,atl_change_percentage:226900,atl_date:"2015-05-06T00:00:00.000Z",sparkline_in_7d:{price:genSpark(0.19,0.198,168)} },
  { id:"tron",     symbol:"trx", name:"TRON",    image:"https://assets.coingecko.com/coins/images/1094/large/tron-logo.png",current_price:0.268,market_cap:25600000000, market_cap_rank:10,total_volume:620000000,   high_24h:0.272,low_24h:0.262,price_change_percentage_24h:0.84,circulating_supply:95400000000,max_supply:null,ath:0.300,ath_change_percentage:-10.7,ath_date:"2024-12-08T00:00:00.000Z",atl:0.0017,atl_change_percentage:15670,atl_date:"2017-11-12T00:00:00.000Z",sparkline_in_7d:{price:genSpark(0.265,0.268,168)} },
  { id:"tether",   symbol:"usdt",name:"Tether",  image:"https://assets.coingecko.com/coins/images/325/large/Tether.png",  current_price:1.00, market_cap:118000000000, market_cap_rank:3, total_volume:52000000000, high_24h:1.001,low_24h:0.999,price_change_percentage_24h:0.01,circulating_supply:118000000000,max_supply:null,ath:1.32,ath_change_percentage:-24.2,ath_date:"2018-07-24T00:00:00.000Z",atl:0.57,atl_change_percentage:75.4,atl_date:"2015-03-02T00:00:00.000Z",sparkline_in_7d:{price:genSpark(1,1,168)} },
  { id:"usd-coin", symbol:"usdc",name:"USD Coin",image:"https://assets.coingecko.com/coins/images/6319/large/usdc.png",   current_price:1.00, market_cap:42000000000,  market_cap_rank:7, total_volume:6100000000,  high_24h:1.001,low_24h:0.999,price_change_percentage_24h:0.0,circulating_supply:42000000000,max_supply:null,ath:1.17,ath_change_percentage:-14.5,ath_date:"2019-05-08T00:00:00.000Z",atl:0.88,atl_change_percentage:13.6,atl_date:"2023-03-11T00:00:00.000Z",sparkline_in_7d:{price:genSpark(1,1,168)} },
];

const LIST_OPTIONS = {
  market_cap:  { label:"By Market Cap",           category:null, metric:"market_cap" },
  trending:    { label:"Trending — Biggest Move",  category:null, metric:"price_change_percentage_24h" },
  stablecoins: { label:"Stablecoins",              category:"stablecoins", metric:"market_cap" },
  defi:        { label:"DeFi",                     category:"decentralized-finance-defi", metric:"market_cap" },
  layer1:      { label:"Layer 1",                  category:"layer-1", metric:"market_cap" },
  privacy:     { label:"Privacy Coins",            category:"privacy-coins", metric:"market_cap" },
};

// ─── Sparkline (inline svg) ─────────────────────────────────────────────────
function Spark({ data, positive, w=90, h=26 }) {
  if (!data || data.length < 2) return <svg width={w} height={h}/>;
  const mn=Math.min(...data), mx=Math.max(...data), rng=mx-mn||1;
  const sx=w/(data.length-1);
  const pts=data.map((d,i)=>`${(i*sx).toFixed(1)},${(h-((d-mn)/rng)*h).toFixed(1)}`).join(" ");
  return <svg width={w} height={h} style={{display:"block"}}><polyline points={pts} fill="none" stroke={positive?C.green:C.red} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/></svg>;
}

// ─── Tooltip ────────────────────────────────────────────────────────────────
function ChartTip({ active, payload }) {
  if (!active||!payload?.length) return null;
  return <div style={{background:C.paper,border:`1px solid ${C.rule}`,padding:"6px 10px",fontFamily:MONO,fontSize:12,color:C.ink}}>{formatPrice(payload[0].value)}</div>;
}

// ─── main page ──────────────────────────────────────────────────────────────
export default function CryptoPage() {
  const [coins,  setCoins]      = useState([]);
  const [global, setGlobal]     = useState(null);
  const [loading,setLoading]    = useState(true);
  const [lastUp, setLastUp]     = useState(null);
  const [tick,   setTick]       = useState(Date.now());
  const [search, setSearch]     = useState("");
  const [listBy, setListBy]     = useState("market_cap");
  const [sortDir,setSortDir]    = useState("desc");
  const [visible,setVisible]    = useState(10);
  const [watchlist,setWatchlist]= useState(new Set());
  const [watchOnly,setWatchOnly]= useState(false);
  const [catCache,setCatCache]  = useState({});
  const [catLoad, setCatLoad]   = useState(false);
  const [selected,setSelected]  = useState(null);
  const [range,   setRange]     = useState("7D");
  const [rdCache, setRdCache]   = useState({});
  const [rdLoad,  setRdLoad]    = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [mRes,gRes] = await Promise.all([
        fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h"),
        fetch("https://api.coingecko.com/api/v3/global"),
      ]);
      const mJson=await mRes.json(), gJson=await gRes.json();
      if (Array.isArray(mJson)&&mJson.length) setCoins(mJson);
      else setCoins(p=>p.length?p:MOCK);
      if (gJson?.data) setGlobal(gJson.data);
    } catch { setCoins(p=>p.length?p:MOCK); }
    setLastUp(Date.now()); setLoading(false);
  },[]);

  useEffect(()=>{ fetchData(); const id=setInterval(fetchData,45000); return ()=>clearInterval(id); },[fetchData]);
  useEffect(()=>{ const id=setInterval(()=>setTick(Date.now()),1000); return ()=>clearInterval(id); },[]);
  useEffect(()=>{ document.body.style.overflow=selected?"hidden":""; return ()=>{document.body.style.overflow=""}; },[selected]);

  const fetchCat = useCallback(async(slug)=>{
    setCatLoad(true);
    try {
      const r=await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=${slug}&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h`);
      const j=await r.json();
      setCatCache(p=>({...p,[slug]:Array.isArray(j)&&j.length?j:p[slug]||[]}));
    } catch { } setCatLoad(false);
  },[]);

  useEffect(()=>{ const opt=LIST_OPTIONS[listBy]; if(opt.category&&!catCache[opt.category]) fetchCat(opt.category); },[listBy,catCache,fetchCat]);

  const fetchRange = useCallback(async(coinId,r)=>{
    const key=`${coinId}_${r}`; if(rdCache[key]) return;
    setRdLoad(true);
    try {
      const days=r==="24H"?1:30;
      const res=await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
      const j=await res.json();
      setRdCache(p=>({...p,[key]:(j.prices||[]).map(p=>p[1])}));
    } catch {} setRdLoad(false);
  },[rdCache]);

  const secs = lastUp ? Math.max(0,Math.floor((tick-lastUp)/1000)) : null;

  const filtered = useMemo(()=>{
    const opt=LIST_OPTIONS[listBy];
    let base = opt.category ? (catCache[opt.category]||[]) : coins;
    if (watchOnly) base=base.filter(c=>watchlist.has(c.id));
    if (search.trim()) { const q=search.toLowerCase(); base=base.filter(c=>c.name.toLowerCase().includes(q)||c.symbol.toLowerCase().includes(q)); }
    return [...base].sort((a,b)=>{ const ak=a[opt.metric]??-Infinity, bk=b[opt.metric]??-Infinity; return sortDir==="asc"?ak-bk:bk-ak; });
  },[coins,catCache,listBy,watchOnly,watchlist,search,sortDir]);

  const allCoins = useMemo(()=>[...coins,...Object.values(catCache).flat(),...MOCK],[coins,catCache]);
  const sel = selected ? allCoins.find(c=>c.id===selected) : null;

  const gainers = useMemo(()=>[...coins].sort((a,b)=>(b.price_change_percentage_24h??-999)-(a.price_change_percentage_24h??-999)).slice(0,3),[coins]);
  const losers  = useMemo(()=>[...coins].sort((a,b)=>(a.price_change_percentage_24h??999)-(b.price_change_percentage_24h??999)).slice(0,3),[coins]);

  const chartPrices = sel
    ? (range==="7D" ? (sel.sparkline_in_7d?.price||[]) : (rdCache[`${sel.id}_${range}`]||[]))
    : [];
  const chartData = chartPrices.map((p,i)=>({i,price:p}));
  const chartUp   = chartPrices.length>1 && chartPrices[chartPrices.length-1]>=chartPrices[0];

  const globalCards = global ? [
    {label:"Total Market Cap",  value:compactNum(global.total_market_cap?.usd), chg:global.market_cap_change_percentage_24h},
    {label:"24H Volume",        value:compactNum(global.total_volume?.usd)},
    {label:"BTC Dominance",     value:`${(global.market_cap_percentage?.btc??0).toFixed(1)}%`},
    {label:"ETH Dominance",     value:`${(global.market_cap_percentage?.eth??0).toFixed(1)}%`},
    {label:"Active Coins",      value:(global.active_cryptocurrencies??0).toLocaleString()},
  ] : [];

  return (
    <div style={{background:C.bg}}>
      <Nav/>

      {/* breadcrumb + header */}
      <div style={{background:C.paper, borderBottom:`1px solid ${C.rule}`, padding:"22px 28px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{fontFamily:MONO,fontSize:10,color:C.muted,letterSpacing:".06em",marginBottom:8}}>Markets / <span style={{color:C.ink}}>Cryptocurrency</span></div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
            <div>
              <h1 style={{fontFamily:SERIF,fontSize:"clamp(24px,3.5vw,38px)",fontWeight:700,color:C.ink,letterSpacing:"-.01em"}}>Cryptocurrency Markets</h1>
              <div style={{display:"flex",alignItems:"center",gap:10,marginTop:6}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:C.green,display:"inline-block",animation:"pulse 2s infinite"}}/>
                <span style={{fontFamily:MONO,fontSize:10,color:C.muted}}>Live via CoinGecko{secs!=null?` · Updated ${secs}s ago`:""}</span>
                <button onClick={fetchData} disabled={loading} style={{fontFamily:SANS,fontSize:11,fontWeight:600,color:C.blue,opacity:loading?.5:1}}>↻ Refresh</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* global stats */}
      {globalCards.length>0 && (
        <div style={{borderBottom:`1px solid ${C.rule}`,background:C.paper}}>
          <div style={{maxWidth:1200,margin:"0 auto",padding:"0 28px",display:"flex",gap:0}}>
            {globalCards.map(g=>(
              <div key={g.label} style={{padding:"12px 20px 12px 0",marginRight:20,borderRight:`1px solid ${C.rule}`,flexShrink:0}}>
                <div style={{fontFamily:MONO,fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{g.label}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                  <span style={{fontFamily:MONO,fontSize:13,fontWeight:600,color:C.ink}}>{g.value}</span>
                  {g.chg!=null&&<span style={{fontFamily:MONO,fontSize:11,fontWeight:700,color:chgColor(g.chg)}}>{pct(g.chg)}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* top movers */}
      {coins.length>0 && (
        <section style={{maxWidth:1200,margin:"0 auto",padding:"28px 28px 0"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:28}}>
            {[{label:"Top Gainers",list:gainers,color:C.green},{label:"Top Losers",list:losers,color:C.red}].map(({label,list,color})=>(
              <div key={label} style={{border:`1px solid ${C.rule}`,background:C.paper}}>
                <div style={{fontFamily:MONO,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color,padding:"10px 14px",borderBottom:`1px solid ${C.rule}`}}>{label} · 24H</div>
                {list.map(c=>(
                  <div key={c.id} onClick={()=>setSelected(c.id)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderBottom:`1px solid ${C.rule2}`,cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#FFF3E5"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <img src={c.image} alt={c.name} style={{width:20,height:20,borderRadius:"50%"}}/>
                      <span style={{fontFamily:SANS,fontSize:13,fontWeight:600,color:C.ink}}>{c.name}</span>
                      <span style={{fontFamily:MONO,fontSize:10,color:C.muted}}>{c.symbol.toUpperCase()}</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:MONO,fontSize:12,color:C.ink}}>{formatPrice(c.current_price)}</div>
                      <div style={{fontFamily:MONO,fontSize:11,fontWeight:700,color}}>{pct(c.price_change_percentage_24h)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* main table */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"0 28px 60px"}}>
        {/* toolbar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:14}}>
          <input value={search} onChange={e=>{setSearch(e.target.value);setVisible(10);}}
            placeholder="Search by name or symbol…"
            style={{fontFamily:SANS,fontSize:13,background:C.paper,border:`1px solid ${C.rule}`,padding:"8px 14px",color:C.ink,width:230,outline:"none"}}/>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <select value={listBy} onChange={e=>{setListBy(e.target.value);setSortDir("desc");setVisible(10);}}
              style={{fontFamily:SANS,fontSize:12,background:C.paper,border:`1px solid ${C.rule}`,padding:"8px 12px",color:C.ink,outline:"none"}}>
              <optgroup label="Sort"><option value="market_cap">Market Cap</option><option value="trending">Trending (Biggest % Move)</option></optgroup>
              <optgroup label="Category"><option value="stablecoins">Stablecoins</option><option value="defi">DeFi</option><option value="layer1">Layer 1</option><option value="privacy">Privacy Coins</option></optgroup>
            </select>
            <button onClick={()=>setSortDir(d=>d==="asc"?"desc":"asc")} style={{fontFamily:SANS,fontSize:12,fontWeight:600,border:`1px solid ${C.rule}`,padding:"8px 14px",color:C.ink,background:C.paper}}>
              {sortDir==="desc"?"High → Low":"Low → High"}
            </button>
            <button onClick={()=>{setWatchOnly(w=>!w);setVisible(10);}} style={{fontFamily:SANS,fontSize:12,fontWeight:600,border:`1px solid ${watchOnly?C.ink:C.rule}`,padding:"8px 14px",color:watchOnly?C.bg:C.muted,background:watchOnly?C.ink:C.paper}}>
              ★ Watchlist{watchlist.size>0?` (${watchlist.size})`:""}
            </button>
          </div>
        </div>
        {catLoad&&<div style={{fontFamily:MONO,fontSize:11,color:C.muted,marginBottom:8}}>Loading category…</div>}

        {/* ledger table */}
        <div style={{border:`1px solid ${C.rule}`,background:C.paper}}>
          <table style={{width:"100%"}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${C.ink}`}}>
                {["#","Coin","Price","24H %","7D Chart","Market Cap","Volume (24H)",""].map(h=>(
                  <th key={h} style={{fontFamily:MONO,fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:".08em",padding:"10px 14px",textAlign:"left",fontWeight:600,background:C.paper}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0,visible).map((c,i)=>{
                const up=(c.price_change_percentage_24h??0)>=0;
                const spark=(c.sparkline_in_7d?.price||[]).filter((_,idx)=>idx%4===0);
                return (
                  <tr key={c.id} onClick={()=>setSelected(c.id)} style={{borderBottom:`1px solid ${C.rule2}`,cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#FFF3E5"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{fontFamily:MONO,fontSize:12,color:C.muted,padding:"12px 14px"}}>{c.market_cap_rank||"—"}</td>
                    <td style={{padding:"12px 14px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <img src={c.image} alt={c.name} style={{width:22,height:22,borderRadius:"50%"}}/>
                        <span style={{fontFamily:SANS,fontSize:13,fontWeight:600,color:C.ink}}>{c.name}</span>
                        <span style={{fontFamily:MONO,fontSize:10,color:C.muted}}>{c.symbol.toUpperCase()}</span>
                      </div>
                    </td>
                    <td style={{fontFamily:MONO,fontSize:13,fontWeight:600,color:C.ink,padding:"12px 14px"}}>{formatPrice(c.current_price)}</td>
                    <td style={{fontFamily:MONO,fontSize:13,fontWeight:700,color:chgColor(c.price_change_percentage_24h),padding:"12px 14px"}}>{pct(c.price_change_percentage_24h)}</td>
                    <td style={{padding:"12px 14px"}}><Spark data={spark} positive={up}/></td>
                    <td style={{fontFamily:MONO,fontSize:12,color:C.muted,padding:"12px 14px"}}>{compactNum(c.market_cap)}</td>
                    <td style={{fontFamily:MONO,fontSize:12,color:C.muted,padding:"12px 14px"}}>{compactNum(c.total_volume)}</td>
                    <td style={{padding:"12px 14px"}}>
                      <button onClick={e=>{e.stopPropagation();setWatchlist(w=>{const n=new Set(w);n.has(c.id)?n.delete(c.id):n.add(c.id);return n;})}}
                        style={{fontSize:16,color:watchlist.has(c.id)?C.amber:C.dim}}>{watchlist.has(c.id)?"★":"☆"}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0&&<div style={{textAlign:"center",padding:40,fontFamily:MONO,fontSize:13,color:C.muted}}>No coins match your filter.</div>}
        </div>
        {visible<filtered.length&&(
          <div style={{textAlign:"center",marginTop:18}}>
            <button onClick={()=>setVisible(v=>v+10)} style={{fontFamily:SANS,fontSize:13,fontWeight:600,border:`1px solid ${C.rule}`,padding:"10px 28px",color:C.ink,background:C.paper}}>
              Show 10 more
            </button>
          </div>
        )}
      </section>

      <Footer />

      {/* detail panel */}
      {sel && (
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",justifyContent:"flex-end"}}>
          <div onClick={()=>setSelected(null)} style={{position:"absolute",inset:0,background:"rgba(26,42,58,0.55)"}}/>
          <div style={{position:"relative",width:420,maxWidth:"92vw",height:"100%",background:C.paper,borderLeft:`2px solid ${C.ink}`,overflowY:"auto",padding:"28px 26px",animation:"slideIn .22s ease-out"}}>
            <button onClick={()=>setSelected(null)} style={{position:"absolute",top:20,right:22,fontSize:18,color:C.muted,fontFamily:MONO}}>✕</button>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <img src={sel.image} alt={sel.name} style={{width:40,height:40,borderRadius:"50%"}}/>
              <div>
                <div style={{fontFamily:SERIF,fontSize:20,fontWeight:700,color:C.ink}}>{sel.name} <span style={{fontFamily:MONO,fontSize:12,color:C.muted,fontWeight:400}}>{sel.symbol.toUpperCase()}</span></div>
                <div style={{fontFamily:MONO,fontSize:10,color:C.muted}}>Rank #{sel.market_cap_rank||"—"}</div>
              </div>
              <button onClick={()=>setWatchlist(w=>{const n=new Set(w);n.has(sel.id)?n.delete(sel.id):n.add(sel.id);return n;})} style={{marginLeft:"auto",fontSize:22,color:watchlist.has(sel.id)?C.amber:C.dim}}>{watchlist.has(sel.id)?"★":"☆"}</button>
            </div>
            <div style={{fontFamily:MONO,fontSize:28,fontWeight:700,color:C.ink,marginBottom:4}}>{formatPrice(sel.current_price)}</div>
            <div style={{fontFamily:MONO,fontSize:13,fontWeight:700,color:chgColor(sel.price_change_percentage_24h??0),marginBottom:18}}>{pct(sel.price_change_percentage_24h)} · 24H</div>

            {/* range tabs */}
            <div style={{display:"flex",gap:6,marginBottom:12,borderBottom:`1px solid ${C.rule}`,paddingBottom:12}}>
              {["24H","7D","30D"].map(r=>(
                <button key={r} onClick={()=>{setRange(r);if(r!=="7D")fetchRange(sel.id,r);}}
                  style={{fontFamily:MONO,fontSize:11,fontWeight:700,border:`1px solid ${range===r?C.ink:C.rule}`,padding:"5px 14px",background:range===r?C.ink:"transparent",color:range===r?C.bg:C.muted}}>
                  {r}
                </button>
              ))}
            </div>

            {/* chart */}
            <div style={{height:180,marginBottom:22}}>
              {rdLoad ? <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontFamily:MONO,fontSize:11,color:C.muted}}>Loading…</div>
              : chartData.length>1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{top:6,right:4,left:0,bottom:0}}>
                    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartUp?C.green:C.red} stopOpacity={.25}/>
                      <stop offset="100%" stopColor={chartUp?C.green:C.red} stopOpacity={0}/>
                    </linearGradient></defs>
                    <XAxis dataKey="i" hide/>
                    <YAxis domain={["auto","auto"]} tick={{fill:C.muted,fontSize:10}} tickFormatter={formatPrice} width={60} axisLine={false} tickLine={false}/>
                    <Tooltip content={<ChartTip/>}/>
                    <Area type="monotone" dataKey="price" stroke={chartUp?C.green:C.red} strokeWidth={1.5} fill="url(#g)"/>
                  </AreaChart>
                </ResponsiveContainer>
              ) : <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontFamily:MONO,fontSize:11,color:C.muted}}>No data</div>}
            </div>

            {/* stats grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.rule,border:`1px solid ${C.rule}`,marginBottom:18}}>
              {[
                ["Market Cap",compactNum(sel.market_cap)],
                ["24H Volume",compactNum(sel.total_volume)],
                ["24H High",formatPrice(sel.high_24h)],
                ["24H Low",formatPrice(sel.low_24h)],
                ["Circulating Supply",sel.circulating_supply?`${(sel.circulating_supply/1e6).toFixed(2)}M ${sel.symbol.toUpperCase()}`:"—"],
                ["Max Supply",sel.max_supply?`${(sel.max_supply/1e6).toFixed(2)}M ${sel.symbol.toUpperCase()}`:"No cap"],
              ].map(([l,v])=>(
                <div key={l} style={{background:C.paper,padding:"12px 14px"}}>
                  <div style={{fontFamily:MONO,fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>{l}</div>
                  <div style={{fontFamily:MONO,fontSize:13,fontWeight:600,color:C.ink}}>{v}</div>
                </div>
              ))}
            </div>

            {/* ATH / ATL */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.rule,border:`1px solid ${C.rule}`}}>
              {[["All-Time High",sel.ath,sel.ath_change_percentage,sel.ath_date],["All-Time Low",sel.atl,sel.atl_change_percentage,sel.atl_date]].map(([l,val,chg,dt])=>(
                <div key={l} style={{background:C.paper,padding:"12px 14px"}}>
                  <div style={{fontFamily:MONO,fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>{l}</div>
                  <div style={{fontFamily:MONO,fontSize:14,fontWeight:700,color:C.ink}}>{formatPrice(val)}</div>
                  <div style={{fontFamily:MONO,fontSize:11,fontWeight:700,color:chgColor(chg??0),marginTop:2}}>{pct(chg)}</div>
                  <div style={{fontFamily:MONO,fontSize:10,color:C.muted,marginTop:2}}>{fmtDate(dt)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
