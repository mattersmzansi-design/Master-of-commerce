import { Link } from "react-router-dom";
import { C, MONO } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useAuth } from "../lib/AuthContext";
import { usePreferences } from "../lib/usePreferences";
import { useCryptoPrices } from "../lib/useCryptoPrices";
import { WIDGETS } from "../lib/widgets";

const chgLabel = n => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

export default function Home() {
  const { user } = useAuth();
  const { layout, hidden } = usePreferences();
  const crypto = useCryptoPrices();

  const btc = crypto.find(c => c.id === "bitcoin");
  const eth = crypto.find(c => c.id === "ethereum");

  const MARKET_SUMMARY = [
    { label:"JSE All Share",  value:"84,234", unit:"pts", chg: 1.34, link:"/jse"    },
    { label:"NYSE Composite", value:"19,872", unit:"pts", chg: 0.89, link:"/nyse"   },
    { label:"Bitcoin (BTC)",  value: btc ? `$${btc.current_price.toLocaleString("en-US",{maximumFractionDigits:0})}` : "$74,842", unit:"", chg: btc?.price_change_percentage_24h ?? 2.14, link:"/crypto" },
    { label:"Ethereum (ETH)", value: eth ? `$${eth.current_price.toLocaleString("en-US",{maximumFractionDigits:0})}` : "$3,521",  unit:"", chg: eth?.price_change_percentage_24h ?? 1.76, link:"/crypto" },
    { label:"USD / ZAR",      value:"18.42",  unit:"",    chg:-0.23, link:"/nyse"   },
    { label:"Gold (XAU)",     value:"$2,312", unit:"/oz", chg: 0.54, link:"/"       },
  ];

  const byId = Object.fromEntries(WIDGETS.map(w => [w.id, w]));
  const visible = layout.filter(id => !hidden.includes(id) && byId[id]);

  return (
    <div style={{ background:C.bg }}>
      <Nav />

      {/* Market Index Strip */}
      <div style={{ background:C.ink, overflowX:"auto" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 28px", display:"flex", gap:0 }}>
          {MARKET_SUMMARY.map(m => (
            <Link to={m.link} key={m.label} style={{ display:"flex", flexDirection:"column", justifyContent:"center", padding:"7px 20px 7px 0", marginRight:20, borderRight:`1px solid rgba(255,255,255,.1)`, minWidth:120, flexShrink:0 }}>
              <div style={{ fontFamily:MONO, fontSize:9, color:"rgba(255,255,255,.45)", letterSpacing:".06em", textTransform:"uppercase", marginBottom:3 }}>{m.label}</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                <span style={{ fontFamily:MONO, fontSize:12, fontWeight:600, color:"#fff" }}>{m.value}<span style={{ fontSize:9, color:"rgba(255,255,255,.45)", marginLeft:2 }}>{m.unit}</span></span>
                <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color: m.chg >= 0 ? "#5EDB90" : "#F47E7E" }}>{chgLabel(m.chg)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {!user && (
        <div style={{ background:"#FFF3E5", borderBottom:`1px solid ${C.rule}` }}>
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"12px 28px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <span style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:13, color:C.ink }}>
              Sign in to unlock Tasks, Cash Flow, Invoices and Inventory — synced across all your devices.
            </span>
            <Link to="/settings" style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:12, fontWeight:700, color:C.blue }}>Customize your dashboard →</Link>
          </div>
        </div>
      )}

      {visible.map(id => {
        const { Component } = byId[id];
        return <Component key={id} />;
      })}

      <Footer />
    </div>
  );
}
