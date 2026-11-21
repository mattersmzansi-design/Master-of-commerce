import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageMeta from "../components/PageMeta";
import { loadBlogArticle, longDate, withVideos } from "../lib/blog.js";

// One blog article in layout B ("briefing with side rail"), chosen from three mockups.
// Articles are written and published in MMM BLADE SEO; the HTML arrives already sanitised.

const LABEL = { fontFamily: MONO, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", color: C.ink, marginBottom: 10 };
const CARD = { background: C.paper, border: `1px solid ${C.rule}`, padding: "16px 18px" };

// html (when the feed sends it) is the same line with its source links, already sanitised by MMM BLADE SEO.
function Dots({ items, html }) {
  return (
    <ul className="mc-inline-links" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
      {items.map((t, i) => (
        <li key={t} style={{ position: "relative", paddingLeft: 18, fontFamily: SERIF, fontSize: 14.5, lineHeight: 1.55 }}>
          <span style={{ position: "absolute", left: 0, top: "0.6em", width: 6, height: 6, borderRadius: 3, background: C.cyan }} />
          {html?.[i] ? <span dangerouslySetInnerHTML={{ __html: html[i] }} /> : t}
        </li>
      ))}
    </ul>
  );
}

function MoreOnTopic({ related, className }) {
  if (!related.length) return null;
  return (
    <div className={className} style={CARD}>
      <div style={LABEL}>More on this topic</div>
      {related.map((r, i) => (
        <Link key={r.slug} to={`/blog/${r.slug}`}
          style={{ display: "block", fontFamily: SERIF, fontWeight: 600, fontSize: 14.5, color: C.ink, lineHeight: 1.3, padding: "9px 0", borderTop: i ? `1px solid ${C.rule2}` : "none", paddingTop: i ? 9 : 0 }}>
          {r.title}
        </Link>
      ))}
    </div>
  );
}

export default function BlogArticle() {
  const { slug } = useParams();
  // The result is stored with the slug it belongs to; a different slug in the address means
  // its article is still loading (so moving between articles shows "Loading", not the old one).
  const [result, setResult] = useState({ slug: null });
  const state = result.slug === slug ? result : { status: "loading" };

  useEffect(() => {
    let live = true;
    loadBlogArticle(slug)
      .then((article) => live && setResult(article ? { slug, status: "ready", article } : { slug, status: "missing" }))
      .catch((e) => live && setResult({ slug, status: "error", message: e.message }));
    return () => { live = false; };
  }, [slug]);

  // Jump to the heading in the address (e.g. from "In this article"), once the text is on the page.
  useEffect(() => {
    if (state.status !== "ready") return;
    if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [state.status, slug]);

  const a = state.article;
  return (
    <div style={{ background: C.bg }}>
      {a && <PageMeta title={a.metaTitle || a.title} description={a.metaDescription} path={`/blog/${a.slug}`} />}
      <Nav />

      {state.status !== "ready" ? (
        <div className="mc-pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 22px", fontFamily: SANS, color: C.muted }}>
          {state.status === "loading" && "Loading the article…"}
          {state.status === "error" && state.message}
          {state.status === "missing" && (
            <>
              <h1 style={{ fontFamily: SERIF, color: C.ink, fontSize: 28, marginBottom: 10 }}>Article not found</h1>
              <p>This article doesn't exist or isn't published yet. <Link to="/blog" style={{ color: C.blue }}>See all articles</Link>.</p>
            </>
          )}
        </div>
      ) : (
        <>
          {/* header */}
          <div style={{ background: C.paper, borderBottom: `2px solid ${C.ink}` }}>
            <div className="mc-pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "26px 22px 22px" }}>
              <div style={{ ...LABEL, color: C.orange, marginBottom: 8 }}>
                <Link to="/blog" style={{ color: C.orange }}>Blog</Link>{a.topic && ` · ${a.topic}`}
              </div>
              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(26px,4.2vw,40px)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-.01em", color: C.ink, marginBottom: 12, maxWidth: 820 }}>
                {a.title}
              </h1>
              <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.muted }}>
                {a.author && <>By <b style={{ color: C.ink, fontWeight: 600 }}>{a.author.name}</b> · </>}
                Updated {longDate(a.updatedAt)} · {a.readMinutes} min read
              </div>
            </div>
          </div>

          <div className="mc-pad mc-blog-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 22px 44px" }}>
            <article style={{ minWidth: 0 }}>
              <div className="mc-prose" dangerouslySetInnerHTML={{ __html: withVideos(a.html) }} />

              {a.faq.length > 0 && (
                <section className="mc-prose">
                  <h2>Frequently asked questions</h2>
                  {a.faq.map((f) => (
                    <div key={f.question}>
                      <h3>{f.question}</h3>
                      {f.answerHtml ? <p dangerouslySetInnerHTML={{ __html: f.answerHtml }} /> : <p>{f.answer}</p>}
                    </div>
                  ))}
                </section>
              )}

              {a.sources.length > 0 && (
                <section style={{ marginTop: 26, borderTop: `1px solid ${C.rule}`, paddingTop: 14, fontFamily: SANS, fontSize: 13 }}>
                  <div style={{ ...LABEL, color: C.muted }}>Sources</div>
                  <ul style={{ marginLeft: 18 }}>
                    {a.sources.map((s) => (
                      <li key={s.url} style={{ margin: "6px 0" }}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: C.blue }}>{s.name}</a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {a.author?.bio && (
                <p style={{ marginTop: 26, borderTop: `1px solid ${C.rule}`, paddingTop: 14, fontFamily: SANS, fontSize: 13, color: C.muted }}>
                  <b style={{ color: C.ink }}>{a.author.name}</b>: {a.author.bio}
                </p>
              )}
              <p style={{ marginTop: 18, fontFamily: SANS, fontSize: 12, color: C.muted, fontStyle: "italic" }}>
                Educational content only, not financial advice. See our <Link to="/legal#disclaimer" style={{ color: C.blue }}>disclaimer</Link>.
              </p>

              <MoreOnTopic related={a.related} className="mc-blog-more-sm" />
            </article>

            <aside className="mc-blog-rail">
              {a.keyTakeaways.length > 0 && (
                <div style={{ ...CARD, borderTop: `3px solid ${C.gold}` }}>
                  <div style={LABEL}>Key takeaways</div>
                  <Dots items={a.keyTakeaways} html={a.keyTakeawaysHtml} />
                </div>
              )}
              {a.headings.length >= 3 && (
                <nav aria-label="In this article" style={CARD}>
                  <div style={LABEL}>In this article</div>
                  <ol style={{ marginLeft: 18, fontFamily: SANS, fontSize: 13.5, lineHeight: 1.85 }}>
                    {a.headings.map((h) => (
                      <li key={h.id}><a href={`#${h.id}`} style={{ color: C.blue }}>{h.text}</a></li>
                    ))}
                  </ol>
                </nav>
              )}
              <MoreOnTopic related={a.related} className="mc-blog-more" />
            </aside>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}
