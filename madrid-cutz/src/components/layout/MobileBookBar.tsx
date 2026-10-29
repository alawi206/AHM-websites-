import { useEffect, useState } from 'react'
import { reputation } from '../../content/site'
import { BookLink } from '../ui/BookLink'
import { Stars } from '../ui/primitives'

/**
 * Sticky booking bar for phones. Appears once the hero's own call to action
 * has scrolled away and steps aside when the final booking section is on
 * screen, so there is never more than one "Book" button competing.
 */
export function MobileBookBar() {
  const [heroVisible, setHeroVisible] = useState(true)
  const [finalVisible, setFinalVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    const final = document.getElementById('book')
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero) setHeroVisible(entry.isIntersecting)
          if (entry.target === final) setFinalVisible(entry.isIntersecting)
        }
      },
      { rootMargin: '0px 0px -35% 0px' },
    )
    if (hero) io.observe(hero)
    if (final) io.observe(final)
    return () => io.disconnect()
  }, [])

  const show = !heroVisible && !finalVisible

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 px-3 pt-6 pb-safe transition-transform duration-700 ease-out-expo md:hidden ${
        show ? 'translate-y-0' : 'translate-y-[130%]'
      }`}
      inert={!show}
      aria-hidden={!show}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent"
      />
      <div className="relative flex items-center gap-3 rounded-full border border-line-strong bg-coal/90 p-1.5 pl-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="min-w-0 flex-1">
          <Stars size="size-2.5" />
          <p className="mt-0.5 truncate font-mono text-[0.625rem] tracking-wide text-silver">
            {reputation.rating.toFixed(1)} · {reputation.reviewCountDisplay} reviews
          </p>
        </div>
        <BookLink placement="sticky-mobile" size="md">
          Book now
        </BookLink>
      </div>
    </div>
  )
}
