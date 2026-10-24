// Verifies every external link and embed in the built site responds.
// Run after `npm run build`:  npm run check:links
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist')

async function htmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? htmlFiles(path.join(dir, e.name)) : e.name.endsWith('.html') ? [path.join(dir, e.name)] : [])),
  )
  return files.flat()
}

const urls = new Set()
for (const file of await htmlFiles(dist)) {
  const html = await fs.readFile(file, 'utf8')
  for (const [, url] of html.matchAll(/(?:href|src)="(https?:\/\/[^"]+)"/g)) {
    const decoded = url.replace(/&amp;/g, '&')
    // Skip our own canonical / Open Graph URLs (the production domain).
    if (!/sofratg\.com\/(?:$|menu|our-story|catering|contact)/.test(decoded) || /kent-sofra/.test(decoded)) urls.add(decoded)
  }
}

let failures = 0
for (const url of [...urls].sort()) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
      headers: { 'user-agent': 'Mozilla/5.0 (link check; Sofra Turkish Grill website)' },
    })
    const ok = res.status < 400
    if (!ok) failures++
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${res.status}  ${url}`)
  } catch (error) {
    failures++
    console.log(`FAIL ---  ${url}  (${error.cause?.code ?? error.name})`)
  }
}
console.log(`\n${urls.size} external links checked, ${failures} failed.`)
process.exit(failures ? 1 : 0)
