/**
 * Photo pipeline. Drop real Madrid Cutz photos into src/assets/photos/** and
 * they are picked up automatically at build time, resized and re-encoded to
 * AVIF + WebP with responsive srcsets (vite-imagetools). No code changes.
 *
 *   photos/work/fade-01.jpg      → gallery, category taken from the prefix
 *   photos/barbers/aj.jpg        → portrait for the barber with id "aj"
 *   photos/shop/hero.jpg         → hero backdrop (layered under the LED light)
 *   photos/shop/about.jpg        → "More than a haircut" image
 *   photos/shop/visit.jpg        → location section image
 *   video/hero.mp4               → optional hero film (muted, looped)
 *
 * See docs/CONTENT.md for naming rules and the photo checklist.
 */

export type Picture = {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
}

export type Photo = {
  id: string
  picture: Picture
  category: string
  alt: string
}

const workFiles = import.meta.glob<Picture>('../assets/photos/work/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  // Glob options must be static literals (Vite requirement).
  query: { w: '480;800;1200;1800', format: 'avif;webp', as: 'picture' },
})

const barberFiles = import.meta.glob<Picture>('../assets/photos/barbers/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: { w: '400;700;1000', format: 'avif;webp', as: 'picture' },
})

const shopFiles = import.meta.glob<Picture>('../assets/photos/shop/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: { w: '800;1400;2200', format: 'avif;webp', as: 'picture' },
})

const videoFiles = import.meta.glob<string>('../assets/video/hero.{mp4,webm}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const CATEGORY_LABELS: Record<string, string> = {
  fade: 'Fades',
  fades: 'Fades',
  taper: 'Tapers',
  tapers: 'Tapers',
  beard: 'Beard Work',
  style: 'Styles',
  styles: 'Styles',
  texture: 'Styles',
  kids: 'Kids',
}

const ALT_SUBJECT: Record<string, string> = {
  Fades: 'Fade haircut',
  Tapers: 'Taper haircut',
  'Beard Work': 'Beard trim and line-up',
  Styles: 'Textured men’s haircut',
  Kids: 'Kids haircut',
  Cuts: 'Haircut',
}

/**
 * Optional hand-written alt text, keyed by file name. Anything not listed gets
 * a descriptive default such as "Fade haircut by Madrid Cutz, Auburn WA".
 */
const ALT_OVERRIDES: Record<string, string> = {}

function baseName(path: string) {
  return path
    .split('/')
    .pop()!
    .replace(/\.[a-z0-9]+$/i, '')
}

function categoryFor(name: string) {
  const prefix = name.toLowerCase().split(/[-_\s]/)[0]
  return CATEGORY_LABELS[prefix] ?? 'Cuts'
}

export const workPhotos: Photo[] = Object.entries(workFiles)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, picture]) => {
    const id = baseName(path)
    const category = categoryFor(id)
    return {
      id,
      picture,
      category,
      alt: ALT_OVERRIDES[id] ?? `${ALT_SUBJECT[category]} by Madrid Cutz, Auburn WA`,
    }
  })

const CATEGORY_ORDER = ['Fades', 'Tapers', 'Beard Work', 'Styles', 'Kids', 'Cuts']

export const workCategories: string[] = [
  'All',
  ...CATEGORY_ORDER.filter((category) => workPhotos.some((p) => p.category === category)),
]

export const barberPhotos: Record<string, Picture> = Object.fromEntries(
  Object.entries(barberFiles).map(([path, picture]) => [baseName(path).toLowerCase(), picture]),
)

export const shopPhotos: Record<string, Picture> = Object.fromEntries(
  Object.entries(shopFiles).map(([path, picture]) => [baseName(path).toLowerCase(), picture]),
)

const videoEntry = Object.entries(videoFiles)[0]
export const heroVideo: { src: string; type: string } | null = videoEntry
  ? { src: videoEntry[1], type: videoEntry[0].endsWith('.webm') ? 'video/webm' : 'video/mp4' }
  : null
