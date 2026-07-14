import { C, MONO, SANS } from "../../theme";
import WidgetShell from "./WidgetShell";

const CALENDAR = [
  { date:"Mon 16 Jun", flag:"🇿🇦", event:"SA Consumer Price Index (May)",  impact:"high",   forecast:"4.8%"  },
  { date:"Mon 16 Jun", flag:"🇺🇸", event:"US Retail Sales (MoM)",           impact:"high",   forecast:"0.3%"  },
  { date:"Tue 17 Jun", flag:"🇪🇺", event:"Eurozone ZEW Economic Sentiment", impact:"medium", forecast:"18.5"  },
  { date:"Wed 18 Jun", flag:"🇿🇦", event:"SA Unemployment Rate Q1",         impact:"high",   forecast:"32.1%" },
];

const IMPACT = { high:C.red, medium:C.amber, low:C.green };

export default function CalendarWidget() {
  return (
    <WidgetShell title="Economic Calendar" sub="Upcoming Events" link="/calendar">
      <table style={{ width:"100%" }}>
        <thead>
          <tr style={{ borderBottom:`1px solid ${C.rule}` }}>
            {["Date","Event","Impact","Forecast"].map(h => (
              <th key={h} style={{ fontFamily:MONO, fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:".07em", padding:"8px 8px", textAlign:"left", fontWeight:600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CALENDAR.map((e, i) => (
            <tr key={i} style={{ borderBottom:`1px solid ${C.rule2}` }}>
              <td style={{ fontFamily:MONO, fontSize:11, color:C.muted, padding:"10px 8px", whiteSpace:"nowrap" }}>{e.flag} {e.date}</td>
              <td style={{ fontFamily:SANS, fontSize:12, color:C.ink, padding:"10px 8px", lineHeight:1.3 }}>{e.event}</td>
              <td style={{ padding:"10px 8px" }}><span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:IMPACT[e.impact] }} /></td>
              <td style={{ fontFamily:MONO, fontSize:12, fontWeight:600, color:C.ink, padding:"10px 8px" }}>{e.forecast}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </WidgetShell>
  );
}
