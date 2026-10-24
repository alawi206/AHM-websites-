// Minimal static server for previewing the production build exactly as
// static hosts (Netlify, Vercel, Cloudflare Pages) serve it:
// /menu -> dist/menu/index.html, unknown paths -> dist/404.html (status 404).
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import zlib from 'node:zlib'

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist')
const port = Number(process.env.PORT) || 4173

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
}

async function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  for (const candidate of [clean, path.join(clean, 'index.html'), `${clean}.html`]) {
    const file = path.join(dist, candidate)
    if (!file.startsWith(dist)) return null
    try {
      if ((await stat(file)).isFile()) return file
    } catch {}
  }
  return null
}

http
  .createServer(async (req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost')
    const file = await resolveFile(pathname)
    const target = file ?? path.join(dist, '404.html')
    const immutable = target.includes(`${path.sep}assets${path.sep}`)
    const type = types[path.extname(target)] ?? 'application/octet-stream'
    // Compress text like production hosts do, so local audits are realistic.
    const accepts = String(req.headers['accept-encoding'] ?? '')
    const compressible = /text|javascript|json|xml|svg/.test(type)
    const encoding = compressible ? (accepts.includes('br') ? 'br' : accepts.includes('gzip') ? 'gzip' : null) : null
    res.writeHead(file ? 200 : 404, {
      'Content-Type': type,
      'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
      ...(encoding ? { 'Content-Encoding': encoding, Vary: 'Accept-Encoding' } : {}),
    })
    const stream = createReadStream(target)
    if (encoding === 'br') stream.pipe(zlib.createBrotliCompress()).pipe(res)
    else if (encoding === 'gzip') stream.pipe(zlib.createGzip()).pipe(res)
    else stream.pipe(res)
  })
  .listen(port, () => console.log(`Sofra preview running at http://localhost:${port}`))
