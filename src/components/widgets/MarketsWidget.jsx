import { useState } from "react";
import { Link } from "react-router-dom";
import { C, MONO, SANS } from "../../theme";
import { useCryptoPrices } from "../../lib/useCryptoPrices";
import WidgetShell from "./WidgetShell";

const JSE = [
  { symbol:"NPN", name:"Naspers",        price:3284.50, chg: 2.34 },
  { symbol:"MTN", name:"MTN Group",      price: 142.60, chg:-1.12 },
  { symbol:"SBK", name:"Standard Bank",  price: 213.40, chg: 0.87 },
  { symbol:"AGL", name:"Anglo American", price: 524.30, chg:-0.45 },
  { symbol:"SHP", name:"Shoprite",       price: 287.90, chg: 1.56 },
  { symbol:"SOL", name:"Sasol",          price: 189.20, chg:-2.31 },
];

const NYSE = [
  { symbol:"AAPL", name:"Apple",     price:213.45, chg: 0.89 },
  { symbol:"MSFT", name:"Microsoft", price:428.30, chg: 1.24 },
  { symbol:"NVDA", name:"NVIDIA",    price:875.60, chg: 3.21 },
  { symbol:"TSLA", name:"Tesla",     price:248.90, chg:-1.87 },
  { symbol:"AMZN", name:"Amazon",    price:198.40, chg: 0.56 },
  { symbol:"META", name:"Meta",      price:524.10, chg: 2.10 },
];

const chgColor = n => n >= 0 ? C.green : C.red;
const chgLabel = n => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
const fmtPrice = (n, prefix = "") => `${prefix}${n.toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 })}`;

export default function MarketsWidget() {
  const [mktTab, setMktTab] = useState("JSE");
  const crypto = useCryptoPrices();

  const mktData = mktTab === "JSE" ? JSE : mktTab === "NYSE" ? NYSE :
    crypto.slice(0, 6).map(c => ({ symbol:c.symbol.toUpperCase(), name:c.name, price:c.current_price, chg:c.price_change_percentage_24h ?? 0 }));
  const mktPrefix = mktTab === "JSE" ? "R " : "$ ";

  return (
    <WidgetShell title="Markets" sub="Live Prices" link="/crypto">
      <div style={{ display:"flex", gap:0, marginBottom:0, borderBottom:`1px solid ${C.ink}` }}>
        {["JSE","NYSE","Crypto"].map(t => (
          <button key={t} onClick={() => setMktTab(t)} style={{
            fontFamily:SANS, fontSize:12, fontWeight: mktTab === t ? 700 : 500,
            color: mktTab === t ? C.ink : C.muted,
            padding:"8px 20px", borderBottom: mktTab === t ? `2px solid ${C.ink}` : "2px solid transparent",
            marginBottom:"-1px", background:"none",
          }}>{t}</button>
        ))}
      </div>
      <table style={{ width:"100%" }}>
        <thead>
          <tr style={{ borderBottom:`1px solid ${C.rule}` }}>
            {["Symbol","Name","Price","Change 24H"].map(h => (
              <th key={h} style={{ fontFamily:MONO, fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:".08em", padding:"10px 12px", textAlign:"left", fontWeight:600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mktData.slice(0, 5).map(s => (
            <tr key={s.symbol} style={{ borderBottom:`1px solid ${C.rule2}` }}>
              <td style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:C.ink, padding:"12px 12px" }}>{s.symbol}</td>
              <td style={{ fontFamily:SANS, fontSize:13, color:C.muted, padding:"12px 12px" }}>{s.name}</td>
              <td style={{ fontFamily:MONO, fontSize:13, fontWeight:600, color:C.ink, padding:"12px 12px" }}>{mktPrefix}{fmtPrice(s.price)}</td>
              <td style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:chgColor(s.chg), padding:"12px 12px" }}>{chgLabel(s.chg)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ paddingTop:12 }}>
        <Link to={mktTab === "JSE" ? "/jse" : mktTab === "NYSE" ? "/nyse" : "/crypto"} style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:C.blue }}>Full {mktTab} data →</Link>
      </div>
    </WidgetShell>
  );
}
