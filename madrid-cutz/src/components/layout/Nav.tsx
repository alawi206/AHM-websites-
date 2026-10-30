import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { announcement, business, nav, reputation } from '../../content/site'
import { useActiveSection, useLockBody, useScrollState } from '../../hooks'
import { BookLink } from '../ui/BookLink'
import { BrandLogo } from '../ui/BrandLogo'
import { Stars } from '../ui/primitives'

const EASE = [0.16, 1, 0.3, 1] as const

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <a href="#top" className={`group flex items-center gap-3 ${className}`} aria-label="Madrid Cutz — back to top">
      <BrandLogo
        sizes="48px"
        alt=""
        className="w-10 transition-transform duration-700 ease-out-expo group-hover:scale-105 md:w-12"
      />
      {/* Same lockup as the logo: chrome serif over tracked gold caps. */}
      <span aria-hidden="true" className="flex flex-col items-center leading-none">
        <span className="display chrome-text text-[1.05rem] tracking-[0.06em] md:text-[1.15rem]">Madrid</span>
        <span className="label mt-1 pl-[0.6em] text-[0.5rem] tracking-[0.6em] text-gold">Cutz</span>
      </span>
    </a>
  )
}

export function Nav() {
  const { scrolled, hidden } = useScrollState()
  const [open, setOpen] = useState(false)
  const active = useActiveSection(nav.map((n) => n.href.slice(1)))
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  useLockBody(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Tab' && panelRef.current) {
        // The toggle lives in the header but belongs to the trap so the menu can be closed by keyboard.
        const focusables = [buttonRef.current!, ...panelRef.current.querySelectorAll<HTMLElement>('a, button')].filter(
          (el) => el.offsetParent !== null,
        )
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    const id = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('a')?.focus(), 350)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(id)
    }
  }, [open])

  const close = () => {
    setOpen(false)
    buttonRef.current?.focus({ preventScroll: true })
  }

  // Scroll only after the menu has released the body scroll lock, otherwise
  // the jump can stop short of the section.
  const goTo = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    close()
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        document.querySelector(href)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
        history.replaceState(null, '', href)
      }),
    )
  }

  const showBar = open || !hidden

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-bone focus:px-5 focus:py-3 focus:text-xs focus:font-semibold focus:tracking-[0.16em] focus:text-ink focus:uppercase"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-out-expo ${
          showBar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div
          className={`border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
            scrolled && !open
              ? 'border-line bg-ink/70 backdrop-blur-xl backdrop-saturate-150'
              : 'border-transparent bg-transparent'
          }`}
        >
          {announcement.enabled && !scrolled && (
            <a
              href={announcement.href}
              target="_blank"
              rel="noopener"
              className="block border-b border-line bg-gold px-5 py-2 text-center text-[0.6875rem] font-semibold tracking-[0.14em] text-ink uppercase"
            >
              {announcement.text} <span className="underline underline-offset-2">{announcement.cta}</span>
            </a>
          )}
          <nav
            className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:h-20 md:px-10"
            aria-label="Primary"
          >
            <Wordmark className="relative z-10" />

            <ul className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => {
                const isActive = active === item.href.slice(1)
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`group relative block px-4 py-2 text-[0.6875rem] font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${
                        isActive ? 'text-bone' : 'text-silver hover:text-bone'
                      }`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      {item.label}
                      <span
                        className={`absolute right-4 bottom-1 left-4 h-px origin-left bg-gold transition-transform duration-500 ease-out-expo ${
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 xl:flex">
                <Stars size="size-3" />
                <span className="font-mono text-[0.6875rem] text-silver">{reputation.rating.toFixed(1)}</span>
              </div>
              {/* Phones get the sticky bottom bar instead. */}
              <span className="hidden sm:block">
                <BookLink placement="nav" size="sm">
                  Book now
                </BookLink>
              </span>
              <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="relative z-10 grid size-11 place-items-center rounded-full border border-line-strong bg-ink/30 backdrop-blur-sm lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                <span className="relative block h-3 w-5">
                  <span
                    className={`absolute left-0 block h-[1.5px] w-full bg-bone transition-transform duration-500 ease-out-expo ${
                      open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
                    }`}
                  />
                  <span
                    className={`absolute left-0 block h-[1.5px] bg-bone transition-all duration-500 ease-out-expo ${
                      open ? 'top-1/2 w-full -translate-y-1/2 -rotate-45' : 'bottom-0 w-3/5'
                    }`}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_50%_at_50%_0%,rgba(246,245,242,0.07),transparent_70%)]" />
            <nav className="relative flex flex-1 flex-col justify-center px-6 pt-20" aria-label="Mobile">
              <ul className="space-y-1">
                {nav.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.a
                      href={item.href}
                      onClick={(e) => goTo(e, item.href)}
                      className="group flex items-baseline gap-4 py-2"
                      initial={{ y: '100%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}
                    >
                      <span className="font-mono text-[0.6875rem] text-gold">0{i + 1}</span>
                      <span className="display chrome-text text-[12vw] leading-[1.05] xs:text-5xl">{item.label}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="relative space-y-5 border-t border-line px-6 pt-6 pb-safe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <div className="flex items-center justify-between gap-4 text-xs text-silver">
                <span className="leading-relaxed">
                  {business.address.street}, {business.address.unit}
                  <br />
                  {business.address.city}, {business.address.state} {business.address.zip}
                </span>
                <span className="flex flex-col items-end gap-1">
                  <Stars size="size-3" />
                  <span className="font-mono text-[0.625rem]">
                    {reputation.rating.toFixed(1)} · {reputation.reviewCountDisplay} reviews
                  </span>
                </span>
              </div>
              <BookLink placement="mobile-menu" size="lg" className="w-full">
                Book your cut
              </BookLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
