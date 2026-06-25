import { useState, useMemo } from "react";
import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

// ─── data ────────────────────────────────────────────────────────────────────

const EVENTS = [
  // TODAY
  { id:1,  group:"Today",       date:"Mon 23 Jun", time:"08:00", flag:"🇿🇦", country:"ZA", event:"SA Inflation Rate (May)",              category:"Inflation",      impact:"high",   prev:"4.7%",  forecast:"4.8%",  actual:"4.9%",   note:"CPI came in above forecast, driven by food and fuel prices. The rand weakened slightly on the print." },
  { id:2,  group:"Today",       date:"Mon 23 Jun", time:"10:30", flag:"🇿🇦", country:"ZA", event:"SA Retail Sales (Apr)",                category:"Retail",         impact:"medium", prev:"-0.8%", forecast:"0.4%",  actual:"0.6%",   note:"Retail sales bounced back in April as fuel prices eased and consumer confidence improved marginally." },
  { id:3,  group:"Today",       date:"Mon 23 Jun", time:"14:30", flag:"🇺🇸", country:"US", event:"US Building Permits (May)",            category:"Housing",        impact:"medium", prev:"1.44M", forecast:"1.42M", actual:"1.39M",  note:"Permits fell short of expectations as higher mortgage rates continue to dampen new construction activity." },
  { id:4,  group:"Today",       date:"Mon 23 Jun", time:"16:00", flag:"🇺🇸", country:"US", event:"US Existing Home Sales (May)",         category:"Housing",        impact:"medium", prev:"4.02M", forecast:"4.10M", actual:null,     note:"Expected to tick higher as spring buying season lifts transaction volumes across most major metro areas." },

  // TOMORROW
  { id:5,  group:"Tomorrow",    date:"Tue 24 Jun", time:"09:00", flag:"🇪🇺", country:"EU", event:"Eurozone Manufacturing PMI (Jun)",     category:"PMI",            impact:"high",   prev:"49.4",  forecast:"49.8",  actual:null,     note:"Manufacturing has contracted for three consecutive months. A reading above 50 would signal a return to expansion." },
  { id:6,  group:"Tomorrow",    date:"Tue 24 Jun", time:"09:30", flag:"🇬🇧", country:"UK", event:"UK CPI (May)",                         category:"Inflation",      impact:"high",   prev:"2.3%",  forecast:"2.0%",  actual:null,     note:"A drop to target would significantly increase the probability of a BOE rate cut at the next meeting." },
  { id:7,  group:"Tomorrow",    date:"Tue 24 Jun", time:"14:30", flag:"🇺🇸", country:"US", event:"US Durable Goods Orders (May)",        category:"Manufacturing",  impact:"medium", prev:"0.7%",  forecast:"0.3%",  actual:null,     note:"Defence orders expected to weigh on the headline, while core capital goods orders may show underlying strength." },
  { id:8,  group:"Tomorrow",    date:"Tue 24 Jun", time:"16:00", flag:"🇺🇸", country:"US", event:"US Consumer Confidence (Jun)",         category:"Consumer",       impact:"medium", prev:"97.5",  forecast:"99.0",  actual:null,     note:"The Conference Board index has been range-bound as households balance job security optimism against inflation concerns." },
  { id:9,  group:"Tomorrow",    date:"Tue 24 Jun", time:"17:00", flag:"🇿🇦", country:"ZA", event:"SARB MPC Minutes Release",             category:"Interest Rates", impact:"high",   prev:"8.25%", forecast:"—",     actual:null,     note:"Markets will parse the minutes for any hints about the timing of the first rate cut, expected later this year." },

  // THIS WEEK
  { id:10, group:"This Week",   date:"Wed 25 Jun", time:"09:00", flag:"🇩🇪", country:"DE", event:"German Ifo Business Climate (Jun)",   category:"Sentiment",      impact:"medium", prev:"89.3",  forecast:"89.7",  actual:null,     note:"German business confidence has been subdued. A surprise to the upside could lift the euro and European equities." },
  { id:11, group:"This Week",   date:"Wed 25 Jun", time:"14:30", flag:"🇺🇸", country:"US", event:"US GDP Growth Rate Q1 (Final)",       category:"GDP",            impact:"high",   prev:"1.6%",  forecast:"1.4%",  actual:null,     note:"The final Q1 read is expected to confirm a slowdown. Focus will shift quickly to early Q2 indicators." },
  { id:12, group:"This Week",   date:"Wed 25 Jun", time:"16:30", flag:"🇺🇸", country:"US", event:"US EIA Crude Oil Inventories",        category:"Commodities",    impact:"medium", prev:"-2.1M", forecast:"-1.5M", actual:null,     note:"A larger-than-expected draw would support oil prices. SA fuel price implications are closely watched." },
  { id:13, group:"This Week",   date:"Thu 26 Jun", time:"08:00", flag:"🇿🇦", country:"ZA", event:"SA Producer Price Index (May)",       category:"Inflation",      impact:"medium", prev:"4.2%",  forecast:"4.5%",  actual:null,     note:"Factory gate prices are a leading indicator for future consumer inflation. A high print could worry the SARB." },
  { id:14, group:"This Week",   date:"Thu 26 Jun", time:"09:00", flag:"🇪🇺", country:"EU", event:"Eurozone Consumer Confidence (Jun)", category:"Consumer",       impact:"medium", prev:"-14.0", forecast:"-13.0", actual:null,     note:"Eurozone consumers remain cautious as the interest rate environment weighs on disposable income." },
  { id:15, group:"This Week",   date:"Thu 26 Jun", time:"14:30", flag:"🇺🇸", country:"US", event:"US Initial Jobless Claims",           category:"Employment",     impact:"high",   prev:"229K",  forecast:"225K",  actual:null,     note:"Claims have remained historically low. A sharp rise would be one of the first signals of labour market softening." },
  { id:16, group:"This Week",   date:"Thu 26 Jun", time:"14:30", flag:"🇺🇸", country:"US", event:"US PCE Price Index (May)",            category:"Inflation",      impact:"high",   prev:"2.7%",  forecast:"2.6%",  actual:null,     note:"The Fed's preferred inflation gauge. A downside surprise could unlock September cut expectations." },
  { id:17, group:"This Week",   date:"Fri 27 Jun", time:"10:00", flag:"🇿🇦", country:"ZA", event:"SA Trade Balance (May)",             category:"Trade",          impact:"medium", prev:"R8.9B", forecast:"R7.2B", actual:null,     note:"Commodity export weakness in May is likely to narrow the surplus compared to April's strong reading." },
  { id:18, group:"This Week",   date:"Fri 27 Jun", time:"14:30", flag:"🇨🇦", country:"CA", event:"Canada GDP (Apr)",                   category:"GDP",            impact:"medium", prev:"0.4%",  forecast:"0.3%",  actual:null,     note:"Canadian growth expected to moderate after a strong start to the year." },

  // NEXT WEEK
  { id:19, group:"Next Week",   date:"Mon 30 Jun", time:"08:00", flag:"🇿🇦", country:"ZA", event:"SA PMI (Jun)",                       category:"PMI",            impact:"medium", prev:"50.2",  forecast:"50.4",  actual:null,     note:"South African manufacturing activity has been hovering near the expansion-contraction line. Load shedding remains a key constraint." },
  { id:20, group:"Next Week",   date:"Mon 30 Jun", time:"09:00", flag:"🇪🇺", country:"EU", event:"Eurozone CPI Flash (Jun)",           category:"Inflation",      impact:"high",   prev:"2.6%",  forecast:"2.5%",  actual:null,     note:"Flash estimate for June inflation. Any surprise to the upside could push ECB cut expectations into late Q3." },
  { id:21, group:"Next Week",   date:"Tue 1 Jul",  time:"14:30", flag:"🇺🇸", country:"US", event:"US ISM Manufacturing PMI (Jun)",     category:"PMI",            impact:"high",   prev:"48.7",  forecast:"49.2",  actual:null,     note:"Manufacturing remains in contraction but any move toward 50 would be read as a green shoot for the sector." },
  { id:22, group:"Next Week",   date:"Wed 2 Jul",  time:"14:15", flag:"🇺🇸", country:"US", event:"US ADP Employment Change (Jun)",     category:"Employment",     impact:"high",   prev:"152K",  forecast:"160K",  actual:null,     note:"Private sector payrolls preview. Markets will use this to calibrate expectations for Friday's NFP." },
  { id:23, group:"Next Week",   date:"Thu 3 Jul",  time:"11:00", flag:"🇿🇦", country:"ZA", event:"SA GDP Growth Rate Q1 (Final)",     category:"GDP",            impact:"high",   prev:"0.6%",  forecast:"0.9%",  actual:null,     note:"Final reading for Q1 GDP. An upside surprise would reduce pressure on the SARB to cut rates aggressively." },
  { id:24, group:"Next Week",   date:"Thu 3 Jul",  time:"14:30", flag:"🇺🇸", country:"US", event:"US Initial Jobless Claims",          category:"Employment",     impact:"high",   prev:"225K",  forecast:"222K",  actual:null,     note:"Weekly claims reading. Given the US holiday week, data may be distorted by seasonal adjustment factors." },
  { id:25, group:"Next Week",   date:"Fri 4 Jul",  time:"14:30", flag:"🇺🇸", country:"US", event:"US Non-Farm Payrolls (Jun)",         category:"Employment",     impact:"high",   prev:"272K",  forecast:"185K",  actual:null,     note:"The most closely watched release in global macro. US markets closed, but Asian and European markets will react immediately." },
  { id:26, group:"Next Week",   date:"Fri 4 Jul",  time:"14:30", flag:"🇺🇸", country:"US", event:"US Unemployment Rate (Jun)",         category:"Employment",     impact:"high",   prev:"4.0%",  forecast:"4.1%",  actual:null,     note:"A tick higher in unemployment alongside weaker payrolls could be the catalyst for a September cut." },
];

