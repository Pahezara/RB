#!/usr/bin/env node
// check-contrast.mjs
// Contrast is proved, never chosen. Parses tokens straight out of the token file and
// asserts every declared pair against WCAG AA. Introduce a colour, add its pair here.
import { readFileSync, existsSync } from 'node:fs';
import { resolve as resolveColor, composite, contrast, hex, BLACK, WHITE } from './lib/color.mjs';

const TOKENS_FILE = 'src/styles/tokens.css';

// ---------------------------------------------------------------------------
// The pair registry. This is the contract. Every foreground/background
// combination that appears on the site must be listed here.
// ---------------------------------------------------------------------------
const PAIRS = [
  // fg token,            bg token,             min,  label
  ['--ink',               '--surface',          4.5,  'body text on paper'],
  ['--ink',               '--surface-raised',   4.5,  'body text on a card'],
  ['--ink',               '--surface-sunken',   4.5,  'body text on a sunken band'],
  ['--ink-soft',          '--surface',          4.5,  'supporting prose on paper'],
  ['--ink-soft',          '--surface-sunken',   4.5,  'supporting prose on a sunken band'],
  ['--ink-soft',          '--surface-raised',   4.5,  'supporting prose on a card'],
  ['--muted',             '--surface',          4.5,  'muted text on paper'],
  ['--muted',             '--surface-raised',   4.5,  'muted text on a card'],
  ['--muted',             '--surface-sunken',   4.5,  'muted text on a sunken band'],

  // the accent ramp. The fill always takes the ink label.
  ['--ink-on-accent',     '--accent',           4.5,  'button label on the accent fill'],
  ['--ink-on-accent',     '--accent-deep',      4.5,  'button label on the pressed accent'],
  ['--ink',               '--accent-tint',      4.5,  'text on the accent tint'],
  ['--accent-ink',        '--surface',          4.5,  'accent as text on paper'],
  ['--accent-ink',        '--surface-raised',   4.5,  'accent as text on a card'],
  ['--accent-ink',        '--surface-sunken',   4.5,  'accent as text on a sunken band'],
  ['--accent-ink',        '--accent-tint',      4.5,  'accent as text on the accent tint'],
  ['--accent',            '--surface-invert',   4.5,  'accent as text on the dark band'],
  ['--accent',            '--surface-invert-2', 4.5,  'accent as text on a dark panel'],
  ['--accent-lift',       '--surface-invert',   4.5,  'lifted accent on the dark band'],
  ['--accent-lift',       '--surface-invert-2', 4.5,  'lifted accent on a dark panel'],

  // the dark band and the panels that sit on it
  ['--ink-invert',        '--surface-invert',   4.5,  'text on the dark band'],
  ['--ink-invert',        '--surface-invert-2', 4.5,  'text on a dark panel'],
  ['--ink-invert',        '--ink',              4.5,  'label on the dark button'],
  ['--muted-invert',      '--surface-invert',   4.5,  'muted text on the dark band'],
  ['--muted-invert',      '--surface-invert-2', 4.5,  'muted text on a dark panel'],

  ['--danger',            '--surface',          4.5,  'validation message'],
  ['--danger',            '--surface-raised',   4.5,  'validation message on a card'],
  ['--focus-ring',        '--surface',          3.0,  'focus ring on paper (1.4.11)'],
  ['--focus-ring',        '--accent',           3.0,  'focus ring on the accent fill (1.4.11)'],
  ['--focus-ring-inner',  '--surface-invert',   3.0,  'focus halo on the dark band'],
  ['--line-strong',       '--surface',          3.0,  'form control border (1.4.11)'],
  ['--line-strong',       '--surface-raised',   3.0,  'form control border on a card'],
  // WCAG 1.4.3 exempts inactive controls from the text contrast minimum. Held
  // at 3:1 so a disabled control still reads as disabled rather than merely
  // quiet. This is the one relaxed row, and it is relaxed for a stated reason.
  ['--ink-disabled',      '--surface-disabled', 3.0,  'disabled control label (1.4.3 exempt)'],
  ['--ink',               '--glass-fill',       4.5,  'ink on glass (composited both ways)'],
];

