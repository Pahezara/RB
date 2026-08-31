#!/usr/bin/env node
// make-og.mjs
// One OG image per page, 1200x630, built from the hero photograph, the mark in
// its dark-ground variant, and the firm's name as type.
//
// The stacked lockup is NOT used here for the same reason it is not used in the
// header: its wordmark is one line at roughly 24:1 and would be unreadable at
// card size. See the note at the top of scripts/prepare-brand.mjs.
//
// The page list is READ FROM THE BUILT SITE, never hand-maintained. A hardcoded
// list drifted the moment the service lines changed and left five pages pointing
// at OG images that did not exist. The slug here is derived exactly as
// src/layouts/Base.astro derives it, so the two cannot disagree.
//
// Run it after a build. It writes into public/og/ so the next build picks the
// files up, and also copies them straight into dist/og/ so the build you already
// have is correct immediately. audit-html.mjs then asserts every og:image
// actually resolves.
import { mkdirSync, readdirSync, statSync, readFileSync, copyFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import sharp from 'sharp';

const DIST = 'dist';
const OUT = 'public/og';
const DIST_OUT = join(DIST, 'og');

if (!existsSync(DIST)) {
  console.error('make-og: dist/ does not exist. Run the build first.');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });
mkdirSync(DIST_OUT, { recursive: true });

const W = 1200, H = 630;

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}

/** Same derivation as Base.astro's ogSlug. */
const slugOf = (route) => route.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'default';

const pages = walk(DIST).map((file) => {
  const route = '/' + relative(DIST, file).split(sep).join('/')
    .replace(/index\.html$/, '').replace(/\.html$/, '');
  const html = readFileSync(file, 'utf8');
  const raw = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
  // Titles read "Thing — Reliance Business Partners". The OG card already
  // carries the mark and the name, so the suffix would only repeat it.
  const title = raw.split(/\s+[—–|]\s+/)[0].trim() || 'Reliance Business Partners';
  return { slug: slugOf(route), title };
});

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrap(text, perLine) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > perLine && cur) { lines.push(cur); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

const bg = await sharp('public/hero/hero-1600.webp')
  .resize(W, H, { fit: 'cover', position: 'left' })
  .toBuffer();

// The monogram, in the variant prepare-brand.mjs proved legible on the dark
// band. The as-drawn mark reaches 1.44:1 there and its navy half would vanish.
const MARK_H = 62;
const mark = await sharp('public/brand/mark-light-256.png')
  .resize(null, MARK_H, { fit: 'inside' })
  .toBuffer();
const markW = (await sharp(mark).metadata()).width;

const SANS = '"Segoe UI", Roboto, Arial, Helvetica, sans-serif';
const NAME_X = 72 + markW + 20;

// The name beside the mark, and the B's own gradient as a rule along the foot
// of the card. Both are drawn once and composited onto every page.
const chrome = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="ramp" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#126ea0"/>
      <stop offset="58%" stop-color="#f3771f"/>
      <stop offset="100%" stop-color="#fbc704"/>
    </linearGradient>
  </defs>
  <text x="${NAME_X}" y="92" fill="#fbfdff"
        font-family='${SANS}' font-size="30" font-weight="800"
        letter-spacing="-0.6">Reliance</text>
  <text x="${NAME_X}" y="118" fill="#a9b9ca"
        font-family='${SANS}' font-size="20" font-weight="600">Business Partners</text>
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#ramp)"/>
</svg>`);

let made = 0;
for (const page of pages) {
  const lines = wrap(page.title, 26).slice(0, 3);
  const size = lines.length > 2 ? 60 : 70;
  const startY = 300;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <style>
      .t { fill: #fbfdff; font-family: "Segoe UI", Roboto, Arial, Helvetica, sans-serif;
           font-size: ${size}px; font-weight: 700; letter-spacing: -1.2px; }
    </style>
    ${lines.map((l, i) => `<text class="t" x="72" y="${startY + i * (size + 12)}">${esc(l)}</text>`).join('\n    ')}
  </svg>`;

  const buf = await sharp(bg)
    .composite([
      { input: mark, top: 56, left: 72 },
      { input: chrome, top: 0, left: 0 },
      { input: Buffer.from(svg), top: 0, left: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  const file = `${OUT}/${page.slug}.jpg`;
  await sharp(buf).toFile(file);
  copyFileSync(file, join(DIST_OUT, `${page.slug}.jpg`));
  made++;
}

// Prove the text drew. An OG image whose text failed to render would be nearly
// identical to the bare background, and would ship silently.
const probe = await sharp(`${OUT}/default.jpg`)
  .extract({ left: 72, top: 250, width: 700, height: 90 })
  .greyscale().stats();
if (probe.channels[0].max < 200) {
  console.error('make-og: FAIL - the headline row is too dark, so the text did not render.');
  process.exit(1);
}

console.log(`make-og: wrote ${made} OG image(s), 1200x630 JPEG, to ${OUT}/ and ${DIST_OUT}/`);
console.log(`make-og: derived from the built routes, so the list cannot drift from the pages.`);
console.log(`make-og: text render probe max luminance ${probe.channels[0].max} (needs > 200) PASS`);
