import { business, maps, SITE_URL } from './business'
import { menu, menuItems } from './menu'

export interface PageMeta {
  path: string
  title: string
  description: string
}

export const pages = {
  home: {
    path: '/',
    title: 'Sofra Turkish Grill | Authentic Turkish Restaurant in Kent, WA',
    description:
      'Authentic Turkish cuisine in Kent, Washington — kebabs, lamb chops, pide, manti and baklava. View the menu, order online or reserve a table at Sofra Turkish Grill.',
  },
  menu: {
    path: '/menu',
    title: 'Menu | Sofra Turkish Grill — Turkish Food in Kent, WA',
    description:
      'The full Sofra Turkish Grill menu: Turkish breakfast, mezes, pide and lahmacun, Iskender kebab, shashlik, lamb chops, dürüm, desserts and Turkish coffee in Kent, WA.',
  },
  story: {
    path: '/our-story',
    title: 'Our Story | Sofra Turkish Grill, Kent WA',
    description:
      'Sofra Turkish Grill was founded with a passion for sharing the flavors and hospitality of Turkey. Learn what guides our kitchen in Kent, Washington.',
  },
  catering: {
    path: '/catering',
    title: 'Turkish Catering & Private Events in Kent, WA | Sofra Turkish Grill',
    description:
      'Turkish catering and group dining for corporate events, birthdays, family celebrations and private gatherings in Kent and South King County. Plan your event with Sofra.',
  },
  contact: {
    path: '/contact',
    title: 'Contact & Directions | Sofra Turkish Grill, Kent WA',
    description:
      'Visit Sofra Turkish Grill at 24228 104th Ave SE, Suite 105, Kent, WA 98031. Hours, directions, phone and reservations.',
  },
  notFound: {
    path: '/404',
    title: 'Page Not Found | Sofra Turkish Grill',
    description: 'The page you were looking for could not be found.',
  },
} satisfies Record<string, PageMeta>

export const OG_IMAGE = '/og-image.jpg'

/** schema.org Restaurant — verified business information only. */
export function restaurantSchema() {
  const { address, hours } = business
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE_URL}/#restaurant`,
    name: business.name,
    url: SITE_URL,
    image: `${SITE_URL}${OG_IMAGE}`,
    telephone: business.phone.e164,
    email: business.email,
    servesCuisine: ['Turkish'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${address.street}, ${address.suite}`,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    hasMap: maps.place,
    hasMenu: `${SITE_URL}/menu`,
    acceptsReservations: business.links.reservations,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: hours.days,
        opens: hours.opens,
        closes: hours.closes,
      },
    ],
    potentialAction: [
      {
        '@type': 'OrderAction',
        target: { '@type': 'EntryPoint', urlTemplate: business.links.orderOnline },
      },
      {
        '@type': 'ReserveAction',
        target: { '@type': 'EntryPoint', urlTemplate: business.links.reservations },
      },
    ],
    sameAs: [business.social.instagram.url],
  }
}

/** schema.org Menu built from the published menu data. */
export function menuSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${SITE_URL}/menu#menu`,
    name: `${business.name} Menu`,
    url: `${SITE_URL}/menu`,
    inLanguage: 'en-US',
    hasMenuSection: menu.map((category) => ({
      '@type': 'MenuSection',
      name: category.title,
      hasMenuItem: menuItems(category).map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        offers: item.variants
          ? item.variants.map((v) => ({
              '@type': 'Offer',
              name: v.label,
              price: v.price.toFixed(2),
              priceCurrency: 'USD',
            }))
          : { '@type': 'Offer', price: item.price!.toFixed(2), priceCurrency: 'USD' },
      })),
    })),
  }
}

export function structuredDataFor(path: string) {
  const data: object[] = [restaurantSchema()]
  if (path === pages.menu.path) data.push(menuSchema())
  return data
}
