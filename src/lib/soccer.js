// Live soccer fixtures + 1X2 odds via The Odds API.
// The Odds API returns upcoming matches WITH bookmaker odds in one call, so we
// get fixtures and odds from a single source (no fragile cross-API matching).
// Key comes from VITE_ODDS_API_KEY; on any problem this resolves to [] and the
// Betting page falls back to its sample fixtures.
//
// NOTE (cost): the free tier is ~500 requests/month and this runs in the
// browser, so every visitor spends credits. Fine for testing; before a public
// launch move this behind a cached serverless function.

export const ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY;

// The Odds API sport keys → the league label the UI already uses.
const LEAGUES = [
  { key: "soccer_epl",                name: "Premier League"   },
  { key: "soccer_spain_la_liga",      name: "La Liga"          },
  { key: "soccer_uefa_champs_league", name: "Champions League" },
  { key: "soccer_italy_serie_a",      name: "Serie A"          },
  { key: "soccer_germany_bundesliga", name: "Bundesliga"       },
];

const pad = (n) => String(n).padStart(2, "0");

// Bucket a kickoff into the page's groups.
function bucket(dt) {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startKick  = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  const days = Math.round((startKick - startToday) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return "This Weekend";
}

function kickoffLabel(dt, group) {
  const t = `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  if (group === "This Weekend") {
    const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dt.getDay()];
    return `${dow} ${t}`;
  }
  return t;
}

// Map one Odds API event to the Betting page's fixture shape (1X2 only).
function mapEvent(ev, leagueName) {
  const market = ev.bookmakers?.[0]?.markets?.find((m) => m.key === "h2h");
  if (!market) return null;
  const priceOf = (name) => market.outcomes.find((o) => o.name === name)?.price;
  const h = priceOf(ev.home_team);
  const a = priceOf(ev.away_team);
  const d = priceOf("Draw");
  if (h == null || a == null || d == null) return null;

  const dt = new Date(ev.commence_time);
  if (isNaN(dt)) return null;
  const group = bucket(dt);
  return {
    id: `od-${ev.id}`,
    league: leagueName,
    home: ev.home_team,
    away: ev.away_team,
    group,
    kickoff: kickoffLabel(dt, group),
    odds: { h, d, a },
    ou: null,     // Over/Under not fetched yet (kept off to save credits)
    btts: null,   // Both-teams-to-score not fetched yet
  };
}

export async function fetchLiveFixtures() {
  if (!ODDS_API_KEY) return [];
  try {
    const perLeague = await Promise.all(
      LEAGUES.map((l) =>
        fetch(`https://api.the-odds-api.com/v4/sports/${l.key}/odds/?apiKey=${ODDS_API_KEY}&regions=uk&markets=h2h&oddsFormat=decimal`)
          .then((r) => (r.ok ? r.json() : []))
          .then((list) => (Array.isArray(list) ? list.map((ev) => mapEvent(ev, l.name)).filter(Boolean) : []))
          .catch(() => [])
      )
    );
    return perLeague.flat().slice(0, 24);
  } catch {
    return [];
  }
}
