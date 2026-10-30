/**
 * Records fast-paced demo videos of the site, frame by frame, so they are
 * perfectly smooth even when the machine renders WebGL in software.
 *
 *   npm run build && npm run preview          (in another terminal)
 *   node scripts/record-demo.mjs desktop      → demo/madrid-cutz-desktop.mp4 (1920×1080)
 *   node scripts/record-demo.mjs mobile       → demo/madrid-cutz-mobile.mp4  (1170×2532)
 *
 * How it stays deterministic: the page clock is frozen (Playwright clock),
 * Motion is forced onto its JS engine (no Element.animate), CSS animations are
 * paused and stepped by hand, and every frame is a screenshot encoded at 30fps
 * with ffmpeg.
 */
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const { chromium } = await import('playwright').catch(() => createRequire(import.meta.url)('playwright'))

const MODE = process.argv[2] === 'mobile' ? 'mobile' : 'desktop'
const BASE = process.env.DEMO_BASE ?? 'http://localhost:4173/'
const FPS = 30
const DT = 1000 / FPS
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'demo', `madrid-cutz-${MODE}.mp4`)
const FRAMES = fs.mkdtempSync(path.join(os.tmpdir(), `mc-${MODE}-`))

const CONFIG = {
  desktop: { viewport: { width: 1440, height: 810 }, deviceScaleFactor: 4 / 3, isMobile: false, hasTouch: false },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
}[MODE]

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const context = await browser.newContext(CONFIG)
const page = await context.newPage()

await page.addInitScript((mode) => {
  // Keep Motion on its JS engine so the frozen clock drives every animation:
  // Motion only checks for an own Element.prototype.animate, so move it one
  // level down where direct callers still find it.
  const animate = Element.prototype.animate
  delete Element.prototype.animate
  HTMLElement.prototype.animate = animate
  SVGElement.prototype.animate = animate

  window.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.scrollBehavior = 'auto'
    const style = document.createElement('style')
    style.textContent = `
      #__cursor{position:fixed;left:-60px;top:-60px;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;
        border:2px solid rgba(255,255,255,.95);background:rgba(255,255,255,.14);
        box-shadow:0 0 0 1px rgba(0,0,0,.35),0 6px 18px rgba(0,0,0,.55);pointer-events:none;z-index:2147483647;
        transition:transform .18s cubic-bezier(.16,1,.3,1)}
      #__cursor.down{transform:scale(.72)}
      .__tap{position:fixed;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;pointer-events:none;
        z-index:2147483647;background:rgba(255,255,255,.35);border:2px solid rgba(255,255,255,.9);
        animation:__tap .5s cubic-bezier(.16,1,.3,1) forwards}
      @keyframes __tap{from{transform:scale(.4);opacity:1}to{transform:scale(1.4);opacity:0}}`
    document.head.appendChild(style)
    if (mode === 'desktop') {
      const cursor = document.createElement('div')
      cursor.id = '__cursor'
      document.body.appendChild(cursor)
      addEventListener('mousemove', (e) => (cursor.style.cssText = `left:${e.clientX}px;top:${e.clientY}px`), true)
      addEventListener('mousedown', () => cursor.classList.add('down'), true)
      addEventListener('mouseup', () => cursor.classList.remove('down'), true)
    }
    window.__tap = (x, y) => {
      const dot = document.createElement('div')
      dot.className = '__tap'
      dot.style.left = `${x}px`
      dot.style.top = `${y}px`
      document.body.appendChild(dot)
      setTimeout(() => dot.remove(), 600)
    }
    // Pause every CSS animation/transition and advance it by hand, one frame at a time.
    window.__stepCss = (dt) => {
      for (const a of document.getAnimations()) {
        try {
          // Scroll-driven animations already follow the scroll position we set each frame.
          if (a.timeline && a.timeline !== document.timeline) continue
          if (!a.__held) {
            a.__held = true
            a.pause()
          }
          const raw = a.currentTime
          const current = typeof raw === 'number' ? raw : Number(raw?.value ?? 0)
          if (!Number.isFinite(current)) continue
          const end = a.effect?.getComputedTiming().endTime
          const next = current + dt
          if (typeof end === 'number' && Number.isFinite(end) && next >= end) a.finish()
          else a.currentTime = next
        } catch {
          // Ignore animations that cannot be stepped (e.g. already removed).
        }
      }
    }
  })
}, MODE)

