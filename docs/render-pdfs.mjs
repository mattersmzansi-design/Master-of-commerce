// Render the two branded PDFs from the markdown sources.
// Usage:  node docs/render-pdfs.mjs
//
// Reads:   docs/briefer.md, docs/prompts.md, docs/fonts/*, public/logo-mark.png
// Writes:  docs/mzansi-briefer.pdf, docs/mzansi-prompt-guide.pdf
//
// The markdown parser here handles only what these two docs need:
// - "# Title" (first h1 becomes the page title)
// - "> blockquote" (becomes the subtitle line, HTML stripped)
// - "## Section" with `- list items` beneath it
// - "**bold**" inline
// - triple hyphens as a section divider
// Nothing fancier — keep the source files simple.

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');

// ── colours & typography tokens (from src/theme.js) ─────────────────────────
const orange='#F24E01', cyan='#00D2F0', gold='#F0B400', ink='#012030', bg='#FFF8F0';
const GRAD  = 'radial-gradient(130% 150% at 28% 28%, #FBC02D 0%, #F7941E 46%, #F24E01 100%)';

// ── font loading ────────────────────────────────────────────────────────────
function dataUrl(file, mime) {
  return `data:${mime};base64,` + readFileSync(file).toString('base64');
}
const fontsDir = path.join(HERE, 'fonts');
const FONT_CSS = `
@font-face{font-family:Poppins;font-weight:400;src:url(${dataUrl(path.join(fontsDir,'poppins-700.woff2'),'font/woff2')}) format('woff2')}
@font-face{font-family:Poppins;font-weight:700;src:url(${dataUrl(path.join(fontsDir,'poppins-700.woff2'),'font/woff2')}) format('woff2')}
@font-face{font-family:Poppins;font-weight:800;src:url(${dataUrl(path.join(fontsDir,'poppins-800.woff2'),'font/woff2')}) format('woff2')}
@font-face{font-family:Lora;font-weight:700;src:url(${dataUrl(path.join(fontsDir,'lora-700.woff2'),'font/woff2')}) format('woff2')}
`;
const MARK = dataUrl(path.join(REPO, 'public', 'logo-mark.png'), 'image/png');

// ── minimal markdown → structured sections ──────────────────────────────────
function parseMarkdown(md) {
  const lines = md.split('\n');
  let title = '', subtitle = '';
  const sections = []; // [{ heading, items:[strings] }]
  let cur = null;

  for (let raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    if (line.startsWith('# ')) { title = line.slice(2).trim(); continue; }
    if (line.startsWith('> ')) { subtitle += (subtitle ? ' ' : '') + line.slice(2).trim(); continue; }
    if (line.startsWith('## ')) { cur = { heading: line.slice(3).trim(), items:[] }; sections.push(cur); continue; }
    if (line.startsWith('- ') && cur) { cur.items.push(line.slice(2).trim()); continue; }
    if (line.startsWith('---')) continue;
    // continuation of the previous list item
    if (cur && cur.items.length && line.startsWith(' ')) {
      cur.items[cur.items.length-1] += ' ' + line.trim();
    }
  }
  return { title, subtitle, sections };
}

