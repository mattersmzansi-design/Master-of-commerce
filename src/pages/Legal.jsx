import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { C, SERIF, MONO, SANS } from "../theme";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const EFFECTIVE_DATE = "15 August 2026";
const CONTACT = "info@mzansimoneymatters.co.za";

// Section wrapper — matches the rest of the site's editorial look.
function Section({ id, title, children }) {
  return (
    <section id={id} style={{ scrollMarginTop: 80, marginBottom: 48 }}>
      <div style={{ borderTop: `2px solid ${C.ink}`, paddingTop: 18, marginBottom: 18 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>
          Effective {EFFECTIVE_DATE}
        </div>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, color: C.ink, letterSpacing: "-.005em", lineHeight: 1.15 }}>
          {title}
        </h2>
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 15.5, lineHeight: 1.75, color: C.ink }}>
        {children}
      </div>
    </section>
  );
}

// Plain-english paragraph — SERIF for the readable body prose.
const P = ({ children }) => <p style={{ marginBottom: 14 }}>{children}</p>;

// Bulleted list, matches site's dot styling.
const UL = ({ children }) => (
  <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 14px", display: "flex", flexDirection: "column", gap: 8 }}>
    {children}
  </ul>
);
const LI = ({ children }) => (
  <li style={{ position: "relative", paddingLeft: 18, fontFamily: SERIF, fontSize: 15, lineHeight: 1.7 }}>
    <span style={{ position: "absolute", left: 0, top: "0.65em", width: 6, height: 6, borderRadius: 3, background: C.cyan }} />
    {children}
  </li>
);

// Subheading inside a section.
const H3 = ({ children }) => (
  <h3 style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: C.ink, marginTop: 22, marginBottom: 10 }}>
    {children}
  </h3>
);

