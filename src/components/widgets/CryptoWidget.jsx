import { Link } from "react-router-dom";
import { C, MONO } from "../../theme";
import { useCryptoPrices } from "../../lib/useCryptoPrices";
import WidgetShell from "./WidgetShell";

const chgLabel = n => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

export default function CryptoWidget() {
  const crypto = useCryptoPrices();
  if (crypto.length === 0) return null;

  return (
    <WidgetShell title="Cryptocurrency" sub="Live Prices via CoinGecko" link="/crypto">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:1, background:C.rule }}>
        {crypto.slice(0, 6).map(c => {
          const up = (c.price_change_percentage_24h ?? 0) >= 0;
          return (
            <Link to="/crypto" key={c.id} style={{ background:C.paper, padding:"14px 16px", display:"block" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <img src={c.image} alt={c.name} style={{ width:22, height:22, borderRadius:"50%" }} />
                <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color:C.ink }}>{c.symbol.toUpperCase()}</span>
              </div>
              <div style={{ fontFamily:MONO, fontSize:14, fontWeight:600, color:C.ink, marginBottom:3 }}>
                ${c.current_price.toLocaleString("en-US", { maximumFractionDigits:2 })}
              </div>
              <div style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color: up ? C.green : C.red }}>
                {chgLabel(c.price_change_percentage_24h ?? 0)}
              </div>
            </Link>
          );
        })}
      </div>
    </WidgetShell>
  );
}
