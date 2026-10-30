import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { ArrowUpRight, Expand } from 'lucide-react'
import overhead from '../../assets/art/ceiling-overhead.jpg?w=500;900&format=avif;webp&as=picture'
import angle from '../../assets/art/ceiling-angle.jpg?w=500;900&format=avif;webp&as=picture'
import { workCategories, workPhotos, type Photo } from '../../content/media'
import { BOOKSY_URL, reputation, socials } from '../../content/site'
import { useMediaQuery } from '../../hooks'
import { track } from '../../lib/analytics'
import { BookLink } from '../ui/BookLink'
import { Reveal, RevealLines } from '../ui/Reveal'
import { Eyebrow, InstagramGlyph, Picture } from '../ui/primitives'
import { Lightbox } from './Lightbox'

const EASE = [0.16, 1, 0.3, 1] as const

/** Staggered column offsets give the grid its editorial rhythm. */
const COLUMN_OFFSETS: Record<number, string[]> = {
  2: ['', 'mt-14'],
  3: ['mt-10', '', 'mt-24'],
  4: ['', 'mt-20', 'mt-8', 'mt-32'],
}

/** Shortest-column-first distribution so uncropped photos stay balanced. */
function toColumns(photos: Photo[], count: number) {
  const columns: { photo: Photo; index: number }[][] = Array.from({ length: count }, () => [])
  const heights = new Array(count).fill(0)
  photos.forEach((photo, index) => {
    const target = heights.indexOf(Math.min(...heights))
    columns[target].push({ photo, index })
    heights[target] += photo.picture.img.h / photo.picture.img.w
  })
  return columns
}

