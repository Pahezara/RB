#!/usr/bin/env node
// extract-brand.mjs
// Derives the palette from the logo FILE, mechanically. Never by eye.
//
//   SVG    -> parse every fill / stroke / stop-color in the document.
//   raster -> sharp. Keep only INTERIOR pixels (every 4-neighbour is the same colour),
//             which discards antialiasing and JPEG fringing; then drop the neutral
//             ground; then cluster what remains in OKLab and rank by area.
//
// Two rules that matter, learned from this logo:
//   * "Near-black" is judged on CHROMA, not lightness alone. A brand navy can sit at
//     luminance 0.0066, below any sane black threshold. Only NEUTRAL darks are ground.
//   * A lossy raster of a flat-colour mark is mostly edge pixels. Counting them makes
//     halos look like brand colours. Erosion removes them before anything is counted.
//
// Writes brand/PALETTE.md and prints the same report.
// Usage: node scripts/extract-brand.mjs [path-to-logo]
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { converter, formatHex, formatCss } from 'culori';

const toOklch = converter('oklch');
const toOklab = converter('oklab');

// --- thresholds, stated explicitly so nothing vanishes quietly -----------------
const ALPHA_MIN = 250;      // brief: drop any pixel with alpha under 250
const NEUTRAL_SPREAD = 14;  // max(r,g,b) - min(r,g,b) below this counts as neutral
const NEAR_WHITE = 0.90;    // neutral AND lighter than this -> page ground
const NEAR_BLACK = 0.02;    // neutral AND darker than this  -> pure black
const EDGE_TOL = 10;        // per-channel delta below which a neighbour is "the same"
const CLUSTER_DIST = 0.055; // OKLab distance below which two colours are one colour
const MIN_SHARE = 1.5;      // clusters under this % of the mark are not reported
const TOP_N = 8;

const channelLum = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = (r, g, b) =>
  0.2126 * channelLum(r / 255) + 0.7152 * channelLum(g / 255) + 0.0722 * channelLum(b / 255);
const spread = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);

function findLogo() {
  if (process.argv[2]) return process.argv[2];
  if (!existsSync('brand')) return null;
  const files = readdirSync('brand').filter((f) => /\.(svg|png|jpg|jpeg|webp|avif)$/i.test(f));
  const svg = files.find((f) => f.toLowerCase().endsWith('.svg'));
  if (svg) return join('brand', svg);
  return files.length ? join('brand', files[0]) : null;
}

// ---------------------------------------------------------------------------
function fromSvg(file) {
  const src = readFileSync(file, 'utf8');
  const hits = new Map();
  const re = /(fill|stroke|stop-color)\s*[:=]\s*["']?\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|[a-zA-Z]+)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const value = m[2].trim();
    if (/^(none|transparent|currentColor|inherit)$/i.test(value)) continue;
    if (!hits.has(value)) hits.set(value, new Set());
    hits.get(value).add(m[1]);
  }
  const out = [];
  for (const [value, attrs] of hits) {
    const parsed = toOklch(value);
    if (!parsed) continue;
    out.push({
      hex: formatHex(value),
      oklch: formatCss({ ...parsed, mode: 'oklch' }),
      where: [...attrs].join(', '),
      share: null,
    });
  }
  return { kind: 'svg', colors: out, dropped: [] };
}

