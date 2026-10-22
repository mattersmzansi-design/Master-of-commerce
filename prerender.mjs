// Prerender every route in public/sitemap.xml to static HTML so Googlebot (and
// link-preview crawlers) see real content on first fetch instead of an empty
// <div id="root">. Runs after `vite build`. React hydrates on top for real
// users, so the site stays fully interactive.
//
// Why: this is a Vite + React SPA. Without this step the HTML Google downloads
// is 3KB of meta tags with no body text — Google's "Discovered — not indexed"
// bucket is where SPAs go to die when they're new.

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { spawn } from 'child_process';
import { createServer } from 'http';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');
const PORT = 4321;
const BASE = `http://127.0.0.1:${PORT}`;

// Read every URL from the sitemap so routes are the single source of truth.
const sitemap = readFileSync(join(__dirname, 'public/sitemap.xml'), 'utf8');
const paths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)]
  .map(m => m[1])
  .map(p => p === '' ? '/' : p);

console.log(`→ Prerendering ${paths.length} routes: ${paths.join(', ')}`);

// Spin up `vite preview` in the background so Playwright can hit the real
// production bundle (not the dev server, which serves source modules).
const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: __dirname,
  stdio: ['ignore', 'pipe', 'pipe'],
});

// Wait until the preview server answers a ping.
await new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error('vite preview did not start in 20s')), 20000);
  const check = async () => {
    try {
      const r = await fetch(BASE + '/');
      if (r.ok) { clearTimeout(timeout); resolve(); return; }
    } catch {}
    setTimeout(check, 300);
  };
  check();
});
console.log(`✓ vite preview up on ${BASE}`);

const browser = await chromium.launch();
const context = await browser.newContext({
  // Pose as Googlebot so any UA-sniffing we add later (none today) gets the
  // crawler path. Playwright's default UA is already fine for our code.
  userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  viewport: { width: 1200, height: 900 },
});

const results = [];

for (const path of paths) {
  const page = await context.newPage();
  const url = BASE + path;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    // Give any late-arriving API data a beat to land in the DOM before the snapshot.
    await page.waitForTimeout(1500);

    // react-helmet-async appends head tags as new siblings instead of replacing
    // the originals from index.html — so we end up with 3 <title>s and 3
    // descriptions per page. Dedupe before snapshotting: for <title> keep the
    // first helmet-injected one; for named/property metas and canonical keep
    // the LAST (helmet appends per-route tags after the template defaults).
    await page.evaluate(() => {
      const head = document.head;
      // Titles: keep the first, remove the rest.
      const titles = [...head.querySelectorAll('title')];
      titles.slice(1).forEach(t => t.remove());
      // Metas by name/property: keep the last one, remove the earlier dupes.
      const seen = new Set();
      [...head.querySelectorAll('meta[name], meta[property]')].reverse().forEach(m => {
        const key = m.getAttribute('name') || m.getAttribute('property');
        if (seen.has(key)) m.remove();
        else seen.add(key);
      });
      // Canonical: keep the last.
      const canonicals = [...head.querySelectorAll('link[rel="canonical"]')];
      canonicals.slice(0, -1).forEach(l => l.remove());
    });

    const html = await page.content();
    const outPath = path === '/'
      ? join(DIST, 'index.html')
      : join(DIST, path.replace(/^\//, ''), 'index.html');
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    const size = (Buffer.byteLength(html) / 1024).toFixed(1);
    results.push(`  ✓ ${path.padEnd(14)} → ${outPath.replace(DIST, 'dist')}  (${size} KB)`);
  } catch (err) {
    results.push(`  ✗ ${path.padEnd(14)} FAILED: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
preview.kill();

console.log('\n' + results.join('\n'));
console.log(`\n✓ Prerender complete — ${results.filter(r => r.startsWith('  ✓')).length}/${paths.length} routes written to dist/`);
