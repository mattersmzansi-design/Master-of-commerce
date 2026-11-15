// The blog's data, from /api/blog-data (our serverless function, which reads the MMM BLADE SEO
// feed). On the first page load the server already put the data in the page as
// <script id="mmm-blog-data">, so we use that instead of asking again.

function embedded() {
  try {
    const el = document.getElementById("mmm-blog-data");
    return el ? JSON.parse(el.textContent) : null;
  } catch {
    return null;
  }
}

export async function loadBlogList() {
  const e = embedded();
  if (e?.kind === "list") return e.articles;
  const r = await fetch("/api/blog-data");
  if (!r.ok) throw new Error("The blog couldn't load. Try again shortly.");
  return (await r.json()).articles || [];
}

/** The article, or null if it doesn't exist or isn't published. */
export async function loadBlogArticle(slug) {
  const e = embedded();
  if (e?.kind === "article" && e.article.slug === slug) return e.article;
  if (e?.kind === "missing" && e.slug === slug) return null;
  const r = await fetch(`/api/blog-data?slug=${encodeURIComponent(slug)}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error("The article couldn't load. Try again shortly.");
  return (await r.json()).article;
}

export function longDate(iso) {
  return new Date(iso).toLocaleDateString("en-ZA", { timeZone: "Africa/Johannesburg", day: "numeric", month: "long", year: "numeric" });
}
