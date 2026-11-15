// Vercel serverless function — the blog's data for the React pages, from the MMM BLADE SEO feed.
//   /api/blog-data           → { articles: [...] }
//   /api/blog-data?slug=abc  → { article: {...} } or 404
// Going through our own function keeps the feed address in a server setting.

import { fetchArticle, fetchList, isSlug } from "./_blog.js";

export default async function handler(req, res) {
  const slug = new URL(req.url, "http://x").searchParams.get("slug");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  try {
    if (slug == null) {
      res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
      res.end(JSON.stringify({ articles: await fetchList() }));
      return;
    }
    const article = isSlug(slug) ? await fetchArticle(slug) : null;
    res.statusCode = article ? 200 : 404;
    res.setHeader("Cache-Control", article ? "public, s-maxage=300, stale-while-revalidate=3600" : "public, s-maxage=60");
    res.end(JSON.stringify(article ? { article } : { error: "not found" }));
  } catch (err) {
    res.statusCode = 502;
    res.setHeader("Cache-Control", "s-maxage=30");
    res.end(JSON.stringify({ error: err.message }));
  }
}
