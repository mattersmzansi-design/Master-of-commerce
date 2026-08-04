// Shared live-news helper (Marketaux financial news wire).
// Both the News page and the Home "Today's Brief" use this so the fetch +
// mapping logic lives in one place. The key comes from the VITE_MARKETAUX_KEY
// env var and is never hard-coded or committed; if it's missing or the request
// fails, callers fall back to their sample stories.

export const MARKETAUX_KEY = import.meta.env.VITE_MARKETAUX_KEY;

export const timeAgo = (iso) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (!isFinite(s) || s < 0) return "just now";
  if (s < 3600)  return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
};

// Slot each article into one of the site's five categories.
export const guessCat = (a) => {
  const ex = (a.entities?.[0]?.exchange || "").toUpperCase();
  const cy = (a.entities?.[0]?.country  || "").toLowerCase();
  const t  = `${a.title} ${a.description || ""} ${a.snippet || ""}`.toLowerCase();
  if (/bitcoin|crypto|ethereum|\bbtc\b|\beth\b|token|blockchain|stablecoin/.test(t)) return "Crypto";
  if (ex.includes("JSE") || cy === "za" || /south africa|\brand\b|eskom|sarb|jse|johannesburg|load shedding/.test(t)) return "SA Economy";
  if (/nasdaq|nyse/.test(ex) || /nasdaq|wall street|dow jones|s&p 500|\bnyse\b/.test(t)) return "NYSE";
  return "Global";
};

// Map a Marketaux article to the shape the site's cards expect.
export const mapArticle = (a) => ({
  id:    `mx-${a.uuid}`,
  cat:   guessCat(a),
  title: a.title,
  dek:   a.description || a.snippet || "",
  src:   a.source || "Marketaux",
  time:  timeAgo(a.published_at),
  read:  "",              // Marketaux doesn't provide a read time
  url:   a.url,           // real source link
  image: a.image_url,
});

// Fetch up to `limit` live headlines. Resolves to [] on any problem so callers
// can simply do `if (list.length) setLive(list)` and keep their fallback data.
export async function fetchLiveNews(limit = 3) {
  if (!MARKETAUX_KEY) return [];
  try {
    const r = await fetch(`https://api.marketaux.com/v1/news/all?language=en&filter_entities=true&limit=${limit}&api_token=${MARKETAUX_KEY}`);
    const d = await r.json();
    return Array.isArray(d?.data) ? d.data.map(mapArticle) : [];
  } catch {
    return [];
  }
}