export default function LegalPage() {
  const { hash } = useLocation();

  // Jump to the anchored section when the URL hash changes (e.g. clicking a
  // footer "Privacy" link). Without this the SPA doesn't scroll on its own.
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const el = document.getElementById(hash.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <div style={{ background: C.bg }}>
      <Nav />

      {/* header */}
      <div className="mc-pad" style={{ background: C.paper, borderBottom: `2px solid ${C.ink}`, padding: "22px 28px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, letterSpacing: ".06em", marginBottom: 10 }}>
            Site / <span style={{ color: C.ink }}>Legal</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: C.ink, letterSpacing: "-.01em", marginBottom: 6 }}>
                Legal &amp; Compliance
              </h1>
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted, maxWidth: 620, lineHeight: 1.6 }}>
                The rules of the road for using Mzansi Money Matters — a financial disclaimer, the site's terms of use, and how we treat your personal information under POPIA.
              </div>
            </div>
          </div>
          {/* jump-link nav */}
          <nav style={{ display: "flex", gap: 0, marginTop: 18, flexWrap: "wrap", borderTop: `1px solid ${C.rule}`, paddingTop: 12 }}>
            {[
              { id: "disclaimer", label: "Financial Disclaimer" },
              { id: "terms",      label: "Terms of Use" },
              { id: "privacy",    label: "Privacy Policy" },
            ].map(({ id, label }) => (
              <a key={id} href={`#${id}`} style={{
                fontFamily: SANS, fontSize: 12, fontWeight: 600, color: C.blue,
                padding: "6px 14px 6px 0", marginRight: 6,
              }}>
                {label} →
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* body */}
      <section className="mc-pad" style={{ maxWidth: 900, margin: "0 auto", padding: "32px 28px 60px" }}>

        <Section id="disclaimer" title="Financial Disclaimer">
          <P>
            <strong>Mzansi Money Matters is an independent financial-media publication. Nothing on this site is personal financial advice, a solicitation to trade, or a recommendation to buy or sell any security, currency, cryptocurrency, or other financial instrument.</strong>
          </P>
          <P>
            The site publishes market news, live and delayed price data, sector commentary, prediction-market snapshots, and the personal writing of its editor. All of that is provided for <em>general information and education only</em>. It does not take into account your personal financial situation, needs, or goals.
          </P>
          <P>
            The publisher is <strong>not</strong> a licensed Financial Services Provider (FSP) under South Africa's Financial Advisory and Intermediary Services Act, 2002 (FAIS), and is not authorised to give you personal financial advice. Before making any investment decision, speak to a licensed adviser who can look at your specific circumstances.
          </P>
          <H3>Data accuracy &amp; timeliness</H3>
          <P>
            Prices, charts, odds and calendar events shown on this site are sourced from third parties (including Alpha Vantage, CoinGecko, TradingView, Polymarket and Marketaux) and may be delayed, cached, incorrect, or unavailable. We make no warranty that anything shown is accurate, current or complete. Do not rely on it for real-money decisions.
          </P>
          <H3>Third-party embeds &amp; links</H3>
          <P>
            When you click through to Polymarket, Substack, TradingView or any other external site, you leave Mzansi Money Matters and are subject to <em>their</em> terms and privacy policies. We don't control what those platforms show you, or the outcome of anything you do on them.
          </P>
          <H3>Your responsibility</H3>
          <P>
            All decisions you make based on information from this site are entirely your own. To the fullest extent permitted by South African law, the publisher, editor, contributors and affiliates accept no liability for any loss or damage — direct, indirect, consequential or otherwise — arising from your use of this site or any content on it.
          </P>
        </Section>

        <Section id="terms" title="Terms of Use">
          <P>
            By accessing this site, you agree to these terms. If you don't agree, please stop using the site.
          </P>
          <H3>Who runs the site</H3>
          <P>
            Mzansi Money Matters (mzansimoneymatters.co.za) is published from South Africa by Ntokozo Cele. You can reach us at <a href={`mailto:${CONTACT}`} style={{ color: C.blue, fontWeight: 600 }}>{CONTACT}</a>.
          </P>
          <H3>Permitted use</H3>
          <P>You may:</P>
          <UL>
            <LI>Read and share the site's content for personal, non-commercial purposes.</LI>
            <LI>Quote short excerpts with clear attribution and a link back to the source page.</LI>
            <LI>Subscribe to the newsletter and receive editorial updates via Substack.</LI>
          </UL>
          <P>You may <strong>not</strong>:</P>
          <UL>
            <LI>Scrape, mirror, or systematically copy the site's content, data or code.</LI>
            <LI>Republish articles, ratings, or sector commentary in full, in any medium, without written permission.</LI>
            <LI>Use the site or its embedded services in a way that violates the terms of the underlying platforms (TradingView, Polymarket, Substack, etc.).</LI>
            <LI>Use the site for any illegal, fraudulent, or misleading purpose.</LI>
          </UL>
          <H3>Intellectual property</H3>
          <P>
            All original written commentary, brand marks (logo, wordmark, "Mzansi Money Matters", "NEWS · DATA · SPORTS" tagline), page design and code are © 2026 Mzansi Money Matters unless credited otherwise. Third-party data and embedded widgets remain the property of their respective owners.
          </P>
          <H3>No warranty</H3>
          <P>
            The site is provided "as is" and "as available", without warranty of any kind. We don't guarantee uninterrupted availability, error-free data, or fitness for any particular purpose.
          </P>
          <H3>Changes to these terms</H3>
          <P>
            We may update these terms from time to time. The effective date at the top of this section will change when we do. Continuing to use the site after an update means you accept the updated terms.
          </P>
          <H3>Governing law</H3>
          <P>
            These terms are governed by the laws of the Republic of South Africa. Any dispute is subject to the exclusive jurisdiction of the South African courts.
          </P>
        </Section>

        <Section id="privacy" title="Privacy Policy">
          <P>
            This policy explains what personal information we collect, why we collect it, and what your rights are — written to align with South Africa's Protection of Personal Information Act, 2013 (POPIA).
          </P>
          <H3>What we collect</H3>
          <UL>
            <LI>
              <strong>Newsletter email addresses.</strong> If you sign up for our newsletter, the Subscribe button sends you to Substack's signup page — <em>your email is stored on Substack, not on our server</em>. See <a href="https://substack.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: C.blue }}>Substack's Privacy Policy</a> for how they handle it.
            </LI>
            <LI>
              <strong>Anonymous usage analytics.</strong> We use Vercel Web Analytics and Vercel Speed Insights, which are <em>cookie-less</em> and don't identify you personally. They record page views, referrers, country-level location, browser type and page-load performance — none of which is tied to an identifiable individual. See <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: C.blue }}>Vercel's Privacy Policy</a>.
            </LI>
            <LI>
              <strong>Standard server logs.</strong> Our hosting provider (Vercel) briefly logs standard request data — IP address, user agent, timestamps — for security, abuse prevention and operational purposes. These logs are retained only as long as needed.
            </LI>
            <LI>
              <strong>Emails you send us.</strong> If you email <a href={`mailto:${CONTACT}`} style={{ color: C.blue }}>{CONTACT}</a>, we keep that correspondence so we can reply and follow up.
            </LI>
          </UL>
          <H3>What we <em>don't</em> do</H3>
          <UL>
            <LI>We don't set our own tracking cookies.</LI>
            <LI>We don't sell your personal information to anyone.</LI>
            <LI>We don't run advertising networks that profile you.</LI>
            <LI>We don't require an account to read anything on the site.</LI>
          </UL>
          <H3>Third-party embeds</H3>
          <P>
            Some pages embed live widgets from TradingView (market charts) and pull data from Polymarket, Alpha Vantage, CoinGecko, Marketaux and Supabase. These providers may set their own cookies or log your visit under their own privacy policies. Follow the links on their sites for details.
          </P>
          <H3>Your POPIA rights</H3>
          <P>
            Under POPIA you have the right to:
          </P>
          <UL>
            <LI>Know what personal information we hold about you.</LI>
            <LI>Ask us to correct information that's wrong or incomplete.</LI>
            <LI>Ask us to delete information we no longer need.</LI>
            <LI>Object to how we use it.</LI>
            <LI>Lodge a complaint with the Information Regulator (SA) if you're not satisfied with our response.</LI>
          </UL>
          <P>
            To exercise any of these rights, email us at <a href={`mailto:${CONTACT}`} style={{ color: C.blue, fontWeight: 600 }}>{CONTACT}</a>. We'll respond within a reasonable time, at most 30 days.
          </P>
          <H3>Changes to this policy</H3>
          <P>
            We may update this policy. The effective date at the top of this section reflects the latest version. Material changes will be flagged on the home page or via the newsletter.
          </P>
        </Section>

        <div style={{
          marginTop: 24, padding: "18px 20px", background: C.paper,
          border: `1px solid ${C.rule2}`, borderLeft: `3px solid ${C.orange}`,
        }}>
          <p style={{ fontFamily: SANS, fontSize: 12.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: C.ink }}>Questions?</strong> Email us at{" "}
            <a href={`mailto:${CONTACT}`} style={{ color: C.blue, fontWeight: 600 }}>{CONTACT}</a>.
            You can also go back to the <Link to="/" style={{ color: C.blue, fontWeight: 600 }}>home page</Link>.
          </p>
        </div>
      </section>

      <Footer note="Legal information is general and not personal advice." />
    </div>
  );
}
