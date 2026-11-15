/* global process */
// Shared helpers for the blog's serverless functions. Vercel doesn't turn files starting
// with "_" into routes, so this file is only imported, never called directly.
//
// WHERE THE ARTICLES COME FROM: MMM BLADE SEO (the SEO app) publishes articles to a public,
// read-only feed. Its address goes in the Vercel environment variable MMM_BLOG_FEED, e.g.
//   https://mmm-blade-seo.vercel.app/api/public/blog/<key>
// The feed only ever contains published articles. Without the variable the blog is empty.

import { readFileSync } from "node:fs";
import { join } from "node:path";

export const BASE = "https://www.mzansimoneymatters.co.za";
export const SITE_NAME = "Mzansi Money Matters";

const FEED = (process.env.MMM_BLOG_FEED || "").trim().replace(/\/+$/, "");
const SLUG = /^[a-z0-9-]{1,100}$/;

export function isSlug(s) {
  return typeof s === "string" && SLUG.test(s);
}

async function getJson(url) {
  const r = await fetch(url, {
    headers: { "User-Agent": "MzansiMoneyMatters/1.0 (+https://www.mzansimoneymatters.co.za)" },
    signal: AbortSignal.timeout(8000),
  });
  if (r.status === 404) return { notFound: true };
  if (!r.ok) throw new Error(`feed answered ${r.status}`);
  return { data: await r.json() };
}

/** Published articles, newest first. Empty if the feed isn't set up. */
export async function fetchList() {
  if (!FEED) return [];
  const { data, notFound } = await getJson(FEED);
  return notFound ? [] : (data.articles || []);
}

/** One published article, or null if there's no such article. */
export async function fetchArticle(slug) {
  if (!FEED || !isSlug(slug)) return null;
  const { data, notFound } = await getJson(`${FEED}/${slug}`);
  return notFound ? null : data.article;
}

// ---------- the app's HTML shell ----------

/**
 * The built index.html with the app's script and style tags, saved untouched by prerender.mjs as
 * _shell.html. Read from the build output if the function can see it, else fetched from the site.
 */
export async function loadShell(req) {
  for (const p of [join(process.cwd(), "dist", "_shell.html"), join(process.cwd(), "_shell.html")]) {
    try {
      return readFileSync(p, "utf8");
    } catch {
      // not bundled with the function: try the next place
    }
  }
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  // Preview deployments are behind Vercel's login: pass on the visitor's own cookie so the
  // request back to the same preview is allowed. Production pages are public anyway.
  const r = await fetch(`${proto}://${host}/_shell.html`, {
    headers: req.headers.cookie ? { cookie: req.headers.cookie } : {},
    signal: AbortSignal.timeout(5000),
  });
  if (!r.ok) throw new Error(`shell answered ${r.status}`);
  return r.text();
}

// ---------- escaping ----------

export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** JSON that's safe inside a <script> tag. */
export function scriptJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

export function longDate(iso) {
  return new Date(iso).toLocaleDateString("en-ZA", { timeZone: "Africa/Johannesburg", day: "numeric", month: "long", year: "numeric" });
}

// ---------- page assembly ----------

