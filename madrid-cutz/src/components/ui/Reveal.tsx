import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1] as const

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'li' | 'p' | 'span'
  amount?: number
}

/** Fade + rise once the element scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 28, as = 'div', amount = 0.3 }: RevealProps) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

const lineParent: Variants = {
  hidden: {},
  show: (stagger: number = 0.09) => ({ transition: { staggerChildren: stagger } }),
}

const lineChild: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1.15, ease: EASE } },
}

type LinesProps = {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  /** Animate immediately (hero) instead of when scrolled into view. */
  immediate?: boolean
  delay?: number
  stagger?: number
  label?: string
  id?: string
}

/** Headline whose lines slide up from behind a mask, one after another. */
export function RevealLines({
  lines,
  className = '',
  lineClassName = 'chrome-text',
  as = 'h2',
  immediate = false,
  delay = 0,
  stagger = 0.09,
  label,
  id,
}: LinesProps) {
  const Tag = motion[as]
  const trigger = immediate
    ? { animate: 'show' as const }
    : { whileInView: 'show' as const, viewport: { once: true, amount: 0.4 } }
  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      {...trigger}
      variants={lineParent}
      custom={stagger}
      transition={{ delayChildren: delay }}
      aria-label={label}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]" aria-hidden={label ? true : undefined}>
          <motion.span className={`block will-change-transform ${lineClassName}`} variants={lineChild}>
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
