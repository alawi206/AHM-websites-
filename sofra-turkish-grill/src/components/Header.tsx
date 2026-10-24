import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { Link, NavLink, useLocation } from '../lib/router'
import { addressLines, business } from '../data/business'
import { useScrolled } from '../hooks/useScrolled'
import { ButtonLink } from './Button'
import { Wordmark } from './Wordmark'

export const navItems = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/catering', label: 'Catering' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const scrolled = useScrolled(24)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [pathname])

  // Lock scroll, make the page behind inert, handle Escape, move focus.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const background = document.querySelectorAll<HTMLElement>('[data-inert-when-menu]')
    root.style.overflow = 'hidden'
    root.dataset.menuOpen = ''
    background.forEach((el) => el.setAttribute('inert', ''))
    panelRef.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      root.style.overflow = ''
      delete root.dataset.menuOpen
      background.forEach((el) => el.removeAttribute('inert'))
      window.removeEventListener('keydown', onKey)
      toggleRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  const solid = scrolled && !open

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color,backdrop-filter] duration-500 ${
          solid
            ? 'bg-ivory/92 text-espresso shadow-[0_1px_0_rgb(36_27_22/0.1)] backdrop-blur-md'
            : 'bg-transparent text-ivory'
        }`}
      >
        {/* Soft top shade keeps the transparent header legible over photos. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-espresso-deep/55 to-transparent transition-opacity duration-500 ${
            solid || open ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <div className="container-luxe relative flex h-(--header-h) items-center justify-between gap-4">
          <Link to="/" className="relative z-10 -my-2 py-2">
            <Wordmark tone={solid ? 'dark' : 'light'} />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `group relative inline-flex h-11 items-center px-3 text-[0.8rem] font-semibold tracking-[0.08em] transition-colors ${
                        isActive ? '' : 'opacity-80 hover:opacity-100'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-x-3 bottom-1.5 h-px origin-left bg-gold transition-transform duration-500 ${
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ButtonLink
              href={business.links.reservations}
              variant={solid ? 'outline-dark' : 'outline-light'}
              size="sm"
              icon="none"
              className="hidden xl:inline-flex"
            >
              Reserve a Table
            </ButtonLink>
            <ButtonLink
              href={business.links.orderOnline}
              variant="gold"
              size="sm"
              icon="none"
              className="hidden min-[360px]:inline-flex"
            >
              <span className="lg:hidden">
                Order<span className="sr-only"> online</span>
              </span>
              <span className="hidden lg:inline">Order Online</span>
            </ButtonLink>

            <button
              ref={toggleRef}
              type="button"
              className="relative z-10 -mr-2 inline-flex h-11 w-11 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true" className="relative block h-3 w-7">
                <span
                  className={`absolute left-0 top-0 h-px w-7 bg-current transition-transform duration-500 ${
                    open ? 'translate-y-1.5 rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute bottom-0 right-0 h-px bg-current transition-all duration-500 ${
                    open ? 'w-7 -translate-y-1.5 -rotate-45' : 'w-5'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} panelRef={panelRef} />
    </>
  )
}

function MobileMenu({ open, panelRef }: { open: boolean; panelRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className={`grain fixed inset-0 z-40 overflow-y-auto bg-espresso text-ivory lg:hidden ${
        open
          ? 'visible [clip-path:inset(0_0_0_0)] [transition:clip-path_0.7s_var(--ease-expo),visibility_0s]'
          : 'invisible [clip-path:inset(0_0_100%_0)] [transition:clip-path_0.7s_var(--ease-expo),visibility_0s_0.7s]'
      }`}
    >
      <div className="pattern-girih [--pattern-opacity:0.07]" />
      <div className="container-luxe relative flex min-h-full flex-col pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(var(--header-h)+2rem)]">
        <nav aria-label="Mobile">
          <ul className="flex flex-col">
            {navItems.map((item, i) => (
              <li
                key={item.to}
                className={`border-b border-ivory/10 transition-[opacity,transform] duration-700 ease-(--ease-expo) ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: open ? `${180 + i * 60}ms` : '0ms' } as CSSProperties}
              >
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-baseline gap-5 py-4 font-display text-[2.4rem] leading-none ${isActive ? 'text-gold' : ''}`
                  }
                >
                  <span className="font-sans text-[0.65rem] font-semibold tracking-[0.2em] text-parchment">
                    0{i + 1}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={`mt-auto pt-10 transition-opacity delay-500 duration-700 ${open ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
            <ButtonLink href={business.links.orderOnline} variant="gold" icon="external">
              Order Online
            </ButtonLink>
            <ButtonLink href={business.links.reservations} variant="outline-light" icon="external">
              Reserve a Table
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-1 text-sm text-parchment">
            <a href={business.phone.href} className="py-1 text-ivory">
              {business.phone.display}
            </a>
            <p>{addressLines.join(' · ')}</p>
            <p>
              {business.hours.summary} · {business.hours.display}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
