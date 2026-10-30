import { useState } from 'react'
import { Check, Clock, Copy, Navigation, Phone } from 'lucide-react'
import overhead from '../../assets/art/ceiling-overhead.jpg?w=700;1200&format=avif;webp&as=picture'
import { shopPhotos } from '../../content/media'
import { business, fullAddress, hours, phone } from '../../content/site'
import { track } from '../../lib/analytics'
import { BookLink } from '../ui/BookLink'
import { Reveal, RevealLines } from '../ui/Reveal'
import { Eyebrow, Picture } from '../ui/primitives'

function HoursTable() {
  const today = new Date().getDay() // 0 = Sunday
  const order = [1, 2, 3, 4, 5, 6, 0]
  return (
    <dl className="divide-y divide-line border-y border-line">
      {hours.value.map((d, i) => {
        const isToday = order[i] === today
        return (
          <div key={d.day} className={`flex items-center justify-between py-3 text-sm ${isToday ? 'text-bone' : 'text-silver'}`}>
            <dt className="flex items-center gap-3">
              {d.day}
              {isToday && (
                <span className="rounded-full bg-gold/15 px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.16em] text-gold uppercase">
                  Today
                </span>
              )}
            </dt>
            <dd className="font-mono text-xs">{d.open && d.close ? `${d.open} – ${d.close}` : 'Closed'}</dd>
          </div>
        )
      })}
    </dl>
  )
}

export function Visit() {
  const [copied, setCopied] = useState(false)
  const photo = shopPhotos.visit

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`Madrid Cutz, ${fullAddress}`)
      setCopied(true)
      track('copy_address')
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // Clipboard can be unavailable (insecure context); the address stays selectable.
    }
  }

  return (
    <section id="visit" aria-labelledby="visit-title" className="relative bg-ink py-24 md:py-36">
      <div className="mx-auto grid grid-cols-1 max-w-[1600px] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow index="07">Visit</Eyebrow>
          </Reveal>
          <RevealLines
            id="visit-title"
            lines={[
              'Find your',
              <>
                next <span className="gold-text">cut.</span>
              </>,
            ]}
            label="Find your next cut."
            className="display mt-6 text-[13vw] sm:text-7xl lg:text-[5.4vw] 2xl:text-[5.75rem]"
          />

          <Reveal delay={0.1} className="mt-12">
            <p className="eyebrow text-mist">Madrid Cutz</p>
            <address className="mt-3 font-display text-2xl leading-tight font-bold not-italic [font-stretch:110%] md:text-3xl">
              {business.address.street}, {business.address.unit}
              <br />
              <span className="text-silver">
                {business.address.city}, {business.address.state} {business.address.zip}
              </span>
            </address>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={business.directionsUrl}
                target="_blank"
                rel="noopener"
                onClick={() => track('directions_click')}
                className="inline-flex h-12 items-center gap-3 rounded-full border border-line-strong px-5 text-xs font-semibold tracking-[0.16em] uppercase transition-colors duration-300 hover:border-bone/60 hover:bg-bone hover:text-ink"
              >
                <Navigation className="size-4" strokeWidth={1.5} />
                Get directions
                <span className="sr-only">(opens Google Maps in a new tab)</span>
              </a>
              <button
                type="button"
                onClick={copy}
                className="inline-flex h-12 items-center gap-3 rounded-full border border-line px-5 text-xs font-semibold tracking-[0.16em] text-silver uppercase transition-colors duration-300 hover:border-line-strong hover:text-bone"
              >
                {copied ? (
                  <Check className="size-4 text-gold" strokeWidth={1.75} />
                ) : (
                  <Copy className="size-4" strokeWidth={1.5} />
                )}
                <span aria-live="polite">{copied ? 'Copied' : 'Copy address'}</span>
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-12">
            {hours.verified ? (
              <>
                <p className="eyebrow mb-4 flex items-center gap-2 text-mist">
                  <Clock className="size-3.5 text-gold" strokeWidth={1.5} /> Hours
                </p>
                <HoursTable />
              </>
            ) : (
              <div className="rounded-[3px] border border-line bg-coal p-6">
                <p className="eyebrow flex items-center gap-2 text-mist">
                  <Clock className="size-3.5 text-gold" strokeWidth={1.5} /> Hours &amp; openings
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-silver">
                  Every open slot updates live on Booksy — see each barber&rsquo;s real-time availability before you book.
                </p>
                <BookLink placement="visit-availability" variant="text" className="mt-5">
                  Check availability
                </BookLink>
              </div>
            )}
            {phone.verified && (
              <a
                href={`tel:${phone.value.tel}`}
                onClick={() => track('phone_click')}
                className="mt-6 inline-flex items-center gap-3 text-sm text-silver transition-colors hover:text-bone"
              >
                <Phone className="size-4 text-gold" strokeWidth={1.5} /> {phone.value.display}
              </a>
            )}
          </Reveal>

          <Reveal delay={0.2} className="mt-10">
            <BookLink placement="visit" size="lg">
              Book appointment
            </BookLink>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={40} className="lg:col-span-7">
          <div className="relative h-[440px] overflow-hidden rounded-[3px] border border-line bg-coal sm:h-[520px] lg:h-full lg:min-h-[640px]">
            {/* Shown while the map loads, or if a browser blocks the embed. */}
            <Picture
              picture={overhead}
              alt=""
              sizes="60vw"
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover opacity-30"
            />
            <iframe
              src={business.mapEmbedUrl}
              title="Map showing Madrid Cutz at 901 Auburn Way N, Suite D, Auburn, WA"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(0.9)_contrast(0.9)_brightness(0.95)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(11,12,14,0.9)]"
            />
            {photo && (
              <div className="absolute top-4 right-4 hidden w-48 overflow-hidden rounded-[3px] border border-line-strong shadow-2xl sm:block md:w-60">
                <Picture
                  picture={photo}
                  alt="Madrid Cutz storefront in Auburn, WA"
                  sizes="240px"
                  imgClassName="aspect-[4/3] h-auto w-full object-cover"
                />
              </div>
            )}
            <div className="absolute inset-x-4 bottom-4 flex flex-col gap-4 rounded-[3px] border border-line bg-ink/85 p-5 backdrop-blur-xl sm:inset-x-auto sm:left-4 sm:max-w-sm">
              <div>
                <p className="font-wide text-sm font-bold tracking-[0.12em] uppercase [font-stretch:125%]">Madrid Cutz</p>
                <p className="mt-1 text-sm text-silver">{fullAddress}</p>
              </div>
              <a
                href={business.directionsUrl}
                target="_blank"
                rel="noopener"
                onClick={() => track('directions_click', { placement: 'map-card' })}
                className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.16em] text-gold uppercase"
              >
                Open in Google Maps <Navigation className="size-3.5" strokeWidth={1.5} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
