// Colour resolution for the token file.
// Handles hex, rgb(), oklch(), var() indirection and color-mix(in oklab, ...),
// because tokens.css is authored in OKLCH and derives tonal steps by mixing in oklab.
import { parse, converter, formatHex } from 'culori';

const toRgb = converter('rgb');
const toOklab = converter('oklab');

/** Split a comma list at top level, ignoring commas inside parentheses. */
export function splitTop(str) {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of str) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/**
 * Resolve a CSS colour value to {r,g,b,alpha} in 0..1 sRGB.
 * `tokens` is a Map of custom-property name -> raw value, for var() indirection.
 */
export function resolve(value, tokens, seen = new Set()) {
  if (value == null) return null;
  let v = String(value).trim();

  // var(--x) or var(--x, fallback)
  const varMatch = v.match(/^var\(\s*(--[\w-]+)\s*(?:,([\s\S]+))?\)$/);
  if (varMatch) {
    const name = varMatch[1];
    if (seen.has(name)) throw new Error(`circular var reference at ${name}`);
    seen.add(name);
    if (tokens.has(name)) return resolve(tokens.get(name), tokens, seen);
    if (varMatch[2]) return resolve(varMatch[2], tokens, seen);
    throw new Error(`unknown token ${name}`);
  }

  // color-mix(in <space>, c1 p1%, c2 [p2%])
  const mixMatch = v.match(/^color-mix\(\s*in\s+([\w-]+)\s*,([\s\S]+)\)$/i);
  if (mixMatch) {
    const space = mixMatch[1].toLowerCase();
    const parts = splitTop(mixMatch[2]);
    if (parts.length !== 2) throw new Error(`color-mix needs two colours: ${v}`);
    const read = (part) => {
      const pm = part.match(/^([\s\S]+?)\s+([\d.]+)%$/) || part.match(/^([\d.]+)%\s+([\s\S]+)$/);
      if (!pm) return { color: part.trim(), pct: null };
      return /^[\d.]+%/.test(part)
        ? { color: pm[2].trim(), pct: parseFloat(pm[1]) }
        : { color: pm[1].trim(), pct: parseFloat(pm[2]) };
    };
    const a = read(parts[0]), b = read(parts[1]);
    let pa = a.pct, pb = b.pct;
    if (pa == null && pb == null) { pa = 50; pb = 50; }
    else if (pa == null) pa = 100 - pb;
    else if (pb == null) pb = 100 - pa;
    const total = pa + pb;
    if (total === 0) throw new Error(`color-mix percentages sum to zero: ${v}`);
    const w = pa / total;
    const ca = resolve(a.color, tokens, new Set(seen));
    const cb = resolve(b.color, tokens, new Set(seen));
    if (space !== 'oklab' && space !== 'srgb' && space !== 'oklch') {
      throw new Error(`unsupported color-mix space "${space}" (use oklab): ${v}`);
    }
    if (space === 'srgb') {
      return {
        r: ca.r * w + cb.r * (1 - w),
        g: ca.g * w + cb.g * (1 - w),
        b: ca.b * w + cb.b * (1 - w),
        alpha: (ca.alpha ?? 1) * w + (cb.alpha ?? 1) * (1 - w),
      };
    }
    const la = toOklab({ mode: 'rgb', r: ca.r, g: ca.g, b: ca.b });
    const lb = toOklab({ mode: 'rgb', r: cb.r, g: cb.g, b: cb.b });
    const mixed = toRgb({
      mode: 'oklab',
      l: la.l * w + lb.l * (1 - w),
      a: la.a * w + lb.a * (1 - w),
      b: la.b * w + lb.b * (1 - w),
    });
    return {
      r: clamp01(mixed.r), g: clamp01(mixed.g), b: clamp01(mixed.b),
      alpha: (ca.alpha ?? 1) * w + (cb.alpha ?? 1) * (1 - w),
    };
  }

  const parsed = parse(v);
  if (!parsed) throw new Error(`cannot parse colour: ${v}`);
  const rgb = toRgb(parsed);
  return { r: clamp01(rgb.r), g: clamp01(rgb.g), b: clamp01(rgb.b), alpha: parsed.alpha ?? 1 };
}

export const clamp01 = (n) => Math.min(1, Math.max(0, n));

/** Composite a possibly-translucent colour over an opaque backdrop, sRGB gamma space (as CSS does). */
export function composite(fg, bg) {
  const a = fg.alpha ?? 1;
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    alpha: 1,
  };
}

const channelLum = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

export function luminance(c) {
  return 0.2126 * channelLum(c.r) + 0.7152 * channelLum(c.g) + 0.0722 * channelLum(c.b);
}

/** WCAG 2.1 contrast ratio. Both colours must already be opaque. */
export function contrast(fg, bg) {
  const l1 = luminance(fg), l2 = luminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export const hex = (c) => formatHex({ mode: 'rgb', r: c.r, g: c.g, b: c.b });

export const BLACK = { r: 0, g: 0, b: 0, alpha: 1 };
export const WHITE = { r: 1, g: 1, b: 1, alpha: 1 };
