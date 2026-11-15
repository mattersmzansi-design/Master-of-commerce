// Vercel serverless function — serves /blog and /blog/<slug> as complete HTML pages.
// vercel.json sends those addresses here. Crawlers (Google, AI search) get the full article
// text in the HTML; people get the same page, which React then takes over (menu, search).

import { BASE, SITE_NAME, articleLd, articleMarkup, fetchArticle, fetchList, fillShell, isSlug, listMarkup, loadShell } from "./_blog.js";

function send(res, status, html, cache) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.end(html);
}

export default async function handler(req, res) {
  const slug = new URL(req.url, "http://x").searchParams.get("slug") || "";
  let shell;
  try {
    shell = await loadShell(req);
  } catch (err) {
    return send(res, 500, `<!doctype html><title>Blog</title><p>The blog couldn't load (${String(err.message).slice(0, 80)}). Try again shortly.</p>`, "no-store");
  }

  try {
    if (!slug) {
      const articles = await fetchList();
      const html = fillShell(shell, {
        title: `Blog · ${SITE_NAME}`,
        description: "Plain-English guides to South African and global markets: the JSE, the rand, crypto and the economy. Educational, not financial advice.",
        canonical: `${BASE}/blog`,
        body: listMarkup(articles),
        data: { kind: "list", articles },
      });
      return send(res, 200, html, "public, s-maxage=300, stale-while-revalidate=3600");
    }

    const article = isSlug(slug) ? await fetchArticle(slug) : null;
    if (!article) {
      const html = fillShell(shell, {
        title: `Article not found · ${SITE_NAME}`,
        description: "This article doesn't exist or isn't published yet.",
        canonical: `${BASE}/blog`,
        body: `<p style="padding:40px 22px">This article doesn't exist or isn't published yet. <a href="/blog">See all articles</a>.</p>`,
        data: { kind: "missing", slug },
      });
      // 404 tells Google not to index it; a short cache so a newly published article shows soon.
      return send(res, 404, html, "public, s-maxage=60");
    }

    const html = fillShell(shell, {
      title: `${article.metaTitle || article.title} · ${SITE_NAME}`,
      description: article.metaDescription,
      canonical: `${BASE}/blog/${article.slug}`,
      ogType: "article",
      jsonLd: articleLd(article),
      body: articleMarkup(article),
      data: { kind: "article", article },
    });
    return send(res, 200, html, "public, s-maxage=300, stale-while-revalidate=3600");
  } catch (err) {
    // The feed is down: send the app anyway, so React can try again in the browser.
    console.error("blog-page:", err.message);
    return send(res, 503, fillShell(shell, { title: `Blog · ${SITE_NAME}`, description: "", canonical: `${BASE}/blog`, body: "", data: { kind: "error" } }), "no-store");
  }
}
