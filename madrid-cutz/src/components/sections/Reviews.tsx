import { useMemo, useRef } from 'react'
import { useInView } from 'motion/react'
import { BOOKSY_URL, reputation, reviews } from '../../content/site'
import { BookLink } from '../ui/BookLink'
import { Reveal, RevealLines } from '../ui/Reveal'
import { Eyebrow, Stars } from '../ui/primitives'

const COLS = 50
const R = 5
const HEX_W = Math.sqrt(3) * R
const ROW_H = 1.5 * R

/** Deterministic pseudo-random so the pattern is identical on every render. */
function rand(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/**
 * One lit hexagon per review — the honeycomb fills in as it scrolls into view.
 * Uses the guaranteed floor (750), never a made-up total.
 */
function ReviewHoneycomb() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const total = reputation.reviewCountFloor
  const rows = Math.ceil(total / COLS)

  const cells = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => {
        const row = Math.floor(i / COLS)
        const col = i % COLS
        const x = col * HEX_W + (row % 2 ? HEX_W / 2 : 0) + HEX_W / 2
        const y = row * ROW_H + R
        // A diagonal sweep, like a bank of LEDs switching on.
        const delay = Math.round(col * 22 + row * 30 + rand(i) * 180)
        const alpha = rand(i + 999) < 0.12 ? 0.35 : 0.92
        return { x, y, delay, alpha }
      }),
    [total],
  )

  const width = COLS * HEX_W + HEX_W / 2
  const height = (rows - 1) * ROW_H + 2 * R

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={`${reputation.reviewCountDisplay} client reviews on ${reputation.source}, one hexagon per review`}
    >
      <defs>
        <path
          id="review-hex"
          d={`M0 ${-R} L${HEX_W / 2} ${-R / 2} L${HEX_W / 2} ${R / 2} L0 ${R} L${-HEX_W / 2} ${R / 2} L${-HEX_W / 2} ${-R / 2}Z`}
        />
      </defs>
      {cells.map((c, i) => (
        <use
          key={i}
          href="#review-hex"
          transform={`translate(${c.x.toFixed(2)} ${c.y.toFixed(2)}) scale(0.74)`}
          fill="#F6F5F2"
          style={{
            opacity: inView ? c.alpha : 0.07,
            transition: `opacity 500ms cubic-bezier(0.16,1,0.3,1) ${inView ? c.delay : 0}ms`,
          }}
        />
      ))}
    </svg>
  )
}

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative overflow-hidden bg-coal py-24 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_20%,rgba(246,245,242,0.05),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <Eyebrow index="06">Reviews</Eyebrow>
        </Reveal>
        <RevealLines
          id="reviews-title"
          lines={[
            'Reputation earned.',
            <>
              <span className="serif-accent text-[1.02em] text-champagne-soft">Not</span> given.
            </>,
          ]}
          label="Reputation earned. Not given."
          className="display mt-6 text-[10.5vw] sm:text-7xl xl:text-8xl"
        />

        <div className="mt-16 grid grid-cols-1 items-center gap-14 md:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="flex items-end gap-5">
                <span className="display metal-text text-[9rem] leading-[0.78] [font-stretch:100%] sm:text-[12rem] xl:text-[15rem]">
                  {reputation.rating.toFixed(1)}
                </span>
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-8 flex items-center gap-4">
              <Stars size="size-5" />
              <span className="font-mono text-xs tracking-[0.16em] text-silver uppercase">Average on {reputation.source}</span>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-silver text-pretty md:text-lg">
                {reputation.reviewCountDisplay} reviews from clients who sat in the chair. Don&rsquo;t take our word for it — read
                every one of them on Booksy.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10">
              <BookLink placement="reviews" href={BOOKSY_URL} size="lg">
                Read all reviews on Booksy
              </BookLink>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-[3px] border border-line bg-ink/60 p-5 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <p className="eyebrow text-silver">Every hexagon is a review</p>
                <p className="font-mono text-[0.6875rem] text-champagne">{reputation.reviewCountDisplay}</p>
              </div>
              <ReviewHoneycomb />
              <div className="mt-6 flex items-center justify-between border-t border-line pt-5 font-mono text-[0.625rem] tracking-[0.16em] text-mist uppercase">
                <span>Source: Booksy</span>
                <span>Rating {reputation.rating.toFixed(1)} / 5</span>
              </div>
            </div>
          </Reveal>
        </div>

        {reviews.length > 0 && (
          <ul className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Selected Booksy reviews">
            {reviews.map((review, i) => (
              <Reveal as="li" key={`${review.name}-${i}`} delay={(i % 3) * 0.08} y={24}>
                <figure className="flex h-full flex-col justify-between rounded-[3px] border border-line bg-ink/60 p-7 md:p-8">
                  <div>
                    <span aria-hidden="true" className="serif-accent block text-6xl leading-none text-champagne">
                      &ldquo;
                    </span>
                    <blockquote className="mt-2 text-lg leading-relaxed text-bone text-pretty">{review.text}</blockquote>
                  </div>
                  <figcaption className="mt-8 flex items-center justify-between border-t border-line pt-5">
                    <span>
                      <span className="block font-display text-sm font-bold tracking-[0.12em] uppercase [font-stretch:115%]">
                        {review.name}
                      </span>
                      <span className="mt-1 block font-mono text-[0.625rem] tracking-[0.14em] text-mist uppercase">
                        Booksy review{review.barber ? ` · with ${review.barber}` : ''}
                      </span>
                    </span>
                    <Stars size="size-3" count={review.rating} />
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
