#!/usr/bin/env node
// prepare-brand.mjs
// Turns the supplied RB logo pack into the assets the site actually needs.
//
// WHY THE MARK AND NOT THE LOCKUP
// -------------------------------
// The supplied lockup is STACKED: the RB monogram sits above a single line
// reading RELIANCE BUSINESS PARTNERS (PRIVATE) LIMITED. That line is 1900x80
// in a 2000px file, an aspect ratio of about 24:1. Rendered at the 132px the
// header bar has room for, its letters would be three pixels tall. So the
// lockup is never rasterised into the page. The header, the footer and the OG
// card carry the MONOGRAM plus the firm's name as real text in the site face,
// which stays crisp at every size, recolours for the dark band for free, and
// is selectable and readable by a screen reader.
//
// WHICH FILE IS THE SOURCE
// ------------------------
// Everything is cut out of `brand/rb-lockup.png`, including the monogram, even
// though the pack also ships a monogram-only file. That file is named
// "transparent" but measures fully opaque on every pixel with a white ground
// baked in, so keying it out would mean guessing a threshold. The lockup is
// genuinely transparent, so the monogram is cropped from it and no pixel is
// invented.
//
// Three things are done mechanically rather than by eye:
//   * the monogram is separated from the wordmark and from the detached
//     parallelogram beneath it by reading the blank row runs, not by guessing
//     a crop box;
//   * the dark-ground variant remaps only the BLUE half of the mark, per pixel,
//     by which brand family the pixel is nearer to, so the orange-to-gold B is
//     left exactly as drawn;
//   * that variant is then MEASURED against the dark band and the script fails
//     if its darkest pixel drops below 3:1, which is the WCAG 1.4.11 floor for
//     a graphic that carries meaning.
//
// Run after any logo change.
import { mkdirSync, writeFileSync, rmSync, readdirSync } from 'node:fs';
import sharp from 'sharp';

const SRC_LOCKUP = 'brand/rb-lockup.png';   // monogram over the wordmark, real alpha
const OUT = 'public/brand';
mkdirSync(OUT, { recursive: true });

// --surface, never pure white. The maskable icon sits on this.
const SURFACE = { r: 241, g: 245, b: 248, alpha: 1 };
const SURFACE_INVERT = [5, 30, 53];          // #051e35, the dark band
const TRANSPARENT = { r: 255, g: 255, b: 255, alpha: 0 };

// The four values read straight out of the logo, and the pair the blue half is
// remapped onto for dark grounds. Both ends are lighter than --blue-lift so the
// gradient survives the move instead of flattening to one tone.
const NAVY = [0x16, 0x3a, 0x61];
const BLUE = [0x12, 0x6e, 0xa0];
const GOLD = [0xfb, 0xc7, 0x04];
const LIFT_DARK = [0x5f, 0xab, 0xdf];   // what the navy end becomes
const LIFT_LIGHT = [0xb3, 0xdd, 0xf6];  // what the blue end becomes

const BLANK_ALPHA = 8;  // a row is blank when no pixel is more opaque than this
const report = [];

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const dist2 = (r, g, b, c) => (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;

// --- 0. Clear the output directory first -------------------------------------
// Every mark and lockup in here is written below. A stale file left from an
// earlier run of this script would still resolve and still be served, so it is
// removed rather than overwritten: if the logo changes shape and a size stops
// being generated, the old one must not survive.
for (const f of readdirSync(OUT)) {
  if (/^(lockup|mark)/.test(f)) rmSync(`${OUT}/${f}`);
}

/**
 * Every run of rows that carries ink, top to bottom.
 * In the supplied lockup there are exactly three: the monogram, the wordmark
 * line, and a small detached parallelogram that reads as dirt at favicon size.
 * The first run is the monogram, and that is the only one this script cuts.
 */
async function inkBands(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const bands = [];
  let start = -1;
  for (let y = 0; y < height; y++) {
    let ink = false;
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > BLANK_ALPHA) { ink = true; break; }
    }
    if (ink && start < 0) start = y;
    if (!ink && start >= 0) { bands.push([start, y - 1]); start = -1; }
  }
  if (start >= 0) bands.push([start, height - 1]);
  // Ignore hairline runs so a stray antialiased pixel cannot split a band.
  return bands.filter(([a, b]) => b - a >= 4);
}

