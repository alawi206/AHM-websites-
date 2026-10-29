/**
 * Captures the social share image (public/og-image.jpg) from the live hero and
 * rasterises the favicon into public/apple-touch-icon.png.
 * Usage: npm run dev (in another terminal), then `node scripts/render-social.mjs`.
 */
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const { chromium } = await import('playwright').catch(() => createRequire(import.meta.url)('playwright'))

const BASE = process.env.RENDER_BASE ?? 'http://localhost:5173/'
const PUBLIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public')

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})

// The hero has a 720px minimum height, so capture at 1371×720 and scale down to exactly 1200×630.
const og = await browser.newPage({
  viewport: { width: 1371, height: 720 },
  deviceScaleFactor: 1200 / 1371,
  reducedMotion: 'reduce',
})
await og.goto(BASE, { waitUntil: 'networkidle' })
// A share card, not a screenshot: keep the rating, headline and lights; drop copy, buttons and nav links.
await og.evaluate(() => {
  document.querySelector('#top a[href="#work"]')?.closest('.grid')?.setAttribute('style', 'display:none')
  document.querySelector('nav[aria-label="Primary"] ul')?.setAttribute('style', 'visibility:hidden')
})
await og.waitForTimeout(2500)
await og.screenshot({ path: path.join(PUBLIC, 'og-image.jpg'), type: 'jpeg', quality: 88 })
console.log('rendered og-image.jpg')

const icon = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 })
const svg = fs.readFileSync(path.join(PUBLIC, 'favicon.svg'), 'utf8').replace('rx="14"', 'rx="0"')
await icon.setContent(`<body style="margin:0">${svg.replace('<svg ', '<svg width="180" height="180" ')}</body>`)
await icon.screenshot({ path: path.join(PUBLIC, 'apple-touch-icon.png') })
console.log('rendered apple-touch-icon.png')

await browser.close()
