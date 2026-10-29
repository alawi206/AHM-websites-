import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Photo } from '../../content/media'
import { useLockBody } from '../../hooks'
import { Picture } from '../ui/primitives'

type Props = {
  photos: Photo[]
  index: number
  onChange: (index: number) => void
  onClose: () => void
}

const EASE = [0.16, 1, 0.3, 1] as const

function largestSrc(photo: Photo) {
  const srcset = photo.picture.sources.webp ?? Object.values(photo.picture.sources)[0]
  return srcset?.split(',').pop()?.trim().split(' ')[0] ?? photo.picture.img.src
}

export function Lightbox({ photos, index, onChange, onClose }: Props) {
  const [direction, setDirection] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const photo = photos[index]
  const count = photos.length
  useLockBody(true)

  const go = useCallback(
    (step: number) => {
      setDirection(step)
      onChange((index + step + count) % count)
    },
    [index, count, onChange],
  )

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab' && dialogRef.current) {
        const focusables = [...dialogRef.current.querySelectorAll<HTMLElement>('button')].filter((el) => el.offsetParent !== null)
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onClose])

  // Warm the cache for the neighbours so swiping feels instant.
  useEffect(() => {
    for (const step of [1, -1]) {
      const img = new Image()
      img.src = largestSrc(photos[(index + step + count) % count])
    }
  }, [index, count, photos])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -450) go(1)
    else if (info.offset.x > 70 || info.velocity.x > 450) go(-1)
  }

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[70] flex flex-col bg-ink/[0.97] backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4 md:px-10 md:pt-8">
        <p className="font-mono text-xs tracking-[0.2em] text-silver" aria-live="polite">
          <span className="text-bone">{String(index + 1).padStart(2, '0')}</span> / {String(count).padStart(2, '0')}
          <span className="mx-3 text-line-strong">—</span>
          <span className="uppercase">{photo.category}</span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="grid size-12 place-items-center rounded-full border border-line-strong text-bone transition-colors hover:bg-bone hover:text-ink"
          aria-label="Close photo viewer"
        >
          <X className="size-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-3 md:px-24">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={photo.id}
            custom={direction}
            variants={{
              enter: (d: number) => ({ x: d * 90, opacity: 0, scale: 0.98 }),
              center: { x: 0, opacity: 1, scale: 1 },
              exit: (d: number) => ({ x: d * -90, opacity: 0, scale: 0.98 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: EASE }}
            drag={count > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={onDragEnd}
            className="flex cursor-grab touch-pan-y items-center justify-center active:cursor-grabbing"
          >
            <Picture
              picture={photo.picture}
              alt={photo.alt}
              sizes="92vw"
              loading="eager"
              imgClassName="h-auto max-h-[calc(100svh-11rem)] w-auto max-w-[94vw] rounded-[2px] object-contain md:max-w-[80vw]"
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-4 hidden size-14 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-ink/40 text-bone backdrop-blur transition-colors hover:bg-bone hover:text-ink md:grid"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute top-1/2 right-4 hidden size-14 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-ink/40 text-bone backdrop-blur transition-colors hover:bg-bone hover:text-ink md:grid"
              aria-label="Next photo"
            >
              <ChevronRight className="size-5" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-10 md:pb-8">
        <p className="text-sm text-silver">{photo.alt}</p>
        {count > 1 && (
          <div className="flex gap-2 md:hidden">
            <button
              type="button"
              onClick={() => go(-1)}
              className="grid size-11 place-items-center rounded-full border border-line-strong text-bone"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="grid size-11 place-items-center rounded-full border border-line-strong text-bone"
              aria-label="Next photo"
            >
              <ChevronRight className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        )}
        <p className="hidden font-mono text-[0.625rem] tracking-[0.18em] text-mist uppercase md:block">
          ← → to browse · Esc to close
        </p>
      </div>
    </motion.div>
  )
}
