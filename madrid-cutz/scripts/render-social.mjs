/**
 * Generates the share image and app icons from the live site and the logo:
 *   public/og-image.jpg        1200×630 social card (captured from the hero)
 *   public/favicon-32.png      browser tab icon (transparent)
 *   public/apple-touch-icon.png, icon-192.png, icon-512.png  (on the brand black)
 * Usage: npm run dev (in another terminal), then `npm run render:social`.
 */
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const { chromium } = await import('playwright').catch(() => createRequire(import.meta.url)('playwright'))

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = path.join(ROOT, 'public')
const LOGO = path.join(ROOT, 'src/assets/brand/madrid-cutz-logo.png')
const BASE = process.env.RENDER_BASE ?? 'http://localhost:5173/'

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
// A share card, not a screenshot: the centred hero minus the nav links.
await og.evaluate(() => {
  document.querySelector('nav[aria-label="Primary"] ul')?.setAttribute('style', 'visibility:hidden')
})
await og.waitForTimeout(3000)
await og.screenshot({ path: path.join(PUBLIC, 'og-image.jpg'), type: 'jpeg', quality: 88 })
console.log('rendered og-image.jpg')

const logo = `data:image/png;base64,${fs.readFileSync(LOGO).toString('base64')}`
const ICONS = [
  { file: 'favicon-32.png', size: 32, pad: 0, bg: 'transparent' },
  { file: 'apple-touch-icon.png', size: 180, pad: 12, bg: '#0b0c0e' },
  { file: 'icon-192.png', size: 192, pad: 10, bg: '#0b0c0e' },
  { file: 'icon-512.png', size: 512, pad: 26, bg: '#0b0c0e' },
]
for (const icon of ICONS) {
  const page = await browser.newPage({ viewport: { width: icon.size, height: icon.size }, deviceScaleFactor: 1 })
  const inner = icon.size - icon.pad * 2
  await page.setContent(
    `<body style="margin:0;background:${icon.bg}"><img src="${logo}" style="display:block;width:${inner}px;height:${inner}px;margin:${icon.pad}px;object-fit:contain"></body>`,
  )
  await page.waitForFunction(() => document.querySelector('img')?.complete)
  await page.screenshot({ path: path.join(PUBLIC, icon.file), omitBackground: icon.bg === 'transparent' })
  console.log('rendered', icon.file)
  await page.close()
}

await browser.close()
