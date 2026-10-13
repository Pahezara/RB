import { chromium } from 'playwright';
import { serve, routes } from './scripts/lib/serve.mjs';
const server = await serve('dist');
let browser = await chromium.launch();
const sizes = [[320,568],[375,667],[390,844],[412,915],[430,932],[667,375],[768,1024],[820,1180],[1024,768],[1024,1366],[1180,820]];
const problems = [];
for (const route of await routes('dist')) {
  for (const [w,h] of sizes) {
    const mobile = w < 800;
    let ctx, page;
    for (let t = 0; t < 3; t++) {
      try {
        ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: mobile, isMobile: mobile });
        page = await ctx.newPage();
        await page.goto(server.origin + route, { waitUntil: 'networkidle' });
        break;
      } catch (e) {
        try { await browser.close(); } catch {}
        browser = await chromium.launch();
      }
    }
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const over = document.documentElement.scrollWidth - vw;
      const bad = [];
      for (const el of document.querySelectorAll('main *, header *, footer *')) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue;
        if (el.closest('.marquee, .jump ul, .table-wrap, .menu-panel, .mega, .visually-hidden')) continue;
        const b = el.getBoundingClientRect();
        if (b.width && (b.right > vw + 1 || b.left < -1)) bad.push((el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : el.tagName) + ` ${Math.round(b.left)}..${Math.round(b.right)}`);
      }
      const bar = document.querySelector('.bar');
      return { over, bad: bad.slice(0, 3), hdr: bar.scrollWidth - bar.clientWidth };
    });
    if (r.over > 0 || r.bad.length || r.hdr > 1) problems.push(`${route} ${w}x${h}: over=${r.over} hdr=${r.hdr} ${r.bad.join(' | ')}`);
    await ctx.close();
  }
}
console.log(problems.length ? problems.join('\n') : 'RESPONSIVE CLEAN');
await browser.close(); await server.close();
