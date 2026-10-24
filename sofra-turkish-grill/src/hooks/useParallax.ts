import { useEffect, type RefObject } from 'react'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Restrained scroll parallax: translates the element by `factor` × scroll
 * distance while its section is on screen. Disabled for reduced motion.
 */
export function useParallax(ref: RefObject<HTMLElement | null>, factor = 0.2) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    let frame = 0
    const update = () => {
      frame = 0
      const parent = el.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      el.style.transform = `translate3d(0, ${(-rect.top * factor).toFixed(1)}px, 0)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    // First measurement waits for a frame so it doesn't force layout mid-hydration.
    frame = requestAnimationFrame(update)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      el.style.transform = ''
    }
  }, [ref, factor])
}
