import { useEffect, useMemo, useState } from "react";
import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ShareToFacebookButton from "../components/ShareToFacebookButton";
import { fetchSectors } from "../lib/sectors.js";

// Build the pre-written Facebook caption for a sector report. The owner just
// pastes it into FB's compose box after the button opens the share window.
function buildShareCaption(row) {
  const { label } = healthLabel(row.health_score);
  const emoji = row.health_score == null ? "📋"
              : row.health_score >= 70 ? "🟢"
              : row.health_score >= 40 ? "🟡"
              : "🔴";
  const firstSentence = (row.health_narrative || "").split(/(?<=[.!?])\s+/)[0];
  return [
    `${emoji} ${row.sector} — ${label} (${row.health_score ?? "—"}/100)`,
    row.cycle_position ? `Cycle: ${row.cycle_position}` : null,
    "",
    firstSentence || "This week's sector read is up on the site.",
    "",
    "Full breakdown — tailwinds, headwinds & what to watch next:",
    "https://mzansimoneymatters.co.za/sectors",
    "",
    "#JSE #SouthAfricanMarkets #MoneyMatters",
  ].filter(v => v !== null).join("\n");
}

// Compliance: this page is educational market commentary only.
// The disclaimer text below is required and must stay visible on the page.
const DISCLAIMER =
  "This content is general market commentary for educational purposes only, not personal financial advice. It does not constitute a recommendation to buy or sell any security.";

function healthLabel(score) {
  if (score == null) return { label: "Report pending",  color: C.muted };
  if (score >= 70)   return { label: "Healthy",         color: C.green };
  if (score >= 40)   return { label: "Mixed",           color: C.amber };
  return              { label: "Under pressure", color: C.red   };
}

function fmtDate(v) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
  } catch { return String(v); }
}
function fmtStamp(v) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString("en-ZA", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return String(v); }
}

function asArray(v) {
  return Array.isArray(v) ? v.filter(Boolean).map(String) : [];
}

function HealthGauge({ score }) {
  const pct = score == null ? 0 : Math.max(0, Math.min(100, score));
  const { label, color } = healthLabel(score);
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, justifyContent: "flex-end" }}>
        <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>
          {score == null ? "—" : score}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em" }}>
          / 100
        </span>
      </div>
      <div style={{ marginTop: 6, height: 6, borderRadius: 3, background: C.rule2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, transition: "width .3s" }} />
      </div>
      <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 9, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: ".1em", textAlign: "right" }}>
        {label}
      </div>
    </div>
  );
}

function SectorCard({ row }) {
  const [expanded, setExpanded] = useState(false);
  const tailwinds = asArray(row.tailwinds);
  const headwinds = asArray(row.headwinds);
  const narrative = row.health_narrative || "";
  const excerpt   = narrative.length > 260 ? narrative.slice(0, 260).trimEnd() + "…" : narrative;
  const hasFull   = narrative.length > excerpt.length;

  return (
    <article style={{
      background: C.paper, border: `1px solid ${C.rule}`, padding: "22px 22px 20px",
      display: "flex", flexDirection: "column", gap: 16, minWidth: 0,
    }}>
      {/* header row: name + gauge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: C.ink, letterSpacing: "-.005em", lineHeight: 1.2 }}>
            {row.sector || "Unnamed sector"}
          </h2>
          {row.cycle_position && (
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, marginTop: 6, fontStyle: "italic" }}>
              Cycle: <span style={{ color: C.ink, fontStyle: "normal" }}>{row.cycle_position}</span>
            </div>
          )}
        </div>
        <HealthGauge score={row.health_score} />
      </div>

      {/* narrative */}
      {narrative ? (
        <div>
          <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>
            Weekly read
          </div>
          <p style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.7, color: C.ink }}>
            {expanded ? narrative : excerpt}
          </p>
          {hasFull && (
            <button onClick={() => setExpanded(v => !v)} style={{
              marginTop: 8, background: "none", border: "none", padding: 0,
              fontFamily: SANS, fontSize: 12, fontWeight: 700, color: C.blue, cursor: "pointer",
            }}>
              {expanded ? "Show less" : "Read the full commentary →"}
            </button>
          )}
        </div>
      ) : (
        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
          Weekly commentary in progress — check back soon.
        </p>
      )}

      {/* tailwinds + headwinds */}
      {(tailwinds.length > 0 || headwinds.length > 0) && (
        <div className="mc-collapse-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 2 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>
              Tailwinds
            </div>
            {tailwinds.length ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {tailwinds.map((t, i) => (
                  <li key={i} style={{ fontFamily: SANS, fontSize: 13, color: C.ink, lineHeight: 1.55, paddingLeft: 14, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: 8, width: 6, height: 6, borderRadius: 3, background: C.green }} />
                    {t}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.muted, fontStyle: "italic" }}>None flagged this week.</div>
            )}
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>
              Headwinds
            </div>
            {headwinds.length ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {headwinds.map((h, i) => (
                  <li key={i} style={{ fontFamily: SANS, fontSize: 13, color: C.ink, lineHeight: 1.55, paddingLeft: 14, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: 8, width: 6, height: 6, borderRadius: 3, background: C.red }} />
                    {h}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.muted, fontStyle: "italic" }}>None flagged this week.</div>
            )}
          </div>
        </div>
      )}

      {/* what to watch */}
      {row.next_review_trigger && (
        <div style={{ borderTop: `1px solid ${C.rule2}`, paddingTop: 14, marginTop: 2 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.cyan, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>
            What to watch next
          </div>
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.ink, lineHeight: 1.6 }}>
            {row.next_review_trigger}
          </div>
        </div>
      )}

      {/* meta + share */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "flex-start", paddingTop: 10, borderTop: `1px solid ${C.rule2}`, marginTop: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em" }}>
            Report: {fmtDate(row.report_date)}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}>
            Updated {fmtStamp(row.updated_at)}
          </span>
        </div>
        {row.health_score != null && (
          <ShareToFacebookButton
            caption={buildShareCaption(row)}
            url={`https://mzansimoneymatters.co.za/sectors#${encodeURIComponent((row.sector || "").toLowerCase().replace(/\s+/g, "-"))}`}
            label="Share to FB"
          />
        )}
      </div>
    </article>
  );
}

