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

// Videos: MMM BLADE SEO turns a paragraph that is only a YouTube link into
// <div data-youtube="ID" data-shape="short|wide"><a …>Watch the video on YouTube</a></div>.
// Here that becomes a privacy-friendly YouTube player (youtube-nocookie.com). The id is checked
// again, so nothing but an 11-character video id ever reaches the player's address.
const VIDEO = /<div data-youtube="([A-Za-z0-9_-]{11})" data-shape="(short|wide)">[\s\S]*?<\/div>/g;

export function withVideos(html) {
  return String(html || "").replace(
    VIDEO,
    (_, id, shape) =>
      `<div class="mc-video mc-video-${shape}"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`,
  );
}
