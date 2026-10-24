import type { CSSProperties, ElementType, ReactNode } from 'react'
import { RatingStar, StarMotif } from './icons'

/** Headline whose words rise out of a mask as it scrolls into view. */
export function RevealWords({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  italic,
  id,
}: {
  id?: string
  text: string
  as?: ElementType
  className?: string
  delay?: number
  /** Words (exact match, punctuation included) to set in italic. */
  italic?: string[]
}) {
  const words = text.split(' ')
  return (
    <Tag id={id} className={className} data-reveal="words" style={{ '--delay': `${delay}ms` } as CSSProperties}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="word">
            <span style={{ '--i': i } as CSSProperties} className={italic?.includes(word) ? 'italic' : undefined}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}

/** Small uppercase label preceded by the star motif. */
export function Eyebrow({
  children,
  tone = 'dark',
  className = '',
}: {
  children: ReactNode
  tone?: 'dark' | 'light' | 'olive'
  className?: string
}) {
  const color = { dark: 'text-gold-deep', light: 'text-gold', olive: 'text-gold-light' }[tone]
  return (
    <p className={`eyebrow flex items-center gap-3 ${color} ${className}`}>
      <StarMotif size={14} strokeWidth={2} className="shrink-0" />
      <span>{children}</span>
    </p>
  )
}

/** Fine-line divider with a centred star. */
export function Ornament({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-current opacity-30" />
      <StarMotif size={16} strokeWidth={1.6} className="opacity-80" />
      <span className="h-px flex-1 bg-current opacity-30" />
    </div>
  )
}

export function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex gap-1 ${className}`} role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <RatingStar key={i} className={i < rating ? '' : 'opacity-25'} />
      ))}
    </span>
  )
}

/** Inline style for a staggered scroll reveal. */
export const revealDelay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties
