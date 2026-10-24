import { Link } from '../lib/router'
import { addressLines, business, maps } from '../data/business'
import { navItems } from './Header'
import { Instagram } from './icons'
import { Wordmark } from './Wordmark'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      data-inert-when-menu
      className="grain relative overflow-hidden bg-espresso-deep pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-parchment lg:pb-0"
    >
      <div className="pattern-girih [--pattern-opacity:0.05]" />
      <div className="container-luxe relative grid grid-flow-row-dense grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-flow-row md:grid-cols-12 md:gap-8 lg:py-16">
        <div className="col-span-2 md:col-span-4">
          <Link to="/" className="inline-block text-ivory">
            <Wordmark tone="light" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Authentic Turkish cuisine, shared generously, in the heart of Kent, Washington.
          </p>
          <a
            href={business.social.instagram.url}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-flex h-11 items-center gap-2.5 text-sm text-ivory transition-colors hover:text-gold"
          >
            <Instagram size={18} />
            <span>{business.social.instagram.handle}</span>
            <span className="sr-only"> on Instagram (opens in a new tab)</span>
          </a>
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className="eyebrow text-gold">Explore</h2>
          <ul className="mt-4 grid text-sm">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="inline-flex min-h-10 items-center transition-colors hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-3">
          <h2 className="eyebrow text-gold">Visit</h2>
          <address className="mt-4 text-sm not-italic leading-relaxed">
            <a href={maps.directions} target="_blank" rel="noopener" className="transition-colors hover:text-ivory">
              {addressLines[0]}
              <br />
              {addressLines[1]}
              <span className="sr-only"> — get directions (opens in a new tab)</span>
            </a>
            <br />
            <a href={business.phone.href} className="mt-3 inline-flex min-h-10 items-center text-ivory hover:text-gold">
              {business.phone.display}
            </a>
            <br />
            <a
              href={`mailto:${business.email}`}
              className="inline-flex min-h-10 items-center [overflow-wrap:anywhere] transition-colors hover:text-ivory"
            >
              {business.email}
            </a>
          </address>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-gold">Hours</h2>
          <p className="mt-4 text-sm">
            <span className="text-ivory">{business.hours.summary}</span>
            <br />
            {business.hours.display}
          </p>
          <ul className="mt-6 grid gap-1 text-sm">
            <li>
              <a href={business.links.orderOnline} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center hover:text-ivory">
                Order online<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={business.links.reservations} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center hover:text-ivory">
                Reserve a table<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={business.links.catering} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center hover:text-ivory">
                Catering inquiries<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-luxe relative flex flex-col gap-2 border-t border-ivory/10 py-6 text-xs text-parchment/80 sm:flex-row sm:items-center sm:justify-between">
        <p suppressHydrationWarning>
          © {year} {business.name}. All rights reserved.
        </p>
        <p>
          {business.credit.label} <span className="text-parchment">{business.credit.name}</span>
        </p>
      </div>
    </footer>
  )
}