const COUNTRIES  = ["ZA","US","EU","UK","DE","CA","CN","JP"];
const CATEGORIES = ["All","GDP","Inflation","Employment","Interest Rates","PMI","Housing","Consumer","Manufacturing","Trade","Commodities","Sentiment","Retail"];
const IMPACTS    = ["All","High","Medium","Low"];
const GROUPS     = ["Today","Tomorrow","This Week","Next Week"];

const FLAG = { ZA:"🇿🇦",US:"🇺🇸",EU:"🇪🇺",UK:"🇬🇧",DE:"🇩🇪",CA:"🇨🇦",CN:"🇨🇳",JP:"🇯🇵" };
const IMPACT_COLOR = { high:C.red, medium:C.amber, low:C.green };
const IMPACT_LABEL = { high:"High", medium:"Medium", low:"Low" };

const CAT_COLOR = {
  "GDP":"#1A3F7A","Inflation":"#A6402E","Employment":"#1F5C4B","Interest Rates":"#6B21A8",
  "PMI":"#8C5F00","Housing":"#2D6A8C","Consumer":"#5C4B1F","Manufacturing":"#4B1A1A",
  "Trade":"#1F4B3A","Commodities":"#6B3A2A","Sentiment":"#3A2A5C","Retail":"#2A4B1F",
};

