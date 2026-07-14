import { Link } from "react-router-dom";
import { C, SERIF, MONO, SANS } from "../../theme";

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

export default function NewsWidget() {
  const featuredArticle = NEWS.find(a => a.featured);
  const sideArticles = NEWS.filter(a => !a.featured).slice(0, 3);
  const bottomArticles = NEWS.filter(a => !a.featured).slice(3);

  return (
    <section style={{ maxWidth:1200, margin:"0 auto", padding:"36px 28px", borderBottom:`1px solid ${C.rule}` }}>
      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:36, alignItems:"start" }}>
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

        <div>
          <div style={{ fontFamily:MONO, fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", fontWeight:700, marginBottom:14, paddingBottom:8, borderBottom:`1px solid ${C.rule}` }}>Also in Today's Brief</div>
          {sideArticles.map((a, i) => (
            <div key={a.id} style={{ paddingBottom:14, marginBottom:14, borderBottom: i < sideArticles.length - 1 ? `1px solid ${C.rule2}` : "none" }}>
              <div style={{ fontFamily:MONO, fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>{a.cat} · {a.time}</div>
              <h3 style={{ fontFamily:SERIF, fontSize:15, fontWeight:600, lineHeight:1.35, color:C.ink, marginBottom:5 }}>{a.title}</h3>
              <p style={{ fontFamily:SANS, fontSize:12, color:C.muted, lineHeight:1.55 }}>{a.dek}</p>
            </div>
          ))}
          <Link to="/news" style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:C.blue }}>All business news →</Link>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, paddingTop:28, paddingBottom:28, marginTop:12, borderTop:`1px solid ${C.rule}` }}>
        {bottomArticles.map(a => (
          <div key={a.id}>
            <div style={{ fontFamily:MONO, fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>{a.cat} · {a.time}</div>
            <h4 style={{ fontFamily:SERIF, fontSize:14, fontWeight:600, lineHeight:1.35, color:C.ink, marginBottom:4 }}>{a.title}</h4>
            <p style={{ fontFamily:SANS, fontSize:12, color:C.muted, lineHeight:1.55 }}>{a.dek.slice(0, 90)}…</p>
          </div>
        ))}
      </div>
    </section>
  );
}
