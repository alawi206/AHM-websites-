import { photoSlots, type SlotId } from '../data/media'

export interface Picture {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
}

// Any image in src/assets/photos named after a slot id is picked up here and
// processed by vite-imagetools into responsive AVIF / WebP / JPEG sets.
const pictures = import.meta.glob<Picture>('../assets/photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: { w: '640;1024;1600;2400', format: 'avif;webp;jpg', quality: '72', as: 'picture' },
})

// Tiny inline previews, blurred behind the real image while it loads.
const previews = import.meta.glob<string>('../assets/photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: { w: '24', format: 'webp', quality: '50', inline: '' },
})

const slotName = (path: string) => path.split('/').pop()!.replace(/\.[^.]+$/, '')

const bySlot = new Map<string, { picture: Picture; preview?: string }>()
for (const [path, picture] of Object.entries(pictures)) {
  bySlot.set(slotName(path), { picture, preview: undefined })
}
for (const [path, preview] of Object.entries(previews)) {
  const entry = bySlot.get(slotName(path))
  if (entry) entry.preview = preview
}

/** Resolve a slot to its photo, following `fallback` links between slots. */
export function resolvePhoto(id: SlotId) {
  const seen = new Set<SlotId>()
  let current: SlotId | undefined = id
  while (current && !seen.has(current)) {
    seen.add(current)
    const found = bySlot.get(current)
    if (found) return { ...found, slot: photoSlots[current] }
    current = photoSlots[current].fallback
  }
  return undefined
}

export const suppliedPhotoCount = bySlot.size
