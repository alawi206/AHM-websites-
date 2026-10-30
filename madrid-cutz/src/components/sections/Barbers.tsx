import { useEffect, useRef, useState } from 'react'
import overhead from '../../assets/art/ceiling-overhead.jpg?w=400;700&format=avif;webp&as=picture'
import { barberPhotos } from '../../content/media'
import { barbers, type Barber } from '../../content/site'
import { BookLink } from '../ui/BookLink'
import { Reveal, RevealLines } from '../ui/Reveal'
import { Eyebrow, HexMark, Picture } from '../ui/primitives'

function BarberCard({ barber, index }: { barber: Barber; index: number }) {
  const photo = barberPhotos[barber.id]
  return (
    <article className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[3px] border border-line bg-coal p-5 transition-colors duration-700 hover:border-line-strong md:p-6">
      {photo ? (
        <>
          <Picture
            picture={photo}
            alt={`${barber.name}, barber at Madrid Cutz`}
            sizes="(min-width: 1024px) 20vw, 75vw"
            className="absolute inset-0"
            imgClassName="h-full w-full object-cover grayscale-[35%] transition-[transform,filter] duration-[1400ms] ease-out-expo group-hover:scale-[1.04] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        </>
      ) : (
        <>
          {/* "Under the lights": a slice of the hex ceiling that powers up on hover. */}
          <div className="absolute inset-x-0 top-0 h-[58%] [mask-image:linear-gradient(to_bottom,black,transparent)]">
            <Picture
              picture={overhead}
              alt=""
              sizes="(min-width: 1024px) 20vw, 75vw"
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover opacity-25 transition-opacity duration-1000 group-hover:opacity-70"
              imgStyle={{ objectPosition: `${20 + index * 15}% ${30 + (index % 3) * 20}%` }}
            />
          </div>
          {/* Roster number in outline type; it "powers on" under the lights on hover. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[14%] left-5 font-display text-[6.5rem] leading-none font-extrabold outline-text transition-[color,-webkit-text-stroke-color,text-shadow] duration-700 group-hover:text-gold group-hover:[-webkit-text-stroke-color:transparent] group-hover:[text-shadow:0_0_40px_rgba(246,198,83,0.45)] md:left-6 md:text-[7.5rem] lg:text-[clamp(4.5rem,7vw,8rem)]"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </>
      )}

      <div className="relative flex items-center justify-end">
        <HexMark className="size-5 text-mist transition-colors duration-700 group-hover:text-gold" />
      </div>

      <div className="relative">
        <h3 className="display text-3xl md:text-4xl">{barber.name}</h3>
        <p className="mt-1.5 font-mono text-[0.6875rem] tracking-[0.16em] text-silver uppercase">{barber.role} · Madrid Cutz</p>
        <div className="mt-5 h-px w-full bg-line transition-colors duration-700 group-hover:bg-line-strong" />
        <BookLink placement={`barber:${barber.id}`} variant="text" className="mt-4">
          Book with {barber.name}
        </BookLink>
      </div>
    </article>
  )
}

export function Barbers() {
  const trackRef = useRef<HTMLUListElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth
      setProgress(max > 0 ? el.scrollLeft / max : 0)
    }
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="barbers" aria-labelledby="barbers-title" className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow index="05">The barbers</Eyebrow>
            </Reveal>
            <RevealLines
              id="barbers-title"
              lines={[
                'The people',
                <>
                  <span className="gold-text">behind the</span> precision.
                </>,
              ]}
              label="The people behind the precision."
              className="display mt-6 text-[12vw] sm:text-7xl xl:text-8xl"
            />
          </div>
          <Reveal delay={0.12} className="lg:col-span-4">
            <p className="text-base leading-relaxed text-silver text-pretty">
              Pick your barber when you book on Booksy and grab the next open chair that suits you.
            </p>
          </Reveal>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 md:mt-20 md:scroll-px-10 md:gap-5 md:px-10 lg:mx-auto lg:grid lg:max-w-[1600px] lg:grid-cols-5 lg:overflow-visible"
        aria-label="Madrid Cutz barbers"
      >
        {barbers.map((barber, i) => (
          <Reveal
            as="li"
            key={barber.id}
            delay={i * 0.07}
            y={30}
            amount={0.2}
            className="w-[72vw] max-w-[320px] shrink-0 snap-start lg:w-auto lg:max-w-none"
          >
            <BarberCard barber={barber} index={i} />
          </Reveal>
        ))}
      </ul>

      <div className="mx-5 mt-8 flex items-center gap-4 md:mx-10 lg:hidden" aria-hidden="true">
        <span className="font-mono text-[0.625rem] tracking-[0.2em] text-mist uppercase">Swipe</span>
        <span className="relative h-px flex-1 bg-line">
          <span
            className="absolute inset-y-0 left-0 bg-bone transition-[width] duration-150"
            style={{ width: `${Math.max(18, progress * 100)}%` }}
          />
        </span>
      </div>
    </section>
  )
}
