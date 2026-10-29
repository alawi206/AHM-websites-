/**
 * Provider-agnostic event layer. Every booking click, directions tap and
 * gallery open calls `track()`. Nothing is sent anywhere until the owner
 * approves an analytics tool: it then forwards automatically to Google Tag
 * Manager / GA4 (`window.dataLayer`) or Plausible (`window.plausible`) if
 * either script is added to index.html. See docs/GROWTH.md.
 */

export type AnalyticsEvent =
  | 'book_click'
  | 'directions_click'
  | 'copy_address'
  | 'gallery_open'
  | 'gallery_filter'
  | 'social_click'
  | 'phone_click'

type Props = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    plausible?: (event: string, options?: { props?: Props }) => void
  }
}

export function track(event: AnalyticsEvent, props: Props = {}) {
  try {
    window.dataLayer?.push({ event, ...props })
    window.plausible?.(event, { props })
    if (import.meta.env.DEV) console.debug('[track]', event, props)
  } catch {
    // Analytics must never break the page.
  }
}
