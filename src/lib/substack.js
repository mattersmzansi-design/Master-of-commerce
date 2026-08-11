// Client-side fetch for Substack posts. Talks to /api/substack (our Vercel
// serverless function), which does the RSS parsing on the server.

export const SUBSTACK_URL           = "https://ntokozocele.substack.com";
export const SUBSTACK_SUBSCRIBE_URL = "https://ntokozocele.substack.com/subscribe";

export async function fetchSubstackPosts() {
  try {
    const r = await fetch("/api/substack");
    if (!r.ok) return [];
    const data = await r.json();
    return Array.isArray(data.posts) ? data.posts : [];
  } catch {
    return [];
  }
}