/**
 * The dark-ground variant. Each opaque pixel is assigned to the blue family or
 * the warm family by proximity, and only the blue family moves: its position
 * along the navy-to-blue gradient is measured and replayed on the lift pair, so
 * the R keeps its gradient instead of flattening into one flat tint.
 */
async function toLightOnDark(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  const navyMean = (NAVY[0] + NAVY[1] + NAVY[2]) / 3;
  const blueMean = (BLUE[0] + BLUE[1] + BLUE[2]) / 3;
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) continue;
    const r = out[i], g = out[i + 1], b = out[i + 2];
    // Warm pixels are left exactly as drawn: they already carry the dark band.
    if (dist2(r, g, b, GOLD) <= Math.min(dist2(r, g, b, NAVY), dist2(r, g, b, BLUE))) continue;
    if (b <= r) continue;  // not a blue-family pixel at all
    const t = clamp(((r + g + b) / 3 - navyMean) / (blueMean - navyMean), 0, 1);
    out[i] = Math.round(lerp(LIFT_DARK[0], LIFT_LIGHT[0], t));
    out[i + 1] = Math.round(lerp(LIFT_DARK[1], LIFT_LIGHT[1], t));
    out[i + 2] = Math.round(lerp(LIFT_DARK[2], LIFT_LIGHT[2], t));
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png().toBuffer();
}

/** Lowest contrast any opaque pixel of `buf` reaches against `ground`. */
async function worstContrast(buf, ground) {
  const { data } = await sharp(buf).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const cl = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const lum = (r, g, b) => 0.2126 * cl(r / 255) + 0.7152 * cl(g / 255) + 0.0722 * cl(b / 255);
  const lg = lum(...ground);
  let worst = Infinity;
  for (let i = 0; i < data.length; i += 4) {
    // Only fully opaque pixels. Antialiased edges blend into the ground by
    // design and measuring them would fail every logo ever drawn.
    if (data[i + 3] < 250) continue;
    const l = lum(data[i], data[i + 1], data[i + 2]);
    const [hi, lo] = l > lg ? [l, lg] : [lg, l];
    worst = Math.min(worst, (hi + 0.05) / (lo + 0.05));
  }
  return worst;
}

// --- 1. The monogram ---------------------------------------------------------
const source = await sharp(SRC_LOCKUP).ensureAlpha().png().toBuffer();
const srcMeta = await sharp(source).metadata();
const bands = await inkBands(source);
if (bands.length < 2) {
  console.error(
    `\nprepare-brand: FAIL - expected the monogram and the wordmark to be separate ` +
    `bands in ${SRC_LOCKUP}, found ${bands.length}. The logo file has changed shape.`
  );
  process.exit(1);
}
report.push(`ink bands in the lockup: ${bands.map(([a, b]) => `${a}-${b}`).join(', ')}`);

// extract and trim are two passes on purpose: sharp resolves trim against the
// ORIGINAL frame, so chaining them in one pipeline asks it to cut a box that no
// longer exists and it throws "bad extract area".
const [top, bottom] = bands[0];
const markBand = await sharp(source)
  .extract({ left: 0, top, width: srcMeta.width, height: bottom - top + 1 })
  .png()
  .toBuffer();
const mark = await sharp(markBand).trim({ threshold: 4 }).png().toBuffer();
const mMeta = await sharp(mark).metadata();
report.push(`monogram trimmed to ${mMeta.width}x${mMeta.height} (aspect ${(mMeta.width / mMeta.height).toFixed(3)})`);

const markLight = await toLightOnDark(mark);

