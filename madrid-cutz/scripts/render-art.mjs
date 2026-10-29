/**
 * Bakes still renders of the hex-light ceiling into src/assets/art/.
 * Usage: npm run dev (in another terminal), then `node scripts/render-art.mjs`.
 * Requires Playwright + Chromium (preinstalled in the build container).
 */
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Resolve Playwright from the project or from a global install.
const { chromium } = await import('playwright').catch(() => createRequire(import.meta.url)('playwright'))

const BASE = process.env.RENDER_BASE ?? 'http://localhost:5173/render.html'
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/assets/art')

const SHOTS = [
  // Looking up and across the ceiling — used in "More than a haircut".
  { name: 'ceiling-angle', w: 1400, h: 1750, q: 'pitch=0.62&yaw=0.42&roll=-0.08&focal=0.78&halfW=3.4&floor=1' },
  // Wide, low corridor view — backdrop for the final call to action.
  { name: 'ceiling-wide', w: 2400, h: 1200, q: 'pitch=0.05&focal=1.15&halfW=3.4&floor=1&exposure=1.1' },
  // Straight up — texture for the gallery fallback tiles.
  { name: 'ceiling-overhead', w: 1400, h: 1400, q: 'mode=overhead&focal=0.45&roll=0.18' },
]

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
for (const shot of SHOTS) {
  const page = await browser.newPage({ viewport: { width: shot.w, height: shot.h }, deviceScaleFactor: 1 })
  await page.goto(`${BASE}?${shot.q}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('body[data-ready="1"]', { timeout: 30000 })
  await page.waitForTimeout(400)
  const file = path.join(OUT, `${shot.name}.jpg`)
  // imagetools re-encodes these to AVIF / WebP at build time.
  await page.screenshot({ path: file, type: 'jpeg', quality: 90 })
  console.log('rendered', file)
  await page.close()
}
await browser.close()