await page.clock.install({ time: new Date('2026-10-30T18:00:00Z') })
await page.clock.pauseAt(new Date('2026-10-30T18:00:02Z'))
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.evaluate(async () => {
  await document.fonts.ready
  // Load and decode every image up front so nothing pops in mid-shot.
  document.querySelectorAll('img').forEach((img) => (img.loading = 'eager'))
  await Promise.all(
    [...document.images].map((img) =>
      img.complete ? img.decode().catch(() => {}) : new Promise((r) => (img.onload = img.onerror = r)),
    ),
  )
})
await page.waitForTimeout(500)

// ---------------------------------------------------------------- frame engine
let frameNo = 0
let scrollY = 0
let mouse = { x: CONFIG.viewport.width * 0.78, y: CONFIG.viewport.height * 0.72 }
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

async function frame(extra) {
  await page.evaluate(
    ({ y, dt }) => {
      window.scrollTo({ top: y, behavior: 'instant' })
      window.__stepCss(dt)
    },
    { y: scrollY, dt: DT },
  )
  if (extra) await extra()
  await page.clock.runFor(DT)
  await page.screenshot({ path: path.join(FRAMES, `${String(frameNo++).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 })
  if (frameNo % 30 === 0) process.stdout.write(`\r${MODE}: ${(frameNo / FPS).toFixed(1)}s recorded`)
}

const hold = async (s) => {
  for (let i = 0; i < Math.round(s * FPS); i++) await frame()
}

/** Eased scroll to a pixel offset or to a selector (with an extra offset). */
async function scroll(target, s, offset = 0) {
  const to =
    typeof target === 'number'
      ? target
      : await page.evaluate(
          ({ sel, off }) => Math.round(document.querySelector(sel).getBoundingClientRect().top + window.scrollY + off),
          { sel: target, off: offset },
        )
  const from = scrollY
  const n = Math.max(1, Math.round(s * FPS))
  for (let i = 1; i <= n; i++) {
    scrollY = Math.round(from + (to - from) * ease(i / n))
    await frame()
  }
}

/** Eased pointer move (desktop), rendered with the visible cursor. */
async function moveTo(x, y, s) {
  const from = { ...mouse }
  const n = Math.max(1, Math.round(s * FPS))
  for (let i = 1; i <= n; i++) {
    const k = ease(i / n)
    mouse = { x: from.x + (x - from.x) * k, y: from.y + (y - from.y) * k }
    await frame(() => page.mouse.move(mouse.x, mouse.y))
  }
}

async function center(selector) {
  return page.evaluate((sel) => {
    const r = document.querySelector(sel).getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }, selector)
}

async function moveToEl(selector, s) {
  const c = await center(selector)
  await moveTo(c.x, c.y, s)
}

async function click() {
  await frame(() => page.mouse.down())
  await frame(() => page.mouse.up())
}

async function tap(selector) {
  const c = await center(selector)
  await frame(async () => {
    await page.evaluate(({ x, y }) => window.__tap(x, y), c)
    await page.touchscreen.tap(c.x, c.y)
  })
}

async function key(name) {
  await frame(() => page.keyboard.press(name))
}

// ---------------------------------------------------------------- storyboards
const W = CONFIG.viewport.width
const H = CONFIG.viewport.height

if (MODE === 'desktop') {
  // Lights power on, the emblem resolves; the cursor drifts so the emblem tilts.
  await moveTo(W * 0.62, H * 0.42, 2.4)
  await moveToEl('#top a[href*="booksy"]', 0.5)
  await hold(0.6)
  await scroll('#trust', 0.7, -170)
  await hold(0.8)
  await scroll('#about', 0.7, 40)
  await hold(1.0)
  await scroll('#services', 0.7, 0)
  await moveToEl('#services li:nth-of-type(1) h3', 0.4)
  await hold(0.8)
  await moveToEl('#services li:nth-of-type(2) h3', 0.4)
  await hold(0.3)
  await scroll('#work', 0.7, 0)
  await hold(0.6)
  await scroll('#work', 0.6, 430)
  await hold(0.5)
  await moveToEl('#work button[aria-label^="Open photo"]', 0.4)
  await hold(0.2)
  await click()
  await hold(0.8)
  await key('ArrowRight')
  await hold(0.6)
  await key('ArrowRight')
  await hold(0.6)
  await key('Escape')
  await hold(0.3)
  await scroll('#barbers', 0.8, 330)
  await moveToEl('#barbers li:nth-of-type(2) article', 0.4)
  await hold(0.8)
  await scroll('#reviews', 0.8, 120)
  await hold(1.8)
  const cine = await page.evaluate(() => document.getElementById('cinematic-title').closest('section').offsetTop)
  await scroll(cine - H * 0.2, 0.5)
  await scroll(cine + H * 0.45, 1.3)
  await hold(0.3)
  await scroll('#visit', 0.7, 0)
  await hold(0.7)
  await scroll('#book', 0.8, 70)
  await moveToEl('#book a[href*="booksy"]', 0.5)
  await hold(1.6)
} else {
  await hold(3.0)
  await tap('button[aria-controls="mobile-menu"]')
  await hold(0.9)
  await tap('button[aria-controls="mobile-menu"]')
  await hold(0.5)
  await scroll('#trust', 0.6, -120)
  await hold(0.7)
  await scroll('#about', 0.6, -10)
  await hold(0.7)
  await scroll('#about', 0.5, 520)
  await hold(0.6)
  await scroll('#services', 0.6, 0)
  await hold(0.6)
  await scroll('#services', 0.5, 470)
  await hold(0.5)
  await scroll('#work', 0.6, 0)
  await hold(0.5)
  await scroll('#work', 0.5, 380)
  await hold(0.4)
  await tap('#work button[aria-label^="Open photo"]')
  await hold(0.7)
  // Swipe to the next photo.
  const img = await center('[aria-label="Photo viewer"] img')
  await frame(async () => {
    await page.evaluate(({ x, y }) => window.__tap(x, y), img)
    await page.mouse.move(img.x, img.y)
    await page.mouse.down()
  })
  for (let i = 1; i <= 6; i++) await frame(() => page.mouse.move(img.x - i * 30, img.y))
  await frame(() => page.mouse.up())
  await hold(0.6)
  await tap('button[aria-label="Close photo viewer"]')
  await hold(0.3)
  await scroll('#barbers', 0.6, 230)
  // Swipe through the barber cards.
  const track = '#barbers ul'
  // Glide instead of snapping card to card while the swipe is scripted.
  await page.evaluate((sel) => (document.querySelector(sel).style.scrollSnapType = 'none'), track)
  for (let i = 1; i <= 24; i++) {
    await frame(() =>
      page.evaluate(
        ({ sel, k }) => {
          const el = document.querySelector(sel)
          el.scrollLeft = (el.scrollWidth - el.clientWidth) * k
        },
        { sel: track, k: ease(i / 24) * 0.8 },
      ),
    )
  }
  await hold(0.3)
  await scroll('#reviews', 0.6, 0)
  await hold(0.6)
  await scroll('#reviews', 0.5, 560)
  await hold(1.4)
  const cine = await page.evaluate(() => document.getElementById('cinematic-title').closest('section').offsetTop)
  await scroll(cine - H * 0.15, 0.5)
  await scroll(cine + H * 0.45, 1.2)
  await scroll('#visit', 0.6, 0)
  await hold(0.6)
  await scroll('#book', 0.7, 0)
  await hold(1.6)
}

await browser.close()
process.stdout.write(`\n${MODE}: ${frameNo} frames, encoding…\n`)

const duration = frameNo / FPS
fs.mkdirSync(path.dirname(OUT), { recursive: true })
execFileSync(
  'ffmpeg',
  [
    '-y',
    '-loglevel',
    'error',
    '-framerate',
    String(FPS),
    '-i',
    path.join(FRAMES, '%05d.jpg'),
    '-vf',
    `fade=t=out:st=${(duration - 0.35).toFixed(2)}:d=0.35`,
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    MODE === 'mobile' ? '21' : '20',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    OUT,
  ],
  { stdio: 'inherit' },
)
fs.rmSync(FRAMES, { recursive: true, force: true })
console.log(`${MODE}: wrote ${path.relative(ROOT, OUT)} (${duration.toFixed(1)}s)`)