/** Puts a page's title, meta tags, structured data, crawler HTML and data into the shell. */
export function fillShell(shell, { title, description, canonical, ogType = "website", jsonLd = [], body, data }) {
  const t = esc(title);
  const d = esc(description);
  const c = esc(canonical);
  const head = [
    `<link rel="canonical" href="${c}">`,
    ...jsonLd.map((j) => `<script type="application/ld+json">${scriptJson(j)}</script>`),
    `<script id="mmm-blog-data" type="application/json">${scriptJson(data)}</script>`,
  ].join("\n    ");
  return shell
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${d}">`)
    .replace(/<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${ogType}">`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${t}">`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${d}">`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${c}">`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${t}">`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${d}">`)
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

// Crawler HTML in layout B ("briefing with side rail"). React replaces it when the page loads
// (src/pages/BlogArticle.jsx renders the same layout), so people see the live app with the menu.
const INK = "#012030";
const box = "max-width:1100px;margin:0 auto;padding:0 22px";
const mono = "font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em";

export function articleMarkup(a) {
  const by = [a.author ? `By <b>${esc(a.author.name)}</b>` : "", `Updated ${esc(longDate(a.updatedAt))}`, `${a.readMinutes} min read`].filter(Boolean).join(" · ");
  const takeaways = a.keyTakeaways.length
    ? `<section><div style="${mono}">Key takeaways</div><ul>${a.keyTakeaways.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></section>`
    : "";
  const toc = a.headings.length >= 3
    ? `<nav aria-label="In this article"><div style="${mono}">In this article</div><ol>${a.headings.map((h) => `<li><a href="#${esc(h.id)}">${esc(h.text)}</a></li>`).join("")}</ol></nav>`
    : "";
  const faq = a.faq.length
    ? `<h2>Frequently asked questions</h2>${a.faq.map((f) => `<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`).join("")}`
    : "";
  const sources = a.sources.length
    ? `<h2>Sources</h2><ul>${a.sources.map((s) => `<li><a href="${esc(s.url)}" rel="noopener noreferrer">${esc(s.name)}</a></li>`).join("")}</ul>`
    : "";
  const related = a.related.length
    ? `<section><div style="${mono}">More on this topic</div><ul>${a.related.map((r) => `<li><a href="/blog/${esc(r.slug)}">${esc(r.title)}</a></li>`).join("")}</ul></section>`
    : "";
  return `<div style="font-family:Poppins,system-ui,sans-serif;color:${INK};line-height:1.6">
<header style="background:#fff;border-bottom:2px solid ${INK}"><div style="${box};padding-top:26px;padding-bottom:22px">
<div style="${mono};color:#F24E01"><a href="/blog">Blog</a>${a.topic ? ` · ${esc(a.topic)}` : ""}</div>
<h1 style="font-family:Lora,Georgia,serif;font-size:36px;line-height:1.12;margin:8px 0 12px">${esc(a.title)}</h1>
<p style="font-size:13px;color:#5A727C">${by}</p></div></header>
<div style="${box};padding-top:28px;padding-bottom:40px">${takeaways}${toc}
<article style="font-family:Lora,Georgia,serif;font-size:16.5px;line-height:1.75">${a.html}${faq}${sources}</article>
${a.author?.bio ? `<p><b>${esc(a.author.name)}</b>: ${esc(a.author.bio)}</p>` : ""}
<p><em>Educational content only, not financial advice.</em></p>${related}</div></div>`;
}

export function listMarkup(articles) {
  const items = articles.length
    ? articles.map((a) => `<li><a href="/blog/${esc(a.slug)}"><h2 style="font-family:Lora,Georgia,serif">${esc(a.title)}</h2></a><p>${esc(a.metaDescription)}</p><p style="font-size:12px;color:#5A727C">${esc(longDate(a.publishedAt))} · ${a.readMinutes} min read</p></li>`).join("")
    : "<li>No articles yet.</li>";
  return `<div style="font-family:Poppins,system-ui,sans-serif;color:${INK};${box};padding-top:26px;padding-bottom:40px">
<h1 style="font-family:Lora,Georgia,serif">Blog</h1><p>Plain-English guides to South African and global markets.</p><ul>${items}</ul></div>`;
}

/** Article structured data: what it is, who wrote it, when. */
export function articleLd(a) {
  const url = `${BASE}/blog/${a.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.metaDescription,
      mainEntityOfPage: url,
      datePublished: a.publishedAt,
      dateModified: a.updatedAt,
      ...(a.author ? { author: { "@type": "Person", name: a.author.name } } : {}),
      publisher: { "@id": `${BASE}/#org` },
      inLanguage: "en-ZA",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
        { "@type": "ListItem", position: 3, name: a.title, item: url },
      ],
    },
  ];
}
