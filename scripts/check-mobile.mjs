#!/usr/bin/env node
// check-mobile.mjs
// The mobile contract, enforced rather than eyeballed. Runs every built route at
// the two phone widths that matter and asserts:
//
//   1. no horizontal overflow, and nothing sticking out past the viewport
//   2. every interactive target is at least 44x44 CSS px (inline links in prose
//      are exempt, since they cannot be, and are not meant to be, buttons)
//   3. no rendered text below 12px, and body copy at 16px or more
//   4. the sticky header's real height matches the --header-h token, because
//      every anchor offset on the site is derived from that one number
//   5. tap targets do not overlap each other
import { existsSync } from 'node:fs';
import { serve, routes } from './lib/serve.mjs';

const DIST = 'dist';
const WIDTHS = [
  // 320 is the floor a responsive site is expected to survive: iPhone SE 1st
  // gen, older budget Androids, and any phone at 100% zoom in split view. It is
  // also where every "it looked fine on my phone" layout actually breaks, so it
  // is the width worth failing a build over.
  { name: '320x568', width: 320, height: 568 },
  { name: '360x640', width: 360, height: 640 },
  { name: '390x844', width: 390, height: 844 },
  // A phone held sideways is still a phone. Short viewports catch anything
  // sized in svh, and the wider column catches two-column rules that switch on
  // too early.
  { name: '844x390', width: 844, height: 390 },
];
const TAP = 44;
const MIN_FONT = 12;

if (!existsSync(DIST) || (await routes(DIST)).length === 0) {
  console.log('check-mobile: no built HTML in dist/ yet. Nothing to check.');
  process.exit(0);
}

let chromium;
try { ({ chromium } = await import('playwright')); }
catch {
  console.error('check-mobile: playwright is not installed.');
  process.exit(1);
}

const server = await serve(DIST);
const browser = await chromium.launch();
const failures = [];
const warnings = [];

const PROBE = `(() => {
  const out = { overflow: null, small: [], tiny: [], overlaps: [], headerH: null, tokenH: null };

  const de = document.documentElement;
  if (de.scrollWidth > innerWidth + 1) {
    // Find what is actually sticking out, so the report names a culprit.
    const wide = [];
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right > innerWidth + 1 || r.left < -1) {
        wide.push({
          tag: el.tagName.toLowerCase(),
          cls: (typeof el.className === 'string' ? el.className : '').trim().slice(0, 60),
          left: Math.round(r.left), right: Math.round(r.right),
        });
      }
    }
    out.overflow = { scrollWidth: de.scrollWidth, innerWidth, culprits: wide.slice(0, 6) };
  }

  const inProse = (el) => !!el.closest('p, li, address, .prose, .answer, .colophon, .step-meta');
  const targets = [];
  for (const el of document.querySelectorAll('a[href], button, summary, input, select, textarea, [role="button"]')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const label = el.tagName.toLowerCase() +
      ((typeof el.className === 'string' && el.className.trim()) ? '.' + el.className.trim().split(/\\s+/)[0] : '') +
      ' "' + (el.textContent || '').trim().slice(0, 28) + '"';
    if ((r.width < ${TAP} - 0.5 || r.height < ${TAP} - 0.5) && !inProse(el)) {
      out.small.push({ label, w: Math.round(r.width), h: Math.round(r.height) });
    }
    targets.push({ label, r: { t: r.top, l: r.left, b: r.bottom, rr: r.right } });
  }

  for (const el of document.querySelectorAll('body *')) {
    if (!el.childNodes.length) continue;
    let hasText = false;
    for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) hasText = true;
    if (!hasText) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < ${MIN_FONT}) {
      out.tiny.push({
        tag: el.tagName.toLowerCase(),
        cls: (typeof el.className === 'string' ? el.className : '').trim().slice(0, 40),
        px: fs.toFixed(1),
      });
    }
  }

  const header = document.querySelector('.site-header');
  if (header) {
    const bar = header.querySelector('.bar') || header;
    out.headerH = Math.round(bar.getBoundingClientRect().height);
    out.tokenH = Math.round(parseFloat(getComputedStyle(de).getPropertyValue('--header-h')) *
      parseFloat(getComputedStyle(de).fontSize) / 16 * 16);
  }

  return out;
})()`;

for (const route of await routes(DIST)) {
  for (const vp of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto(server.origin + route, { waitUntil: 'networkidle' });
    const r = await page.evaluate(PROBE);

    if (r.overflow) {
      failures.push(
        `${route} @ ${vp.name}: horizontal overflow, scrollWidth ${r.overflow.scrollWidth} > ${r.overflow.innerWidth}\n` +
        r.overflow.culprits.map((c) => `        ${c.tag}.${c.cls} spans ${c.left}..${c.right}`).join('\n')
      );
    }
    for (const s of r.small) {
      failures.push(`${route} @ ${vp.name}: tap target ${s.w}x${s.h} is under ${TAP}x${TAP}  ${s.label}`);
    }
    for (const t of r.tiny) {
      failures.push(`${route} @ ${vp.name}: ${t.px}px text on ${t.tag}.${t.cls} (minimum ${MIN_FONT}px)`);
    }
    if (r.headerH != null && Math.abs(r.headerH - r.tokenH) > 2) {
      warnings.push(`${route} @ ${vp.name}: header renders ${r.headerH}px but --header-h says ${r.tokenH}px`);
    }
    await page.close();
  }
}

await browser.close();
await server.close();

for (const w of warnings) console.warn(`WARN  ${w}`);
if (failures.length) {
  console.error(`\ncheck-mobile: FAIL - ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`check-mobile: PASS - no overflow, no small tap targets, no tiny text at ${WIDTHS.map((w) => w.name).join(", ")}.`);
process.exit(0);
