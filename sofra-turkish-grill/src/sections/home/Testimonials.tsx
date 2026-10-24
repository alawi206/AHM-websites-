import { TextLink } from '../../components/Button'
import { Eyebrow, RevealWords, Stars, revealDelay } from '../../components/ui'
import { maps } from '../../data/business'
import { publishedReviews } from '../../data/reviews'

export function Testimonials() {
  if (publishedReviews.length === 0) return null
  const many = publishedReviews.length > 2

  return (
    <section aria-labelledby="reviews-title" className="relative overflow-hidden bg-cream py-[clamp(5rem,11vw,10rem)]">
      <div className="container-luxe">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Guest Reviews</Eyebrow>
            <RevealWords
              id="reviews-title"
              text="Words from our table."
              italic={['table.']}
              className="mt-6 font-display text-display-lg"
            />
          </div>
          <div className="md:pb-2 md:text-right" data-reveal style={revealDelay(120)}>
            <p className="text-sm text-ink-soft">Reviews from Google, shared by our guests.</p>
            <TextLink href={maps.reviews} icon="external" className="mt-3 text-espresso">
              Read more on Google
            </TextLink>
          </div>
        </div>

        <ul
          className={`no-scrollbar -mx-(--gutter) mt-14 flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) pb-2 md:mx-0 md:mt-16 md:grid md:gap-8 md:overflow-visible md:px-0 ${
            many ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
          }`}
          aria-label="Guest reviews"
          // Scrollable on phones, so it must be reachable by keyboard.
          tabIndex={0}
        >
          {publishedReviews.map((review, i) => (
            <li
              key={review.author}
              className={`w-[86%] shrink-0 snap-start md:w-auto ${publishedReviews.length === 1 ? 'w-full' : ''}`}
              data-reveal
              style={revealDelay(i * 120)}
            >
              <figure className="relative flex h-full flex-col bg-ivory px-7 pb-8 pt-10 sm:px-12 sm:pb-10 sm:pt-12">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-6 top-2 font-display text-[7rem] leading-none text-gold/35 sm:right-10"
                >
                  &rdquo;
                </span>
                <Stars rating={review.rating} className="text-gold-deep" />
                <blockquote className="mt-6 flex-1">
                  <p className="font-display text-[1.45rem] leading-snug text-ink sm:text-[1.85rem]">{review.text}</p>
                </blockquote>
                <figcaption className="mt-9 flex items-center justify-between gap-4 border-t border-sand pt-6">
                  <span className="font-semibold">{review.author}</span>
                  <span className="eyebrow text-[0.6rem] text-ink-soft">{review.source} review</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
