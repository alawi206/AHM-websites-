import { signatureDishes } from '../data/signatures'
import { formatPrice, lowestPrice } from '../data/menu'
import { hasPhoto } from '../lib/photos'
import { Link } from '../lib/router'
import { ArrowRight, StarMotif } from './icons'
import { Photo } from './Photo'
import { revealDelay } from './ui'

/**
 * Signature dishes. With an authorized photo for every dish this is a photo
 * grid; otherwise each dish is a framed, text-led menu card, and any dish that
 * does have a verified photo shows it in the card's arch medallion. A dish is
 * only ever shown with a photo of that exact dish.
 */
export function SignatureDishes({ variant = 'feature' }: { variant?: 'feature' | 'compact' }) {
  const dishes = signatureDishes()
  const allPhotographed = dishes.every((dish) => hasPhoto(dish.slot))

  if (variant === 'feature' && allPhotographed) return <PhotoGrid dishes={dishes} />

  const compact = variant === 'compact'
  return (
    <ul
      aria-label="Signature dishes"
      className={`no-scrollbar -mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto px-(--gutter) pb-3 pt-1 md:mx-0 md:grid md:gap-5 md:overflow-visible md:px-0 md:pb-0 ${
        compact ? 'md:grid-cols-3 lg:grid-cols-6' : 'md:grid-cols-2 lg:grid-cols-3 lg:gap-7'
      }`}
    >
      {dishes.map((dish, i) => {
        const price = lowestPrice(dish.item)
        const photo = hasPhoto(dish.slot)
        // Alternate light and dark cards, like a tiled pattern.
        const dark = i % 2 === 1
        return (
          <li
            key={dish.slot}
            className={`shrink-0 snap-start md:w-auto md:max-w-none ${compact ? 'w-[58%] max-w-[15rem]' : 'w-[74%] max-w-[20rem]'}`}
            data-reveal
            style={revealDelay((i % 3) * 90)}
          >
            <Link
              to={`/menu#${dish.category.id}`}
              className={`group relative flex h-full flex-col items-center text-center transition-[translate,box-shadow] duration-700 ease-(--ease-expo) hover:-translate-y-1 hover:shadow-[0_32px_60px_-36px_rgb(36_27_22/0.55)] ${
                dark
                  ? 'grain overflow-hidden bg-espresso text-ivory'
                  : `${compact ? 'bg-cream' : 'bg-ivory'} text-ink` // contrast with the section behind
              } ${compact ? 'px-4 pb-6 pt-6' : 'px-6 pb-7 pt-8 sm:px-8'}`}
            >
              {/* Inset hairline frame, as on a printed menu card. */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-2 border transition-colors duration-700 group-hover:border-gold sm:inset-2.5 ${
                  dark ? 'border-gold/30' : 'border-gold/35'
                }`}
              />

              <span className={`eyebrow text-[0.58rem] tabular-nums ${dark ? 'text-gold' : 'text-gold-deep'}`}>
                No. {String(i + 1).padStart(2, '0')}
              </span>

              {!compact && (
                <span
                  className={`relative mt-5 block ${photo ? 'h-36 w-28' : 'h-[5.25rem] w-16'}`}
                  aria-hidden={photo ? undefined : true}
                >
                  {photo ? (
                    <span className="mask-arch absolute inset-0 block overflow-hidden">
                      <span className="absolute inset-0 transition-[scale] duration-[1.4s] ease-(--ease-expo) group-hover:scale-110">
                        <Photo slot={dish.slot} sizes="112px" whenMissing="none" />
                      </span>
                    </span>
                  ) : (
                    <>
                      <svg viewBox="0 0 400 500" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-gold">
                        <path
                          d="M0 500V196C0 98 86 40 200 0c114 40 200 98 200 196v304Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                      <StarMotif
                        size={28}
                        strokeWidth={1.4}
                        className={`absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-(--ease-expo) group-hover:rotate-45 ${
                          dark ? 'text-gold' : 'text-gold-deep'
                        }`}
                      />
                    </>
                  )}
                </span>
              )}

              <span className={`eyebrow text-[0.58rem] ${dark ? 'text-parchment' : 'text-ink-soft'} ${compact ? 'mt-4' : 'mt-5'}`}>
                {dish.category.title}
              </span>
              <h3
                className={`mt-2 font-display leading-[1.05] transition-colors duration-500 ${
                  dark ? 'group-hover:text-gold-light' : 'group-hover:text-olive'
                } ${
                  compact ? 'text-[1.45rem]' : 'text-[1.9rem] lg:text-[2.1rem]'
                }`}
              >
                {dish.item.name}
              </h3>

              <span aria-hidden="true" className={`flex items-center gap-2 text-gold ${compact ? 'my-3' : 'my-4'}`}>
                <span className="h-px w-6 bg-current opacity-60" />
                <StarMotif size={10} strokeWidth={2.4} />
                <span className="h-px w-6 bg-current opacity-60" />
              </span>

              <span className={`font-display ${dark ? 'text-gold-light' : 'text-gold-deep'} ${compact ? 'text-[1.25rem]' : 'text-[1.6rem]'}`}>
                {dish.item.variants && (
                  <span className="mr-1.5 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.16em]">from</span>
                )}
                {formatPrice(price)}
              </span>

              {!compact && (
                <span
                  className={`eyebrow mt-auto inline-flex items-center gap-2 pt-5 text-[0.6rem] transition-colors duration-500 ${
                    dark ? 'text-parchment group-hover:text-ivory' : 'text-ink-soft group-hover:text-espresso'
                  }`}
                >
                  See it on the menu
                  <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/** Full photo grid — used once every signature dish has an authorized photo. */
function PhotoGrid({ dishes }: { dishes: ReturnType<typeof signatureDishes> }) {
  return (
    <ul
      className="no-scrollbar -mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-16 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 lg:gap-x-10 lg:pb-24"
      aria-label="Signature dishes"
    >
      {dishes.map((dish, i) => {
        const price = lowestPrice(dish.item)
        return (
          <li
            key={dish.slot}
            className="w-[78%] max-w-[22rem] shrink-0 snap-start md:w-auto md:max-w-none lg:[&:nth-child(3n+2)]:translate-y-24"
          >
            <Link to={`/menu#${dish.category.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-espresso">
                <div className="absolute inset-0 transition-[scale] duration-[1.6s] ease-(--ease-expo) group-hover:scale-[1.045]">
                  <Photo
                    slot={dish.slot}
                    reveal
                    revealDelay={(i % 3) * 120}
                    whenMissing="none"
                    sizes="(min-width: 1024px) 28vw, (min-width: 768px) 44vw, 78vw"
                  />
                </div>
                {/* Soft vignette keeps lighting consistent across photos. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgb(25_18_14/0.35))]"
                />
                <span className="eyebrow absolute left-5 top-5 text-[0.62rem] text-ivory/90">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between bg-gradient-to-t from-espresso/85 to-transparent px-5 pb-5 pt-16 text-ivory opacity-0 transition-[opacity,translate] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                >
                  <span className="eyebrow text-[0.62rem]">See it on the menu</span>
                  <ArrowRight size={16} />
                </span>
              </div>
              <p className="eyebrow mt-6 text-[0.62rem] text-gold-deep">{dish.category.title}</p>
              <div className="mt-2 flex items-baseline">
                <h3 className="font-display text-[1.75rem] leading-tight transition-colors group-hover:text-olive lg:text-[2rem]">
                  {dish.item.name}
                </h3>
                <span className="leader" aria-hidden="true" />
                <span className="shrink-0 font-display text-[1.5rem] text-gold-deep">
                  {dish.item.variants && <span className="mr-1.5 font-sans text-xs uppercase tracking-[0.14em]">from</span>}
                  {formatPrice(price)}
                </span>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
