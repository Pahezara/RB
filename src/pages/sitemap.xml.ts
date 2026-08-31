import type { APIRoute } from 'astro';
import { serviceLines } from '../data/site';

/**
 * The sitemap, DERIVED from the pages that exist rather than typed out.
 *
 * `import.meta.glob` is resolved by Vite at build time against the real
 * contents of src/pages, so adding a page puts it in the sitemap with no
 * second edit. The one thing a glob cannot expand on its own is the dynamic
 * route, so `[slug]` is filled from the same `serviceLines` array that
 * getStaticPaths uses — the two cannot disagree.
 *
 * scripts/audit-html.mjs then asserts that every route actually BUILT into
 * dist/ appears here, so if this derivation ever misses one, the build fails
 * instead of shipping a sitemap that quietly omits a page.
 */
const PAGES = Object.keys(import.meta.glob('./**/*.astro'));

/** './services/index.astro' -> '/services/'  ·  './about.astro' -> '/about/' */
function toRoute(file: string): string[] {
  const path = file.replace(/^\.\//, '').replace(/\.astro$/, '');

  // 404 is not a page anyone should be pointed at.
  if (path === '404') return [];

  if (path.includes('[slug]')) {
    return serviceLines.map((s) => `/${path.replace('[slug]', s.slug).replace(/\/index$/, '')}/`);
  }
  if (path === 'index') return ['/'];
  return [`/${path.replace(/\/index$/, '')}/`];
}

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://rbpl.lk')).origin;
  const routes = [...new Set(PAGES.flatMap(toRoute))].sort();

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes.map((r) => `  <url><loc>${origin}${r}</loc></url>`).join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
};
