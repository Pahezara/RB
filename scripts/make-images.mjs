#!/usr/bin/env node
// make-images.mjs
// Every photograph on the site, from source to responsive file, in one place.
//
// The manifest is src/data/images.json. A human writes WHAT is wanted there —
// the Commons file, where it is used, the crop focus, and, for any image that
// carries type, a scrim and the regions the type occupies. This script writes
// everything that must never be typed by hand: the author, the licence, the
// licence URL, the source page and the pixel dimensions, all read back from the
// Wikimedia Commons API.
//
// Four things it refuses to do quietly:
//
//   1. Ship an image whose licence is not on the allow-list below. CC0, public
//      domain and CC BY / BY-SA only. Anything else stops the build.
//   2. Ship type on a photograph that cannot be read. Where a scrim is declared
//      it is BAKED into the file, and every declared text region is measured at
//      its 95th-percentile luminance against the ink that will actually sit
//      there. Under the declared minimum, the build fails. A CSS overlay cannot
//      be measured, so there is none.
//   3. Re-download. Sources are cached in brand/stock/ at up to 2560px wide and
//      committed, so the build is reproducible offline.
//   4. Leave a stale output behind. public/img/ is cleared of any file this run
//      did not write.
//
// VARIANTS. An image may declare a `portrait` variant: its own crop, scrim and
// regions, written as <slug>-p-<width>. Img.astro serves it below 48rem. This
// exists because a landscape scrim measured for a copy column on the left says
// nothing about a phone, where object-fit shows a narrow slice from the middle
// of the frame and the type sits somewhere else entirely.
//
// Run after changing the manifest:  node scripts/make-images.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import sharp from 'sharp';

const MANIFEST = 'src/data/images.json';
const SRC_DIR = 'brand/stock';
const OUT_DIR = 'public/img';
const MAX_SOURCE = 2560;
const UA = { 'User-Agent': 'RBPL-static-site-build/1.0 (image sourcing for a small business website)' };

// Licences this site may use. CC BY and BY-SA carry an attribution duty, which
// the /credits/ page discharges from the same manifest this script fills in.
const ALLOWED = /^(CC0|Public domain|CC BY (2\.0|2\.5|3\.0|4\.0)|CC BY-SA (2\.0|2\.5|3\.0|4\.0))$/;

// The inks that may sit on a scrimmed photograph, from tokens.css. Muted text
// never does: a region is declared with the ink that will actually be there.
const INKS = {
  'ink-invert': [252, 251, 248],   // #fcfbf8
  'accent-lift': [249, 149, 61],   // #f9953d, the italic accent in a headline
};
// The navy every scrim darkens toward: --surface-invert, #04152a.
const SCRIM = [4, 21, 42];

mkdirSync(SRC_DIR, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const strip = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = (r, g, b) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const ratio = (a, b) => { const [hi, lo] = a > b ? [a, b] : [b, a]; return (hi + 0.05) / (lo + 0.05); };
const smooth = (t) => t * t * (3 - 2 * t);

/**
 * The author's name and, where Commons gives one, a link to them.
 *
 * Photographs imported from Unsplash carry "Name <a href=unsplash.com/@handle>
 * handle</a>", which strips to "Name handle". Those become the name alone, with
 * the profile as the link. Anything else keeps its stripped text, and its first
 * link made absolute.
 */
function artist(html = '') {
  const u = html.match(/^([^<]+?)\s*<a[^>]*href="https?:\/\/unsplash\.com\/@([^"/?]+)[^"]*"[^>]*>[^<]*<\/a>\s*$/);
  if (u) return { author: strip(u[1]), authorUrl: `https://unsplash.com/@${u[2]}` };
  // A "redlink" points at a user page that does not exist: no link at all is better.
  const href = ((html.match(/href="([^"]+)"/) || [])[1] || '').replace(/&amp;/g, '&');
  if (/[?&]redlink=1/.test(href)) return { author: strip(html).replace(/\s*\(talk\)$/i, ''), authorUrl: '' };
  const authorUrl = href.startsWith('//') ? 'https:' + href
    : href.startsWith('/') ? 'https://commons.wikimedia.org' + href
    : href.startsWith('http') ? href : '';
  return { author: strip(html).replace(/\s*\(talk\)$/i, ''), authorUrl };
}

/**
 * One API request at a time, spaced out, and backing off when Commons says
 * "too many requests" (which arrives as plain text, not JSON). A build script
 * has no business hammering a volunteer-run API.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastCall = 0;
async function politeJson(url) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const wait = lastCall + 1500 - Date.now();
    if (wait > 0) await sleep(wait);
    lastCall = Date.now();
    const res = await fetch(url, { headers: UA });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      const backoff = 15000 * (attempt + 1);
      console.log(`  Commons is rate limiting (${res.status}); waiting ${backoff / 1000}s`);
      await sleep(backoff);
    }
  }
  throw new Error(`Commons kept refusing: ${url}`);
}

/** Author, licence and a size-capped download URL, from the Commons API. */
async function commons(file) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', titles: 'File:' + file,
    prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: String(MAX_SOURCE),
  });
  const d = await politeJson('https://commons.wikimedia.org/w/api.php?' + params);
  const page = Object.values(d.query.pages)[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) throw new Error(`Commons has no file called "${file}"`);
  const em = ii.extmetadata || {};
  return {
    ...artist(em.Artist?.value),
    license: strip(em.LicenseShortName?.value),
    licenseUrl: em.LicenseUrl?.value || '',
    page: ii.descriptionurl,
    // Commons will not upscale, so for a source narrower than the cap the
    // thumbnail URL is simply the original.
    download: ii.width > MAX_SOURCE ? ii.thumburl : ii.url,
  };
}

