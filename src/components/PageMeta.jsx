import { Helmet } from "react-helmet-async";

// Per-page SEO helper — drop <PageMeta title="…" description="…" /> at the
// top of any page's JSX and it updates the browser tab title, meta
// description, canonical URL and Open Graph tags for that route.
//
// Why this matters: our site is a Vite SPA served from a single index.html,
// so without this every page would share the homepage's <title>. That's bad
// for Google (identical titles = confusion + poor rankings) and worse for
// users landing on a specific page from a shared link.

const BASE = "https://mzansimoneymatters.co.za";
const SITE_NAME = "Mzansi Money Matters";

export default function PageMeta({ title, description, path = "" }) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  const desc = description || "Your daily brief for South African & global markets — news, live data and sector commentary.";
  const canonical = `${BASE}${path}`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      {/* Open Graph overrides so link previews reflect the actual page */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
}
