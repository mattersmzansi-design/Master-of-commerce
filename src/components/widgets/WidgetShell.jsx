import { Link } from "react-router-dom";
import { C, SERIF, MONO, SANS } from "../../theme";

export default function WidgetShell({ title, sub, link, requiresAuth, children }) {
  return (
    <section style={{ maxWidth:1200, margin:"0 auto", padding:"36px 28px", borderBottom:`1px solid ${C.rule}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:18 }}>
        <div>
          <div style={{ fontFamily:MONO, fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:".1em", marginBottom:4 }}>{sub}</div>
          <h2 style={{ fontFamily:SERIF, fontSize:24, fontWeight:700, color:C.ink, letterSpacing:"-.01em" }}>{title}</h2>
        </div>
        {link && <Link to={link} style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:C.blue }}>View all →</Link>}
      </div>
      {requiresAuth ? (
        <div style={{ padding:"20px 0", fontFamily:SANS, fontSize:13, color:C.muted, lineHeight:1.6 }}>
          Sign in to use this widget — your data syncs across every device you use.
        </div>
      ) : children}
    </section>
  );
}
