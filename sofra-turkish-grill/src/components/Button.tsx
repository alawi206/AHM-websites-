import type { ReactNode } from 'react'
import { Link } from '../lib/router'
import { ArrowRight, ArrowUpRight } from './icons'

type Variant = 'gold' | 'outline-light' | 'outline-dark' | 'espresso'

interface ButtonLinkProps {
  /** Internal route (rendered with the router) or external / tel: / mailto: URL. */
  href: string
  variant?: Variant
  size?: 'md' | 'sm'
  icon?: 'arrow' | 'external' | 'none'
  className?: string
  children: ReactNode
  ariaLabel?: string
}

export const isExternal = (href: string) => /^https?:\/\//.test(href)

export function ButtonLink({
  href,
  variant = 'gold',
  size = 'md',
  icon = 'arrow',
  className = '',
  children,
  ariaLabel,
}: ButtonLinkProps) {
  const classes = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`
  const Icon = icon === 'external' ? ArrowUpRight : ArrowRight
  const content = (
    <>
      <span>{children}</span>
      {icon !== 'none' && <Icon size={16} className="btn-arrow" />}
    </>
  )

  if (isExternal(href)) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener" aria-label={ariaLabel}>
        {content}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  if (/^(tel|mailto):/.test(href)) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </a>
    )
  }
  return (
    <Link to={href} className={classes} aria-label={ariaLabel}>
      {content}
    </Link>
  )
}

/** Inline text link with drawn underline. */
export function TextLink({
  href,
  children,
  className = '',
  icon = 'arrow',
}: {
  href: string
  children: ReactNode
  className?: string
  icon?: 'arrow' | 'external' | 'none'
}) {
  const Icon = icon === 'external' ? ArrowUpRight : ArrowRight
  const inner = (
    <>
      <span>{children}</span>
      {icon !== 'none' && <Icon size={15} className="btn-arrow" />}
    </>
  )
  const classes = `link-line eyebrow ${className}`
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener" className={classes}>
        {inner}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  if (/^(tel|mailto):/.test(href)) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    )
  }
  return (
    <Link to={href} className={classes}>
      {inner}
    </Link>
  )
}
