import type { ReactNode } from 'react'
import { ButtonLink } from '../components/Button'
import { Clock, Mail, MapPin, Phone } from '../components/icons'
import { Eyebrow, RevealWords, revealDelay } from '../components/ui'
import { addressLines, business, maps } from '../data/business'

function Detail({
  icon,
  label,
  children,
  className = '',
}: {
  icon: ReactNode
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`relative min-w-0 pl-14 ${className}`}>
      <dt className="eyebrow pt-0.5 text-[0.62rem] text-ink-soft">
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 text-gold-deep"
        >
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-1.5 leading-relaxed text-ink">{children}</dd>
    </div>
  )
}

/** Address, hours, contact and map. Used on the home and contact pages. */
export function Visit({ title = 'Find your seat at our table.' }: { title?: string }) {
  return (
    <section id="visit" aria-labelledby="visit-title" className="relative bg-ivory py-[clamp(5rem,10vw,8.5rem)]">
      <div className="container-luxe grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col lg:col-span-5">
          <Eyebrow>Visit Sofra</Eyebrow>
          <RevealWords
            id="visit-title"
            text={title}
            italic={['table.']}
            className="mt-6 font-display text-display-lg"
          />

          <dl className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" data-reveal style={revealDelay(120)}>
            <Detail icon={<MapPin size={17} />} label="Address">
              <address className="not-italic">
                {addressLines[0]}
                <br />
                {addressLines[1]}
              </address>
            </Detail>
            <Detail icon={<Clock size={17} />} label="Hours">
              {business.hours.summary}
              <br />
              {business.hours.display}
            </Detail>
            <Detail icon={<Phone size={17} />} label="Phone">
              <a href={business.phone.href} className="underline decoration-sand underline-offset-4 hover:decoration-gold-deep">
                {business.phone.display}
              </a>
            </Detail>
            <Detail icon={<Mail size={17} />} label="Email" className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <a
                href={`mailto:${business.email}`}
                className="[overflow-wrap:anywhere] underline decoration-sand underline-offset-4 hover:decoration-gold-deep"
              >
                {business.email}
              </a>
            </Detail>
          </dl>

          <div className="mt-11 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap" data-reveal style={revealDelay(200)}>
            <ButtonLink href={business.links.reservations} variant="espresso" icon="external">
              Reserve a Table
            </ButtonLink>
            <ButtonLink href={maps.directions} variant="outline-dark" icon="external">
              Get Directions
            </ButtonLink>
          </div>
        </div>

        <div className="relative lg:col-span-7" data-reveal="fade" style={revealDelay(150)}>
          <div aria-hidden="true" className="absolute -right-3 -top-3 hidden h-full w-full border border-gold/50 sm:block" />
          <div className="relative h-[22rem] overflow-hidden bg-cream sm:h-[28rem] lg:h-full lg:min-h-[34rem]">
            {/* Shown while the map loads, or if it is blocked. */}
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <div className="pattern-girih [--pattern-color:var(--color-gold-deep)] [--pattern-opacity:0.1]" />
              <div className="relative mx-6 flex max-w-xs flex-col items-center gap-2 bg-ivory px-7 py-6 text-center shadow-[0_20px_50px_-30px_rgb(36_27_22/0.5)]">
                <MapPin size={22} className="text-gold-deep" />
                <span className="font-display text-2xl">{business.name}</span>
                <span className="text-sm text-balance text-ink-soft">{addressLines.join(', ')}</span>
              </div>
            </div>
            <iframe
              title={`Map showing ${business.name} at ${maps.fullAddress}`}
              src={maps.embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.35)_sepia(0.18)_contrast(1.02)]"
              allowFullScreen
            />
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            Map not loading?{' '}
            <a href={maps.place} target="_blank" rel="noopener" className="font-semibold text-espresso underline underline-offset-4">
              Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
