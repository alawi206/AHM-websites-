import { business, SITE_URL } from '../data/business'
import { OG_IMAGE, structuredDataFor, type PageMeta } from '../data/seo'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const canonicalFor = (path: string) => `${SITE_URL}${path === '/' ? '/' : path}`

/** Head markup injected into each prerendered page. */
export function headTags(meta: PageMeta, { indexable = true } = {}) {
  const url = canonicalFor(meta.path)
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    indexable ? `<link rel="canonical" href="${url}" />` : `<meta name="robots" content="noindex" />`,
    `<meta property="og:type" content="restaurant" />`,
    `<meta property="og:site_name" content="${escapeHtml(business.name)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="geo.region" content="US-WA" />`,
    `<meta name="geo.placename" content="Kent, Washington" />`,
  ]
  if (indexable) {
    for (const data of structuredDataFor(meta.path)) {
      tags.push(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`)
    }
  }
  return tags.join('\n    ')
}

/** Keep title / description / canonical in sync during client navigation. */
export function applyHead(meta: PageMeta) {
  document.title = meta.title
  const set = (selector: string, attr: string, value: string) => {
    document.head.querySelector(selector)?.setAttribute(attr, value)
  }
  const url = canonicalFor(meta.path)
  set('meta[name="description"]', 'content', meta.description)
  set('link[rel="canonical"]', 'href', url)
  set('meta[property="og:title"]', 'content', meta.title)
  set('meta[property="og:description"]', 'content', meta.description)
  set('meta[property="og:url"]', 'content', url)
}
