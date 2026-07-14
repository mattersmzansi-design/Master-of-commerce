import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useAuth } from "../lib/AuthContext";
import { usePreferences } from "../lib/usePreferences";
import { WIDGETS } from "../lib/widgets";

export default function Settings() {
  const { user } = useAuth();
  const { layout, hidden, toggleHidden, moveWidget } = usePreferences();

  const byId = Object.fromEntries(WIDGETS.map(w => [w.id, w]));

  return (
    <div style={{ background:C.bg, minHeight:"100vh" }}>
      <Nav />
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"44px 28px" }}>
        <div style={{ fontFamily:MONO, fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>Customize</div>
        <h1 style={{ fontFamily:SERIF, fontSize:32, fontWeight:700, color:C.ink, marginBottom:12 }}>Your Dashboard</h1>

        {!user ? (
          <p style={{ fontFamily:SANS, fontSize:14, color:C.muted, maxWidth:520, lineHeight:1.7 }}>
            Sign in to show, hide and reorder widgets on your home page. Your layout
            syncs automatically across every device you sign into.
          </p>
        ) : (
          <>
            <p style={{ fontFamily:SANS, fontSize:14, color:C.muted, maxWidth:560, lineHeight:1.7, marginBottom:28 }}>
              Choose what appears on your home page and in what order. Changes save
              automatically and sync to your other devices.
            </p>
            <div style={{ maxWidth:560 }}>
              {layout.map((id, i) => {
                const widget = byId[id];
                if (!widget) return null;
                const isHidden = hidden.includes(id);
                return (
                  <div key={id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${C.rule2}` }}>
                    <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                      <button disabled={i === 0} onClick={() => moveWidget(id, -1)} style={{ fontFamily:MONO, fontSize:11, color: i === 0 ? C.dim : C.ink, border:`1px solid ${C.rule}`, width:22, height:18 }}>↑</button>
                      <button disabled={i === layout.length - 1} onClick={() => moveWidget(id, 1)} style={{ fontFamily:MONO, fontSize:11, color: i === layout.length - 1 ? C.dim : C.ink, border:`1px solid ${C.rule}`, width:22, height:18 }}>↓</button>
                    </div>
                    <span style={{ fontFamily:SANS, fontSize:14, fontWeight:600, color: isHidden ? C.muted : C.ink, flex:1 }}>{widget.label}</span>
                    <button
                      onClick={() => toggleHidden(id)}
                      style={{
                        fontFamily:SANS, fontSize:12, fontWeight:700, padding:"6px 16px",
                        background: isHidden ? "transparent" : C.ink,
                        color: isHidden ? C.muted : C.bg,
                        border: isHidden ? `1px solid ${C.rule}` : "none",
                      }}
                    >
                      {isHidden ? "Hidden" : "Visible"}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
      <Footer />
    </div>
  );
}
