import { useState } from "react";
import { C, SANS, MONO } from "../../theme";
import { useAuth } from "../../lib/AuthContext";
import { useUserRows } from "../../lib/useUserRows";
import WidgetShell from "./WidgetShell";

export default function InventoryWidget() {
  const { user } = useAuth();
  const { rows, insert, update, remove } = useUserRows("inventory_items", { orderBy: "name", ascending: true });
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lowStockAt, setLowStockAt] = useState("5");

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setName(""); setQuantity(""); setLowStockAt("5");
    await insert({
      name: name.trim(),
      quantity: parseInt(quantity, 10) || 0,
      low_stock_at: parseInt(lowStockAt, 10) || 5,
    });
  };

  const adjust = (item, delta) => {
    const next = Math.max(0, item.quantity + delta);
    update(item.id, { quantity: next });
  };

  const lowStock = rows.filter(i => i.quantity <= i.low_stock_at);

  return (
    <WidgetShell title="Inventory" sub="Stock On Hand" requiresAuth={!user}>
      {lowStock.length > 0 && (
        <div style={{ marginBottom:18, padding:"12px 16px", background:"#FFF3E5", border:`1px solid ${C.amber}` }}>
          <span style={{ fontFamily:SANS, fontSize:13, fontWeight:700, color:C.amber }}>
            {lowStock.length} item{lowStock.length > 1 ? "s" : ""} low on stock:
          </span>{" "}
          <span style={{ fontFamily:SANS, fontSize:13, color:C.ink }}>{lowStock.map(i => i.name).join(", ")}</span>
        </div>
      )}

      <form onSubmit={add} style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        <input
          value={name} onChange={e => setName(e.target.value)} placeholder="Item name"
          style={{ flex:1, minWidth:140, padding:"9px 12px", border:`1px solid ${C.rule}`, background:C.bg, color:C.ink, fontFamily:SANS, fontSize:13 }}
        />
        <input
          type="number" min="0" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Qty"
          style={{ width:80, padding:"9px 12px", border:`1px solid ${C.rule}`, background:C.bg, color:C.ink, fontFamily:SANS, fontSize:13 }}
        />
        <input
          type="number" min="0" value={lowStockAt} onChange={e => setLowStockAt(e.target.value)} placeholder="Low at"
          style={{ width:90, padding:"9px 12px", border:`1px solid ${C.rule}`, background:C.bg, color:C.ink, fontFamily:SANS, fontSize:13 }}
        />
        <button type="submit" style={{ background:C.ink, color:C.bg, fontFamily:SANS, fontSize:12, fontWeight:700, padding:"9px 18px" }}>Add</button>
      </form>

      {rows.length === 0 ? (
        <p style={{ fontFamily:SANS, fontSize:13, color:C.muted }}>No stock items yet — add what you sell.</p>
      ) : (
        rows.map(item => {
          const low = item.quantity <= item.low_stock_at;
          return (
            <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.rule2}` }}>
              <span style={{ fontFamily:SANS, fontSize:13, fontWeight:600, color:C.ink, flex:1 }}>{item.name}</span>
              {low && <span style={{ fontFamily:MONO, fontSize:9, fontWeight:700, color:C.amber, textTransform:"uppercase", letterSpacing:".06em" }}>Low</span>}
              <button onClick={() => adjust(item, -1)} style={{ width:24, height:24, border:`1px solid ${C.rule}`, fontFamily:MONO, fontSize:14 }}>−</button>
              <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color: low ? C.amber : C.ink, width:36, textAlign:"center" }}>{item.quantity}</span>
              <button onClick={() => adjust(item, 1)} style={{ width:24, height:24, border:`1px solid ${C.rule}`, fontFamily:MONO, fontSize:14 }}>+</button>
              <button onClick={() => remove(item.id)} style={{ fontFamily:MONO, fontSize:11, color:C.muted }}>Remove</button>
            </div>
          );
        })
      )}
    </WidgetShell>
  );
}
