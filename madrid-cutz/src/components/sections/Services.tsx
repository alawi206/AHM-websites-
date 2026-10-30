import type { PointerEvent } from 'react'
import { ArrowUpRight, Info } from 'lucide-react'
import { BOOKSY_URL, craft, services } from '../../content/site'
import { track } from '../../lib/analytics'
import { BookLink } from '../ui/BookLink'
import { Reveal, RevealLines } from '../ui/Reveal'
import { Eyebrow, HexMark } from '../ui/primitives'

function spotlight(e: PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`)
}

function CraftMarquee() {
  const words = [...craft, ...craft]
  return (
    <div
      className="relative mt-24 overflow-hidden border-y border-line py-6 md:mt-32 md:py-8"
      aria-label={`Cuts we do: ${craft.join(', ')}`}
    >
      <div className="flex w-max animate-[marquee_48s_linear_infinite] motion-reduce:animate-none" aria-hidden="true">
        {words.map((word, i) => (
          <span key={i} className="flex items-center">
            <span
              className={`display px-6 text-4xl whitespace-nowrap md:px-10 md:text-6xl ${i % 2 ? 'outline-text' : 'text-bone/90'}`}
            >
              {word}
            </span>
            <HexMark className="size-5 shrink-0 text-gold/60 md:size-6" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  )
}

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative bg-ink pt-24 pb-0 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="03">Services</Eyebrow>
            </Reveal>
            <RevealLines
              id="services-title"
              lines={['The services.']}
              className="display mt-6 text-[13vw] sm:text-7xl xl:text-8xl"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="text-base leading-relaxed text-silver text-pretty">
              Every appointment is booked through Booksy, where you can pick your barber, see live prices and lock in a time that
              works.
            </p>
            <p className="mt-4 flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.12em] text-mist uppercase">
              <Info className="size-3.5 text-gold" strokeWidth={1.5} aria-hidden="true" />
              Live pricing &amp; availability on Booksy
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 border-t border-line md:mt-20">
          {services.map((service, i) => (
            <Reveal as="li" key={service.id} delay={i * 0.06} y={20} amount={0.4} className="border-b border-line">
              <a
                href={BOOKSY_URL}
                target="_blank"
                rel="noopener"
                onClick={() => track('book_click', { placement: `service:${service.id}` })}
                onPointerMove={spotlight}
                className="group relative grid grid-cols-12 items-center gap-x-4 gap-y-5 overflow-hidden py-9 md:gap-x-8 md:py-12"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(520px_circle_at_var(--x,50%)_var(--y,50%),rgba(246,245,242,0.07),transparent_45%)]"
                />
                <span className="col-span-2 self-start pt-2 font-mono text-xs text-gold md:col-span-1 md:pt-4">0{i + 1}</span>
                <h3 className="col-span-10 display text-[2.6rem] leading-[0.92] transition-transform duration-700 ease-out-expo group-hover:translate-x-2 sm:text-6xl md:col-span-5 xl:text-7xl">
                  {service.name}
                </h3>
                <div className="col-span-12 md:col-span-4 md:col-start-7">
                  <p className="max-w-md text-[0.9375rem] leading-relaxed text-silver text-pretty">{service.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Includes">
                    {service.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[0.625rem] tracking-[0.14em] text-silver uppercase"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-12 flex items-center justify-between gap-4 md:col-span-2 md:flex-col md:items-end md:justify-center">
                  {service.price ? (
                    <p className="text-right">
                      <span className="display block text-3xl">{service.price}</span>
                      {service.duration && <span className="font-mono text-[0.6875rem] text-mist">{service.duration}</span>}
                    </p>
                  ) : (
                    <span className="eyebrow text-mist md:hidden">Price on Booksy</span>
                  )}
                  <span className="inline-flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.18em] text-bone uppercase">
                    Book now
                    <span className="relative grid size-12 place-items-center">
                      <svg
                        viewBox="0 0 48 48"
                        className="absolute inset-0 size-full text-line-strong transition-colors duration-500 group-hover:text-gold"
                        aria-hidden="true"
                      >
                        <path
                          d="M24 2.5 42.6 13.25v21.5L24 45.5 5.4 34.75v-21.5L24 2.5Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.25"
                        />
                      </svg>
                      <span className="absolute inset-0 scale-50 rounded-full bg-bone/0 blur-xl transition-all duration-700 group-hover:scale-100 group-hover:bg-gold/25" />
                      <ArrowUpRight
                        className="relative size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45"
                        strokeWidth={1.5}
                      />
                    </span>
                  </span>
                </div>
                <span className="sr-only">(opens Booksy in a new tab)</span>
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="max-w-lg text-sm text-silver">
            Looking for something specific? The full, up-to-date service menu lives on the Madrid Cutz Booksy profile.
          </p>
          <BookLink placement="services-menu" variant="text">
            View full menu on Booksy
          </BookLink>
        </Reveal>
      </div>

      <CraftMarquee />
    </section>
  )
}
