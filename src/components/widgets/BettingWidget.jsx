import { useState } from "react";
import { Link } from "react-router-dom";
import { C, SERIF, MONO, SANS } from "../../theme";
import WidgetShell from "./WidgetShell";

const MATCHES = [
  { league:"PSL",            home:"Mamelodi Sundowns", away:"Orlando Pirates",  time:"15:00", odds:{h:1.85,d:3.40,a:4.20} },
  { league:"PSL",            home:"Kaizer Chiefs",     away:"SuperSport Utd",   time:"17:30", odds:{h:2.10,d:3.10,a:3.50} },
  { league:"Premier League", home:"Arsenal",           away:"Manchester City",  time:"17:30", odds:{h:2.40,d:3.20,a:2.95} },
  { league:"La Liga",        home:"Real Madrid",       away:"Barcelona",        time:"20:00", odds:{h:2.10,d:3.30,a:3.40} },
];

const LEAGUE_CLR = { "PSL":C.green, "Premier League":C.blue, "La Liga":C.amber, "Champions League":C.gold };

export default function BettingWidget() {
  const [picks, setPicks] = useState({});
  const count = Object.values(picks).filter(Boolean).length;

  return (
    <WidgetShell title="Today's Fixtures" sub="Soccer Betting" link="/betting">
      <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
        {MATCHES.map((m, i) => {
          const lc = LEAGUE_CLR[m.league] || C.muted;
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
                {[["H",m.odds.h,"h"],["D",m.odds.d,"d"],["A",m.odds.a,"a"]].map(([lbl, odd, key]) => (
                  <button key={key} onClick={() => setPicks(p => ({ ...p, [i]: p[i] === key ? null : key }))} style={{
                    flex:1, border:`1px solid ${picks[i] === key ? C.ink : C.rule}`,
                    background: picks[i] === key ? C.ink : "transparent",
                    color: picks[i] === key ? C.bg : C.ink,
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
      {count > 0 && (
        <div style={{ marginTop:14, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", border:`1px solid ${C.ink}`, background:C.ink }}>
          <span style={{ fontFamily:SANS, fontSize:12, color:C.bg, fontWeight:600 }}>{count} selection{count > 1 ? "s" : ""} added</span>
          <Link to="/betting" style={{ fontFamily:SANS, fontSize:12, fontWeight:700, color:"#FFF3E5" }}>View bet slip →</Link>
        </div>
      )}
    </WidgetShell>
  );
}
