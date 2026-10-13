import { chromium } from 'playwright';
import { serve } from './scripts/lib/serve.mjs';
const server = await serve('dist');
const browser = await chromium.launch();
for (const w of [1024, 1100, 1152, 1200, 1232, 1280, 1366, 1440, 1536, 1600, 1680, 1728, 1920, 2048, 2560, 3440]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(server.origin + '/services/', { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const bar = document.querySelector('.bar'); const cs = getComputedStyle(bar);
    const inner = { l: bar.getBoundingClientRect().left + parseFloat(cs.paddingLeft), r: bar.getBoundingClientRect().right - parseFloat(cs.paddingRight) };
    const vis = [...bar.querySelectorAll('.brand, .nav-link, .mega-toggle, .tel, .cta, .cta-compact, .menu > summary')].filter((e) => e.getClientRects().length && getComputedStyle(e).display !== 'none');
    const right = Math.max(...vis.map((e) => e.getBoundingClientRect().right));
    const left = Math.min(...vis.map((e) => e.getBoundingClientRect().left));
    const wraps = [...bar.querySelectorAll('.nav-link')].some((e) => e.getBoundingClientRect().height > 50);
    const content = document.querySelector('main .container').getBoundingClientRect();
    const ccs = getComputedStyle(document.querySelector('main .container'));
    return { root: getComputedStyle(document.documentElement).fontSize, overR: Math.round(right - inner.r), overL: Math.round(inner.l - left), wraps,
      contentL: Math.round(content.left + parseFloat(ccs.paddingLeft)), headerL: Math.round(inner.l), tel: !!vis.find((e) => e.classList.contains('tel')), contentW: Math.round(content.width) };
  });
  console.log(w, JSON.stringify(r));
  await page.close();
}
await browser.close(); await server.close();