// ---------------------------------------------------------------------------
async function fromRaster(file) {
  const { default: sharp } = await import('sharp');
  const img = sharp(file).ensureAlpha();
  const meta = await img.metadata();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const at = (x, y) => (y * width + x) * channels;

  const counts = new Map();
  let total = width * height;
  let dropAlpha = 0, dropEdge = 0, dropWhite = 0, dropBlack = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = at(x, y);
      const a = channels === 4 ? data[i + 3] : 255;
      if (a < ALPHA_MIN) { dropAlpha++; continue; }
      const r = data[i], g = data[i + 1], b = data[i + 2];

      // Interior test: every 4-neighbour must be the same colour. Border pixels of
      // the image count as edges. This is what removes JPEG halos and antialiasing.
      let interior = true;
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) interior = false;
      else {
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const j = at(x + dx, y + dy);
          if (Math.abs(data[j] - r) > EDGE_TOL ||
              Math.abs(data[j + 1] - g) > EDGE_TOL ||
              Math.abs(data[j + 2] - b) > EDGE_TOL) { interior = false; break; }
        }
      }
      if (!interior) { dropEdge++; continue; }

      // Ground removal, judged on chroma first. A chromatic colour is never ground,
      // however light or dark it is.
      const neutral = spread(r, g, b) < NEUTRAL_SPREAD;
      const L = lum(r, g, b);
      if (neutral && L > NEAR_WHITE) { dropWhite++; continue; }
      if (neutral && L < NEAR_BLACK) { dropBlack++; continue; }

      const key = `${r},${g},${b}`;
      let rec = counts.get(key);
      if (!rec) {
        rec = { n: 0, sx: 0, sy: 0, minX: 1e9, maxX: -1, minY: 1e9, maxY: -1 };
        counts.set(key, rec);
      }
      rec.n++; rec.sx += x; rec.sy += y;
      if (x < rec.minX) rec.minX = x;
      if (x > rec.maxX) rec.maxX = x;
      if (y < rec.minY) rec.minY = y;
      if (y > rec.maxY) rec.maxY = y;
    }
  }

  const entries = [...counts.entries()]
    .map(([k, rec]) => {
      const [r, g, b] = k.split(',').map(Number);
      return { lab: toOklab({ mode: 'rgb', r: r / 255, g: g / 255, b: b / 255 }), ...rec };
    })
    .sort((a, b) => b.n - a.n);

  const clusters = [];
  for (const e of entries) {
    let best = null, bestD = Infinity;
    for (const c of clusters) {
      const d = Math.hypot(e.lab.l - c.lab.l, e.lab.a - c.lab.a, e.lab.b - c.lab.b);
      if (d < bestD) { bestD = d; best = c; }
    }
    if (best && bestD < CLUSTER_DIST) {
      const w = best.n / (best.n + e.n), v = 1 - w;
      best.lab = { mode: 'oklab', l: best.lab.l * w + e.lab.l * v,
                   a: best.lab.a * w + e.lab.a * v, b: best.lab.b * w + e.lab.b * v };
      best.n += e.n; best.sx += e.sx; best.sy += e.sy;
      best.minX = Math.min(best.minX, e.minX); best.maxX = Math.max(best.maxX, e.maxX);
      best.minY = Math.min(best.minY, e.minY); best.maxY = Math.max(best.maxY, e.maxY);
    } else {
      clusters.push({ lab: e.lab, n: e.n, sx: e.sx, sy: e.sy,
                      minX: e.minX, maxX: e.maxX, minY: e.minY, maxY: e.maxY });
    }
  }

  const kept = clusters.reduce((s, c) => s + c.n, 0);
  clusters.sort((a, b) => b.n - a.n);

  const colors = clusters
    .map((c) => {
      const cx = Math.round(c.sx / c.n), cy = Math.round(c.sy / c.n);
      return {
        hex: formatHex(c.lab),
        oklch: formatCss({ ...toOklch(c.lab), mode: 'oklch' }),
        share: (c.n / kept) * 100,
        px: c.n,
        where: `centroid ${Math.round((cx / width) * 100)}% across, ` +
               `${Math.round((cy / height) * 100)}% down; ` +
               `spans x ${c.minX}-${c.maxX}, y ${c.minY}-${c.maxY}`,
      };
    })
    .filter((c) => c.share >= MIN_SHARE)
    .slice(0, TOP_N);

  return {
    kind: 'raster',
    meta: { width, height, format: meta.format },
    colors,
    dropped: [
      [`alpha < ${ALPHA_MIN}`, dropAlpha],
      [`edge or antialiased (a 4-neighbour differs by more than ${EDGE_TOL}/255)`, dropEdge],
      [`neutral and lighter than luminance ${NEAR_WHITE} (page ground)`, dropWhite],
      [`neutral and darker than luminance ${NEAR_BLACK} (pure black)`, dropBlack],
    ],
    total, kept,
  };
}

// ---------------------------------------------------------------------------
const file = findLogo();
if (!file || !existsSync(file)) {
  console.error('extract-brand: no logo found. Put the logo in brand/ (SVG preferred) or pass a path.');
  process.exit(1);
}

const result = extname(file).toLowerCase() === '.svg'
  ? fromSvg(file)
  : await fromRaster(file);

const lines = [];
lines.push('# PALETTE.md');
lines.push('');
lines.push(`Derived mechanically from \`${file.replace(/\\/g, '/')}\` by \`scripts/extract-brand.mjs\`.`);
lines.push('Not sampled by eye. Re-run the script to regenerate.');
lines.push('');
if (result.kind === 'raster') {
  const { width, height, format } = result.meta;
  lines.push(`Source: ${format}, ${width}x${height}. ` +
             `${result.kept.toLocaleString()} of ${result.total.toLocaleString()} pixels ` +
             `counted as solid interior of the mark.`);
  lines.push('');
  lines.push('Pixels excluded, and why:');
  lines.push('');
  for (const [why, n] of result.dropped) {
    lines.push(`- ${n.toLocaleString()} (${((n / result.total) * 100).toFixed(1)}%) - ${why}`);
  }
  lines.push('');
  lines.push('Ground removal is judged on chroma first: a colour with real chroma is never');
  lines.push('discarded as black or white, however dark or light it is. A brand navy can sit');
  lines.push('well below any plain black threshold and still be a brand colour.');
  lines.push('');
  lines.push('The rows below are CLUSTER CENTROIDS. Where the mark is drawn as a gradient,');
  lines.push('each row is the average of a band rather than a colour anyone chose, so the');
  lines.push('tokens in `src/styles/tokens.css` are sampled at the gradient ENDPOINTS instead');
  lines.push('and will read a few units away from these. Both are measurements of the same');
  lines.push('file; neither is an eyeball.');
  lines.push('');
}
lines.push('## Colours found');
lines.push('');
lines.push('| # | Hex | OKLCH | Share of mark | Where it appears |');
lines.push('|---|-----|-------|---------------|------------------|');
result.colors.forEach((c, i) => {
  lines.push(`| ${i + 1} | \`${c.hex}\` | \`${c.oklch}\` | ` +
             `${c.share == null ? 'n/a' : c.share.toFixed(1) + '%'} | ${c.where} |`);
});
lines.push('');

const md = lines.join('\n');
writeFileSync('brand/PALETTE.md', md);
console.log(md);
console.error(`extract-brand: wrote brand/PALETTE.md from ${file}`);