function inlineMD(s) {
  return s
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

// Split a "- **Title** — description" list item into a { title, description } pair.
// If there's no title, description holds the whole thing and title is empty.
function splitTitleDesc(itemMd) {
  const m = itemMd.match(/^\*\*([^*]+)\*\*\s*[—–-]\s*(.+)$/);
  if (m) return { title: m[1], desc: m[2] };
  return { title: '', desc: itemMd };
}

// ── HTML shell shared by both docs ──────────────────────────────────────────
const STYLE = `${FONT_CSS}
@page{size:A4;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:${bg};color:${ink};font-family:Poppins,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;padding:20mm 18mm}
.hero{background:${GRAD};border-radius:14px;padding:14px 18px;display:flex;align-items:center;gap:12px;box-shadow:0 3px 10px rgba(1,32,48,.15);overflow:hidden}
.hero img{width:56px;height:56px;object-fit:cover;object-position:center 12%;-webkit-mask-image:linear-gradient(to right,#000 55%,transparent 100%);mask-image:linear-gradient(to right,#000 55%,transparent 100%)}
.wm{font:800 22px Poppins;color:${ink};text-transform:uppercase;letter-spacing:.015em;line-height:1}
.tag{font:700 10px Poppins;color:${cyan};letter-spacing:.2em;margin-top:4px;line-height:1}
h1{font:700 30px Lora,serif;color:${ink};margin-top:22px;line-height:1.1}
.sub{font:500 12.5px Poppins;color:#5A727C;margin-top:6px;line-height:1.5}
.divider{width:44px;height:3px;background:${cyan};border-radius:2px;margin:16px 0 8px}
h2{font:800 12.5px Poppins;text-transform:uppercase;letter-spacing:.16em;color:${ink};display:flex;align-items:center;gap:10px;margin-top:20px}
h2 .pill{display:inline-flex;align-items:center;justify-content:center;height:20px;padding:0 10px;border-radius:11px;font:800 10px Poppins;letter-spacing:.05em;text-transform:uppercase;background:${cyan};color:${ink}}
.rows{list-style:none;margin-top:8px}
.rows li{background:#fff;border-radius:10px;padding:10px 13px;margin-bottom:6px;border-left:3px solid ${cyan};box-shadow:0 1px 3px rgba(1,32,48,.06);page-break-inside:avoid;break-inside:avoid}
.rows li .t{font:700 12px Poppins;color:${ink};line-height:1.25}
.rows li .d{font:400 10.5px Poppins;color:#3f545c;line-height:1.45;margin-top:2px}
.rows li .d.solo{font-size:11.5px}
.pagefoot{margin-top:22px;padding-top:12px;border-top:1px solid #E4D9CC;display:flex;justify-content:space-between;font:500 9.5px Poppins;color:#5A727C}
.pagefoot .stamp{font:800 9.5px Poppins;color:${ink};text-transform:uppercase;letter-spacing:.16em}
/* section-specific accents */
.rows.warn li{border-left-color:${orange}}
.rows.gold li{border-left-color:${gold}}
h2.warn .pill{background:${orange};color:#fff}
h2.gold .pill{background:${gold};color:${ink}}
`;

// Pill colour picks: first section cyan, second orange, third+ gold.
function pillClass(index) {
  if (index === 0) return '';
  if (index === 1) return 'warn';
  return 'gold';
}

function buildHTML({ title, subtitle, sections, footerStamp }) {
  const body = sections.map((sec, i) => {
    const cls = pillClass(i);
    const items = sec.items.map(m => {
      const { title:t, desc } = splitTitleDesc(m);
      if (t) return `<li><div class="t">${inlineMD(t)}</div><div class="d">${inlineMD(desc)}</div></li>`;
      return `<li><div class="d solo">${inlineMD(desc)}</div></li>`;
    }).join('');
    return `
      <h2 class="${cls}"><span class="pill">${inlineMD(sec.heading)}</span></h2>
      <ul class="rows ${cls}">${items}</ul>`;
  }).join('');

  return `<!doctype html><html><head><meta charset="utf8"><style>${STYLE}</style></head><body>
    <div class="page">
      <div class="hero">
        <img src="${MARK}"/>
        <div>
          <div class="wm">Mzansi Money Matters</div>
          <div class="tag">NEWS &nbsp;·&nbsp; DATA &nbsp;·&nbsp; SPORTS</div>
        </div>
      </div>
      <h1>${inlineMD(title)}</h1>
      ${subtitle ? `<div class="sub">${inlineMD(subtitle)}</div>` : ''}
      <div class="divider"></div>
      ${body}
      <div class="pagefoot">
        <span class="stamp">${footerStamp}</span>
        <span>mzansimoneymatters.co.za</span>
      </div>
    </div>
  </body></html>`;
}

// ── render via Playwright ───────────────────────────────────────────────────
async function findChromium() {
  const candidates = [
    '/opt/node22/lib/node_modules/playwright/index.js',
    path.join(REPO, 'node_modules', 'playwright', 'index.js'),
  ];
  for (const c of candidates) {
    if (!existsSync(c)) continue;
    const mod = await import(c);
    const chromium = mod.chromium || mod.default?.chromium;
    if (chromium) return chromium;
  }
  throw new Error('Playwright not found. Install: npm i -D playwright && npx playwright install chromium');
}

async function renderPdf(html, outPath) {
  const chromium = await findChromium();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil:'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.pdf({ path: outPath, format:'A4', printBackground:true, margin:{ top:0, right:0, bottom:0, left:0 }});
  await browser.close();
}

// ── main ────────────────────────────────────────────────────────────────────
// Only the briefer is regenerated here — its content changes every session.
// The prompts cheat sheet is stable; its PDF stays checked in as-is until we
// materially edit the guide (rare). If you need to rebuild it, add a section
// below and run this script.
const briefer = parseMarkdown(readFileSync(path.join(HERE, 'briefer.md'), 'utf8'));
await renderPdf(
  buildHTML({ ...briefer, footerStamp:'Mzansi Money Matters · Project briefer' }),
  path.join(HERE, 'mzansi-briefer.pdf'),
);
console.log('✓ docs/mzansi-briefer.pdf');
