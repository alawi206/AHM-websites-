import type { CSSProperties, ReactNode } from 'react'
import { Star } from 'lucide-react'
import type { Picture as PictureData } from '../../content/media'

/** Hexagon glyph — the brand mark, taken from the shop's LED ceiling. */
export function HexMark({ className = '', strokeWidth = 1.6 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 1.8 20.83 6.9v10.2L12 22.2 3.17 17.1V6.9L12 1.8Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path d="M12 7.4 16.5 10v5.2L12 17.8l-4.5-2.6V10L12 7.4Z" fill="currentColor" opacity="0.9" />
    </svg>
  )
}

/** Minimal camera glyph (Lucide no longer ships brand icons). */
export function InstagramGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.25" cy="6.75" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Stars({ className = '', size = 'size-3.5', count = 5 }: { className?: string; size?: string; count?: number }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-gold ${className}`} role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${size} ${i < count ? '' : 'opacity-25'}`}
          fill="currentColor"
          strokeWidth={0}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

export function Eyebrow({ index, children, className = '' }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 text-silver ${className}`}>
      {index && <span className="text-gold">{index}</span>}
      {index && <span aria-hidden="true" className="h-px w-8 bg-line-strong" />}
      <span>{children}</span>
    </p>
  )
}

type PictureProps = {
  picture: PictureData
  alt: string
  sizes: string
  className?: string
  imgClassName?: string
  imgStyle?: CSSProperties
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
}

/** Responsive <picture> fed by the vite-imagetools pipeline (AVIF → WebP). */
export function Picture({
  picture,
  alt,
  sizes,
  className,
  imgClassName,
  imgStyle,
  loading = 'lazy',
  fetchPriority,
}: PictureProps) {
  const formats = Object.entries(picture.sources)
  return (
    <picture className={className}>
      {formats.map(([format, srcset]) => (
        <source key={format} type={`image/${format}`} srcSet={srcset} sizes={sizes} />
      ))}
      <img
        src={picture.img.src}
        width={picture.img.w}
        height={picture.img.h}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={imgClassName}
        style={imgStyle}
        draggable={false}
      />
    </picture>
  )
}
