import type { CSSProperties, ReactNode } from 'react'
import type { SlotId } from '../data/media'
import { Photo } from './Photo'
import { Eyebrow } from './ui'

interface PageHeroProps {
  slot: SlotId
  eyebrow: string
  title: string
  /** Optional second line set in italic. */
  titleAccent?: string
  intro?: ReactNode
  actions?: ReactNode
}

/** Shorter cinematic hero used on interior pages. */
export function PageHero({ slot, eyebrow, title, titleAccent, intro, actions }: PageHeroProps) {
  return (
    <section className="relative isolate flex min-h-[68svh] items-end overflow-hidden bg-espresso text-ivory lg:min-h-[74svh]">
      <div className="hero-media absolute inset-0 -z-10">
        <Photo slot={slot} priority sizes="100vw" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(25_18_14/0.92)_0%,rgb(25_18_14/0.55)_45%,rgb(25_18_14/0.2)_75%,rgb(25_18_14/0.45)_100%)]"
      />
      <div className="container-luxe pb-14 pt-[calc(var(--header-h)+4rem)] lg:pb-20">
        <div className="hero-fade" style={{ '--d': '0.15s' } as CSSProperties}>
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
        </div>
        <h1 className="mt-6 max-w-5xl font-display text-display-xl">
          <span className="hero-line">
            <span style={{ '--i': 0 } as CSSProperties}>{title}</span>
          </span>{' '}
          {titleAccent && (
            <span className="hero-line">
              <span style={{ '--i': 1 } as CSSProperties} className="italic text-gold-light">
                {titleAccent}
              </span>
            </span>
          )}
        </h1>
        {intro && (
          <div
            className="hero-fade mt-6 max-w-xl text-lede text-parchment"
            style={{ '--d': '0.6s' } as CSSProperties}
          >
            {intro}
          </div>
        )}
        {actions && (
          <div
            className="hero-fade mt-9 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap"
            style={{ '--d': '0.75s' } as CSSProperties}
          >
            {actions}
          </div>
        )}
      </div>
    </section>
  )
}
