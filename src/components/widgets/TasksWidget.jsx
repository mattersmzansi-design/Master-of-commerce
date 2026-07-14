import { useState } from "react";
import { C, SANS, MONO } from "../../theme";
import { useAuth } from "../../lib/AuthContext";
import { useUserRows } from "../../lib/useUserRows";
import WidgetShell from "./WidgetShell";

export default function TasksWidget() {
  const { user } = useAuth();
  const { rows, insert, update, remove } = useUserRows("tasks", { orderBy: "created_at", ascending: true });
  const [title, setTitle] = useState("");

  const add = async (e) => {
    e.preventDefault();
    const value = title.trim();
    if (!value) return;
    setTitle("");
    await insert({ title: value, done: false });
  };

  const open = rows.filter(t => !t.done);
  const done = rows.filter(t => t.done);

  return (
    <WidgetShell title="Today's Tasks" sub="Daily To-Dos" requiresAuth={!user}>
      <form onSubmit={add} style={{ display:"flex", gap:8, marginBottom:18 }}>
        <input
          value={title} onChange={e => setTitle(e.target.value)} placeholder="Add a task…"
          style={{ flex:1, padding:"9px 12px", border:`1px solid ${C.rule}`, background:C.bg, color:C.ink, fontFamily:SANS, fontSize:13 }}
        />
        <button type="submit" style={{ background:C.ink, color:C.bg, fontFamily:SANS, fontSize:12, fontWeight:700, padding:"9px 18px" }}>Add</button>
      </form>

      {open.length === 0 && done.length === 0 && (
        <p style={{ fontFamily:SANS, fontSize:13, color:C.muted }}>No tasks yet — add what you need to get done today.</p>
      )}

      {open.map(t => (
        <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.rule2}` }}>
          <input type="checkbox" checked={false} onChange={() => update(t.id, { done: true })} style={{ width:16, height:16 }} />
          <span style={{ fontFamily:SANS, fontSize:13, color:C.ink, flex:1 }}>{t.title}</span>
          <button onClick={() => remove(t.id)} style={{ fontFamily:MONO, fontSize:11, color:C.muted }}>Remove</button>
        </div>
      ))}

      {done.length > 0 && (
        <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.rule}` }}>
          <div style={{ fontFamily:MONO, fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Completed ({done.length})</div>
          {done.map(t => (
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0" }}>
              <input type="checkbox" checked={true} onChange={() => update(t.id, { done: false })} style={{ width:16, height:16 }} />
              <span style={{ fontFamily:SANS, fontSize:13, color:C.muted, flex:1, textDecoration:"line-through" }}>{t.title}</span>
              <button onClick={() => remove(t.id)} style={{ fontFamily:MONO, fontSize:11, color:C.muted }}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </WidgetShell>
  );
}
