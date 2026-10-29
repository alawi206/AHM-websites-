import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { BOOKSY_URL } from '../../content/site'
import { track } from '../../lib/analytics'

type Variant = 'primary' | 'ghost' | 'text'
type Size = 'sm' | 'md' | 'lg' | 'xl'

type Props = {
  /** Where on the page the link lives — sent with the analytics event. */
  placement: string
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  href?: string
  icon?: boolean
}

const SIZES: Record<Size, string> = {
  sm: 'h-10 pl-4 pr-3 text-[0.6875rem] gap-2',
  md: 'h-12 pl-6 pr-4 text-xs gap-3',
  lg: 'h-14 pl-7 pr-5 text-[0.8125rem] gap-4',
  xl: 'h-16 sm:h-20 pl-8 pr-6 sm:pl-10 sm:pr-8 text-sm sm:text-base gap-5',
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-bone text-ink hover:text-ink',
  ghost: 'border border-line-strong text-bone hover:border-bone/60 backdrop-blur-sm bg-ink/20',
  text: 'text-bone',
}

/**
 * Every "Book" call to action on the site. Always points at the real
 * Madrid Cutz Booksy profile and opens it in a new tab.
 */
export function BookLink({
  placement,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href = BOOKSY_URL,
  icon = true,
}: Props) {
  if (variant === 'text') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        onClick={() => track('book_click', { placement })}
        className={`group inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase ${className}`}
      >
        <span className="relative">
          {children}
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-current transition-transform duration-500 ease-out-expo group-hover:scale-x-0" />
          <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-champagne transition-transform delay-150 duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
        </span>
        {icon && (
          <ArrowUpRight
            className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        )}
        <span className="sr-only">(opens Booksy in a new tab)</span>
      </a>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      onClick={() => track('book_click', { placement })}
      className={`group relative inline-flex items-center justify-between overflow-hidden rounded-full font-semibold tracking-[0.16em] uppercase transition-[border-color,color,transform] duration-500 ease-out-expo active:scale-[0.98] ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    >
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-left scale-x-0 bg-champagne transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
        />
      )}
      <span className="relative whitespace-nowrap">{children}</span>
      {icon && (
        <span
          aria-hidden="true"
          className={`relative grid place-items-center overflow-hidden rounded-full ${
            size === 'xl' ? 'size-10 sm:size-12' : size === 'sm' ? 'size-6' : 'size-8'
          } ${variant === 'primary' ? 'bg-ink text-bone' : 'bg-bone text-ink'}`}
        >
          <ArrowUpRight
            className="size-[55%] transition-transform duration-500 ease-out-expo group-hover:translate-x-[150%] group-hover:-translate-y-[150%]"
            strokeWidth={1.75}
          />
          <ArrowUpRight
            className="absolute size-[55%] -translate-x-[150%] translate-y-[150%] transition-transform duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0"
            strokeWidth={1.75}
          />
        </span>
      )}
      <span className="sr-only">(opens Booksy in a new tab)</span>
    </a>
  )
}
