#!/usr/bin/env node
// make-hero.mjs
// Builds the hero imagery from brand/hero-source.jpg.
//
// The source is a street-level Colombo photograph. It is CROPPED to the tower
// line on purpose: the full frame carries third-party billboards (Nippon Paint,
// Union Assurance, Hilton) and putting those behind this firm's headline would
// imply a association that does not exist. The crop keeps the architecture and
// the sky and drops every readable brand mark.
//
// A7.6 is solved mechanically, not assumed: the script samples the region the
// hero type actually occupies, takes the 95th-percentile luminance, and FAILS
// if the light ink cannot clear 4.5:1 there. The scrim is tuned by that number.
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const SRC = 'brand/hero-source.jpg';
const OUT = 'public/hero';
mkdirSync(OUT, { recursive: true });

// The photograph is mapped to a NAVY DUOTONE rather than tinted.
//
// Blending a colour photo toward a saturated navy in sRGB does not read as
// navy: the residual red channel survives in the midtones and the whole frame goes
// violet. Mapping luminance through a two-point ramp instead gives a clean
// monochrome in the brand's own hue, with no purple cast anywhere.
const SHADOW    = [5, 30, 53];      // #051e35  --surface-invert, the darkest point
// The highlight must have green clearly ahead of red. With r and g close, the
// midtones land on a blue-violet and the whole frame reads purple rather than
// navy, however dark it is. This is a steel blue: r 95, g 134, b 173.
const HIGHLIGHT = [124, 170, 214];
const INK_INVERT = [251, 253, 255]; // #fbfdff  the type that sits on this

// Crops in SOURCE pixel coordinates (6000x3750). Chosen to exclude every
// billboard, shopfront and traffic signal in the original frame.
const CROP_LANDSCAPE = { left: 1688, top: 281, width: 2813, height: 1641 };
const CROP_PORTRAIT  = { left: 2280, top: 200, width: 1500, height: 2100 };

// Scrim strength. base darkens the whole frame; left adds more where the copy
// sits. Both are proved by the measurement below rather than judged by eye.
const SCRIM_BASE = 0.30;
const SCRIM_LEFT = 0.62;
const SCRIM_LEFT_REACH = 0.72;   // fraction of width the left ramp covers

// A soft light source behind the towers. This is what stops the frame reading
// as a flat wash: it gives the skyline an edge to be lit from, and it puts the
// mark's own blue in the picture rather than only in the corner.
//
// It is deliberately the BLUE half of the logo and not the gold. Gold is the
// action colour on this site and it has exactly one job; spending it on a sky
// would cost the buttons their only signal. It would also break the cast check
// below, which asserts green leads red everywhere.
const GLOW = [95, 171, 223];     // #5fabdf, the mark's blue lifted for a light source
const GLOW_CX = 0.70, GLOW_CY = 0.16, GLOW_R = 0.62, GLOW_STRENGTH = 0.30;
const SCRIM_TOP = 0.22;          // a little extra under the header

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

const srgbToLin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

// Three treatments of the same photograph, because it now does two different
// jobs on the site:
//
//   landscape / portrait - the OG card background, and the full-bleed fallback.
//                          Type sits on these, so they carry the heavy ramp
//                          that the A7.6 measurement below tunes.
//   panel                - the inset figure in the hero. Nothing is written on
//                          it, so the ramp that exists to protect type would
//                          only be throwing away the architecture. It gets a
//                          light base scrim and no ramp at all.
const MODES = { landscape: 0, portrait: 1, panel: 2 };
const PANEL_SCRIM = 0.08;

