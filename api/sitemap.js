// Vercel serverless function — /sitemap.xml (vercel.json sends it here).
// The site's fixed pages plus every published blog article, so Google finds new articles
// without anyone editing a file. If the blog feed is down, the fixed pages are still listed.

import { BASE, esc, fetchList } from "./_blog.js";

const PAGES = [
  ["/", "daily", "1.0"],
  ["/news", "hourly", "0.9"],
  ["/sectors", "weekly", "0.9"],
  ["/predictions", "hourly", "0.9"],
  ["/analyst", "daily", "0.9"],
  ["/blog", "daily", "0.9"],
  ["/jse", "daily", "0.8"],
  ["/nyse", "daily", "0.8"],
  ["/crypto", "hourly", "0.8"],
  ["/calendar", "daily", "0.7"],
  ["/legal", "yearly", "0.3"],
];

export default async function handler(req, res) {
  let articles = [];
  try {
    articles = await fetchList();
  } catch (err) {
    console.error("sitemap: blog feed failed:", err.message);
  }
  const urls = [
    ...PAGES.map(([p, freq, pri]) => `  <url>\n    <loc>${BASE}${p}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>`),
    ...articles.map((a) => `  <url>\n    <loc>${BASE}/blog/${esc(a.slug)}</loc>\n    <lastmod>${esc(a.updatedAt)}</lastmod>\n    <priority>0.7</priority>\n  </url>`),
  ];
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
  res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
}
