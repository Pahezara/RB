import { chromium } from 'playwright';
import { serve } from './scripts/lib/serve.mjs';
const [route, vp = '1440x900', out, mode = 'fold', sy = '0'] = process.argv.slice(2);
const [w, h] = vp.split('x').map(Number);
const server = await serve('dist');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 800, isMobile: w < 800 });
await page.goto(server.origin + route, { waitUntil: 'networkidle' });
if (mode === 'full') { const H = await page.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y < H; y += Math.floor(h * 0.6)) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(80); } }
await page.evaluate((yy) => window.scrollTo(0, yy), Number(sy)); await page.waitForTimeout(1300);
await page.screenshot({ path: out, fullPage: mode === 'full' });
await browser.close(); await server.close();