function Masonry({ photos, onOpen }: { photos: Photo[]; onOpen: (index: number, el: HTMLElement) => void }) {
  const xl = useMediaQuery('(min-width: 1280px)')
  const md = useMediaQuery('(min-width: 768px)')
  const count = xl ? 4 : md ? 3 : 2
  const columns = useMemo(() => toColumns(photos, count), [photos, count])

  return (
    <div className="flex items-start gap-3 md:gap-5">
      {columns.map((column, c) => (
        <div key={c} className={`flex min-w-0 flex-1 flex-col gap-3 md:gap-5 ${COLUMN_OFFSETS[count][c]}`}>
          {column.map(({ photo, index }, row) => (
            // The in-view trigger sits on an unclipped wrapper: a fully clipped
            // element has no visible area, so it would never count as "in view".
            <motion.div key={photo.id} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
              <motion.button
                type="button"
                onClick={(e) => onOpen(index, e.currentTarget)}
                className="group relative block w-full overflow-hidden rounded-[3px] bg-coal text-left"
                variants={{
                  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
                  show: { clipPath: 'inset(0% 0% 0% 0%)' },
                }}
                transition={{ duration: 1.1, ease: EASE, delay: (row % 3) * 0.08 + c * 0.05 }}
                aria-label={`Open photo: ${photo.alt}`}
              >
                <Picture
                  picture={photo.picture}
                  alt={photo.alt}
                  sizes="(min-width: 1280px) 24vw, (min-width: 768px) 32vw, 48vw"
                  className="block"
                  imgClassName="block h-auto w-full transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.045]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between p-4 opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  <span className="eyebrow text-bone">{photo.category}</span>
                  <span className="grid size-9 place-items-center rounded-full bg-bone text-ink">
                    <Expand className="size-4" strokeWidth={1.75} />
                  </span>
                </span>
              </motion.button>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}

const FALLBACK_TILES = [
  { label: 'Fades', picture: overhead, position: '20% 30%', scale: 1.35 },
  { label: 'Tapers', picture: angle, position: '70% 20%', scale: 1.15 },
  { label: 'Beard Work', picture: angle, position: '30% 85%', scale: 1.5 },
  { label: 'Styles', picture: overhead, position: '80% 75%', scale: 1.6 },
]

/**
 * Shown until real photos are added to src/assets/photos/work/. It never
 * implies these renders are client work — it sends people to the live
 * portfolio on Booksy instead.
 */
const instagram = socials.find((s) => s.label === 'Instagram' && s.verified)

function PortfolioFallback() {
  return (
    <div className="grid grid-cols-1 gap-3 md:gap-5 lg:grid-cols-12">
      <Reveal className="flex flex-col justify-between gap-10 rounded-[3px] border border-line bg-coal p-7 md:p-10 lg:col-span-5">
        <div>
          <p className="eyebrow text-gold">The portfolio</p>
          <p className="display mt-6 text-4xl leading-none md:text-5xl">
            <span className="chrome-text block">Fresh work,</span>
            <span className="block">
              <span className="gold-text">straight from</span> <span className="chrome-text">the chair.</span>
            </span>
          </p>
          <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-silver">
            {reputation.portfolioDisplay} photos of fades, tapers and beard work live on the Madrid Cutz Booksy profile. Browse
            them, then book the barber whose work you like best.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <BookLink placement="gallery-fallback" variant="ghost" size="md">
            See the latest work
          </BookLink>
          {instagram && (
            <a
              href={instagram.href}
              target="_blank"
              rel="noopener"
              onClick={() => track('social_click', { network: 'Instagram', placement: 'gallery' })}
              className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-silver uppercase transition-colors hover:text-gold-soft"
            >
              <InstagramGlyph className="size-4 text-gold" />
              {instagram.handle}
              <span className="sr-only">on Instagram (opens in a new tab)</span>
            </a>
          )}
        </div>
      </Reveal>
      <div className="grid grid-cols-2 gap-3 md:gap-5 lg:col-span-7">
        {FALLBACK_TILES.map((tile, i) => (
          <Reveal key={tile.label} delay={i * 0.07} y={20}>
            <a
              href={BOOKSY_URL}
              target="_blank"
              rel="noopener"
              onClick={() => track('book_click', { placement: `gallery-tile:${tile.label}` })}
              className="group relative block aspect-[4/5] overflow-hidden rounded-[3px] bg-coal sm:aspect-[5/4]"
            >
              <Picture
                picture={tile.picture}
                alt=""
                sizes="(min-width: 1024px) 28vw, 50vw"
                className="absolute inset-0"
                imgClassName="h-full w-full object-cover brightness-[0.45] transition-[filter] duration-[1400ms] ease-out-expo group-hover:brightness-[0.9]"
                imgStyle={{ objectPosition: tile.position, transform: `scale(${tile.scale})`, transformOrigin: tile.position }}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <span className="absolute top-4 left-4 font-mono text-[0.6875rem] text-gold md:top-5 md:left-5">0{i + 1}</span>
              <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2 md:inset-x-5 md:bottom-5">
                <span className="display text-xl leading-none sm:text-2xl md:text-3xl">{tile.label}</span>
                <ArrowUpRight
                  className="size-5 shrink-0 text-silver transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bone"
                  strokeWidth={1.5}
                />
              </span>
              <span className="sr-only">— view on Booksy (opens in a new tab)</span>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export function Gallery() {
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState<number | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const hasPhotos = workPhotos.length > 0
  const showFilters = workCategories.length > 2

  const photos = useMemo(() => (filter === 'All' ? workPhotos : workPhotos.filter((p) => p.category === filter)), [filter])

  const openAt = (index: number, el: HTMLElement) => {
    triggerRef.current = el
    setOpen(index)
    track('gallery_open', { photo: photos[index]?.id })
  }

  const close = () => {
    setOpen(null)
    triggerRef.current?.focus({ preventScroll: true })
  }

  return (
    <section id="work" aria-labelledby="work-title" className="relative bg-ink pt-24 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="04">The work</Eyebrow>
            </Reveal>
            <RevealLines
              id="work-title"
              lines={[
                'The work',
                <>
                  speaks <span className="gold-text">for</span> itself.
                </>,
              ]}
              label="The work speaks for itself."
              className="display mt-6 text-[12.5vw] sm:text-7xl xl:text-8xl"
            />
          </div>
          {showFilters && hasPhotos && (
            <Reveal delay={0.1} className="min-w-0 lg:col-span-5 lg:justify-self-end">
              <LayoutGroup id="gallery-filter">
                <div
                  role="group"
                  aria-label="Filter photos"
                  className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:justify-end lg:overflow-visible lg:px-0"
                >
                  {workCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setFilter(cat)
                        track('gallery_filter', { category: cat })
                      }}
                      aria-pressed={filter === cat}
                      className={`relative shrink-0 rounded-full px-4 py-2.5 text-[0.6875rem] font-medium tracking-[0.16em] uppercase transition-colors duration-300 ${
                        filter === cat ? 'text-ink' : 'text-silver hover:text-bone'
                      }`}
                    >
                      {filter === cat && (
                        <motion.span
                          layoutId="filter-pill"
                          className="absolute inset-0 rounded-full bg-bone"
                          transition={{ duration: 0.5, ease: EASE }}
                        />
                      )}
                      <span className="relative">{cat}</span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
            </Reveal>
          )}
        </div>

        <div className="mt-14 md:mt-20">
          {hasPhotos ? <Masonry key={filter} photos={photos} onOpen={openAt} /> : <PortfolioFallback />}
        </div>

        <div className="mt-20 grid grid-cols-1 items-end gap-8 border-t border-line pt-10 md:mt-28 md:grid-cols-12 md:pt-14">
          <RevealLines
            as="p"
            lines={['Ready for your', 'next cut?']}
            className="display text-[11vw] text-bone sm:text-6xl md:col-span-8 xl:text-7xl"
          />
          <Reveal delay={0.15} className="md:col-span-4 md:justify-self-end">
            <BookLink placement="gallery-cta" size="lg">
              Book your appointment
            </BookLink>
          </Reveal>
        </div>
      </div>

      <AnimatePresence>
        {open !== null && photos[open] && <Lightbox photos={photos} index={open} onChange={setOpen} onClose={close} />}
      </AnimatePresence>
    </section>
  )
}
