/**
 * Single source of truth for every business fact shown on the site.
 *
 * Rule: nothing reaches the page unless it has been verified. Facts that were
 * found in public listings but not yet confirmed with the shop are kept here
 * with `verified: false`, and the components skip them. Flip the flag once the
 * owner confirms. See docs/CONTENT.md for the verification checklist.
 */

export const BOOKSY_URL = 'https://booksy.com/en-us/1090147_madrid-cutz_barber-shop_39184_auburn'

export const business = {
  name: 'Madrid Cutz',
  city: 'Auburn',
  region: 'Washington',
  regionShort: 'WA',
  address: {
    street: '901 Auburn Way N',
    unit: 'Suite D',
    city: 'Auburn',
    state: 'WA',
    zip: '98002',
  },
  bookingUrl: BOOKSY_URL,
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent('Madrid Cutz, 901 Auburn Way N Suite D, Auburn, WA 98002'),
  mapEmbedUrl:
    'https://www.google.com/maps?q=' +
    encodeURIComponent('Madrid Cutz, 901 Auburn Way N Suite D, Auburn, WA 98002') +
    '&z=16&output=embed',
} as const

export const fullAddress = `${business.address.street}, ${business.address.unit}, ${business.address.city}, ${business.address.state} ${business.address.zip}`

/**
 * Booksy reputation. The screenshots supplied for this project show 5.0 stars
 * from 777 reviews; the site rounds down to "750+" so the copy stays true as
 * the live number moves. Re-check the live profile before launch.
 */
export const reputation = {
  rating: 5.0,
  reviewCountDisplay: '750+',
  reviewCountFloor: 750,
  source: 'Booksy',
} as const

export type Verified<T> = { value: T; verified: boolean }

/**
 * Public directories (Yelp, Yahoo Local, Facebook) list (253) 737-5646.
 * Not shown until the owner confirms it.
 */
export const phone: Verified<{ display: string; tel: string }> = {
  value: { display: '(253) 737-5646', tel: '+12537375646' },
  verified: false,
}

export type DayHours = { day: string; short: string; open: string | null; close: string | null }

/**
 * Hours as listed on Yelp (Mon–Fri 10–7, Sat 9–7, Sun 10–5). Other directories
 * disagree, so they stay hidden until confirmed against Booksy or the owner.
 */
export const hours: Verified<DayHours[]> = {
  value: [
    { day: 'Monday', short: 'Mon', open: '10:00 AM', close: '7:00 PM' },
    { day: 'Tuesday', short: 'Tue', open: '10:00 AM', close: '7:00 PM' },
    { day: 'Wednesday', short: 'Wed', open: '10:00 AM', close: '7:00 PM' },
    { day: 'Thursday', short: 'Thu', open: '10:00 AM', close: '7:00 PM' },
    { day: 'Friday', short: 'Fri', open: '10:00 AM', close: '7:00 PM' },
    { day: 'Saturday', short: 'Sat', open: '9:00 AM', close: '7:00 PM' },
    { day: 'Sunday', short: 'Sun', open: '10:00 AM', close: '5:00 PM' },
  ],
  verified: false,
}

export type Social = { label: string; handle: string; href: string; verified: boolean }

export const socials: Social[] = [
  {
    label: 'Instagram',
    handle: '@madridcutz',
    href: 'https://www.instagram.com/madridcutz/',
    // Handle supplied in the brief but not yet confirmed as the shop's account.
    verified: false,
  },
  {
    label: 'Facebook',
    handle: 'Madrid Cutz Barbershop',
    href: 'https://www.facebook.com/p/Madrid-Cutz-Barbershop-61553226029361/',
    verified: false,
  },
]

export type Service = {
  id: string
  name: string
  description: string
  /** Shown only when set. Leave undefined until confirmed on Booksy. */
  price?: string
  duration?: string
  tags: string[]
}

/**
 * Services listed on the Booksy profile (as indexed by search engines).
 * Booksy snapshots showed Haircut $35 / 45 min, Haircut & Beard $50 / 45 min
 * and Kids Haircut (under 10) $30 — fill `price` / `duration` once those are
 * confirmed against the live menu. Until then the cards send people to
 * Booksy for live pricing, which also means prices are never stale here.
 */
export const services: Service[] = [
  {
    id: 'haircut',
    name: 'Haircut',
    description:
      'A precision cut built around your head shape and the way you wear your hair — clipper work, scissor work and a clean, finished line.',
    tags: ['Fades', 'Tapers', 'Scissor work', 'Line-up'],
  },
  {
    id: 'haircut-beard',
    name: 'Haircut & Beard',
    description: 'The full reset. Your cut plus beard shaping and sharp edges, so the hair and the beard read as one clean look.',
    tags: ['Beard shaping', 'Edges', 'Blend'],
  },
  {
    id: 'kids',
    name: 'Kids Haircut',
    description: 'Same precision, scaled down. Clean, comfortable cuts for the younger clients in the chair.',
    tags: ['Under 10', 'Fades', 'Classic cuts'],
  },
]

/** The cuts the team is known for — used as craft vocabulary, not as menu items. */
export const craft = ['Skin fades', 'Tapers', 'Line-ups', 'Textured styles', 'Beard work', 'Scissor cuts'] as const

export type Barber = {
  id: string
  name: string
  /** Neutral, factual role line. No invented specialties or bios. */
  role: string
}

/**
 * Roster as shown on the Booksy profile in the supplied screenshots.
 * Re-check the live staff list before launch.
 */
export const barbers: Barber[] = [
  { id: 'aj', name: 'AJ', role: 'Barber' },
  { id: 'adam', name: 'Adam', role: 'Barber' },
  { id: 'mar', name: 'Mar', role: 'Barber' },
  { id: 'abbas', name: 'Abbas', role: 'Barber' },
  { id: 'isaiah', name: 'Isaiah', role: 'Barber' },
]

export type Review = {
  /** Reviewer first name exactly as shown on Booksy. */
  name: string
  rating: 1 | 2 | 3 | 4 | 5
  /** Verbatim excerpt from the Booksy review. Never paraphrase. */
  text: string
  barber?: string
  date?: string
}

/**
 * Verbatim Booksy reviews. Intentionally empty: review text must be copied
 * word-for-word from the live profile (with the shop's permission), never
 * written or paraphrased. When this list has entries the Reviews section
 * renders them as quote cards automatically.
 */
export const reviews: Review[] = []

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Barbers', href: '#barbers' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Visit', href: '#visit' },
] as const

/**
 * Optional announcement bar (promotions, holiday hours, new barber, etc.).
 * Disabled by default; set `enabled: true` with owner-approved copy.
 */
export const announcement = {
  enabled: false,
  text: '',
  href: BOOKSY_URL,
  cta: 'Book now',
}
