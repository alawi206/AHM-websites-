import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { Crown, MapPin, Scissors } from 'lucide-react'
import { business, reputation } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { Stars } from '../ui/primitives'

function CountUp({ to, decimals = 0, suffix = '' }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? to : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setValue,
    })
    return () => controls.stop()
  }, [inView, reduce, to])

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden="true">
        {value.toFixed(decimals)}
        {suffix}
      </span>
      <span className="sr-only">
        {to.toFixed(decimals)}
        {suffix}
      </span>
    </span>
  )
}

export function TrustStrip() {
  const items = [
    {
      label: 'Rating',
      value: <CountUp to={reputation.rating} decimals={1} />,
      detail: (
        <span className="flex items-center gap-2">
          <Stars size="size-3" /> on {reputation.source}
        </span>
      ),
    },
    {
      label: 'Reviews',
      value: <CountUp to={reputation.reviewCountFloor} suffix="+" />,
      detail: <span>Client reviews on {reputation.source}</span>,
    },
    {
      // Badge shown on the shop's Booksy profile (see docs/CONTENT.md).
      label: 'Status',
      value: (
        <span className="inline-flex items-center">
          <Crown className="size-[0.85em] text-gold" strokeWidth={1.25} aria-hidden="true" />
          <span className="sr-only">Booksy Recommended</span>
        </span>
      ),
      detail: (
        <span className="flex items-center gap-2">
          <Scissors className="size-3.5 text-gold" strokeWidth={1.5} aria-hidden="true" />
          {reputation.badge}
        </span>
      ),
    },
    {
      label: 'Location',
      value: <span>{business.city}</span>,
      detail: (
        <span className="flex items-center gap-2">
          <MapPin className="size-3.5 text-gold" strokeWidth={1.5} aria-hidden="true" />
          {business.address.street}, {business.regionShort}
        </span>
      ),
    },
  ]

  return (
    <section id="trust" aria-label="Reputation" className="relative border-y border-line bg-ink">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal
            key={item.label}
            delay={i * 0.08}
            y={16}
            className={`relative px-5 py-8 md:px-10 md:py-12 lg:px-8 ${i % 2 === 1 ? 'border-l border-line' : ''} ${
              i > 1 ? 'border-t border-line lg:border-t-0' : ''
            } ${i === 2 ? 'lg:border-l' : ''}`}
          >
            <p className="eyebrow mb-4 flex items-center justify-between text-mist">
              <span>{item.label}</span>
              <span className="text-gold/70">0{i + 1}</span>
            </p>
            <p className="display chrome-text text-[8vw] leading-none lg:text-[4vw] 2xl:text-[4.5rem]">{item.value}</p>
            <div className="mt-4 text-xs text-silver sm:text-sm">{item.detail}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
