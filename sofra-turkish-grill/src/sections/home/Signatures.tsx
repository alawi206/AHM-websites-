import { Link } from '../../lib/router'
import { TextLink } from '../../components/Button'
import { ArrowRight } from '../../components/icons'
import { Photo } from '../../components/Photo'
import { Eyebrow, RevealWords, revealDelay } from '../../components/ui'
import type { SlotId } from '../../data/media'
import { findItem, formatPrice, lowestPrice } from '../../data/menu'

/** Featured dishes — each must exist on the published menu. */
const signatures: { slot: SlotId; category: string; name: string }[] = [
  { slot: 'dish-lamb-chops', category: 'entrees', name: 'Lamb Chops' },
  { slot: 'dish-iskender', category: 'entrees', name: 'Iskender Kebab' },
  { slot: 'dish-manti', category: 'entrees', name: 'Manti' },
  { slot: 'dish-mix-meat-pide', category: 'pide', name: 'Mix Meat Pide' },
  { slot: 'dish-shashlik', category: 'entrees', name: 'Shashlik Kebab' },
  { slot: 'dish-baklava', category: 'desserts', name: 'Baklava' },
]

export function Signatures() {
  return (
    <section aria-labelledby="signatures-title" className="relative overflow-hidden bg-cream pb-[clamp(5rem,11vw,10rem)] pt-[clamp(6rem,12vw,11rem)]">
      <div className="container-luxe">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow>Signature Dishes</Eyebrow>
            <RevealWords
              id="signatures-title"
              text="From our grill to your table."
              italic={['your', 'table.']}
              className="mt-6 font-display text-display-lg"
            />
          </div>
          <div className="md:col-span-5 md:pb-2" data-reveal style={revealDelay(150)}>
            <p className="max-w-sm text-ink-soft">
              A few of our favorites — kebabs and lamb chops from the grill, manti, and pide fresh from the oven.
            </p>
            <TextLink href="/menu" className="mt-5 text-espresso">
              View the full menu
            </TextLink>
          </div>
        </div>

        <ul
          className="no-scrollbar -mx-(--gutter) mt-14 flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) pb-4 md:mx-0 md:mt-20 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-16 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 lg:gap-x-10 lg:pb-24"
          aria-label="Signature dishes"
        >
          {signatures.map((dish, i) => {
            const { category, item } = findItem(dish.category, dish.name)
            const price = lowestPrice(item)
            return (
              <li
                key={dish.slot}
                className="w-[78%] max-w-[22rem] shrink-0 snap-start md:w-auto md:max-w-none lg:[&:nth-child(3n+2)]:translate-y-24"
              >
                <Link to={`/menu#${category.id}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-espresso">
                    <div className="absolute inset-0 transition-[scale] duration-[1.6s] ease-(--ease-expo) group-hover:scale-[1.045]">
                      <Photo
                        slot={dish.slot}
                        reveal
                        revealDelay={(i % 3) * 120}
                        sizes="(min-width: 1024px) 28vw, (min-width: 768px) 44vw, 78vw"
                      />
                    </div>
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
                  <p className="eyebrow mt-6 text-[0.62rem] text-gold-deep">{category.title}</p>
                  <div className="mt-2 flex items-baseline">
                    <h3 className="font-display text-[1.75rem] leading-tight transition-colors group-hover:text-olive lg:text-[2rem]">
                      {item.name}
                    </h3>
                    <span className="leader" aria-hidden="true" />
                    <span className="shrink-0 font-display text-[1.5rem] text-gold-deep">
                      {item.variants && <span className="mr-1.5 font-sans text-xs uppercase tracking-[0.14em]">from</span>}
                      {formatPrice(price)}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
