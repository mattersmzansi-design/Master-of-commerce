import { useMemo, useState } from "react";
import { C, SANS, MONO } from "../../theme";
import { useAuth } from "../../lib/AuthContext";
import { useUserRows } from "../../lib/useUserRows";
import WidgetShell from "./WidgetShell";

const fmt = n => `R ${Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function InvoicesWidget() {
  const { user } = useAuth();
  const { rows, insert, update, remove } = useUserRows("invoices", { orderBy: "created_at", ascending: false });
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const add = async (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!clientName.trim() || !value || value <= 0) return;
    setClientName(""); setAmount(""); setDueDate("");
    await insert({ client_name: clientName.trim(), amount: value, due_date: dueDate || null, status: "unpaid" });
  };

  const outstanding = useMemo(
    () => rows.filter(i => i.status === "unpaid").reduce((s, i) => s + Number(i.amount), 0),
    [rows]
  );

  return (
    <WidgetShell title="Invoices" sub="Money Owed To You" requiresAuth={!user}>
      <div style={{ marginBottom:20, padding:"14px 18px", background:C.ink, display:"inline-block" }}>
        <div style={{ fontFamily:MONO, fontSize:9, color:C.bg, opacity:.7, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>Outstanding</div>
        <div style={{ fontFamily:MONO, fontSize:20, fontWeight:700, color:C.bg }}>{fmt(outstanding)}</div>
      </div>

      <form onSubmit={add} style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        <input
          value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client name"
          style={{ flex:1, minWidth:140, padding:"9px 12px", border:`1px solid ${C.rule}`, background:C.bg, color:C.ink, fontFamily:SANS, fontSize:13 }}
        />
        <input
          type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount"
          style={{ width:120, padding:"9px 12px", border:`1px solid ${C.rule}`, background:C.bg, color:C.ink, fontFamily:SANS, fontSize:13 }}
        />
        <input
          type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
          style={{ padding:"9px 12px", border:`1px solid ${C.rule}`, background:C.bg, color:C.ink, fontFamily:SANS, fontSize:13 }}
        />
        <button type="submit" style={{ background:C.ink, color:C.bg, fontFamily:SANS, fontSize:12, fontWeight:700, padding:"9px 18px" }}>Create</button>
      </form>

      {rows.length === 0 ? (
        <p style={{ fontFamily:SANS, fontSize:13, color:C.muted }}>No invoices yet — create one for a client who owes you.</p>
      ) : (
        rows.map(inv => (
          <div key={inv.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.rule2}` }}>
            <span style={{ fontFamily:SANS, fontSize:13, fontWeight:600, color:C.ink, flex:1 }}>{inv.client_name}</span>
            {inv.due_date && <span style={{ fontFamily:MONO, fontSize:11, color:C.muted }}>Due {inv.due_date}</span>}
            <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:C.ink }}>{fmt(inv.amount)}</span>
            <button
              onClick={() => update(inv.id, { status: inv.status === "paid" ? "unpaid" : "paid" })}
              style={{
                fontFamily:SANS, fontSize:11, fontWeight:700, padding:"4px 10px",
                background: inv.status === "paid" ? C.green : "transparent",
                color: inv.status === "paid" ? C.bg : C.amber,
                border: inv.status === "paid" ? "none" : `1px solid ${C.amber}`,
              }}
            >
              {inv.status === "paid" ? "Paid" : "Mark paid"}
            </button>
            <button onClick={() => remove(inv.id)} style={{ fontFamily:MONO, fontSize:11, color:C.muted }}>Remove</button>
          </div>
        ))
      )}
    </WidgetShell>
  );
}