// There is deliberately no --accent-on-surface pair. The accent measures 2.86:1
// on the page ground: it is a FILL there, never text, and never a control
// border either, which would need 3:1. Where the brand must be text on a light
// ground the job goes to --accent-ink, which is the same hue darkened until it
// clears AA.
//
// The four raw brand tokens (--brand-navy, --brand-blue, --brand-orange,
// --brand-gold) carry no pairs on purpose: nothing is painted with them. They
// exist so the derived steps have a stated origin, and so --brand-ramp can
// reproduce the mark's gradient on the three brand edges. The OKLCH/hex parity
// check below proves all four still match the pixels read out of the logo.
//
// --brand-gold is the ONLY gold left anywhere, and it reaches the page solely
// inside that gradient, which is the logo rather than the interface.
//
// Links are --ink with an underline, not brand-coloured.

// Headings may sit at large-text sizes, but everything is held to 4.5 rather than
// claiming 3.0 for large text. Cheaper to pass than to police per-element sizes.

// ---------------------------------------------------------------------------
// Translucent tokens that are NOT text-bearing surfaces: 1px rims and specular
// edges. Testing body text against a hairline is meaningless. Every entry needs
// a reason, and every entry is printed in the report, so the exemption stays
// visible rather than becoming a quiet escape hatch. A token only belongs here
// if nothing is ever rendered ON it.
const NON_TEXT_SURFACES = new Map([
  ['--glass-edge',  '1px specular top rim on glass. Carries no text.'],
  ['--glass-under', '1px darker hairline under glass. Carries no text.'],
]);

function parseTokens(css) {
  const tokens = new Map();
  const meta = new Map();
  // Match `--name: value;` with an optional trailing block comment on the same line.
  const re = /(--[\w-]+)\s*:\s*([^;]+);(?:[^\S\n]*\/\*([^*]*)\*\/)?/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const name = m[1];
    tokens.set(name, m[2].trim());
    if (m[3]) meta.set(name, m[3].trim());
  }
  return { tokens, meta };
}

