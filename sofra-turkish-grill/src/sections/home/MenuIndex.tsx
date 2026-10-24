import { Link } from '../../lib/router'
import { ButtonLink } from '../../components/Button'
import { ArrowRight } from '../../components/icons'
import { Eyebrow, RevealWords, revealDelay } from '../../components/ui'
import { business } from '../../data/business'
import { menu, menuItems } from '../../data/menu'

export function MenuIndex() {
  return (
    <section aria-labelledby="menu-index-title" className="relative bg-ivory py-[clamp(5rem,11vw,10rem)]">
      <div className="container-luxe grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <Eyebrow>Explore the Menu</Eyebrow>
            <RevealWords
              id="menu-index-title"
              text="From breakfast to baklava."
              italic={['baklava.']}
              className="mt-6 font-display text-display-lg"
            />
            <p className="mt-7 max-w-md text-ink-soft" data-reveal style={revealDelay(120)}>
              Turkish breakfast and mezes, pide from the oven, kebabs from the grill, and Turkish coffee to finish —
              the whole menu, in one place.
            </p>
            <div className="mt-9 flex flex-col gap-3 min-[480px]:flex-row" data-reveal style={revealDelay(200)}>
              <ButtonLink href="/menu" variant="espresso">
                View Full Menu
              </ButtonLink>
              <ButtonLink href={business.links.orderOnline} variant="outline-dark" icon="external">
                Order Online
              </ButtonLink>
            </div>
          </div>
        </div>

        <ol className="lg:col-span-7 lg:col-start-6 lg:pl-10">
          {menu.map((category, i) => {
            const count = menuItems(category).length
            return (
              <li key={category.id} className="border-t border-sand last:border-b" data-reveal style={revealDelay(i * 50)}>
                <Link
                  to={`/menu#${category.id}`}
                  className="group flex items-center gap-5 py-5 sm:gap-8 sm:py-6"
                >
                  <span className="eyebrow w-7 shrink-0 text-[0.65rem] text-gold-deep tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[1.9rem] leading-none transition-transform duration-700 ease-(--ease-expo) group-hover:translate-x-2 sm:text-[2.4rem]">
                      {category.title}
                    </span>
                    {category.turkish !== category.title && (
                      <span
                        lang="tr"
                        className="mt-1.5 block font-display text-lg italic text-ink-soft transition-transform delay-75 duration-700 ease-(--ease-expo) group-hover:translate-x-2"
                      >
                        {category.turkish}
                      </span>
                    )}
                  </span>
                  <span className="hidden shrink-0 text-sm text-ink-soft sm:block">
                    {count} {category.id === 'drinks' ? 'drinks' : 'dishes'}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-espresso/20 transition-colors duration-500 group-hover:border-espresso group-hover:bg-espresso group-hover:text-ivory"
                  >
                    <ArrowRight size={16} />
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
