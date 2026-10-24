/**
 * Sofra Turkish Grill — editable business information.
 *
 * Everything the site says about the restaurant (contact details, hours,
 * external booking/ordering links) lives here so it can be updated in one
 * place. Values were taken from the client brief and the restaurant's own
 * website (sofratg.com). Items marked CONFIRM must be verified with the owner
 * before the site goes live.
 */

/** Production URL used for canonical links, Open Graph and the sitemap. */
export const SITE_URL = 'https://sofratg.com'

export const business = {
  name: 'Sofra Turkish Grill',
  shortName: 'Sofra',
  tagline: 'Authentic Turkish Grill in Kent, Washington',

  address: {
    street: '24228 104th Ave SE',
    suite: 'Suite 105',
    city: 'Kent',
    region: 'WA',
    postalCode: '98031',
    country: 'US',
  },

  phone: {
    display: '(253) 480-7348',
    href: 'tel:+12534807348',
    e164: '+1-253-480-7348',
  },

  email: 'sofraturkishgrille@gmail.com',

  /**
   * CONFIRM: sofratg.com publishes "daily 10 AM – 9 PM", but third-party
   * listings differ (e.g. delivery apps). Verify with the owner before launch.
   */
  hours: {
    summary: 'Open daily',
    display: '10 AM – 9 PM',
    // schema.org opening hours (24h clock)
    opens: '10:00',
    closes: '21:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },

  /** Existing third-party systems the restaurant already uses. */
  links: {
    orderOnline: 'https://sofraturkishgrillwa.com/store/',
    reservations: 'https://tmt.spotapps.co/reservations?spot_id=364253',
    catering: 'https://tmt.spotapps.co/catering?spot_id=364253',
    originalSite: 'https://sofratg.com/',
    originalMenu: 'https://sofratg.com/kent-sofra-turkish-grill-food-menu',
  },

  social: {
    // Verified profile: "SOFRA TURKISH GRILL (@sofratg) · Kent, WA"
    instagram: { handle: '@sofratg', url: 'https://www.instagram.com/sofratg/' },
  },

  /** Credit shown in the footer while the site is presented as a proposal. */
  credit: { name: 'AHM Digital LLC', label: 'Website redesign by' },
} as const

const fullAddress = `${business.address.street}, ${business.address.suite}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}`
const mapsQuery = encodeURIComponent(`${business.name}, ${fullAddress}`)

export const addressLines = [
  `${business.address.street}, ${business.address.suite}`,
  `${business.address.city}, ${business.address.region} ${business.address.postalCode}`,
]

export const maps = {
  fullAddress,
  /** Google Maps URLs API — no key required. */
  directions: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`,
  place: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
  /** Keyless embed; swap for a Maps Embed API URL with a key if preferred. */
  embed: `https://www.google.com/maps?q=${mapsQuery}&z=16&output=embed`,
  /** "Read more reviews" destination (Google Business Profile search). */
  reviews: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
}
