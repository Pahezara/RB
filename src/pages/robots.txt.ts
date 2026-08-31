import type { APIRoute } from 'astro';

/**
 * Generated rather than dropped in public/, so the sitemap line is built from
 * `site` in astro.config.mjs. A hardcoded robots.txt is the classic way a site
 * ends up advertising a sitemap on the wrong domain after a rename.
 *
 * Everything is allowed. There is nothing on this site that should not be
 * indexed, and a Disallow rule invented "just in case" is how pages quietly
 * fall out of search.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://rbpl.lk')).origin;

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
