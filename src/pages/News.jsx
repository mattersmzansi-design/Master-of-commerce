import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const CATEGORIES = ["JSE","NYSE","Crypto","SA Economy","Global"];

const CAT_STYLE = {
  "JSE":        { color:C.green,  border:"1px solid #1F5C4B" },
  "NYSE":       { color:C.blue,   border:"1px solid #1A3F7A" },
  "Crypto":     { color:"#6B21A8",border:"1px solid #6B21A8" },
  "SA Economy": { color:C.red,    border:"1px solid #A6402E" },
  "Global":     { color:C.amber,  border:"1px solid #8C5F00" },
};

const ARTICLES = [
  { id:1,  cat:"SA Economy", featured:true,
    title:"SARB Holds Rate Steady at 8.25% as Rand Strengthens on Improving Current Account",
    dek:"The Monetary Policy Committee voted 5–2 to hold, with the minority advocating a 25bp cut. Governor Kganyago cited persistent services inflation and global uncertainty as reasons for caution.",
    src:"Reuters", time:"1h ago", read:"5 min" },
  { id:2,  cat:"JSE",
    title:"Naspers Reports Strong H1 as Tencent Stake Recovers",
    dek:"First-half headline earnings per share rose 18% year-on-year, beating consensus estimates by a wide margin as the group's Tencent holding recovered sharply.",
    src:"Business Day", time:"2h ago", read:"3 min" },
  { id:3,  cat:"Crypto",
    title:"Bitcoin Breaks $75,000 — Institutional Demand Hits New Record",
    dek:"Spot ETF inflows logged their largest weekly total on record, with pension and sovereign wealth funds accounting for the lion's share of fresh allocations.",
    src:"CoinDesk", time:"5h ago", read:"4 min" },
  { id:4,  cat:"NYSE",
    title:"NVIDIA Hits All-Time High as AI Chip Backlog Extends to 18 Months",
    dek:"The chipmaker guided for record data-centre revenue in the coming quarter. Analysts raised 12-month price targets by an average of 12% following the announcement.",
    src:"Bloomberg", time:"8h ago", read:"4 min" },
  { id:5,  cat:"Global",
    title:"Fed Minutes Show Growing Policy Split Over Pace of Rate Cuts",
    dek:"Several committee members flagged sticky services inflation and a resilient labour market as reasons to proceed cautiously with any easing cycle.",
    src:"Reuters", time:"10h ago", read:"5 min" },
  { id:6,  cat:"JSE",
    title:"MTN Group Extends Mobile Banking Push Into Three New African Markets",
    dek:"MoMo now operates across 11 African markets after the group completed its latest rollout, with management targeting 50 million registered users by year-end.",
    src:"Fin24", time:"12h ago", read:"3 min" },
  { id:7,  cat:"SA Economy",
    title:"Load Shedding Risk Falls to Two-Year Low, Eskom Reports",
    dek:"Improved generation capacity and forward maintenance scheduling have sharply cut the probability of stage 2 interruptions or higher over the coming 90-day period.",
    src:"BusinessTech", time:"14h ago", read:"3 min" },
  { id:8,  cat:"Crypto",
    title:"Ethereum Layer-2 Transaction Volumes Overtake Mainnet for First Time",
    dek:"Combined throughput across major rollup networks exceeded the Ethereum base layer for the first time this year, marking a milestone for the scaling roadmap.",
    src:"CoinDesk", time:"16h ago", read:"4 min" },
  { id:9,  cat:"NYSE",
    title:"JPMorgan Raises Quarterly Dividend After Strong Fixed-Income Trading",
    dek:"Robust trading revenue across fixed income and equities gave the bank room to lift its payout for the third consecutive year.",
    src:"CNBC", time:"18h ago", read:"3 min" },
  { id:10, cat:"Global",
    title:"Oil Prices Slip as OPEC+ Weighs Modest Output Increase Next Quarter",
    dek:"Crude futures eased after reports that several member states are pushing for a small supply hike, citing stronger-than-expected demand recovery.",
    src:"Bloomberg", time:"20h ago", read:"3 min" },
  { id:11, cat:"SA Economy",
    title:"Treasury Trims Borrowing Forecast on Stronger-Than-Expected Tax Receipts",
    dek:"Higher corporate tax collections gave the National Treasury room to revise its funding needs lower in the mid-term update, easing pressure on bond markets.",
    src:"Moneyweb", time:"22h ago", read:"4 min" },
  { id:12, cat:"JSE",
    title:"Shoprite Lifts Full-Year Guidance on Resilient Grocery Sales",
    dek:"The retailer cited market share gains and steady consumer spending despite a tighter household budget environment across its key Southern African trading regions.",
    src:"Moneyweb", time:"1d ago", read:"3 min" },
];

const TRENDING = ["Interest Rates","Bitcoin ETF","Load Shedding","AI Stocks","Rand","Mining Sector","Fed Policy","Stablecoins","Eskom","JSE Earnings"];

const SNAPSHOT = [
  { label:"JSE All Share", value:"84,234", chg:1.34 },
  { label:"NYSE Composite",value:"19,872", chg:0.89 },
];

