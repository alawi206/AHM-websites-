import { useSyncExternalStore } from 'react'

const subscribe = (callback: () => void) => {
  window.addEventListener('scroll', callback, { passive: true })
  return () => window.removeEventListener('scroll', callback)
}

/** True once the page has scrolled past `offset` pixels. */
export function useScrolled(offset = 24) {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > offset,
    () => false,
  )
}

/** True once the page has scrolled past a fraction of the viewport height. */
export function useScrolledPastViewport(fraction = 0.7) {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > window.innerHeight * fraction,
    () => false,
  )
}
