import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageMeta from "../components/PageMeta";
import { loadBlogList, longDate } from "../lib/blog.js";

// The blog's front page: every published article, newest first. Same header and card style as
// the News page's "Ntokozo's take" cards.

export default function Blog() {
  const [state, setState] = useState({ status: "loading", articles: [] });

  useEffect(() => {
    let live = true;
    loadBlogList()
      .then((articles) => live && setState({ status: "ready", articles }))
      .catch((e) => live && setState({ status: "error", message: e.message, articles: [] }));
    return () => { live = false; };
  }, []);

  return (
    <div style={{ background: C.bg }}>
      <PageMeta
        title="Blog"
        description="Plain-English guides to South African and global markets: the JSE, the rand, crypto and the economy. Educational, not financial advice."
        path="/blog"
      />
      <Nav />

      <div className="mc-pad" style={{ background: C.paper, borderBottom: `2px solid ${C.ink}`, padding: "22px 28px 18px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, letterSpacing: ".06em", marginBottom: 10 }}>
            <Link to="/" style={{ color: C.muted }}>Home</Link> / <span style={{ color: C.ink }}>Blog</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: C.ink, letterSpacing: "-.01em" }}>Blog</h1>
          <p style={{ fontFamily: SANS, fontSize: 14, color: C.muted, marginTop: 6 }}>
            Plain-English guides to South African and global markets. Educational, not financial advice.
          </p>
        </div>
      </div>

      <div className="mc-pad" style={{ padding: "28px 28px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {state.status === "loading" && <p style={{ fontFamily: SANS, color: C.muted }}>Loading articles…</p>}
        {state.status === "error" && <p style={{ fontFamily: SANS, color: C.muted }}>{state.message}</p>}
        {state.status === "ready" && state.articles.length === 0 && (
          <p style={{ fontFamily: SANS, color: C.muted }}>No articles yet. The first ones are on their way.</p>
        )}
        {state.articles.length > 0 && (
          <div className="mc-collapse-sm" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
            {state.articles.map((a) => (
              <Link key={a.slug} to={`/blog/${a.slug}`}
                style={{ background: C.paper, border: `1px solid ${C.rule}`, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8, color: "inherit" }}>
                <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: ".1em" }}>
                  {a.topic || "Guide"} · {longDate(a.publishedAt)}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: C.ink, lineHeight: 1.25, letterSpacing: "-.005em" }}>{a.title}</div>
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {a.metaDescription}
                </div>
                <div style={{ marginTop: "auto", paddingTop: 6, fontFamily: SANS, fontSize: 11.5, fontWeight: 600, color: C.blue }}>
                  Read · {a.readMinutes} min →
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
