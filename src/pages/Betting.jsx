import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const LEAGUE_COLOR = {
  "PSL":"#1F5C4B", "Premier League":"#1A3F7A",
  "La Liga":"#8C5F00","Bundesliga":"#6B3A2A",
  "Serie A":"#6B21A8","Champions League":"#1F5C4B",
};

const GROUPS = ["Live Now","Today","Tomorrow","This Weekend"];

const FIXTURES = [
  { id:1,  league:"PSL",            home:"Mamelodi Sundowns", away:"Orlando Pirates",    group:"Live Now",    kickoff:"LIVE", liveMin:67, score:{h:1,a:1}, odds:{h:2.40,d:2.80,a:3.60}, ou:{o:1.95,u:1.85}, btts:{y:1.70,n:2.05} },
  { id:2,  league:"Premier League", home:"Liverpool",         away:"Chelsea",            group:"Live Now",    kickoff:"LIVE", liveMin:23, score:{h:0,a:0}, odds:{h:1.95,d:3.30,a:4.10}, ou:{o:1.80,u:2.00}, btts:{y:1.65,n:2.15} },
  { id:3,  league:"PSL",            home:"Kaizer Chiefs",     away:"SuperSport United",  group:"Today",       kickoff:"19:30", odds:{h:2.10,d:3.10,a:3.50}, ou:{o:1.90,u:1.90}, btts:{y:1.75,n:2.00} },
  { id:4,  league:"La Liga",        home:"Real Madrid",       away:"Barcelona",          group:"Today",       kickoff:"20:00", odds:{h:2.10,d:3.30,a:3.40}, ou:{o:1.70,u:2.10}, btts:{y:1.55,n:2.40} },
  { id:5,  league:"Bundesliga",     home:"Bayern Munich",     away:"Borussia Dortmund",  group:"Today",       kickoff:"19:30", odds:{h:1.65,d:4.00,a:5.20}, ou:{o:1.55,u:2.40}, btts:{y:1.50,n:2.50} },
  { id:6,  league:"Serie A",        home:"Inter Milan",       away:"AC Milan",           group:"Today",       kickoff:"20:45", odds:{h:2.05,d:3.20,a:3.60}, ou:{o:1.95,u:1.85}, btts:{y:1.80,n:1.95} },
  { id:7,  league:"PSL",            home:"AmaZulu",           away:"Royal AM",           group:"Tomorrow",    kickoff:"15:00", odds:{h:1.90,d:3.20,a:4.00}, ou:{o:2.00,u:1.75}, btts:{y:1.85,n:1.90} },
  { id:8,  league:"Premier League", home:"Arsenal",           away:"Manchester City",    group:"Tomorrow",    kickoff:"17:30", odds:{h:2.40,d:3.20,a:2.95}, ou:{o:1.75,u:2.05}, btts:{y:1.60,n:2.30} },
  { id:9,  league:"Champions League",home:"PSG",              away:"Bayern Munich",      group:"Tomorrow",    kickoff:"21:00", odds:{h:2.20,d:3.40,a:3.10}, ou:{o:1.65,u:2.20}, btts:{y:1.58,n:2.35} },
  { id:10, league:"PSL",            home:"Cape Town City",    away:"Stellenbosch FC",   group:"This Weekend",kickoff:"Sat 15:00", odds:{h:2.00,d:3.10,a:3.80}, ou:{o:1.95,u:1.85}, btts:{y:1.82,n:1.92} },
  { id:11, league:"Premier League", home:"Manchester United", away:"Tottenham",          group:"This Weekend",kickoff:"Sat 17:30", odds:{h:2.15,d:3.30,a:3.30}, ou:{o:1.80,u:2.00}, btts:{y:1.68,n:2.10} },
  { id:12, league:"Champions League",home:"Real Madrid",      away:"Manchester City",   group:"This Weekend",kickoff:"Wed 21:00", odds:{h:2.55,d:3.30,a:2.70}, ou:{o:1.60,u:2.30}, btts:{y:1.55,n:2.40} },
];

