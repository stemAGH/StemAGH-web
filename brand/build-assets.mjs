// Renders the raster brand assets from the SVG mark: `pnpm brand:build`.
//   src/app/apple-icon.png  180x180, full-bleed indigo (iOS applies its own rounding)
//   public/og.png           1200x630 social-sharing card
// Output is committed; rerun only when the mark, colours or tagline change.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const INDIGO = '#3f3fb8';
const INK = '#14161c';
const MUTED = '#4b5262';
// Embedded as a data URL: a page set via setContent cannot load file:// fonts.
const font = `data:font/woff2;base64,${readFileSync(
  'node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2',
).toString('base64')}`;

const mark = (size, stroke) => `
<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" stroke="${stroke}"
  stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M16 27V16"/><path d="M16 16 8 7"/><path d="M16 16 24 7"/>
</svg>`;

const base = `@font-face{font-family:G;src:url('${font}');font-weight:100 900}
*{margin:0;box-sizing:border-box}body{font-family:G,sans-serif;-webkit-font-smoothing:antialiased}`;

const appleIcon = `<style>${base}body{width:180px;height:180px;background:${INDIGO};display:grid;place-items:center}</style>${mark(112, '#fff')}`;

const og = `<style>${base}
body{width:1200px;height:630px;background:#fbfbfc;padding:88px;display:flex;flex-direction:column;justify-content:space-between;border-top:12px solid ${INDIGO}}
.lock{display:flex;align-items:center;gap:20px;font-size:56px;font-weight:600;letter-spacing:-0.02em;color:${INK}}
.lock b{color:${INDIGO};font-weight:600}
h1{font-size:76px;line-height:1.08;font-weight:600;letter-spacing:-0.03em;color:${INK};max-width:900px}
h1 span{color:${INDIGO}}
p{font-size:30px;color:${MUTED}}
</style>
<div class="lock">${mark(64, INDIGO)}<div>Stem<b>AGH</b></div></div>
<h1>Dependable software for <span>complex business operations</span>.</h1>
<p>Software products, starting with OpenEstate</p>`;

const browser = await chromium.launch();
async function shot(html, w, h, path) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path });
  await page.close();
  console.log('wrote', path);
}
await shot(appleIcon, 180, 180, 'src/app/apple-icon.png');
await shot(og, 1200, 630, 'public/og.png');
await browser.close();
