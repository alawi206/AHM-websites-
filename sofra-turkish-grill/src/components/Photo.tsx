import type { CSSProperties } from 'react'
import { photoSlots, SHOW_PLACEHOLDER_LABELS, type SlotId } from '../data/media'
import { resolvePhoto } from '../lib/photos'
import { StarMotif } from './icons'

interface PhotoProps {
  slot: SlotId
  /** `sizes` attribute — describe the rendered width for responsive loading. */
  sizes?: string
  /** Above-the-fold images load eagerly with high fetch priority. */
  priority?: boolean
  className?: string
  imgClassName?: string
  /** Scroll-reveal style for the frame. */
  reveal?: boolean
  revealDelay?: number
  labelPosition?: 'bottom-left' | 'bottom-right' | 'top-right' | 'center'
  /** Decorative usage (e.g. purely atmospheric backgrounds). */
  decorative?: boolean
}

/**
 * A photo slot. Fills its (positioned) parent. Serves optimized AVIF / WebP /
 * JPEG when an owner-approved photo exists, otherwise a labelled placeholder.
 */
export function Photo({
  slot,
  sizes = '100vw',
  priority = false,
  className = '',
  imgClassName = '',
  reveal = false,
  revealDelay = 0,
  labelPosition = 'bottom-left',
  decorative = false,
}: PhotoProps) {
  const config = photoSlots[slot]
  const found = resolvePhoto(slot)

  const frameProps = reveal
    ? { 'data-reveal': 'image', style: { '--delay': `${revealDelay}ms` } as CSSProperties }
    : {}

  if (!found) {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`} {...frameProps}>
        <Placeholder slot={slot} labelPosition={labelPosition} hero={slot === 'hero'} />
      </div>
    )
  }

  const { picture, preview } = found
  const position: CSSProperties = {
    '--pos': config.position ?? '50% 50%',
    '--pos-sm': config.mobilePosition ?? config.position ?? '50% 50%',
  } as CSSProperties

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-espresso-soft ${className}`}
      {...frameProps}
    >
      {preview && (
        <img
          src={preview}
          alt=""
          aria-hidden="true"
          className="photo-img absolute inset-0 scale-110 blur-2xl"
          style={position}
        />
      )}
      <picture className="absolute inset-0 block">
        {['avif', 'webp'].map((format) =>
          picture.sources[format] ? (
            <source key={format} type={`image/${format}`} srcSet={picture.sources[format]} sizes={sizes} />
          ) : null,
        )}
        <img
          src={picture.img.src}
          srcSet={picture.sources.jpeg ?? picture.sources.jpg}
          sizes={sizes}
          width={picture.img.w}
          height={picture.img.h}
          alt={decorative ? '' : config.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          className={`photo-img ${imgClassName}`}
          style={position}
        />
      </picture>
    </div>
  )
}

function Placeholder({
  slot,
  labelPosition,
  hero,
}: {
  slot: SlotId
  labelPosition: PhotoProps['labelPosition']
  hero: boolean
}) {
  const config = photoSlots[slot]
  const labelPlacement = {
    'bottom-left': 'left-5 bottom-5 sm:left-6 sm:bottom-6 items-start text-left',
    'bottom-right': 'right-5 bottom-5 sm:right-6 sm:bottom-6 items-end text-right',
    'top-right': 'right-5 top-[calc(var(--header-h)+1.25rem)] items-end text-right',
    center: 'inset-x-5 top-1/2 mx-auto -translate-y-1/2 items-center text-center',
  }[labelPosition ?? 'bottom-left']

  return (
    <div className="ph" data-tone={config.tone} role="img" aria-label={`Photo placeholder: ${config.label}`}>
      {hero && <div className="ph-glow" />}
      <div className="pattern-girih" />
      {hero && (
        <StarMotif
          size={560}
          strokeWidth={0.16}
          className="absolute left-[78%] top-[42%] -translate-x-1/2 -translate-y-1/2 opacity-25"
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_40%,rgb(0_0_0/0.35))]" />
      {SHOW_PLACEHOLDER_LABELS && (
        <div className={`absolute flex max-w-[16rem] flex-col gap-1.5 ${labelPlacement}`}>
          <span className="eyebrow text-[0.6rem] tracking-[0.22em] opacity-75">Photo awaiting approval</span>
          <span className="font-display text-lg italic leading-tight opacity-90">{config.label}</span>
          <span className="mt-1 h-px w-10 bg-current opacity-40" />
        </div>
      )}
    </div>
  )
}
