import { useMemo, useState } from "react";
import { C, SANS, MONO } from "../../theme";
import { useAuth } from "../../lib/AuthContext";
import { useUserRows } from "../../lib/useUserRows";
import WidgetShell from "./WidgetShell";

const fmt = n => `R ${Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function startOfWeek() {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function CashFlowWidget() {
  const { user } = useAuth();
  const { rows, insert, remove } = useUserRows("cash_flow_entries", { orderBy: "entry_date", ascending: false });
  const [kind, setKind] = useState("income");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const add = async (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    setAmount("");
    setNote("");
    await insert({ kind, amount: value, note: note.trim() || null, entry_date: new Date().toISOString().slice(0, 10) });
  };

  const weekTotal = useMemo(() => {
    const monday = startOfWeek();
    return rows.reduce((sum, r) => {
      const d = new Date(r.entry_date);
      if (d < monday) return sum;
      return sum + (r.kind === "income" ? Number(r.amount) : -Number(r.amount));
    }, 0);
  }, [rows]);

  return (
    <WidgetShell title="Cash Flow" sub="This Week" requiresAuth={!user}>
      <div style={{ marginBottom:20, padding:"14px 18px", background: weekTotal >= 0 ? C.green : C.red, display:"inline-block" }}>
        <div style={{ fontFamily:MONO, fontSize:9, color:C.bg, opacity:.8, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>Net this week</div>
        <div style={{ fontFamily:MONO, fontSize:20, fontWeight:700, color:C.bg }}>{weekTotal >= 0 ? "+" : ""}{fmt(weekTotal)}</div>
      </div>

      <form onSubmit={add} style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        <select value={kind} onChange={e => setKind(e.target.value)} style={{ padding:"9px 10px", border:`1px solid ${C.rule}`, background:C.bg, color:C.ink, fontFamily:SANS, fontSize:13 }}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount"
          style={{ width:120, padding:"9px 12px", border:`1px solid ${C.rule}`, background:C.bg, color:C.ink, fontFamily:SANS, fontSize:13 }}
        />
        <input
          value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optional)"
          style={{ flex:1, minWidth:140, padding:"9px 12px", border:`1px solid ${C.rule}`, background:C.bg, color:C.ink, fontFamily:SANS, fontSize:13 }}
        />
        <button type="submit" style={{ background:C.ink, color:C.bg, fontFamily:SANS, fontSize:12, fontWeight:700, padding:"9px 18px" }}>Log</button>
      </form>

      {rows.length === 0 ? (
        <p style={{ fontFamily:SANS, fontSize:13, color:C.muted }}>No entries yet — log today's income and expenses.</p>
      ) : (
        rows.slice(0, 8).map(r => (
          <div key={r.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.rule2}` }}>
            <span style={{ fontFamily:MONO, fontSize:11, color:C.muted, width:90 }}>{r.entry_date}</span>
            <span style={{ fontFamily:SANS, fontSize:13, color:C.ink, flex:1 }}>{r.note || (r.kind === "income" ? "Income" : "Expense")}</span>
            <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color: r.kind === "income" ? C.green : C.red }}>
              {r.kind === "income" ? "+" : "−"}{fmt(r.amount)}
            </span>
            <button onClick={() => remove(r.id)} style={{ fontFamily:MONO, fontSize:11, color:C.muted }}>Remove</button>
          </div>
        ))
      )}
    </WidgetShell>
  );
}