export default function NewsPage() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [visible,  setVisible]  = useState(6);
  const [coins,    setCoins]    = useState([]);

  useEffect(()=>{
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=false&price_change_percentage=24h")
      .then(r=>r.json()).then(d=>Array.isArray(d)&&setCoins(d)).catch(()=>{});
  },[]);

  const featured   = ARTICLES.find(a=>a.featured);
  const rest       = ARTICLES.filter(a=>!a.featured);

  const filtered = useMemo(()=>{
    let base = category==="All" ? rest : rest.filter(a=>a.cat===category);
    if (search.trim()) {
      const q=search.toLowerCase();
      base=base.filter(a=>a.title.toLowerCase().includes(q)||a.dek.toLowerCase().includes(q));
    }
    return base;
  },[rest, category, search]);

  const showFeatured = category==="All" && !search.trim();
  const visible6 = filtered.slice(0,visible);

  const handleTag = (tag) => { setSearch(tag); setCategory("All"); setVisible(6); };

  const catColor = (cat) => CAT_STYLE[cat]?.color || C.muted;

  return (
    <div style={{background:C.bg}}>
      <Nav/>

      {/* page header */}
      <div style={{background:C.paper,borderBottom:`2px solid ${C.ink}`,padding:"22px 28px 0"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{fontFamily:MONO,fontSize:10,color:C.muted,letterSpacing:".06em",marginBottom:10}}>
            News / <span style={{color:C.ink}}>Business News</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12,marginBottom:0}}>
            <h1 style={{fontFamily:SERIF,fontSize:"clamp(24px,3.5vw,38px)",fontWeight:700,color:C.ink,letterSpacing:"-.01em"}}>
              Business News
            </h1>
            <div style={{fontFamily:MONO,fontSize:10,color:C.muted}}>
              Stories updated throughout the trading day
            </div>
          </div>
          {/* category strip */}
          <div style={{display:"flex",gap:0,marginTop:16}}>
            {["All",...CATEGORIES].map(c=>(
              <button key={c} onClick={()=>{setCategory(c);setVisible(6);}}
                style={{fontFamily:SANS,fontSize:12,fontWeight:category===c?700:500,
                  color:category===c?C.ink:C.muted,
                  padding:"9px 16px",background:"none",
                  borderBottom:category===c?`2px solid ${C.ink}`:"2px solid transparent",
                  marginBottom:"-2px",whiteSpace:"nowrap"}}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* body */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"32px 28px 60px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:40,alignItems:"start"}}>

          {/* main column */}
          <div>
            {/* search */}
            <div style={{marginBottom:24}}>
              <input value={search} onChange={e=>{setSearch(e.target.value);setVisible(6);}}
                placeholder="Search stories…"
                style={{fontFamily:SANS,fontSize:13,background:C.paper,border:`1px solid ${C.rule}`,borderRadius:0,padding:"10px 16px",color:C.ink,width:"100%",maxWidth:320,outline:"none"}}/>
            </div>

            {/* featured story */}
            {showFeatured && featured && (
              <div style={{borderTop:`2px solid ${C.ink}`,borderBottom:`1px solid ${C.rule}`,paddingTop:22,paddingBottom:22,marginBottom:22,display:"grid",gridTemplateColumns:"1fr 1fr",gap:32}}>
                <div>
                  <div style={{fontFamily:MONO,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:C.red,marginBottom:10}}>
                    Featured · {featured.cat}
                  </div>
                  <h2 style={{fontFamily:SERIF,fontSize:"clamp(20px,2.5vw,30px)",fontWeight:700,color:C.ink,lineHeight:1.15,letterSpacing:"-.01em",marginBottom:12}}>
                    {featured.title}
                  </h2>
                  <div style={{display:"flex",gap:12,fontFamily:MONO,fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:".07em"}}>
                    <span>{featured.src}</span><span>·</span><span>{featured.time}</span><span>·</span><span>{featured.read} read</span>
                  </div>
                </div>
                <div>
                  <p style={{fontFamily:SERIF,fontStyle:"italic",fontSize:16,lineHeight:1.7,color:C.muted}}>
                    {featured.dek}
                  </p>
                  <Link to="/news" style={{display:"inline-block",marginTop:14,fontFamily:SANS,fontSize:12,fontWeight:600,color:C.blue}}>Read full story →</Link>
                </div>
              </div>
            )}

            {/* article grid — newspaper 2-col */}
            {visible6.length === 0 ? (
              <div style={{padding:"40px 0",fontFamily:MONO,fontSize:13,color:C.muted}}>No stories match your search.</div>
            ) : (
              <div>
                {/* first 2 — big */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.rule,border:`1px solid ${C.rule}`,marginBottom:1}}>
                  {visible6.slice(0,2).map(a=>(
                    <ArticleCard key={a.id} article={a} size="large" catColor={catColor(a.cat)}/>
                  ))}
                </div>
                {/* remaining — 3-col */}
                {visible6.length > 2 && (
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:C.rule,border:`1px solid ${C.rule}`}}>
                    {visible6.slice(2).map(a=>(
                      <ArticleCard key={a.id} article={a} size="small" catColor={catColor(a.cat)}/>
                    ))}
                  </div>
                )}
              </div>
            )}

            {visible < filtered.length && (
              <div style={{textAlign:"center",marginTop:20}}>
                <button onClick={()=>setVisible(v=>v+6)}
                  style={{fontFamily:SANS,fontSize:13,fontWeight:600,border:`1px solid ${C.rule}`,padding:"10px 28px",color:C.ink,background:C.paper}}>
                  Load more stories
                </button>
              </div>
            )}
          </div>

          {/* sidebar */}
          <aside style={{display:"flex",flexDirection:"column",gap:22}}>

            {/* live markets widget */}
            <div style={{border:`1px solid ${C.rule}`,background:C.paper}}>
              <div style={{fontFamily:SERIF,fontSize:15,fontWeight:700,color:C.ink,padding:"12px 16px",borderBottom:`1px solid ${C.rule}`,display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:C.green,display:"inline-block",animation:"pulse 2s infinite"}}/>
                Live Market Snapshot
              </div>
              {SNAPSHOT.map(s=>(
                <div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"10px 16px",borderBottom:`1px solid ${C.rule2}`}}>
                  <span style={{fontFamily:SANS,fontSize:12,fontWeight:600,color:C.ink}}>{s.label}</span>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:MONO,fontSize:12,color:C.ink}}>{s.value}</div>
                    <div style={{fontFamily:MONO,fontSize:11,fontWeight:700,color:s.chg>=0?C.green:C.red}}>{s.chg>=0?"+":""}{s.chg.toFixed(2)}%</div>
                  </div>
                </div>
              ))}
              {coins.map(c=>(
                <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:`1px solid ${C.rule2}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <img src={c.image} alt={c.name} style={{width:16,height:16,borderRadius:"50%"}}/>
                    <span style={{fontFamily:MONO,fontSize:11,fontWeight:600,color:C.ink}}>{c.symbol.toUpperCase()}</span>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:MONO,fontSize:11,color:C.ink}}>
                      ${c.current_price>=1000
                        ? c.current_price.toLocaleString("en-US",{maximumFractionDigits:0})
                        : c.current_price.toFixed(2)}
                    </div>
                    <div style={{fontFamily:MONO,fontSize:10,fontWeight:700,color:(c.price_change_percentage_24h??0)>=0?C.green:C.red}}>
                      {(c.price_change_percentage_24h??0)>=0?"+":""}{(c.price_change_percentage_24h??0).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
              <div style={{padding:"10px 16px"}}>
                <Link to="/crypto" style={{fontFamily:SANS,fontSize:12,fontWeight:600,color:C.blue}}>Full crypto market →</Link>
              </div>
            </div>

            {/* trending topics */}
            <div style={{border:`1px solid ${C.rule}`,background:C.paper}}>
              <div style={{fontFamily:SERIF,fontSize:15,fontWeight:700,color:C.ink,padding:"12px 16px",borderBottom:`1px solid ${C.rule}`}}>Trending Topics</div>
              <div style={{padding:"14px 16px",display:"flex",flexWrap:"wrap",gap:8}}>
                {TRENDING.map(tag=>(
                  <button key={tag} onClick={()=>handleTag(tag)}
                    style={{fontFamily:SANS,fontSize:11,fontWeight:500,border:`1px solid ${C.rule}`,padding:"5px 12px",color:C.muted,background:"transparent"}}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* editorial note */}
            <div style={{border:`1px solid ${C.rule}`,background:C.paper,padding:"14px 16px"}}>
              <div style={{fontFamily:MONO,fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Editorial Note</div>
              <p style={{fontFamily:SERIF,fontStyle:"italic",fontSize:12,color:C.muted,lineHeight:1.65}}>
                These stories are curated examples. Live wire integration via NewsAPI is planned for Phase 3, once we have a backend to keep the API key secure.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

function ArticleCard({ article, size, catColor }) {
  const isLarge = size === "large";
  return (
    <div style={{background:C.paper,padding: isLarge ? "20px 22px" : "16px 18px",cursor:"pointer"}}
      onMouseEnter={e=>e.currentTarget.style.background="#FFF3E5"}
      onMouseLeave={e=>e.currentTarget.style.background=C.paper}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:isLarge?10:8}}>
        <span style={{fontFamily:MONO,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:catColor}}>{article.cat}</span>
        <span style={{fontFamily:MONO,fontSize:9,color:C.muted}}>{article.time}</span>
      </div>
      <h3 style={{fontFamily:SERIF,fontSize:isLarge?16:14,fontWeight:600,lineHeight:1.3,color:C.ink,marginBottom:isLarge?10:8}}>
        {article.title}
      </h3>
      {isLarge && <p style={{fontFamily:SANS,fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:10}}>{article.dek}</p>}
      <div style={{display:"flex",gap:10,fontFamily:MONO,fontSize:9,color:C.dim,textTransform:"uppercase",letterSpacing:".06em"}}>
        <span>{article.src}</span><span>·</span><span>{article.read} read</span>
      </div>
    </div>
  );
}
