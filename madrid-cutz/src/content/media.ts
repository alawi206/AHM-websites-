/**
 * Photo pipeline. Drop real Madrid Cutz photos into src/assets/photos/** and
 * they are picked up automatically at build time, resized and re-encoded to
 * AVIF + WebP with responsive srcsets (vite-imagetools). No code changes.
 *
 *   photos/work/01-fade-low.jpg  → gallery; number sets the order, first known word the filter
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
const ALT_OVERRIDES: Record<string, string> = {
  '01-taper-locs': 'Locs with a clean taper fade, under the hexagon LED ceiling at Madrid Cutz',
  '02-fade-low-lineup': 'Low fade with a sharp line-up and a short textured top',
  '03-beard-steam-trim': 'Beard trim with steam and a face mask in the chair at Madrid Cutz',
  '04-fade-low-taper-blonde': 'Low taper fade with a textured top, blended into a full beard',
  '05-style-textured-high-fade': 'Textured top with a high fade, in a Madrid Cutz cape',
  '06-fade-bald-beard': 'Bald fade blended into a full beard, under the hexagon lights',
  '07-kids-textured-fade': 'Kids haircut: fade with a textured, spiky top',
  '08-taper-swept-back': 'Swept-back textured top with a taper fade, under the hexagon lights',
  '09-beard-full-shape': 'Full beard, shaped and lined up, with the Madrid Cutz stations behind',
  '10-beard-lineup': 'Sculpted beard and line-up with a fade, seen from above in the chair',
}

function baseName(path: string) {
  return path
    .split('/')
    .pop()!
    .replace(/\.[a-z0-9]+$/i, '')
}

/** First recognised word in the file name, so "01-taper-locs.jpg" → Tapers. */
function categoryFor(name: string) {
  const word = name
    .toLowerCase()
    .split(/[-_\s]/)
    .find((token) => token in CATEGORY_LABELS)
  return word ? CATEGORY_LABELS[word] : 'Cuts'
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