export default function BettingPage() {
  const [leagueFilter, setLeagueFilter] = useState("All");
  const [selections,   setSelections]   = useState({});
  const [stake,        setStake]        = useState(50);
  const [mode,         setMode]         = useState("accumulator");
  const [placed,       setPlaced]       = useState(false);
  const [expanded,     setExpanded]     = useState({});

  const leagues = ["All",...[...new Set(FIXTURES.map(f=>f.league))]];

  const filtered = useMemo(()=>
    leagueFilter==="All" ? FIXTURES : FIXTURES.filter(f=>f.league===leagueFilter)
  ,[leagueFilter]);

  const grouped = useMemo(()=>
    GROUPS.map(g=>({group:g,items:filtered.filter(f=>f.group===g)})).filter(g=>g.items.length)
  ,[filtered]);

  const pick = (fixture, market, key, odds) => {
    setSelections(prev=>{
      const ex=prev[fixture.id];
      if (ex?.market===market&&ex?.key===key) { const n={...prev}; delete n[fixture.id]; return n; }
      return {...prev,[fixture.id]:{market,key,odds,label:`${fixture.home} v ${fixture.away}`,league:fixture.league}};
    });
  };

  const selList = Object.values(selections);
  const accOdds = selList.reduce((a,s)=>a*s.odds,1);

  const handlePlace = () => {
    setPlaced(true);
    setTimeout(()=>{ setPlaced(false); setSelections({}); },3000);
  };

  const isActive = (id,market,key) => selections[id]?.market===market && selections[id]?.key===key;

  return (
    <div style={{background:C.bg}}>
      <Nav/>

      {/* header */}
      <div style={{background:C.paper,borderBottom:`2px solid ${C.ink}`,padding:"22px 28px 0"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{fontFamily:MONO,fontSize:10,color:C.muted,letterSpacing:".06em",marginBottom:10}}>
            Betting / <span style={{color:C.ink}}>Soccer</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
                <h1 style={{fontFamily:SERIF,fontSize:"clamp(24px,3.5vw,38px)",fontWeight:700,color:C.ink,letterSpacing:"-.01em"}}>Soccer Betting</h1>
                <span style={{display:"inline-flex",alignItems:"center",gap:6,fontFamily:MONO,fontSize:10,color:C.red,fontWeight:700}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:C.red,display:"inline-block",animation:"pulse 1.4s infinite"}}/>
                  2 LIVE
                </span>
              </div>
              <div style={{fontFamily:MONO,fontSize:10,color:C.muted}}>PSL · Premier League · La Liga · Bundesliga · Serie A · Champions League</div>
            </div>
          </div>
          {/* league filter strip */}
          <div style={{display:"flex",gap:0,marginTop:16,overflowX:"auto"}}>
            {leagues.map(l=>(
              <button key={l} onClick={()=>setLeagueFilter(l)}
                style={{fontFamily:SANS,fontSize:12,fontWeight:leagueFilter===l?700:500,
                  color:leagueFilter===l?C.ink:C.muted,padding:"9px 16px",background:"none",
                  borderBottom:leagueFilter===l?`2px solid ${C.ink}`:"2px solid transparent",
                  marginBottom:"-2px",whiteSpace:"nowrap"}}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* body */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"32px 28px 60px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:32,alignItems:"flex-start"}}>

          {/* fixtures */}
          <div>
            {grouped.length===0 && <div style={{padding:"40px 0",fontFamily:MONO,fontSize:13,color:C.muted}}>No fixtures for this league.</div>}
            {grouped.map(g=>(
              <div key={g.group} style={{marginBottom:28}}>
                {/* group header */}
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  {g.group==="Live Now"&&<span style={{width:7,height:7,borderRadius:"50%",background:C.red,animation:"pulse 1.4s infinite"}}/>}
                  <span style={{fontFamily:MONO,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:g.group==="Live Now"?C.red:C.ink}}>{g.group}</span>
                  <span style={{flex:1,height:"1px",background:C.rule}}/>
                </div>

                {/* fixture table */}
                <div style={{border:`1px solid ${C.rule}`,background:C.paper}}>
                  {g.items.map((f,fi)=>{
                    const lc = LEAGUE_COLOR[f.league]||C.muted;
                    const isLive = f.group==="Live Now";
                    const exp = expanded[f.id];
                    const Btn = ({label,odds,market,k})=>{
                      const act=isActive(f.id,market,k);
                      return (
                        <button onClick={()=>pick(f,market,k,odds)} style={{
                          flex:1,fontFamily:MONO,fontSize:13,fontWeight:700,
                          border:`1px solid ${act?C.ink:C.rule}`,
                          background:act?C.ink:"transparent",
                          color:act?C.bg:C.ink,padding:"8px 0",textAlign:"center"}}>
                          <div style={{fontSize:9,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",opacity:.6,marginBottom:2}}>{label}</div>
                          {odds.toFixed(2)}
                        </button>
                      );
                    };
                    return (
                      <div key={f.id} style={{borderBottom:fi<g.items.length-1?`1px solid ${C.rule2}`:"none"}}>
                        <div style={{padding:"16px 18px"}}>
                          {/* meta row */}
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                            <span style={{fontFamily:MONO,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:lc}}>{f.league}</span>
                            {isLive
                              ? <span style={{fontFamily:MONO,fontSize:11,fontWeight:700,color:C.red}}>{f.liveMin}' · {f.score.h}–{f.score.a}</span>
                              : <span style={{fontFamily:MONO,fontSize:10,color:C.muted}}>{f.kickoff}</span>}
                          </div>
                          {/* teams */}
                          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:12,marginBottom:14}}>
                            <span style={{fontFamily:SERIF,fontSize:15,fontWeight:600,color:C.ink}}>{f.home}</span>
                            <span style={{fontFamily:MONO,fontSize:11,color:C.muted}}>vs</span>
                            <span style={{fontFamily:SERIF,fontSize:15,fontWeight:600,color:C.ink,textAlign:"right"}}>{f.away}</span>
                          </div>
                          {/* 1X2 odds */}
                          <div style={{display:"flex",gap:6,marginBottom:10}}>
                            <Btn label="Home" odds={f.odds.h} market="1X2" k="h"/>
                            <Btn label="Draw" odds={f.odds.d} market="1X2" k="d"/>
                            <Btn label="Away" odds={f.odds.a} market="1X2" k="a"/>
                          </div>
                          <button onClick={()=>setExpanded(e=>({...e,[f.id]:!e[f.id]}))}
                            style={{fontFamily:SANS,fontSize:11,fontWeight:600,color:C.blue}}>
                            {exp?"Fewer markets ▴":"More markets ▾"}
                          </button>
                          {exp && (
                            <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.rule2}`,display:"flex",flexDirection:"column",gap:10}}>
                              <div>
                                <div style={{fontFamily:MONO,fontSize:9,textTransform:"uppercase",letterSpacing:".07em",color:C.muted,marginBottom:6}}>Over/Under 2.5 Goals</div>
                                <div style={{display:"flex",gap:6}}>
                                  <Btn label="Over" odds={f.ou.o} market="O/U" k="o"/>
                                  <Btn label="Under" odds={f.ou.u} market="O/U" k="u"/>
                                </div>
                              </div>
                              <div>
                                <div style={{fontFamily:MONO,fontSize:9,textTransform:"uppercase",letterSpacing:".07em",color:C.muted,marginBottom:6}}>Both Teams to Score</div>
                                <div style={{display:"flex",gap:6}}>
                                  <Btn label="Yes" odds={f.btts.y} market="BTTS" k="y"/>
                                  <Btn label="No"  odds={f.btts.n} market="BTTS" k="n"/>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* bet slip */}
          <aside>
            <div style={{border:`1px solid ${C.rule}`,background:C.paper,position:"sticky",top:80}}>
              <div style={{fontFamily:SERIF,fontSize:16,fontWeight:700,color:C.ink,padding:"14px 18px",borderBottom:`1px solid ${C.rule}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span>Bet Slip{selList.length>0?` (${selList.length})`:""}</span>
                {selList.length>0&&<button onClick={()=>setSelections({})} style={{fontFamily:SANS,fontSize:11,color:C.muted,fontWeight:600}}>Clear all</button>}
              </div>

              {placed ? (
                <div style={{padding:"24px 18px",textAlign:"center"}}>
                  <div style={{fontFamily:SERIF,fontSize:15,fontWeight:700,color:C.green,marginBottom:6}}>✓ Demo bet placed</div>
                  <div style={{fontFamily:SANS,fontSize:12,color:C.muted,lineHeight:1.6}}>No real money wagered. UI preview only.</div>
                </div>
              ) : selList.length===0 ? (
                <div style={{padding:"28px 18px",textAlign:"center",fontFamily:SANS,fontSize:13,color:C.muted,lineHeight:1.6}}>
                  Click any odds on a match to add a selection here.
                </div>
              ) : (
                <div style={{padding:"14px 18px"}}>
                  {selList.map(s=>(
                    <div key={`${s.label}-${s.market}`} style={{borderBottom:`1px solid ${C.rule2}`,paddingBottom:10,marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                        <div style={{flex:1}}>
                          <div style={{fontFamily:SANS,fontSize:12,fontWeight:600,color:C.ink,marginBottom:2}}>{s.label}</div>
                          <div style={{fontFamily:MONO,fontSize:10,color:C.muted}}>{s.market} — <span style={{color:C.ink,fontWeight:700,textTransform:"uppercase"}}>{s.key}</span></div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontFamily:MONO,fontSize:14,fontWeight:700,color:C.ink}}>{s.odds.toFixed(2)}</div>
                          <button onClick={()=>setSelections(p=>{const n={...p};const id=FIXTURES.find(f=>`${f.home} v ${f.away}`===s.label)?.id;if(id)delete n[id];return n;})} style={{fontFamily:MONO,fontSize:14,color:C.dim}}>✕</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {selList.length>=2&&(
                    <div style={{display:"flex",gap:6,marginBottom:14}}>
                      {["accumulator","singles"].map(m=>(
                        <button key={m} onClick={()=>setMode(m)} style={{flex:1,fontFamily:SANS,fontSize:11,fontWeight:700,textTransform:"capitalize",border:`1px solid ${mode===m?C.ink:C.rule}`,padding:"7px 0",background:mode===m?C.ink:"transparent",color:mode===m?C.bg:C.muted}}>
                          {m}
                        </button>
                      ))}
                    </div>
                  )}

                  <div style={{marginBottom:14}}>
                    <div style={{fontFamily:MONO,fontSize:9,textTransform:"uppercase",letterSpacing:".07em",color:C.muted,marginBottom:6}}>
                      {mode==="accumulator"?"Stake":"Stake per selection"}
                    </div>
                    <div style={{display:"flex",alignItems:"center",border:`1px solid ${C.rule}`,padding:"0 12px",background:C.paper}}>
                      <span style={{fontFamily:MONO,fontSize:13,color:C.muted}}>R</span>
                      <input type="number" min={10} step={10} value={stake} onChange={e=>setStake(Math.max(0,Number(e.target.value)))}
                        style={{flex:1,background:"none",border:"none",fontFamily:MONO,fontSize:14,color:C.ink,padding:"9px 8px",outline:"none"}}/>
                    </div>
                  </div>

                  <div style={{borderTop:`1px solid ${C.rule}`,paddingTop:12,marginBottom:14}}>
                    {mode==="accumulator" ? (
                      <>
                        <SlipRow label="Combined odds" value={accOdds.toFixed(2)}/>
                        <SlipRow label="Potential payout" value={`R ${(stake*accOdds).toFixed(2)}`} bold/>
                      </>
                    ) : (
                      <>
                        <SlipRow label="Total stake" value={`R ${(stake*selList.length).toFixed(2)}`}/>
                        <SlipRow label="Potential payout" value={`R ${selList.reduce((a,s)=>a+stake*s.odds,0).toFixed(2)}`} bold/>
                      </>
                    )}
                  </div>

                  <button onClick={handlePlace} disabled={stake<=0}
                    style={{width:"100%",fontFamily:SANS,fontSize:13,fontWeight:700,background:C.ink,color:C.bg,padding:"12px 0",border:"none",opacity:stake>0?1:.5}}>
                    Place Bet
                  </button>
                </div>
              )}

              <div style={{padding:"12px 18px",borderTop:`1px solid ${C.rule}`}}>
                <div style={{fontFamily:MONO,fontSize:9,color:C.dim,lineHeight:1.7}}>
                  18+ only. Odds are illustrative — a real provider is planned for Phase 3.<br/>
                  National Responsible Gambling Programme:<br/>
                  <span style={{color:C.muted}}>0800 006 008</span> (toll-free, 24/7)
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer note="Odds are illustrative and for demonstration only">
        <div style={{fontFamily:MONO,fontSize:10,color:"rgba(255,255,255,.4)",lineHeight:1.7}}>
          18+ only. Gambling can be addictive — please play responsibly.<br/>
          National Responsible Gambling Programme: 0800 006 008 (toll-free, 24/7)
        </div>
      </Footer>
    </div>
  );
}

function SlipRow({label,value,bold}){
  return (
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
      <span style={{fontFamily:SANS,fontSize:12,color:C.muted}}>{label}</span>
      <span style={{fontFamily:MONO,fontWeight:700,fontSize:bold?15:13,color:C.ink}}>{value}</span>
    </div>
  );
}