function DisclaimerBanner() {
  return (
    <div style={{
      background: "#FFF3E5", border: `1px solid rgba(242,78,1,0.25)`, borderLeft: `4px solid ${C.orange}`,
      padding: "14px 18px", marginBottom: 28,
    }}>
      <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>
        Educational content · Not financial advice
      </div>
      <p style={{ fontFamily: SANS, fontSize: 12.5, color: C.ink, lineHeight: 1.6, margin: 0 }}>
        {DISCLAIMER}
      </p>
    </div>
  );
}

export default function SectorsPage() {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [rows,    setRows]    = useState([]);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchSectors().then(({ sectors, error }) => {
      setRows(sectors);
      setError(error);
      setLoading(false);
    });
  };

  useEffect(load, []);

  // The API already sorts by health_score desc; keep the guarantee client-side too
  // so partial/stale caches always render in a consistent order.
  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const av = a.health_score == null ? -1 : a.health_score;
      const bv = b.health_score == null ? -1 : b.health_score;
      return bv - av;
    });
  }, [rows]);

  const lastUpdated = useMemo(() => {
    if (!sorted.length) return null;
    const latest = sorted.reduce((acc, r) => {
      const d = r.updated_at ? new Date(r.updated_at).getTime() : 0;
      return d > acc ? d : acc;
    }, 0);
    return latest ? new Date(latest) : null;
  }, [sorted]);

  return (
    <div style={{ background: C.bg }}>
      <Nav />

      {/* page header — matches NYSE / Crypto / JSE pages */}
      <div className="mc-pad" style={{ background: C.paper, borderBottom: `2px solid ${C.ink}`, padding: "22px 28px 18px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, letterSpacing: ".06em", marginBottom: 10 }}>
            Markets / <span style={{ color: C.ink }}>Sector Health · JSE</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: C.ink, letterSpacing: "-.01em", marginBottom: 6 }}>
                Sector Health
              </h1>
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted, maxWidth: 620, lineHeight: 1.6 }}>
                Weekly educational commentary on the health of JSE-listed sectors — tailwinds, headwinds, and what to watch next. Sorted by health score.
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {lastUpdated && (
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>
                  Latest report {fmtStamp(lastUpdated)}
                </span>
              )}
              <button onClick={load} disabled={loading} style={{
                fontFamily: SANS, fontSize: 11, fontWeight: 700, color: C.blue,
                background: "none", border: "none", cursor: "pointer", opacity: loading ? .5 : 1,
              }}>
                ↻ Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* body */}
      <section className="mc-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 28px 60px" }}>
        <DisclaimerBanner />

        {loading && (
          <div style={{ padding: "60px 0", textAlign: "center", fontFamily: MONO, fontSize: 12, color: C.muted }}>
            Loading sector reports…
          </div>
        )}

        {!loading && error && (
          <div style={{
            padding: "24px 20px", background: "#FDECE1", border: `1px solid rgba(194,69,31,0.3)`, borderLeft: `4px solid ${C.red}`,
            fontFamily: SANS, fontSize: 13.5, color: C.ink, lineHeight: 1.6,
          }}>
            <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>
              Couldn't load reports
            </div>
            {error}
            <div style={{ marginTop: 12 }}>
              <button onClick={load} style={{
                fontFamily: SANS, fontSize: 12, fontWeight: 700, background: C.ink, color: C.bg,
                border: "none", padding: "8px 16px", cursor: "pointer",
              }}>Try again</button>
            </div>
          </div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <div style={{ padding: "60px 20px", textAlign: "center", background: C.paper, border: `1px solid ${C.rule}` }}>
            <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
              No sector reports yet
            </div>
            <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.muted, lineHeight: 1.6, maxWidth: 420, margin: "0 auto" }}>
              The weekly rundown lands here every Monday. Check back soon, or subscribe on the Substack to get notified.
            </div>
          </div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div className="mc-collapse" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 20 }}>
            {sorted.map((row) => (
              <SectorCard key={`${row.sector}-${row.report_date}`} row={row} />
            ))}
          </div>
        )}

        {/* Footer-of-body disclaimer restate — visible near where readers finish */}
        {!loading && sorted.length > 0 && (
          <div style={{ marginTop: 40, padding: "18px 20px", background: C.paper, border: `1px solid ${C.rule2}`, borderLeft: `3px solid ${C.orange}` }}>
            <p style={{ fontFamily: SANS, fontSize: 12, color: C.muted, lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: C.ink }}>Reminder:</strong> {DISCLAIMER}
            </p>
          </div>
        )}
      </section>

      <Footer note="Sector data via Mzansi Money Matters research · Educational only" />
    </div>
  );
}
