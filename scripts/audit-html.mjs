#!/usr/bin/env node
// audit-html.mjs
// Runs over BUILT html in dist/, plus a source-level lint over src/ for the two
// defects that are invisible after rendering (welded text, duplicate attributes).
// Never trust dist/: run this only after a fresh build.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname, sep } from 'node:path';
import { parseHTML } from 'linkedom';

const DIST = 'dist';
const SRC = 'src';
const SITE_HOST = 'rbpl.lk';

// Origins we deliberately allow. Anything else gets flagged as third-party.
const ALLOWED_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

const INLINE_TAGS = 'a|em|strong|b|i|span|code|abbr|small|sup|sub|mark|time|q|cite';

const errors = [];
const warns = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warns.push(`${file}: ${msg}`);

function walk(dir, ext, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, ext, out);
    else if (ext.some((e) => name.endsWith(e))) out.push(p);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Source lint: the gotchas that no longer exist once the HTML is rendered.
// ---------------------------------------------------------------------------
function lintSource() {
  const files = walk(SRC, ['.astro']);
  for (const file of files) {
    const raw = readFileSync(file, 'utf8');
    const lines = raw.split(/\r?\n/);

    // A1 gotcha: JSX/Astro drops the newline between text and an inline element,
    // so `the\n<em>x</em>` renders as `thex`. Require an explicit {" "}.
    for (let i = 0; i < lines.length - 1; i++) {
      const cur = lines[i];
      const next = lines[i + 1];
      if (/[\w,.;:)\]]\s*$/.test(cur) && !/[>}]\s*$/.test(cur)) {
        const opens = new RegExp(`^\\s*<(${INLINE_TAGS})[\\s>]`, 'i');
        if (opens.test(next)) {
          err(`${file}:${i + 2}`,
            `welded text: line ends in a word and the next line opens <${next.trim().match(/^<(\w+)/)[1]}>. ` +
            `Add an explicit {" "} or keep them on one line.`);
        }
      }
      // Mirror case: inline element closes, next line starts with a word.
      const closes = new RegExp(`</(${INLINE_TAGS})>\\s*$`, 'i');
      if (closes.test(cur) && /^\s*[a-z0-9(]/i.test(next) && !/^\s*[<{]/.test(next)) {
        err(`${file}:${i + 2}`,
          'welded text: an inline element closes and the next line starts with a word. Add {" "}.');
      }
    }

    // Duplicate class= (or any attribute) on one tag: silently dropped, last wins.
    checkDuplicateAttributes(raw, file);
  }
}

