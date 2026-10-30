import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { BOOKSY_URL, business, nav, socials } from '../../content/site'
import { track } from '../../lib/analytics'
import { BookLink } from '../ui/BookLink'
import { BrandLogo } from '../ui/BrandLogo'

export function Footer() {
  const verifiedSocials = socials.filter((s) => s.verified)
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink pt-20 pb-32 md:pt-28 md:pb-10">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5 lg:col-span-4">
            <BrandLogo sizes="160px" className="w-32 md:w-36" alt="Madrid Cutz" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-silver">
              Precision haircuts, fades and beard work in Auburn, Washington.
            </p>
            <BookLink placement="footer" size="sm" className="mt-8">
              Book now
            </BookLink>
          </div>

          <nav className="md:col-span-2 lg:col-start-6" aria-label="Footer">
            <p className="eyebrow text-mist">Explore</p>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-silver transition-colors hover:text-bone">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3 lg:col-span-3">
            <p className="eyebrow text-mist">Visit</p>
            <address className="mt-5 text-sm leading-relaxed text-silver not-italic">
              Madrid Cutz
              <br />
              {business.address.street}, {business.address.unit}
              <br />
              {business.address.city}, {business.address.state} {business.address.zip}
            </address>
            <a
              href={business.directionsUrl}
              target="_blank"
              rel="noopener"
              onClick={() => track('directions_click', { placement: 'footer' })}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-bone underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-gold"
            >
              Get directions <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <p className="eyebrow text-mist">Book &amp; follow</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={BOOKSY_URL}
                  target="_blank"
                  rel="noopener"
                  onClick={() => track('book_click', { placement: 'footer-booksy' })}
                  className="inline-flex items-center gap-1.5 text-sm text-silver transition-colors hover:text-bone"
                >
                  Booksy <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              {verifiedSocials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    onClick={() => track('social_click', { network: s.label })}
                    className="inline-flex items-center gap-1.5 text-sm text-silver transition-colors hover:text-bone"
                  >
                    {s.label} <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                    <span className="sr-only">{s.handle} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="relative mt-20 select-none md:mt-28">
        <p className="display text-center text-[11vw] leading-[0.8] whitespace-nowrap">
          <span className="bg-gradient-to-b from-gold/30 via-gold/[0.08] to-transparent bg-clip-text text-transparent">
            Madrid Cutz
          </span>
        </p>
      </div>

      <div className="mx-auto mt-6 flex max-w-[1600px] flex-col gap-4 border-t border-line px-5 pt-6 text-xs text-mist sm:flex-row sm:items-center sm:justify-between md:px-10">
        <p>
          © {year} Madrid Cutz · Barbershop in {business.city}, {business.regionShort}
        </p>
        <a href="#top" className="inline-flex items-center gap-2 text-silver transition-colors hover:text-bone">
          Back to top <ArrowUp className="size-3.5" strokeWidth={1.5} />
        </a>
      </div>
    </footer>
  )
}
