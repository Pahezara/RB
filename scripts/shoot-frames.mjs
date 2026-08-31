#!/usr/bin/env node
// shoot-frames.mjs
// Verify by looking. Static analysis says "clean" while the page is visibly broken.
// Renders every route to PNG at four viewports, plus the reduced-motion and
// no-backdrop-filter variants, into frames/.
//
// 1366x768 is the one that catches the type-scale bug, which is why it is in the set.
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { serve, routes } from './lib/serve.mjs';

const DIST = 'dist';
const OUT = 'frames';

const VIEWPORTS = [
  { name: '360x640', width: 360, height: 640, mobile: true },   /* smallest common Android */
  { name: '390x844', width: 390, height: 844, mobile: true },   /* the most common real phone */
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1920x1080', width: 1920, height: 1080 },
];

const all = existsSync(DIST) ? await routes(DIST) : [];
if (all.length === 0) {
  console.log('shoot-frames: no built HTML in dist/ yet. Nothing to shoot.');
  process.exit(0);
}

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('shoot-frames: playwright is not installed. Run: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const server = await serve(DIST);
const browser = await chromium.launch();
const slug = (r) => (r === '/' ? 'home' : r.replace(/^\/|\/$/g, '').replace(/\//g, '-'));
let shot = 0;

async function capture(route, vp, label, opts = {}) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: opts.reducedMotion ? 'reduce' : 'no-preference',
    isMobile: false,
  });
  const page = await context.newPage();

  if (opts.noBackdrop) {
    // Visual check only: this shows the page with blur removed. It does NOT
    // exercise the @supports fallback path, which check-glass-count asserts
    // separately by looking for the rule in the built CSS.
    await page.addInitScript(() => {
      addEventListener('DOMContentLoaded', () => {
        const s = document.createElement('style');
        s.textContent = '*{backdrop-filter:none !important;-webkit-backdrop-filter:none !important}';
        document.head.appendChild(s);
      });
    });
  }
  if (opts.reducedTransparency) {
    // Genuinely emulate the media feature over CDP, rather than injecting CSS
    // that merely imitates the fallback. This exercises the real
    // @media (prefers-reduced-transparency: reduce) rule in glass.css.
    const client = await context.newCDPSession(page);
    await client.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }],
    });
  }

  await page.goto(server.origin + route, { waitUntil: 'networkidle' });

  // Walk the page before capturing. A fullPage screenshot does NOT trigger
  // loading="lazy" images below the fold, so without this every lazy image in
  // the footer renders as a blank gap and the frame lies about the page.
  await page.evaluate(async () => {
    const step = innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');

  // Let fonts settle so the shot is not of a mid-swap page.
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(250);

  const base = join(OUT, `${slug(route)}__${vp.name}${label ? '__' + label : ''}`);

  // The fold: exactly what a visitor at this viewport sees, no resizing. This is
  // the frame to trust for anything above the fold.
  await page.screenshot({ path: `${base}__fold.png` });
  shot++;

  // The full page. A fullPage capture computes its height from the CURRENT
  // viewport but renders with a taller one, so any length keyed to svh (the
  // section rhythm, the hero) lays out at a different size than the capture
  // assumed. The frame then disagrees with the real page by tens of pixels, and
  // shows a phantom strip of page ground under the footer. Growing the viewport
  // to the document first, and repeating until it settles, makes layout and
  // capture agree with each other.
  for (let i = 0; i < 4; i++) {
    const docH = await page.evaluate(() => document.documentElement.scrollHeight);
    const target = Math.min(docH, 12000);
    const current = page.viewportSize();
    if (Math.abs(current.height - target) <= 2) break;
    await page.setViewportSize({ width: vp.width, height: target });
    await page.waitForTimeout(140);
  }
  await page.screenshot({ path: `${base}.png`, fullPage: true });
  shot++;
  await context.close();
  return `${base}.png`;
}

for (const route of all) {
  for (const vp of VIEWPORTS) {
    await capture(route, vp, '');
  }
}

// Variants, on the home page and one inner page, at the two viewports that matter most.
const variantRoutes = [all[0], all.find((r) => r !== all[0])].filter(Boolean);
for (const route of variantRoutes) {
  for (const vp of VIEWPORTS.filter((v) => v.name === '360x640' || v.name === '1366x768')) {
    await capture(route, vp, 'reduced-motion', { reducedMotion: true });
    await capture(route, vp, 'no-backdrop-filter', { noBackdrop: true });
    await capture(route, vp, 'reduced-transparency', { reducedTransparency: true });
  }
}

await browser.close();
await server.close();

console.log(`shoot-frames: PASS - ${shot} frame(s) written to ${OUT}/`);
console.log('shoot-frames: now LOOK at them. This script proves they rendered, not that they are right.');
process.exit(0);