// --- 2. Contrast proof for the dark-ground variant ---------------------------
const worstDark = await worstContrast(mark, SURFACE_INVERT);
const worstLight = await worstContrast(markLight, SURFACE_INVERT);
report.push(`as drawn on the dark band, worst pixel ${worstDark.toFixed(2)}:1`);
report.push(`lifted variant on the dark band, worst pixel ${worstLight.toFixed(2)}:1`);
if (worstLight < 3) {
  console.error(
    `\nprepare-brand: FAIL - the lifted mark reaches only ${worstLight.toFixed(2)}:1 on ` +
    `the dark band and WCAG 1.4.11 needs 3:1. Raise LIFT_DARK.`
  );
  process.exit(1);
}

// --- 3. Emit the mark at the sizes the page asks for -------------------------
// The header renders it at 34px and 42px tall, the footer at 48px, so the 128px
// step already covers a 3x screen. 512 exists for the OG card.
for (const h of [64, 128, 256, 512]) {
  const w = Math.round((mMeta.width / mMeta.height) * h);
  for (const [buf, name] of [[mark, 'mark'], [markLight, 'mark-light']]) {
    await sharp(buf).resize(w, h).png({ compressionLevel: 9 }).toFile(`${OUT}/${name}-${h}.png`);
    await sharp(buf).resize(w, h).webp({ quality: 94, alphaQuality: 100 })
      .toFile(`${OUT}/${name}-${h}.webp`);
  }
  report.push(`mark-${h} and mark-light-${h}  ${w}x${h}`);
}

// --- 4. The full stacked lockup ----------------------------------------------
// Not used in the page chrome, for the reason at the top of this file. It is
// written for print, for e-mail signatures and for anyone who asks for "the
// logo", so that the answer is a file in the repo rather than a screenshot.
const lockup = await sharp(source).trim({ threshold: 4 }).png().toBuffer();
const lMeta = await sharp(lockup).metadata();
report.push(`lockup trimmed to ${lMeta.width}x${lMeta.height} (reference only, not rendered)`);
for (const w of [480, 960]) {
  const h = Math.round((lMeta.height / lMeta.width) * w);
  await sharp(lockup).resize(w, h).png({ compressionLevel: 9 }).toFile(`${OUT}/lockup-${w}.png`);
}
await sharp(await toLightOnDark(lockup)).resize(960, null)
  .png({ compressionLevel: 9 }).toFile(`${OUT}/lockup-light-960.png`);
report.push('lockup-480, lockup-960, lockup-light-960');

// --- 5. Favicons -------------------------------------------------------------
/** Fit the monogram into a square canvas at `inset` of its width, on `bg`. */
async function square(size, inset, bg, src = mark) {
  const box = Math.round(size * inset);
  const scaled = await sharp(src)
    .resize(box, box, { fit: 'inside', background: TRANSPARENT })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: scaled, gravity: 'centre' }])
    .png().toBuffer();
}

for (const s of [16, 32, 180, 192, 512]) {
  // Small sizes get a little more room so the monogram does not touch the edge.
  const inset = s <= 32 ? 0.86 : 0.92;
  await sharp(await square(s, inset, TRANSPARENT)).toFile(`public/icon-${s}.png`);
  report.push(`icon-${s}.png`);
}

// Maskable: the monogram on the light SURFACE, not on the navy. The R's own top
// half IS the navy, so a navy ground makes a quarter of the mark disappear.
// Measured, not guessed: navy on navy is 1:1.
await sharp(await square(512, 0.64, SURFACE)).toFile('public/icon-maskable-512.png');
report.push('icon-maskable-512.png  512x512, surface ground, 64% safe zone');

// --- 6. Manifest -------------------------------------------------------------
writeFileSync('public/site.webmanifest', JSON.stringify({
  name: 'Reliance Business Partners (Pvt) Ltd',
  short_name: 'Reliance Partners',
  start_url: '/',
  display: 'standalone',
  background_color: '#f1f5f8',
  theme_color: '#051e35',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2) + '\n');
report.push('site.webmanifest');

console.log(report.map((r) => '  ' + r).join('\n'));
console.log(`\nprepare-brand: done. Monogram ${mMeta.width}x${mMeta.height}, lifted variant clears ${worstLight.toFixed(2)}:1 on the dark band.`);
