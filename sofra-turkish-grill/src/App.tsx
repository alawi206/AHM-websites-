import { useEffect, useRef } from 'react'
import { useLocation } from './lib/router'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { MobileCtaBar } from './components/MobileCtaBar'
import { useRevealObserver } from './hooks/useRevealObserver'
import { applyHead } from './lib/head'
import { metaForPath, notFoundRoute, routes } from './routes'

export function App() {
  const { pathname, hash } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)
  const route = routes.find((r) => r.meta.path === pathname) ?? notFoundRoute

  useRevealObserver(pathname)

  // Keep title / description in sync (prerendered pages already match).
  useEffect(() => applyHead(metaForPath(pathname)), [pathname])

  // Page changes: reset scroll (or jump to a hash) and move focus to the new
  // page for screen-reader and keyboard users. Hash-only changes are left to
  // the browser.
  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)))
    if (target) target.scrollIntoView()
    else window.scrollTo({ top: 0, behavior: 'instant' })
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname, hash])

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] bg-gold px-5 py-3 font-semibold text-espresso focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="outline-none" data-inert-when-menu>
        {route.element}
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