function main() {
  if (!existsSync(TOKENS_FILE)) {
    console.log(`check-contrast: ${TOKENS_FILE} does not exist yet.`);
    console.log('check-contrast: nothing to check. Green on an empty site, by design.');
    console.log('check-contrast: stays green until the palette is derived from the logo file.');
    return 0;
  }

  const css = readFileSync(TOKENS_FILE, 'utf8');
  const { tokens, meta } = parseTokens(css);

  if (tokens.size === 0) {
    console.error('check-contrast: FAIL - tokens.css exists but declares no custom properties.');
    return 1;
  }

  const failures = [];
  const warnings = [];
  const exempt = [];
  const rows = [];

  // --- 1. Declared pairs -----------------------------------------------------
  for (const [fgName, bgName, min, label] of PAIRS) {
    if (!tokens.has(fgName) || !tokens.has(bgName)) {
      failures.push(`missing token for pair "${label}": ${tokens.has(fgName) ? bgName : fgName}`);
      continue;
    }
    let fg, bg;
    try {
      fg = resolveColor(tokens.get(fgName), tokens);
      bg = resolveColor(tokens.get(bgName), tokens);
    } catch (err) {
      failures.push(`cannot resolve pair "${label}": ${err.message}`);
      continue;
    }

    // A translucent background is measured against its worst-case backdrop,
    // not a convenient one: composite over pure black AND pure white.
    const backdrops = (bg.alpha ?? 1) < 1
      ? [['over black', composite(bg, BLACK)], ['over white', composite(bg, WHITE)]]
      : [['', bg]];

    for (const [note, solidBg] of backdrops) {
      const fgSolid = (fg.alpha ?? 1) < 1 ? composite(fg, solidBg) : fg;
      const ratio = contrast(fgSolid, solidBg);
      const pass = ratio >= min;
      rows.push({
        label: label + (note ? ` (${note})` : ''),
        ratio, min, pass, fg: hex(fgSolid), bg: hex(solidBg),
      });
      if (!pass) {
        failures.push(
          `${label}${note ? ' ' + note : ''}: ${ratio.toFixed(2)}:1 ` +
          `(needs ${min}:1)  fg ${hex(fgSolid)} on bg ${hex(solidBg)}`
        );
      }
    }
  }

  // --- 2. Every translucent surface token, composited both ways ---------------
  // Muted text is banned on glass, so --ink at full strength is the test.
  const inkRaw = tokens.get('--ink');
  if (inkRaw) {
    const ink = resolveColor(inkRaw, tokens);
    for (const [name, raw] of tokens) {
      let c;
      try { c = resolveColor(raw, tokens); } catch { continue; }
      if ((c.alpha ?? 1) >= 1) continue;
      if (!/glass|surface|veil|scrim|fill/i.test(name)) continue;
      if (NON_TEXT_SURFACES.has(name)) {
        exempt.push(`${name} - ${NON_TEXT_SURFACES.get(name)}`);
        continue;
      }
      for (const [note, ground] of [['pure black', BLACK], ['pure white', WHITE]]) {
        const solid = composite(c, ground);
        const ratio = contrast(ink, solid);
        rows.push({
          label: `${name} translucent, ink over ${note}`,
          ratio, min: 4.5, pass: ratio >= 4.5, fg: hex(ink), bg: hex(solid),
        });
        if (ratio < 4.5) {
          failures.push(
            `translucent ${name} over ${note}: ink contrast ${ratio.toFixed(2)}:1 ` +
            `(needs 4.5:1). Composite is ${hex(solid)}. Raise the alpha or darken the ink.`
          );
        }
      }
    }
  }

  // --- 3. OKLCH <-> hex parity ------------------------------------------------
  // Tokens are authored in OKLCH with the measured value recorded in a comment.
  // If the comment states a hex, it must match what the OKLCH actually resolves to.
  for (const [name, comment] of meta) {
    const stated = comment.match(/#([0-9a-f]{6})\b/i);
    if (!stated) continue;
    let c;
    try { c = resolveColor(tokens.get(name), tokens); } catch { continue; }
    const actual = hex(c).toLowerCase();
    const claimed = ('#' + stated[1]).toLowerCase();
    if (actual !== claimed) {
      failures.push(
        `OKLCH/hex parity on ${name}: comment says ${claimed}, value resolves to ${actual}`
      );
    }
  }

  // --- 4. Palette discipline ---------------------------------------------------
  // The three base tokens every derived step mixes from, and the four raw
  // values read out of the logo that the derivation is answerable to.
  const base = [
    '--accent', '--ink', '--surface',
    '--brand-navy', '--brand-blue', '--brand-orange', '--brand-gold',
  ];
  const missing = base.filter((n) => !tokens.has(n));
  if (missing.length && missing.length !== base.length) {
    warnings.push(`palette is missing ${missing.join(', ')}`);
  }

  // --- report -----------------------------------------------------------------
  const pad = Math.max(...rows.map((r) => r.label.length), 10);
  for (const r of rows) {
    console.log(
      `${r.pass ? 'PASS' : 'FAIL'}  ${r.label.padEnd(pad)}  ` +
      `${r.ratio.toFixed(2).padStart(6)}:1  (min ${r.min})  ${r.fg} on ${r.bg}`
    );
  }
  for (const e of exempt) console.log(`EXEMPT  ${e}`);
  for (const w of warnings) console.warn(`WARN  ${w}`);

  if (failures.length) {
    console.error(`\ncheck-contrast: FAIL - ${failures.length} problem(s):`);
    for (const f of failures) console.error(`  - ${f}`);
    return 1;
  }
  console.log(`\ncheck-contrast: PASS - ${rows.length} pair(s) proved.`);
  return 0;
}

process.exit(main());
