import type { CSSProperties } from 'react'
import { photoSlots, type ArtTone, type PhotoSlot, type SlotId } from '../data/media'
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
  /** Decorative usage (e.g. purely atmospheric backgrounds). */
  decorative?: boolean
  /** Without a photo: show the slot's art panel, or render nothing. */
  whenMissing?: 'art' | 'none'
  /** Art panel composition: centred medallion, or an oversized side word. */
  artLayout?: 'center' | 'stage'
  /** Large eight-point star and ember glow (used by the home hero). */
  artMotif?: boolean
}

/**
 * A photo slot. Fills its (positioned) parent. Serves optimized AVIF / WebP /
 * JPEG when an owner-authorized photo exists. Otherwise it shows a designed
 * art panel in the brand palette — or nothing — and never a placeholder notice.
 */
export function Photo({
  slot,
  sizes = '100vw',
  priority = false,
  className = '',
  imgClassName = '',
  reveal = false,
  revealDelay = 0,
  decorative = false,
  whenMissing = 'art',
  artLayout = 'center',
  artMotif = false,
}: PhotoProps) {
  const found = resolvePhoto(slot)

  const frameProps = reveal
    ? { 'data-reveal': 'image', style: { '--delay': `${revealDelay}ms` } as CSSProperties }
    : {}

  if (!found) {
    if (whenMissing === 'none') return null
    const config = photoSlots[slot]
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`} {...frameProps}>
        <ArtPanel tone={config.tone} art={config.art} layout={artLayout} motif={artMotif} />
      </div>
    )
  }

  // Alt text and crop come from the slot that owns the photo, so a borrowed
  // photo is always described accurately.
  const { picture, preview, slot: source } = found
  const position: CSSProperties = {
    '--pos': source.position ?? '50% 50%',
    '--pos-sm': source.mobilePosition ?? source.position ?? '50% 50%',
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
          alt={decorative ? '' : source.alt}
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

/**
 * Typographic art panel in the brand palette: tonal gradient, Turkish
 * geometric lattice and, optionally, a Turkish word with its meaning.
 * Purely decorative — hidden from assistive technology.
 */
export function ArtPanel({
  tone,
  art,
  layout = 'center',
  motif = false,
}: {
  tone: ArtTone
  art?: PhotoSlot['art']
  layout?: 'center' | 'stage'
  motif?: boolean
}) {
  const light = tone === 'sand'
  return (
    <div className="ph" data-tone={tone} aria-hidden="true">
      {motif && <div className="ph-glow" />}
      <div className="pattern-girih" />
      {motif && (
        <StarMotif
          size={420}
          strokeWidth={0.18}
          className="absolute left-[76%] top-[35%] -translate-x-1/2 -translate-y-1/2 opacity-25"
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_40%,rgb(0_0_0/0.32))]" />

      {art && layout === 'center' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <StarMotif size={34} strokeWidth={1.3} className={light ? 'text-gold-deep' : 'text-gold'} />
          <span
            lang="tr"
            className={`mt-6 font-display text-[clamp(2.3rem,1.4rem+3vw,4.25rem)] italic leading-[0.95] text-balance ${
              light ? 'text-espresso' : 'text-gold-light'
            }`}
          >
            {art.word}
          </span>
          <span className={`mt-3 h-px w-12 ${light ? 'bg-gold-deep/50' : 'bg-gold/50'}`} />
          <span className={`eyebrow mt-3 text-[0.62rem] ${light ? 'text-ink-soft' : 'text-parchment/80'}`}>
            {art.meaning}
          </span>
        </div>
      )}

      {art && layout === 'stage' && (
        <div className="container-luxe absolute inset-x-0 top-[calc(var(--header-h)+5rem)] flex justify-end lg:top-[22%]">
          <span className="text-right">
            <span
              lang="tr"
              className="block font-display text-[clamp(6rem,3.5rem+11vw,15rem)] italic leading-[0.85] text-gold/30"
            >
              {art.word}
            </span>
            <span className="eyebrow mt-8 inline-flex items-center gap-3 text-[0.62rem] text-gold/80 lg:mt-10">
              <span className="h-px w-8 bg-gold/50" />
              <span lang="tr" className="normal-case tracking-[0.12em]">
                {art.word.toLocaleLowerCase('tr')}
              </span>
              <span>·</span>
              <span>{art.meaning}</span>
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