/** Map to a navy duotone, then darken where the type sits. In place. */
function scrim(data, width, height, mode) {
  const portrait = mode === MODES.portrait;
  const panel = mode === MODES.panel;
  for (let y = 0; y < height; y++) {
    const ty = Math.pow(clamp(1 - y / (height * 0.55), 0, 1), 1.4) * SCRIM_TOP;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;

      // Perceptual luminance of the original pixel, 0..1.
      const L = 0.2126 * srgbToLin(data[i] / 255)
              + 0.7152 * srgbToLin(data[i + 1] / 255)
              + 0.0722 * srgbToLin(data[i + 2] / 255);
      // A gentle curve keeps the building facades from flattening into the sky.
      const t = Math.pow(clamp(L, 0, 1), 0.72);

      let r = lerp(SHADOW[0], HIGHLIGHT[0], t);
      let g = lerp(SHADOW[1], HIGHLIGHT[1], t);
      let b = lerp(SHADOW[2], HIGHLIGHT[2], t);

      // Then the type ramp, toward the same shadow colour. On the portrait crop
      // the copy sits across the full width, so the ramp is vertical. The panel
      // has no ramp: nothing is written on it.
      const lx = panel
        ? 0
        : portrait
          ? Math.pow(clamp(y / height, 0, 1), 1.1) * SCRIM_LEFT
          : Math.pow(clamp(1 - x / (width * SCRIM_LEFT_REACH), 0, 1), 1.2) * SCRIM_LEFT;
      const a = panel
        ? PANEL_SCRIM
        : clamp(SCRIM_BASE + (portrait ? 0.12 : 0) + lx + ty, 0, 1);

      r = lerp(r, SHADOW[0], a);
      g = lerp(g, SHADOW[1], a);
      b = lerp(b, SHADOW[2], a);

      // The glow is added, not blended, so it behaves like light falling on the
      // scene rather than a coloured sheet laid over it. It is applied after the
      // scrim so it never brightens the region the type sits in.
      // The portrait crop is a narrow slice of the same scene, so the same glow
      // covers proportionally far more of the frame and washes it out. It gets a
      // tighter radius and less of it.
      const narrow = portrait || panel;
      const gr = GLOW_R * (narrow ? 0.62 : 1);
      const gs = GLOW_STRENGTH * (narrow ? 0.62 : 1);
      const gx = (x / width - (narrow ? 0.62 : GLOW_CX)) * (narrow ? 1.5 : 1);
      const gy = (y / height - (narrow ? 0.10 : GLOW_CY)) * (narrow ? 1 : 1.6);
      const gd = Math.hypot(gx, gy) / gr;
      if (gd < 1) {
        const t2 = 1 - gd;
        const w = t2 * t2 * (3 - 2 * t2) * gs * (1 - a);
        r += GLOW[0] * w; g += GLOW[1] * w; b += GLOW[2] * w;
      }

      data[i]     = Math.round(clamp(r, 0, 255));
      data[i + 1] = Math.round(clamp(g, 0, 255));
      data[i + 2] = Math.round(clamp(b, 0, 255));
    }
  }
}

async function build(crop, width, height, mode) {
  const { data, info } = await sharp(SRC)
    .extract(crop)
    .resize(width, height, { fit: 'cover' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  scrim(data, info.width, info.height, mode);
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } });
}

// --- A7.6 measurement --------------------------------------------------------
const cl = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lumOf = (r, g, b) => 0.2126 * cl(r / 255) + 0.7152 * cl(g / 255) + 0.0722 * cl(b / 255);
const ratio = (a, b) => { const [hi, lo] = a > b ? [a, b] : [b, a]; return (hi + 0.05) / (lo + 0.05); };

async function measure(img, width, height, label, box) {
  const { data } = await img.clone().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const lums = [];
  const x0 = Math.floor(box[0] * width), x1 = Math.floor(box[2] * width);
  const y0 = Math.floor(box[1] * height), y1 = Math.floor(box[3] * height);
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * 3;
      lums.push(lumOf(data[i], data[i + 1], data[i + 2]));
    }
  }
  lums.sort((a, b) => a - b);
  const p95 = lums[Math.floor(lums.length * 0.95)];
  const r = ratio(lumOf(...INK_INVERT), p95);
  const ok = r >= 4.5;
  console.log(`  ${label.padEnd(26)} 95th-pct ${p95.toFixed(4)}  ink ${r.toFixed(2)}:1  ${ok ? 'PASS' : 'FAIL'}`);
  return r;
}

console.log('Solving hero text contrast against the photograph (A7.6):');

const master = await build(CROP_LANDSCAPE, 2400, 1400, MODES.landscape);
const rHead    = await measure(master, 2400, 1400, 'landscape headline', [0.04, 0.30, 0.52, 0.78]);
const rEyebrow = await measure(master, 2400, 1400, 'landscape eyebrow',  [0.04, 0.20, 0.34, 0.29]);

