import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { ButtonLink } from '../components/Button'
import { Close, Search, StarMotif } from '../components/icons'
import { PageHero } from '../components/PageHero'
import { SignatureDishes } from '../components/SignatureDishes'
import { Eyebrow } from '../components/ui'
import { business } from '../data/business'
import { formatPrice, menu, type MenuCategory, type MenuItem } from '../data/menu'
import { isSignature } from '../data/signatures'

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .toLowerCase()

function filterMenu(query: string): MenuCategory[] {
  if (!query) return menu
  return menu
    .map((category) => {
      const categoryText = normalize(`${category.title} ${category.turkish}`)
      const groups = category.groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            const text = normalize(
              [item.name, item.note, item.description, ...(item.variants ?? []).map((v) => v.label), categoryText]
                .filter(Boolean)
                .join(' '),
            )
            return query.split(/\s+/).every((word) => text.includes(word))
          }),
        }))
        .filter((group) => group.items.length > 0)
      return { ...category, groups }
    })
    .filter((category) => category.groups.length > 0)
}

export function MenuPage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const normalizedQuery = normalize(deferredQuery.trim())
  const categories = useMemo(() => filterMenu(normalizedQuery), [normalizedQuery])
  const resultCount = categories.reduce((sum, c) => sum + c.groups.reduce((n, g) => n + g.items.length, 0), 0)

  const [active, setActive] = useState(menu[0].id)
  const chipsRef = useRef<HTMLUListElement>(null)

  // Scrollspy: highlight the category currently in the reading zone.
  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-30% 0px -65% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [categories])

  // Keep the active category chip in view on narrow screens.
  useEffect(() => {
    const list = chipsRef.current
    const chip = list?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (!list || !chip || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: chip.offsetLeft - 20, behavior: 'smooth' })
  }, [active])

  return (
    <>
      <PageHero
        slot="menu-hero"
        eyebrow="The Menu"
        title="Our Menu"
        titleAccent="from breakfast to baklava."
        intro="Turkish breakfast, mezes, pide and lahmacun, kebabs from the grill, dürüm and desserts — served daily in Kent."
        actions={
          <>
            <ButtonLink href={business.links.orderOnline} variant="gold" icon="external">
              Order Online
            </ButtonLink>
            <ButtonLink href={business.links.reservations} variant="outline-light" icon="external">
              Reserve a Table
            </ButtonLink>
          </>
        }
      />

      <div className="sticky top-(--header-h) z-20 border-b border-sand bg-ivory/95 backdrop-blur-md">
        <nav aria-label="Menu categories" className="container-luxe">
          <ul ref={chipsRef} className="no-scrollbar -mx-(--gutter) flex gap-1 overflow-x-auto px-(--gutter) py-2.5 lg:mx-0 lg:justify-between lg:px-0">
            {categories.map((category) => {
              const isActive = active === category.id
              return (
                <li key={category.id} className="shrink-0">
                  <a
                    href={`#${category.id}`}
                    data-id={category.id}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => setActive(category.id)}
                    className={`inline-flex h-10 items-center whitespace-nowrap px-4 text-[0.78rem] font-semibold tracking-[0.06em] transition-colors duration-300 ${
                      isActive ? 'bg-espresso text-ivory' : 'text-ink-soft hover:bg-cream hover:text-espresso'
                    }`}
                  >
                    {category.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div className="bg-ivory">
        <div className="container-luxe flex flex-col gap-6 pt-10 md:flex-row md:items-center md:justify-between lg:pt-14">
          <div className="relative w-full md:max-w-sm" role="search">
            <label htmlFor="menu-search" className="sr-only">
              Search the menu
            </label>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              id="menu-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes — try “pide” or “lamb”"
              autoComplete="off"
              enterKeyHint="search"
              className="h-13 w-full border border-sand bg-white/60 pl-11 pr-12 text-[1rem] text-ink outline-none transition-colors placeholder:text-ink-soft/80 focus:border-gold-deep focus:bg-white [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-ink-soft hover:text-espresso"
                aria-label="Clear search"
              >
                <Close size={16} />
              </button>
            )}
          </div>
          <p className="max-w-md text-sm text-ink-soft md:text-right">
            Menu and prices are subject to change. Please tell your server about any allergies or dietary needs.
          </p>
        </div>

        <p className="sr-only" aria-live="polite">
          {normalizedQuery
            ? resultCount
              ? `${resultCount} ${resultCount === 1 ? 'item matches' : 'items match'} “${deferredQuery.trim()}”.`
              : `No items match “${deferredQuery.trim()}”.`
            : ''}
        </p>

        {!normalizedQuery && (
          <section aria-labelledby="menu-signatures-title" className="container-luxe pt-12 lg:pt-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow>House Signatures</Eyebrow>
                <h2 id="menu-signatures-title" className="mt-4 font-display text-display-md">
                  Where to <span className="italic">begin.</span>
                </h2>
              </div>
              <p className="flex items-center gap-2 text-sm text-ink-soft">
                <StarMotif size={13} strokeWidth={2.2} className="text-gold-deep" />
                Marks a signature dish throughout the menu.
              </p>
            </div>
            <div className="mt-8">
              <SignatureDishes variant="compact" />
            </div>
          </section>
        )}

        <div className="container-luxe pb-[clamp(4rem,9vw,7rem)] pt-6">
          {categories.length === 0 ? (
            <EmptyState query={deferredQuery.trim()} onClear={() => setQuery('')} />
          ) : (
            categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                number={menu.findIndex((c) => c.id === category.id) + 1}
              />
            ))
          )}
        </div>
      </div>

      <OrderBand />
    </>
  )
}

