// Minimal static server over dist/, so the browser-driven checks run against
// real HTTP rather than file:// (view transitions and absolute paths need it).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

export async function serve(root, port = 0) {
  const server = createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      // Contain the path inside root.
      let filePath = join(root, normalize(path).replace(/^(\.\.[/\\])+/, ''));
      let s = await stat(filePath).catch(() => null);
      if (s?.isDirectory()) {
        filePath = join(filePath, 'index.html');
        s = await stat(filePath).catch(() => null);
      }
      if (!s) {
        const alt = filePath.endsWith('.html') ? null : filePath + '.html';
        if (alt && (await stat(alt).catch(() => null))) filePath = alt;
        else {
          const notFound = join(root, '404.html');
          const has404 = await stat(notFound).catch(() => null);
          res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
          res.end(has404 ? await readFile(notFound) : 'Not found');
          return;
        }
      }
      res.writeHead(200, { 'content-type': TYPES[extname(filePath)] || 'application/octet-stream' });
      res.end(await readFile(filePath));
    } catch (e) {
      res.writeHead(500);
      res.end(String(e));
    }
  });

  await new Promise((r) => server.listen(port, '127.0.0.1', r));
  const { port: actual } = server.address();
  return {
    origin: `http://127.0.0.1:${actual}`,
    close: () => new Promise((r) => server.close(r)),
  };
}

/** Every built route, as site-absolute paths. */
export async function routes(distDir) {
  const { readdirSync, statSync, existsSync } = await import('node:fs');
  const { relative, sep } = await import('node:path');
  const out = [];
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) {
        const rel = relative(distDir, p).split(sep).join('/');
        out.push('/' + rel.replace(/index\.html$/, ''));
      }
    }
  };
  walk(distDir);
  return out.sort();
}
