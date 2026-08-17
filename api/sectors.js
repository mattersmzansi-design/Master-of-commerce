// Vercel serverless function — queries the sector_summary_public view in
// Supabase and returns the rows as JSON to the client. Runs server-side so
// the Supabase key never touches the browser bundle and the env vars can use
// any prefix (this site is Vite, so client-side env vars would need VITE_*).
//
// Cached at Vercel's edge for 10 min · stale for another 30, so refresh cost
// is minimal for readers even if Supabase gets slow.

import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cachedClient = null;
function getClient() {
  if (!URL || !KEY) return null;
  if (!cachedClient) {
    cachedClient = createClient(URL, KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cachedClient;
}

export default async function handler(req, res) {
  const supabase = getClient();
  if (!supabase) {
    res.setHeader("Cache-Control", "s-maxage=60");
    res.status(500).json({
      error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel env vars.",
      sectors: [],
    });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("sector_summary_public")
      .select("sector, report_date, health_score, health_narrative, cycle_position, tailwinds, headwinds, next_review_trigger, updated_at")
      .order("health_score", { ascending: false, nullsLast: true });

    if (error) throw error;

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1800");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).json({ sectors: Array.isArray(data) ? data : [] });
  } catch (err) {
    res.setHeader("Cache-Control", "s-maxage=60");
    res.status(502).json({ error: err.message, sectors: [] });
  }
}