// Works on raw markup, because every HTML parser silently drops the duplicate.
function checkDuplicateAttributes(raw, file) {
  const tagRe = /<([a-zA-Z][\w-]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*\/?>/g;
  let m;
  while ((m = tagRe.exec(raw)) !== null) {
    const attrsRaw = m[2];
    if (!attrsRaw) continue;
    const names = [];
    const attrRe = /(^|\s)([^\s=>/]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g;
    let a;
    while ((a = attrRe.exec(attrsRaw)) !== null) {
      const name = a[2].toLowerCase();
      if (name.startsWith('{')) continue; // Astro spread / expression
      names.push(name);
    }
    const seen = new Set();
    for (const n of names) {
      if (seen.has(n)) {
        const line = raw.slice(0, m.index).split(/\r?\n/).length;
        err(`${file}:${line}`, `duplicate attribute "${n}" on <${m[1]}>. The first one is silently dropped.`);
      }
      seen.add(n);
    }
  }
}

// ---------------------------------------------------------------------------
// Built HTML audit
// ---------------------------------------------------------------------------
function auditBuilt() {
  const files = walk(DIST, ['.html']);
  if (files.length === 0) {
    console.log('audit-html: no built HTML in dist/ yet. Nothing to audit.');
    return { pages: 0 };
  }

  // Map of every page path -> set of ids, so cross-page anchors can be resolved.
  const pageIds = new Map();
  const docs = [];

  for (const file of files) {
    const raw = readFileSync(file, 'utf8');
    const { document } = parseHTML(raw);
    const route = '/' + relative(DIST, file).split(sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '/');
    docs.push({ file, raw, document, route });
    pageIds.set(route.replace(/\/$/, '') || '/', new Set(
      [...document.querySelectorAll('[id]')].map((el) => el.getAttribute('id'))
    ));
  }

  for (const { file, raw, document, route } of docs) {
    checkDuplicateAttributes(raw, file);

    // Duplicate IDs
    const ids = [...document.querySelectorAll('[id]')].map((el) => el.getAttribute('id'));
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    for (const d of new Set(dupes)) err(file, `duplicate id "${d}"`);

    // One h1 per page, and heading levels never skip
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
    const h1s = headings.filter((h) => h.tagName.toLowerCase() === 'h1');
    if (h1s.length !== 1) err(file, `expected exactly one <h1>, found ${h1s.length}`);
    let prev = 0;
    for (const h of headings) {
      const lvl = Number(h.tagName[1]);
      if (prev && lvl > prev + 1) {
        err(file, `heading level skips from h${prev} to h${lvl} at "${(h.textContent || '').trim().slice(0, 40)}"`);
      }
      prev = lvl;
    }

    // Orphan aria-labelledby / aria-describedby / for
    const idSet = new Set(ids);
    for (const el of document.querySelectorAll('[aria-labelledby],[aria-describedby]')) {
      for (const attr of ['aria-labelledby', 'aria-describedby']) {
        const v = el.getAttribute(attr);
        if (!v) continue;
        for (const ref of v.split(/\s+/)) {
          if (!idSet.has(ref)) err(file, `${attr}="${ref}" points at no element`);
        }
      }
    }
    for (const label of document.querySelectorAll('label[for]')) {
      const v = label.getAttribute('for');
      if (!idSet.has(v)) err(file, `<label for="${v}"> points at no element`);
    }

    // Internal links and anchors resolve
    for (const a of document.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') === false && /^[a-z]+:/i.test(href)) {
        if (href && href.startsWith('#')) { /* fallthrough below */ } else continue;
      }
      if (href.startsWith('#')) {
        if (!idSet.has(href.slice(1))) err(file, `in-page anchor ${href} has no target`);
        continue;
      }
      if (href.startsWith('/')) {
        const [path, hash] = href.split('#');
        const key = path.replace(/\/$/, '') || '/';
        if (!pageIds.has(key)) {
          err(file, `internal link ${href} points at a page that was not built`);
        } else if (hash && !pageIds.get(key).has(hash)) {
          err(file, `cross-page anchor ${href} has no target on that page`);
        }
      }
    }

    // Every image has explicit dimensions (CLS)
    for (const img of document.querySelectorAll('img')) {
      if (!img.getAttribute('width') || !img.getAttribute('height')) {
        err(file, `<img src="${img.getAttribute('src')}"> is missing width/height`);
      }
    }
    // Exactly one eager image per page, the LCP element
    const eager = [...document.querySelectorAll('img')].filter(
      (i) => (i.getAttribute('loading') || '') !== 'lazy'
    );
    if (eager.length > 1) {
      warn(file, `${eager.length} images are not lazy. Exactly one eager image per page (the LCP element).`);
    }

    // Third-party origins
    for (const el of document.querySelectorAll('[src],[href]')) {
      const url = el.getAttribute('src') || el.getAttribute('href');
      if (!url || !/^https?:\/\//i.test(url)) continue;
      try {
        const u = new URL(url);
        if (u.host.endsWith(SITE_HOST)) continue;
        if (ALLOWED_ORIGINS.some((o) => url.startsWith(o))) continue;
        if (el.tagName.toLowerCase() === 'a') continue; // outbound links are fine
        warn(file, `third-party resource: ${u.origin}`);
      } catch { /* ignore */ }
    }

    // Meta lengths
    const title = (document.querySelector('title')?.textContent || '').trim();
    if (!title) err(file, 'missing <title>');
    else if (title.length > 60) warn(file, `<title> is ${title.length} chars (over 60)`);
    const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    if (!desc) err(file, 'missing meta description');
    else if (desc.length < 50 || desc.length > 160) {
      warn(file, `meta description is ${desc.length} chars (aim 50-160)`);
    }

    // Every og:image must resolve to a file that actually exists in dist/.
    // A hardcoded OG page list drifted once and left five pages pointing at
    // images that were never generated, which ships as a blank preview card.
    const og = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    if (og) {
      try {
        const p = new URL(og).pathname.replace(/^\//, '');
        if (!existsSync(join(DIST, p))) err(file, `og:image ${og} does not exist in dist/`);
      } catch { err(file, `og:image is not a valid URL: ${og}`); }
    } else {
      err(file, 'missing og:image');
    }

    // JSON-LD parses
    for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        JSON.parse(s.textContent);
      } catch (e) {
        err(file, `JSON-LD does not parse: ${e.message}`);
      }
    }

    // Landmarks and skip link
    if (!document.querySelector('main')) err(file, 'no <main> landmark');
    if (!document.querySelector('a[href^="#"][class*="skip"], a.skip-link')) {
      warn(file, 'no skip link found');
    }

    // 100vh is banned; svh/dvh only. (Catches it in inline styles.)
    if (/:\s*100vh\b/.test(raw)) err(file, 'uses 100vh. Use 100svh or 100dvh.');
  }

  return { pages: files.length };
}

/**
 * The sitemap is DERIVED (src/pages/sitemap.xml.ts) rather than typed, but a
 * derivation can still be wrong. This proves it against the routes that were
 * actually built: every page in dist/ must be listed, and nothing may be listed
 * that does not exist. 404 is excluded on both sides — it is a page nobody
 * should be sent to on purpose.
 */
function auditSitemap() {
  const file = join(DIST, 'sitemap.xml');
  if (!existsSync(file)) {
    err('dist/sitemap.xml', 'missing. Search engines have nothing to read.');
    return;
  }
  const xml = readFileSync(file, 'utf8');
  const listed = new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  );

  const built = new Set(
    walk(DIST, ['.html'])
      .map((f) => '/' + relative(DIST, f).split(sep).join('/').replace(/index\.html$/, ''))
      .filter((r) => r !== '/404.html')
  );

  for (const r of built) {
    if (!listed.has(r)) err('dist/sitemap.xml', `built route ${r} is not in the sitemap`);
  }
  for (const r of listed) {
    if (!built.has(r)) err('dist/sitemap.xml', `sitemap lists ${r}, which was not built`);
  }

  if (!existsSync(join(DIST, 'robots.txt'))) {
    err('dist/robots.txt', 'missing. Nothing points crawlers at the sitemap.');
  } else if (!readFileSync(join(DIST, 'robots.txt'), 'utf8').includes('/sitemap.xml')) {
    err('dist/robots.txt', 'does not reference the sitemap.');
  }
}

lintSource();
const { pages } = auditBuilt();
auditSitemap();

for (const w of warns) console.warn(`WARN  ${w}`);
if (errors.length) {
  console.error(`\naudit-html: FAIL - ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`\naudit-html: PASS - ${pages} page(s) audited, ${warns.length} warning(s).`);
process.exit(0);
