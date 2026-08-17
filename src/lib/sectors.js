// Client-side fetch for JSE sector reports. Talks to /api/sectors (our Vercel
// serverless function), which pulls from Supabase server-side.
//
// Returns { sectors, error } always — error is a string on failure, null on
// success. UI code branches on `error` to render a friendly fallback.

export async function fetchSectors() {
  try {
    const r = await fetch("/api/sectors");
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return { sectors: [], error: data.error || `Request failed (${r.status})` };
    }
    return {
      sectors: Array.isArray(data.sectors) ? data.sectors : [],
      error: data.error || null,
    };
  } catch (e) {
    return { sectors: [], error: e.message || "Network error" };
  }
}
