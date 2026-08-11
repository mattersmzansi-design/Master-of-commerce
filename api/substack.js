// Vercel serverless function — fetches Ntokozo's Substack RSS on the server
// (Substack doesn't send CORS headers, so the browser can't fetch it directly).
// Cached at the edge for 10 min · stale for another 30, so the site is fast
// AND stays fresh without a rebuild when a new post ships.

const FEED_URL = "https://ntokozocele.substack.com/feed";

// Minimal RSS parser — Substack's format is stable, so regex is enough.
function grab(item, tag) {
  const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`).exec(item);
  if (cdata) return cdata[1];
  const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`).exec(item);
  return plain ? plain[1] : "";
}

function firstImage(html) {
  return html?.match(/<img[^>]+src="([^"]+)"/)?.[1] || null;
}

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default async function handler(req, res) {
  try {
    const r = await fetch(FEED_URL, {
      headers: { "User-Agent": "MzansiMoneyMatters/1.0 (+https://mzansimoneymatters.co.za)" },
    });
    if (!r.ok) throw new Error(`Substack RSS returned HTTP ${r.status}`);
    const xml = await r.text();

    const publication = grab(xml.match(/<channel>[\s\S]*?<\/channel>/)?.[0] || "", "title");
    const posts = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = itemRegex.exec(xml))) {
      const item = m[1];
      const content = grab(item, "content:encoded") || grab(item, "description");
      const enclosureImg = /<enclosure[^>]+url="([^"]+)"/.exec(item)?.[1];
      posts.push({
        title:       stripHtml(grab(item, "title")),
        link:        grab(item, "link").trim(),
        date:        grab(item, "pubDate").trim(),
        author:      stripHtml(grab(item, "dc:creator") || publication || "Ntokozo Cele"),
        excerpt:     stripHtml(grab(item, "description")).slice(0, 240),
        image:       enclosureImg || firstImage(content),
      });
      if (posts.length >= 20) break;
    }

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1800");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).json({ publication, posts });
  } catch (err) {
    res.setHeader("Cache-Control", "s-maxage=60"); // short cache on errors so we recover fast
    res.status(502).json({ error: err.message, posts: [] });
  }
}