/**
 * The scrim's opacity at a point, 0..1.
 *   left    heavy under a copy column on the left, falling away to the right,
 *           with extra weight along the top (under the header) and the bottom
 *           (under a credentials rail).
 *   bottom  for phones: the photograph fades into solid navy toward the foot,
 *           where the type sits. `top` adds weight along the head of the frame,
 *           under a transparent header.
 *   center  an even veil with a soft vignette, for type set in the middle.
 */
function scrimAt(s, x, y) {
  if (s.kind === 'left') {
    const t = clamp(1 - x / (s.reach ?? 0.78), 0, 1);
    return 0.22 + Math.pow(t, 1.1) * s.strength
      + clamp(1 - y / (s.topReach ?? 0.2), 0, 1) * (s.top ?? 0.2)
      + smooth(clamp((y - (s.foot ?? 0.7)) / 0.3, 0, 1)) * (s.footStrength ?? 0.45);
  }
  if (s.kind === 'bottom') {
    return (s.base ?? 0.3) + smooth(clamp((y - (s.from ?? 0.25)) / ((s.to ?? 0.75) - (s.from ?? 0.25)), 0, 1)) * s.strength
      // optional weight along the top, under a transparent header
      + smooth(clamp(1 - y / (s.topReach ?? 0.24), 0, 1)) * (s.top ?? 0);
  }
  const dx = (x - 0.5) * 2, dy = (y - 0.5) * 2;
  return s.strength * 0.82 + Math.min(1, Math.hypot(dx, dy)) * s.strength * 0.25;
}

function applyScrim(data, w, h, s) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = clamp(scrimAt(s, x / w, y / h), 0, s.max ?? 0.97);
      const i = (y * w + x) * 3;
      data[i] = Math.round(data[i] + (SCRIM[0] - data[i]) * a);
      data[i + 1] = Math.round(data[i + 1] + (SCRIM[1] - data[i + 1]) * a);
      data[i + 2] = Math.round(data[i + 2] + (SCRIM[2] - data[i + 2]) * a);
    }
  }
}

/** 95th-percentile contrast of an ink against a region, box in 0..1 units. */
function measure(data, w, h, box, ink) {
  const lums = [];
  const [x0, y0, x1, y1] = [box[0] * w, box[1] * h, box[2] * w, box[3] * h].map(Math.floor);
  for (let y = y0; y < y1; y += 2) {
    for (let x = x0; x < x1; x += 2) {
      const i = (y * w + x) * 3;
      lums.push(lum(data[i], data[i + 1], data[i + 2]));
    }
  }
  lums.sort((a, b) => a - b);
  return ratio(lum(...INKS[ink]), lums[Math.floor(lums.length * 0.95)]);
}

