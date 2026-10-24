import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Photo } from '../../components/Photo'
import { Eyebrow } from '../../components/ui'
import type { SlotId } from '../../data/media'

const chapters: { slot: SlotId; kicker: string; title: string; text: string }[] = [
  {
    slot: 'experience-grill',
    kicker: 'The Grill',
    title: 'Where the fire does the talking.',
    text: 'Shashlik, Iskender and lamb chops — the classics of a Turkish grill.',
  },
  {
    slot: 'experience-pide',
    kicker: 'The Oven',
    title: 'Golden pide, made for sharing.',
    text: 'Boat-shaped Turkish flatbread, baked golden and meant to be passed around the table.',
  },
  {
    slot: 'experience-table',
    kicker: 'The Table',
    title: 'Sofra means the table.',
    text: 'In Turkish homes the sofra is set for everyone. We set ours the same way.',
  },
  {
    slot: 'experience-welcome',
    kicker: 'The Welcome',
    title: 'Stay a while longer.',
    text: 'Turkish coffee, Turkish tea and baklava — the unhurried way to end a meal.',
  },
]

/**
 * Pinned, scroll-linked story. Each chapter's photograph is revealed with a
 * clip-path wipe as the visitor scrolls. Without JavaScript, or with reduced
 * motion, the chapters simply stack (see `.story` rules in index.css).
 */
export function Experience() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      if (scrollable <= 0) return
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable))
      setActive(Math.min(chapters.length - 1, Math.floor(progress * chapters.length)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    // First measurement waits for a frame so it doesn't force layout mid-hydration.
    frame = requestAnimationFrame(update)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      ref={ref}
      aria-labelledby="experience-title"
      className="story relative bg-espresso text-ivory"
      style={{ '--chapters': chapters.length } as CSSProperties}
    >
      <h2 id="experience-title" className="sr-only">
        The Sofra Experience
      </h2>
      <div className="story-stage">
        {chapters.map((chapter, i) => (
          <article
            key={chapter.slot}
            className={`story-chapter overflow-hidden ${i === active ? 'is-active' : ''} ${i < active ? 'is-past' : ''}`}
            aria-label={chapter.kicker}
          >
            <div className="story-media absolute inset-0">
              <Photo slot={chapter.slot} sizes="100vw" labelPosition="center" />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_top,rgb(25_18_14/0.92)_0%,rgb(25_18_14/0.5)_40%,rgb(25_18_14/0.12)_68%,rgb(25_18_14/0.6)_100%)]"
              />
            </div>

            <div className="container-luxe relative flex h-full min-h-[inherit] flex-col justify-end pb-[clamp(3rem,10vh,6rem)] pt-32">
              <div className="story-copy max-w-2xl">
                <p className="eyebrow flex items-center gap-4 text-gold">
                  <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
                  <span>{chapter.kicker}</span>
                </p>
                <h3 className="mt-5 font-display text-display-lg text-balance">{chapter.title}</h3>
                <p className="mt-5 max-w-md text-lede text-parchment">{chapter.text}</p>
              </div>
            </div>
          </article>
        ))}

        {/* Persistent label and progress, pinned over the stage. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden pt-[calc(var(--header-h)+2rem)] [.js_&]:block">
          <div className="container-luxe flex items-center justify-between">
            <Eyebrow tone="light">The Sofra Experience</Eyebrow>
            <ol className="story-progress hidden items-center gap-2" aria-hidden="true">
              {chapters.map((c, i) => (
                <li key={c.slot} className="relative h-px w-8 overflow-hidden bg-ivory/25 sm:w-12">
                  <span
                    className={`absolute inset-0 origin-left bg-gold transition-transform duration-700 ${
                      i <= active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
