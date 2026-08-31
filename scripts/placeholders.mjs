#!/usr/bin/env node
// placeholders.mjs
// The replacement list is generated FROM the asset register, so the two cannot drift.
// Blocks a production build while any placeholder or {{ASK: ...}} token remains.
//
// Set PLACEHOLDERS_ALLOW=1 for a local preview build. Never in CI, never for production.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';

const REGISTER = 'content/ASSETS.md';
const SCAN_DIRS = ['src', 'dist', 'content'];
const SCAN_EXT = ['.astro', '.html', '.css', '.md', '.json', '.ts', '.mjs'];

const allow = process.env.PLACEHOLDERS_ALLOW === '1';

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (SCAN_EXT.some((e) => name.endsWith(e))) out.push(p);
  }
  return out;
}

// --- 1. Parse the asset register into the replacement list -------------------
function readRegister() {
  if (!existsSync(REGISTER)) {
    console.error(`placeholders: FAIL - ${REGISTER} is missing. The register is the source of truth.`);
    process.exit(1);
  }
  const rows = [];
  for (const line of readFileSync(REGISTER, 'utf8').split(/\r?\n/)) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').map((c) => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1);
    if (cells.length < 4) continue;
    if (/^-+$/.test(cells[0]) || cells[0].toLowerCase() === 'asset') continue;
    const status = cells[1].replace(/\*\*/g, '').trim().toUpperCase();
    rows.push({ asset: cells[0].replace(/`/g, ''), status, needed: cells[2], source: cells[3] });
  }
  return rows;
}

const rows = readRegister();
// A row is satisfied when it is HAVE (we have the asset) or N/A (deliberately
// dropped by a recorded decision in content/DECISIONS.md). Anything else blocks.
// N/A is not a way to silence a gap: each N/A row must name the decision.
const outstanding = rows.filter((r) => !/^(HAVE|N\/A)\b/.test(r.status));

// --- 2. Scan the tree for ASK tokens and obvious placeholders -----------------
const askRe = /\{\{\s*ASK\s*:([^}]*)\}\}/g;
const lorem = /\blorem ipsum\b/i;
const tbdRe = /\b(TODO|TBD|FIXME|XXX|PLACEHOLDER)\b/;

const found = [];
for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    // The register and the Phase 0 notes are allowed to talk about what is missing.
    if (['content/ASSETS.md', 'content/FACTS.md', 'content/DECISIONS.md']
      .includes(file.split(sep).join('/'))) continue;
    const raw = readFileSync(file, 'utf8');
    const lines = raw.split(/\r?\n/);
    lines.forEach((line, i) => {
      askRe.lastIndex = 0;
      let m;
      while ((m = askRe.exec(line)) !== null) {
        found.push({ file, line: i + 1, kind: 'ASK', text: m[1].trim() });
      }
      if (lorem.test(line)) found.push({ file, line: i + 1, kind: 'LOREM', text: line.trim().slice(0, 60) });
      if (tbdRe.test(line) && !file.endsWith('.mjs')) {
        found.push({ file, line: i + 1, kind: 'TODO', text: line.trim().slice(0, 60) });
      }
    });
  }
}

// --- report ------------------------------------------------------------------
console.log('placeholders: replacement list, generated from ' + REGISTER + '\n');
if (outstanding.length === 0) {
  console.log('  asset register: all rows HAVE.');
} else {
  console.log(`  asset register: ${outstanding.length} of ${rows.length} row(s) outstanding:`);
  for (const r of outstanding) {
    console.log(`    [${r.status}] ${r.asset}`);
    console.log(`        needed for: ${r.needed}`);
    console.log(`        obtain via: ${r.source}`);
  }
}

if (found.length) {
  console.log(`\n  in-tree tokens: ${found.length}`);
  for (const f of found) console.log(`    ${f.kind}  ${f.file}:${f.line}  ${f.text}`);
}

const blocking = outstanding.length + found.length;
if (blocking === 0) {
  console.log('\nplaceholders: PASS - nothing outstanding. Safe for production.');
  process.exit(0);
}

if (allow) {
  console.warn(`\nplaceholders: ${blocking} item(s) outstanding. PLACEHOLDERS_ALLOW=1 set, so this is a preview build only.`);
  console.warn('placeholders: DO NOT deploy this build.');
  process.exit(0);
}

console.error(`\nplaceholders: FAIL - ${blocking} item(s) outstanding. Production build blocked.`);
console.error('placeholders: set PLACEHOLDERS_ALLOW=1 for a local preview build only.');
process.exit(1);