// ─── page ────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const [countries,  setCountries]  = useState(new Set());
  const [category,   setCategory]   = useState("All");
  const [impact,     setImpact]     = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [search,     setSearch]     = useState("");

  const toggleCountry = (c) => setCountries(prev => {
    const n = new Set(prev);
    n.has(c) ? n.delete(c) : n.add(c);
    return n;
  });

  const filtered = useMemo(() => {
    return EVENTS.filter(e => {
      if (countries.size > 0 && !countries.has(e.country)) return false;
      if (category !== "All" && e.category !== category)   return false;
      if (impact !== "All" && e.impact !== impact.toLowerCase()) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!e.event.toLowerCase().includes(q) && !e.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [countries, category, impact, search]);

  const grouped = useMemo(() => {
    return GROUPS
      .map(g => ({ group: g, items: filtered.filter(e => e.group === g) }))
      .filter(g => g.items.length > 0);
  }, [filtered]);

  const totalHigh   = filtered.filter(e => e.impact === "high").length;
  const hasReleased = filtered.filter(e => e.actual).length;

  return (
    <div style={{ background:C.bg }}>
      <Nav/>

      {/* page header */}
      <div style={{ background:C.paper, borderBottom:`2px solid ${C.ink}`, padding:"22px 28px 0" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ fontFamily:MONO, fontSize:10, color:C.muted, letterSpacing:".06em", marginBottom:10 }}>
            Tools / <span style={{ color:C.ink }}>Economic Calendar</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12, paddingBottom:18 }}>
            <div>
              <h1 style={{ fontFamily:SERIF, fontSize:"clamp(24px,3.5vw,38px)", fontWeight:700, color:C.ink, letterSpacing:"-.01em", marginBottom:6 }}>
                Economic Calendar
              </h1>
              <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
                <Stat label="Upcoming events" value={filtered.length} />
                <Stat label="High impact" value={totalHigh} color={C.red} />
                <Stat label="Already released" value={hasReleased} color={C.green} />
              </div>
            </div>
            <div style={{ fontFamily:MONO, fontSize:10, color:C.muted, textAlign:"right" }}>
              All times in SAST (UTC+2)<br/>
              <span style={{ color:C.blue }}>ZA events highlighted</span>
            </div>
          </div>
        </div>
      </div>

      {/* body */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"32px 28px 60px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:32, alignItems:"flex-start" }}>

          {/* ── filters sidebar ── */}
          <aside>
            <div style={{ border:`1px solid ${C.rule}`, background:C.paper, position:"sticky", top:80 }}>

              {/* search */}
              <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.rule}` }}>
                <div style={{ fontFamily:MONO, fontSize:9, textTransform:"uppercase", letterSpacing:".08em", color:C.muted, marginBottom:8 }}>Search</div>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Event name…"
                  style={{ width:"100%", fontFamily:SANS, fontSize:12, background:C.bg, border:`1px solid ${C.rule}`, padding:"7px 10px", color:C.ink, outline:"none" }}/>
              </div>

              {/* country filter */}
              <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.rule}` }}>
                <div style={{ fontFamily:MONO, fontSize:9, textTransform:"uppercase", letterSpacing:".08em", color:C.muted, marginBottom:10 }}>Country</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {COUNTRIES.map(c => (
                    <button key={c} onClick={() => toggleCountry(c)}
                      style={{ fontFamily:MONO, fontSize:11, fontWeight:700,
                        border:`1px solid ${countries.has(c) ? C.ink : C.rule}`,
                        background: countries.has(c) ? C.ink : "transparent",
                        color: countries.has(c) ? C.bg : C.muted,
                        padding:"4px 8px" }}>
                      {FLAG[c]} {c}
                    </button>
                  ))}
                  {countries.size > 0 && (
                    <button onClick={() => setCountries(new Set())}
                      style={{ fontFamily:SANS, fontSize:10, color:C.blue, padding:"4px 0", background:"none", border:"none" }}>
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* impact filter */}
              <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.rule}` }}>
                <div style={{ fontFamily:MONO, fontSize:9, textTransform:"uppercase", letterSpacing:".08em", color:C.muted, marginBottom:10 }}>Impact</div>
                {IMPACTS.map(i => (
                  <button key={i} onClick={() => setImpact(i)}
                    style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"6px 0",
                      fontFamily:SANS, fontSize:12, fontWeight: impact===i ? 700 : 500,
                      color: impact===i ? C.ink : C.muted, background:"none", border:"none", textAlign:"left" }}>
                    {i !== "All" && <span style={{ width:7, height:7, borderRadius:"50%", background:IMPACT_COLOR[i.toLowerCase()], display:"inline-block" }}/>}
                    {i}
                  </button>
                ))}
              </div>

              {/* category filter */}
              <div style={{ padding:"14px 16px" }}>
                <div style={{ fontFamily:MONO, fontSize:9, textTransform:"uppercase", letterSpacing:".08em", color:C.muted, marginBottom:10 }}>Category</div>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    style={{ display:"block", width:"100%", padding:"5px 0",
                      fontFamily:SANS, fontSize:12, fontWeight: category===cat ? 700 : 400,
                      color: category===cat ? C.ink : C.muted, background:"none", border:"none", textAlign:"left" }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── main calendar ── */}
          <div>
            {grouped.length === 0 && (
              <div style={{ padding:"40px 0", textAlign:"center", fontFamily:MONO, fontSize:13, color:C.muted }}>
                No events match your filters.
              </div>
            )}

            {grouped.map(g => (
              <div key={g.group} style={{ marginBottom:28 }}>
                {/* group header */}
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                  <span style={{ fontFamily:MONO, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:g.group==="Today"?C.red:C.ink }}>{g.group}</span>
                  <span style={{ flex:1, height:1, background:C.rule }}/>
                  <span style={{ fontFamily:MONO, fontSize:9, color:C.muted }}>{g.items[0]?.date}</span>
                </div>

                {/* events table */}
                <div style={{ border:`1px solid ${C.rule}`, background:C.paper }}>
                  {/* table header */}
                  <div style={{ display:"grid", gridTemplateColumns:"70px 50px 120px 1fr 90px 80px 80px 36px", gap:0, borderBottom:`2px solid ${C.ink}`, padding:"8px 16px" }}>
                    {["Time","","Country","Event","Prev","Forecast","Actual",""].map((h,i) => (
                      <div key={i} style={{ fontFamily:MONO, fontSize:9, textTransform:"uppercase", letterSpacing:".07em", color:C.muted, fontWeight:600 }}>{h}</div>
                    ))}
                  </div>

                  {g.items.map((e, ei) => {
                    const isZA = e.country === "ZA";
                    const released = e.actual != null;
                    const isOpen = expandedId === e.id;
                    const actUp = released && e.forecast !== "—" && parseFloat(e.actual) >= parseFloat(e.forecast);
                    const catClr = CAT_COLOR[e.category] || C.muted;

                    return (
                      <div key={e.id}>
                        <div onClick={() => setExpandedId(isOpen ? null : e.id)}
                          style={{ display:"grid", gridTemplateColumns:"70px 50px 120px 1fr 90px 80px 80px 36px",
                            gap:0, padding:"12px 16px", cursor:"pointer",
                            background: isZA ? "rgba(31,92,75,0.04)" : "transparent",
                            borderBottom: ei < g.items.length-1 && !isOpen ? `1px solid ${C.rule2}` : "none" }}
                          onMouseEnter={e => e.currentTarget.style.background = isZA ? "rgba(31,92,75,0.08)" : "#FFF3E5"}
                          onMouseLeave={ev => ev.currentTarget.style.background = isZA ? "rgba(31,92,75,0.04)" : "transparent"}>

                          <div style={{ fontFamily:MONO, fontSize:12, fontWeight:600, color: released ? C.muted : C.ink }}>{e.time}</div>

                          {/* impact dot */}
                          <div style={{ display:"flex", alignItems:"center" }}>
                            <span style={{ width:8, height:8, borderRadius:"50%", background:IMPACT_COLOR[e.impact], display:"inline-block", boxShadow: e.impact==="high" ? `0 0 0 2px ${IMPACT_COLOR[e.impact]}33` : "none" }}/>
                          </div>

                          {/* country */}
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:14 }}>{e.flag}</span>
                            <span style={{ fontFamily:MONO, fontSize:10, color:C.muted, fontWeight:600 }}>{e.country}</span>
                          </div>

                          {/* event name */}
                          <div>
                            <div style={{ fontFamily:SANS, fontSize:13, fontWeight: e.impact==="high" ? 600 : 500, color:C.ink, marginBottom:2 }}>{e.event}</div>
                            <span style={{ fontFamily:MONO, fontSize:9, fontWeight:700, color:catClr, textTransform:"uppercase", letterSpacing:".06em" }}>{e.category}</span>
                          </div>

                          <div style={{ fontFamily:MONO, fontSize:12, color:C.muted }}>{e.prev}</div>
                          <div style={{ fontFamily:MONO, fontSize:12, color:C.muted }}>{e.forecast}</div>

                          {/* actual */}
                          <div style={{ fontFamily:MONO, fontSize:12, fontWeight:700,
                            color: released ? (actUp ? C.green : C.red) : C.dim }}>
                            {released ? e.actual : "—"}
                          </div>

                          <div style={{ fontFamily:MONO, fontSize:11, color:C.dim, textAlign:"right" }}>
                            {isOpen ? "▴" : "▾"}
                          </div>
                        </div>

                        {/* expanded detail */}
                        {isOpen && (
                          <div style={{ padding:"14px 20px 16px", borderTop:`1px solid ${C.rule2}`,
                            borderBottom: ei < g.items.length-1 ? `1px solid ${C.rule2}` : "none",
                            background: isZA ? "rgba(31,92,75,0.04)" : "#FFFAF4" }}>
                            <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:20, alignItems:"start" }}>
                              <div>
                                <div style={{ fontFamily:MONO, fontSize:9, textTransform:"uppercase", letterSpacing:".08em", color:C.muted, marginBottom:8 }}>Analysis</div>
                                <p style={{ fontFamily:SERIF, fontStyle:"italic", fontSize:14, lineHeight:1.7, color:C.muted }}>{e.note}</p>
                              </div>
                              <div style={{ display:"flex", flexDirection:"column", gap:1, background:C.rule, border:`1px solid ${C.rule}`, minWidth:200 }}>
                                {[["Previous", e.prev],["Forecast", e.forecast],["Actual", e.actual||"Pending"],["Impact", IMPACT_LABEL[e.impact]]].map(([l,v]) => (
                                  <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", background:C.paper }}>
                                    <span style={{ fontFamily:MONO, fontSize:9, textTransform:"uppercase", letterSpacing:".06em", color:C.muted }}>{l}</span>
                                    <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:
                                      l==="Impact" ? IMPACT_COLOR[e.impact] :
                                      l==="Actual" && e.actual ? (actUp?C.green:C.red) : C.ink }}>{v}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* legend */}
            <div style={{ display:"flex", gap:20, alignItems:"center", paddingTop:18, borderTop:`1px solid ${C.rule}`, flexWrap:"wrap" }}>
              <div style={{ fontFamily:MONO, fontSize:9, textTransform:"uppercase", letterSpacing:".08em", color:C.muted }}>Impact:</div>
              {[["high","High Impact"],["medium","Medium Impact"],["low","Low Impact"]].map(([k,l]) => (
                <div key={k} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:IMPACT_COLOR[k], display:"inline-block" }}/>
                  <span style={{ fontFamily:SANS, fontSize:11, color:C.muted }}>{l}</span>
                </div>
              ))}
              <div style={{ display:"flex", alignItems:"center", gap:6, marginLeft:12 }}>
                <span style={{ width:12, height:12, background:"rgba(31,92,75,0.08)", border:"1px solid rgba(31,92,75,0.2)", display:"inline-block" }}/>
                <span style={{ fontFamily:SANS, fontSize:11, color:C.muted }}>ZA events highlighted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <span style={{ fontFamily:MONO, fontSize:16, fontWeight:700, color: color||C.ink }}>{value}</span>
      <span style={{ fontFamily:MONO, fontSize:10, color:C.muted, marginLeft:6 }}>{label}</span>
    </div>
  );
}