function CategorySection({ category, number }: { category: MenuCategory; number: number }) {
  return (
    <section
      id={category.id}
      aria-labelledby={`${category.id}-title`}
      className="grid scroll-mt-[calc(var(--header-h)+4.5rem)] gap-8 border-t border-sand py-12 first:border-t-0 lg:grid-cols-12 lg:gap-10 lg:py-20"
    >
      <header className="self-start lg:sticky lg:top-[calc(var(--header-h)+6.5rem)] lg:col-span-4">
        <span className="eyebrow text-[0.65rem] text-gold-deep tabular-nums">{String(number).padStart(2, '0')}</span>
        <h2 id={`${category.id}-title`} className="mt-3 font-display text-display-md">
          {category.title}
        </h2>
        {category.turkish !== category.title && (
          <p lang="tr" className="mt-1 font-display text-xl italic text-ink-soft">
            {category.turkish}
          </p>
        )}
      </header>

      <div className="space-y-10 lg:col-span-8">
        {category.groups.map((group, i) => (
          <div key={group.title ?? i}>
            {group.title && <h3 className="eyebrow mb-2 text-[0.65rem] text-ink-soft">{group.title}</h3>}
            <ul className="grid gap-x-12 md:grid-cols-2">
              {group.items.map((item) => (
                <Item key={item.name} item={item} signature={isSignature(category.id, item.name)} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function Item({ item, signature }: { item: MenuItem; signature: boolean }) {
  return (
    <li className="border-b border-sand/70 py-4">
      <div className="flex items-baseline">
        <span className="font-display text-[1.4rem] leading-tight text-ink sm:text-[1.5rem]">{item.name}</span>
        {signature && (
          <>
            <StarMotif size={13} strokeWidth={2.2} className="ml-2.5 shrink-0 self-center text-gold-deep" />
            <span className="sr-only"> (signature dish)</span>
          </>
        )}
        {item.price !== undefined && (
          <>
            <span className="leader" aria-hidden="true" />
            <span className="shrink-0 font-semibold tabular-nums text-gold-deep">{formatPrice(item.price)}</span>
          </>
        )}
      </div>
      {item.description && <p className="mt-1 text-sm text-ink-soft">{item.description}</p>}
      {item.note && <p className="mt-1 text-sm text-ink-soft">{item.note}</p>}
      {item.variants && (
        <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
          {item.variants.map((variant) => (
            <li key={variant.label}>
              {variant.label} <span className="ml-1 font-semibold tabular-nums text-gold-deep">{formatPrice(variant.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <StarMotif size={44} strokeWidth={1.2} className="text-gold" />
      <p className="mt-6 font-display text-display-md">Nothing matches “{query}”.</p>
      <p className="mt-3 max-w-md text-ink-soft">
        Try another dish name, or browse the full menu. Looking for something specific? Call us at{' '}
        <a href={business.phone.href} className="font-semibold text-espresso underline underline-offset-4">
          {business.phone.display}
        </a>
        .
      </p>
      <button type="button" onClick={onClear} className="btn btn-outline-dark mt-8">
        <span>Show the full menu</span>
      </button>
    </div>
  )
}

function OrderBand() {
  return (
    <section aria-labelledby="order-band-title" className="grain relative overflow-hidden bg-espresso py-20 text-ivory lg:py-24">
      <div className="pattern-girih [--pattern-opacity:0.07]" />
      <div className="container-luxe relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow tone="light">Order or Reserve</Eyebrow>
          <h2 id="order-band-title" className="mt-5 font-display text-display-lg">
            Hungry already? <span className="italic text-gold-light">We’re ready.</span>
          </h2>
        </div>
        <div className="flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
          <ButtonLink href={business.links.orderOnline} variant="gold" icon="external">
            Order Online
          </ButtonLink>
          <ButtonLink href={business.links.reservations} variant="outline-light" icon="external">
            Reserve a Table
          </ButtonLink>
          <ButtonLink href={business.phone.href} variant="outline-light" icon="none">
            Call {business.phone.display}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