async function cropBuffer(src, crop) {
  if (!crop) return sharp(src).toBuffer();
  const m = await sharp(src).metadata();
  const [x0, y0, x1, y1] = crop;
  // extract and any later operation are two passes on purpose: sharp resolves
  // some operations against the ORIGINAL frame when chained in one pipeline.
  return sharp(src).extract({
    left: Math.round(x0 * m.width), top: Math.round(y0 * m.height),
    width: Math.round((x1 - x0) * m.width), height: Math.round((y1 - y0) * m.height),
  }).toBuffer();
}

const failures = [];
const keep = new Set();

/** Crop, scrim, measure and write one variant. Returns its pixel size. */
async function render(img, v, prefix) {
  const cropped = await cropBuffer(`${SRC_DIR}/${img.slug}.jpg`, v.crop);
  const { data, info } = await sharp(cropped).removeAlpha().raw().toBuffer({ resolveWithObject: true });

  let base = sharp(cropped);
  if (v.scrim) {
    applyScrim(data, info.width, info.height, v.scrim);
    for (const r of v.regions || []) {
      const got = measure(data, info.width, info.height, r.box, r.ink);
      r.measured = Number(got.toFixed(2));
      const ok = got >= r.min;
      console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${prefix.padEnd(22)} ${r.name.padEnd(12)} ${got.toFixed(2)}:1 for ${r.ink} (min ${r.min})`);
      if (!ok) failures.push(`${prefix} ${r.name}: ${got.toFixed(2)}:1 for ${r.ink}, needs ${r.min}. Strengthen the scrim.`);
    }
    if (!v.regions?.length) failures.push(`${prefix}: a scrim is declared but no text regions are, so nothing proves it works`);
    base = sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } });
  }

  const rendered = await base.png().toBuffer();
  for (const w of v.widths) {
    const pipe = sharp(rendered).resize({ width: Math.min(w, info.width) });
    await pipe.clone().avif({ quality: 52, effort: 6 }).toFile(`${OUT_DIR}/${prefix}-${w}.avif`);
    await pipe.clone().webp({ quality: 76 }).toFile(`${OUT_DIR}/${prefix}-${w}.webp`);
    keep.add(`${prefix}-${w}.avif`).add(`${prefix}-${w}.webp`);
  }
  return { width: info.width, height: info.height };
}

for (const img of manifest.images) {
  const src = `${SRC_DIR}/${img.slug}.jpg`;

  // --- provenance, always re-read so a changed licence cannot slip past --------
  const meta = await commons(img.file);
  if (!ALLOWED.test(meta.license)) {
    failures.push(`${img.slug}: licence "${meta.license}" is not on the allow-list`);
    continue;
  }
  Object.assign(img, { author: meta.author, authorUrl: meta.authorUrl, license: meta.license, licenseUrl: meta.licenseUrl, page: meta.page });

  // --- source, downloaded once ---------------------------------------------------
  if (!existsSync(src)) {
    const buf = Buffer.from(await (await fetch(meta.download, { headers: UA })).arrayBuffer());
    await sharp(buf).rotate().resize({ width: MAX_SOURCE, withoutEnlargement: true })
      .flatten({ background: '#ffffff' }).jpeg({ quality: 88, mozjpeg: true }).toFile(src);
    console.log(`  downloaded  ${img.slug}  <- ${img.file}`);
  }

  // --- the default (landscape) variant, then the phone variant if declared -------
  const size = await render(img, img, img.slug);
  img.width = size.width;
  img.height = size.height;
  if (img.portrait) {
    const p = await render(img, img.portrait, `${img.slug}-p`);
    img.portrait.width = p.width;
    img.portrait.height = p.height;
  }
  console.log(`  wrote       ${img.slug.padEnd(18)} ${img.widths.join(', ')}${img.portrait ? `  + portrait ${img.portrait.widths.join(', ')}` : ''}  (${img.license}, ${img.author})`);
}

// --- no stale outputs ------------------------------------------------------------
for (const f of readdirSync(OUT_DIR)) if (!keep.has(f)) rmSync(`${OUT_DIR}/${f}`);

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

if (failures.length) {
  console.error(`\nmake-images: FAIL - ${failures.length} problem(s):`);
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log(`\nmake-images: ${manifest.images.length} image(s), provenance written back to ${MANIFEST}.`);
