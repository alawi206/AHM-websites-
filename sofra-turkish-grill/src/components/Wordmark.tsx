import { business } from '../data/business'
import { logo } from '../lib/brand'
import { StarMotif } from './icons'

interface WordmarkProps {
  /** `light` for dark backgrounds, `dark` for light backgrounds. */
  tone?: 'light' | 'dark'
  size?: 'md' | 'lg'
  className?: string
}

/**
 * Sofra wordmark. Renders the official logo when a file is supplied in
 * src/assets/brand, otherwise a typographic mark in the brand typefaces.
 */
export function Wordmark({ tone = 'light', size = 'md', className = '' }: WordmarkProps) {
  const file = logo[tone]
  if (file) {
    return (
      <img
        src={file}
        alt={business.name}
        className={`${size === 'lg' ? 'h-16' : 'h-10 lg:h-12'} w-auto ${className}`}
      />
    )
  }

  const lg = size === 'lg'
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <StarMotif size={lg ? 40 : 30} className="shrink-0 text-gold" strokeWidth={lg ? 1.1 : 1.3} />
      <span className="flex flex-col leading-none" aria-hidden="true">
        <span
          className={`font-display font-medium ${lg ? 'text-[2.6rem]' : 'text-[1.6rem] lg:text-[1.75rem]'} tracking-[0.22em]`}
        >
          SOFRA
        </span>
        <span
          className={`mt-1 font-sans font-semibold uppercase ${lg ? 'text-[0.66rem]' : 'text-[0.52rem]'} tracking-[0.44em] opacity-80`}
        >
          Turkish Grill
        </span>
      </span>
      <span className="sr-only">{business.name}</span>
    </span>
  )
}