const masterP = await build(CROP_PORTRAIT, 900, 1350, MODES.portrait);
const rP = await measure(masterP, 900, 1350, 'portrait copy region', [0.06, 0.42, 0.94, 0.92]);

// The panel deliberately has no measurement here. A7.6 is about type on a
// photograph, and no type is set on the panel: it is a figure in the layout with
// its caption outside it. Measuring it would be measuring nothing.

if (rHead < 4.5 || rEyebrow < 4.5 || rP < 4.5) {
  console.error('\nmake-hero: FAIL - a type region does not clear 4.5:1. Raise SCRIM_BASE.');
  process.exit(1);
}

// --- output ------------------------------------------------------------------
for (const w of [1024, 1600, 2400]) {
  const h = Math.round((1400 / 2400) * w);
  const im = await build(CROP_LANDSCAPE, w, h, MODES.landscape);
  await im.clone().avif({ quality: 52 }).toFile(`${OUT}/hero-${w}.avif`);
  await im.clone().webp({ quality: 74 }).toFile(`${OUT}/hero-${w}.webp`);
  console.log(`  hero-${w}  ${w}x${h}`);
}

// A real portrait crop below 640px. A full-bleed cover hero on a tall phone
// needs art direction, not just sizes="100vw".
for (const w of [640, 900]) {
  const h = Math.round(w * 1.5);
  const im = await build(CROP_PORTRAIT, w, h, MODES.portrait);
  await im.clone().avif({ quality: 52 }).toFile(`${OUT}/hero-portrait-${w}.avif`);
  await im.clone().webp({ quality: 74 }).toFile(`${OUT}/hero-portrait-${w}.webp`);
  console.log(`  hero-portrait-${w}  ${w}x${h}`);
}

// The hero's inset figure. Same crop, same duotone, almost none of the scrim,
// because the scrim exists to protect type and there is no type on it.
for (const w of [640, 900]) {
  const h = Math.round(w * 1.5);
  const im = await build(CROP_PORTRAIT, w, h, MODES.panel);
  await im.clone().avif({ quality: 55 }).toFile(`${OUT}/hero-panel-${w}.avif`);
  await im.clone().webp({ quality: 78 }).toFile(`${OUT}/hero-panel-${w}.webp`);
  console.log(`  hero-panel-${w}  ${w}x${h}  (scrim ${PANEL_SCRIM}, no type ramp)`);
}

// --- cast check --------------------------------------------------------------
// A blue that is not clearly blue reads violet, and violet is nowhere in this
// mark. Green must lead red by a real margin at
// every sampled point of every written file, or the build fails.
//
// It also catches a subtler failure: if a write is skipped and a stale file from
// an older palette survives on disk, its cast is measured here too.
const MIN_G_MINUS_R = 12;
const castFailures = [];
for (const f of ['hero-1024', 'hero-1600', 'hero-2400', 'hero-portrait-640', 'hero-portrait-900', 'hero-panel-640', 'hero-panel-900']) {
  const { data, info } = await sharp(`${OUT}/${f}.webp`).removeAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  for (const [nx, ny] of [[0.15, 0.10], [0.80, 0.12], [0.5, 0.45], [0.2, 0.55], [0.5, 0.85]]) {
    const x = Math.round(nx * info.width), y = Math.round(ny * info.height);
    const i = (y * info.width + x) * 3;
    const gr = data[i + 1] - data[i];
    if (gr < MIN_G_MINUS_R) {
      const hexAt = [data[i], data[i + 1], data[i + 2]]
        .map((v) => v.toString(16).padStart(2, '0')).join('');
      castFailures.push(
        `${f} at ${nx}x${ny}: g-r is ${gr}, needs ${MIN_G_MINUS_R}. ` +
        `That pixel is #${hexAt}, which reads violet.`
      );
    }
  }
}
if (castFailures.length) {
  console.error('\nmake-hero: FAIL - violet cast detected:');
  for (const c of castFailures) console.error('  - ' + c);
  process.exit(1);
}
console.log(`  cast check: all 7 files read blue (g-r >= ${MIN_G_MINUS_R}) at every sample`);

console.log('\nmake-hero: done.');
