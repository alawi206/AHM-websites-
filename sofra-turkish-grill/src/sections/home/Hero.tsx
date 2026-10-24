import type { CSSProperties } from 'react'
import { useRef } from 'react'
import { ButtonLink } from '../../components/Button'
import { Photo } from '../../components/Photo'
import { Eyebrow } from '../../components/ui'
import { addressLines, business, maps } from '../../data/business'
import { useParallax } from '../../hooks/useParallax'

const delay = (seconds: number) => ({ '--d': `${seconds}s` }) as CSSProperties

export function Hero() {
  const mediaRef = useRef<HTMLDivElement>(null)
  useParallax(mediaRef, 0.28)

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-espresso text-ivory"
    >
      <div ref={mediaRef} className="absolute inset-0 -z-10 will-change-transform">
        <div className="hero-media absolute inset-0">
          <Photo slot="hero" priority sizes="100vw" labelPosition="top-right" />
        </div>
      </div>

      {/* Controlled overlay: dark at the base for the title, light in the middle
          so the food reads, a touch of shade at the top for the navigation. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(25_18_14/0.94)_0%,rgb(25_18_14/0.72)_28%,rgb(25_18_14/0.18)_62%,rgb(25_18_14/0.42)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_0%_100%,rgb(25_18_14/0.6),transparent_70%)]"
      />

      <div className="container-luxe pb-[clamp(2.25rem,6vh,4.5rem)] pt-[calc(var(--header-h)+5rem)]">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <div className="hero-fade" style={delay(0.1)}>
              <Eyebrow tone="light">Turkish Grill · Kent, Washington</Eyebrow>
            </div>

            <h1 id="hero-title" className="mt-6 font-display text-display-2xl text-balance">
              <span className="hero-line">
                <span style={{ '--i': 0 } as CSSProperties}>A Taste of Turkey.</span>
              </span>{' '}
              <span className="hero-line">
                <span style={{ '--i': 1 } as CSSProperties} className="italic text-gold-light">
                  A Table to Remember.
                </span>
              </span>
            </h1>

            <p className="hero-fade mt-7 max-w-xl text-lede text-parchment" style={delay(0.75)}>
              Discover authentic Turkish flavors, thoughtfully prepared and shared in the heart of Kent.
            </p>

            <div
              className="hero-fade mt-9 flex flex-col gap-3 min-[480px]:flex-row"
              style={delay(0.9)}
            >
              <ButtonLink href="/menu" variant="gold">
                Explore the Menu
              </ButtonLink>
              <ButtonLink href={business.links.reservations} variant="outline-light" icon="external">
                Reserve a Table
              </ButtonLink>
            </div>
          </div>

          <dl
            className="hero-fade hidden gap-7 border-l border-ivory/20 pl-8 text-sm lg:col-span-3 lg:grid"
            style={delay(1.1)}
          >
            <div>
              <dt className="eyebrow text-[0.65rem] text-gold">Hours</dt>
              <dd className="mt-2 text-ivory">
                {business.hours.summary}
                <br />
                <span className="text-parchment">{business.hours.display}</span>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-[0.65rem] text-gold">Find us</dt>
              <dd className="mt-2">
                <a
                  href={maps.directions}
                  target="_blank"
                  rel="noopener"
                  className="text-ivory transition-colors hover:text-gold-light"
                >
                  {addressLines[0]}
                  <br />
                  <span className="text-parchment">{addressLines[1]}</span>
                  <span className="sr-only"> — get directions (opens in a new tab)</span>
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-[0.65rem] text-gold">Call</dt>
              <dd className="mt-2">
                <a href={business.phone.href} className="text-ivory transition-colors hover:text-gold-light">
                  {business.phone.display}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* Mobile quick facts */}
        <p
          className="hero-fade mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] text-parchment lg:hidden"
          style={delay(1.05)}
        >
          <span>
            {business.hours.summary} · {business.hours.display}
          </span>
          <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-gold" />
          <a href={business.phone.href} className="inline-flex min-h-10 items-center text-ivory underline-offset-4 hover:underline">
            {business.phone.display}
          </a>
        </p>

        <div className="mt-12 hidden items-center gap-6 lg:flex">
          <span className="hero-rule h-px flex-1 bg-ivory/20" style={delay(0.6)} />
          <a
            href="#welcome"
            className="hero-fade eyebrow flex items-center gap-4 text-[0.65rem] text-parchment transition-colors hover:text-ivory"
            style={delay(1.3)}
          >
            Discover Sofra
            <span aria-hidden="true" className="scroll-cue relative block h-10 w-px overflow-hidden bg-ivory/15" />
          </a>
        </div>
      </div>
    </section>
  )
}
