// Renders every route to static HTML after the client and server builds.
// Output: dist/index.html, dist/menu/index.html, …, dist/404.html,
// plus sitemap.xml and robots.txt.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
const { render, routes, notFoundRoute, headTags, SITE_URL } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)

// Preload the two Latin font files used above the fold.
const assets = await fs.readdir(path.join(dist, 'assets'))
const fontPreloads = assets
  .filter((file) => /^(cormorant-garamond-latin-wght-(normal|italic)|manrope-latin-wght-normal)-.+\.woff2$/.test(file))
  .map((file) => `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ')

function page(url, meta, options) {
  const appHtml = render(url)
  return template
    .replace(/<title>.*?<\/title>\s*/s, '')
    .replace('<!--head-->', `${headTags(meta, options)}\n    ${fontPreloads}`)
    .replace('<!--app-->', appHtml)
}

async function write(file, html) {
  const target = path.join(dist, file)
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(target, html)
  console.log(`  prerendered  ${path.relative(root, target)}`)
}

for (const route of routes) {
  const { path: routePath } = route.meta
  const file = routePath === '/' ? 'index.html' : `${routePath.slice(1)}/index.html`
  await write(file, page(routePath, route.meta))
}
await write('404.html', page('/404', notFoundRoute.meta, { indexable: false }))

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url><loc>${SITE_URL}${r.meta.path === '/' ? '/' : r.meta.path}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n')}
</urlset>
`
await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap)
await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

// The server bundle and build manifest are not part of the deployed site.
await fs.rm(ssrDir, { recursive: true, force: true })
await fs.rm(path.join(dist, '.vite'), { recursive: true, force: true })
console.log('  wrote        dist/sitemap.xml, dist/robots.txt')
