// Flat, searchable list of everything on the site.
// Each entry: { title, subtitle, path, kind } — kind drives the little tag on the result row.
//
// Data comes from the same seed constants each page renders from, so a match
// always corresponds to something you'll actually see on that page. When we
// swap seeds for live APIs (news feed, live tickers), point this file at the
// same live source and results stay in sync automatically.

import { ARTICLES }     from "../pages/News.jsx";
import { MOCK_STOCKS }  from "../pages/NYSE.jsx";
import { MOCK }         from "../pages/Crypto.jsx";
import { EVENTS }       from "../pages/Calendar.jsx";
import { FIXTURES }     from "../pages/Betting.jsx";

const PAGES = [
  { title:"Home",              subtitle:"Today's brief — markets, news, sport",   path:"/",         kind:"Page" },
  { title:"Business News",     subtitle:"Latest South African & global finance",  path:"/news",     kind:"Page" },
  { title:"JSE",               subtitle:"Johannesburg Stock Exchange (coming soon)", path:"/jse",  kind:"Page" },
  { title:"NYSE",              subtitle:"New York Stock Exchange — live prices",  path:"/nyse",     kind:"Page" },
  { title:"Crypto",            subtitle:"Bitcoin, Ethereum and the top coins",    path:"/crypto",   kind:"Page" },
  { title:"Economic Calendar", subtitle:"Global data releases and central bank meetings", path:"/calendar", kind:"Page" },
  { title:"Soccer Betting",    subtitle:"PSL, EPL, La Liga and Champions League fixtures", path:"/betting", kind:"Page" },
];

const news = ARTICLES.map(a => ({
  title:    a.title,
  subtitle: `${a.cat} · ${a.src} · ${a.time}`,
  path:     "/news",
  kind:     "News",
}));

const stocks = MOCK_STOCKS.map(s => ({
  title:    `${s.symbol} — ${s.name}`,
  subtitle: `${s.sector} · $${s.price.toFixed(2)}`,
  path:     "/nyse",
  kind:     "NYSE",
}));

const coins = MOCK.map(c => ({
  title:    `${c.name} (${c.symbol.toUpperCase()})`,
  subtitle: `Rank #${c.market_cap_rank} · $${c.current_price.toLocaleString()}`,
  path:     "/crypto",
  kind:     "Crypto",
}));

const events = EVENTS.map(e => ({
  title:    e.event,
  subtitle: `${e.date} · ${e.country} · ${e.category} · ${e.impact} impact`,
  path:     "/calendar",
  kind:     "Calendar",
}));

const fixtures = FIXTURES.map(f => ({
  title:    `${f.home} vs ${f.away}`,
  subtitle: `${f.league} · ${f.group} · ${f.kickoff}`,
  path:     "/betting",
  kind:     "Fixture",
}));

const BASE_INDEX = [...PAGES, ...news, ...stocks, ...coins, ...events, ...fixtures];
let extras = []; // populated at runtime by dynamic sources (Substack, live news, …)

export const INDEX = BASE_INDEX;

// Merge a batch of runtime items into the searchable set. Call this once at
// app start for each async source (see App.jsx). Deduped by title+path so
// React StrictMode's double-invoked useEffects don't create duplicate results.
export function addToIndex(items) {
  const seen = new Set(extras.map(x => x.title + "|" + x.path));
  for (const it of items) {
    if (!it) continue;
    const key = it.title + "|" + it.path;
    if (seen.has(key)) continue;
    seen.add(key);
    extras.push(it);
  }
}

// Query: split on whitespace, every word must appear somewhere in title+subtitle
// (case-insensitive). Ranks title-hits above subtitle-hits, and full-word
// title matches above partial ones. Returns up to `limit` results.
export function search(query, limit = 12) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/);

  const scored = [];
  for (const item of [...BASE_INDEX, ...extras]) {
    const title = item.title.toLowerCase();
    const sub   = item.subtitle.toLowerCase();
    let score = 0;
    let allWordsMatch = true;
    for (const w of words) {
      const inTitle = title.includes(w);
      const inSub   = sub.includes(w);
      if (!inTitle && !inSub) { allWordsMatch = false; break; }
      if (inTitle) score += (` ${title} `.includes(` ${w} `) ? 3 : 2);
      else score += 1;
    }
    if (allWordsMatch) scored.push({ item, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.item);
}
