import { business } from '../data/business'
import { useScrolledPastViewport } from '../hooks/useScrolled'
import { Bag, Calendar, Phone } from './icons'

/** Compact ordering / reservation bar for phones, shown after the hero. */
export function MobileCtaBar() {
  const visible = useScrolledPastViewport(0.6)
  return (
    <div
      data-hide-when-menu
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-ivory/10 bg-espresso/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-500 ease-(--ease-expo) lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      inert={!visible}
    >
      <div className="mx-auto flex max-w-md items-stretch gap-2">
        <a
          href={business.links.orderOnline}
          target="_blank"
          rel="noopener"
          className="btn btn-gold btn-sm flex-1 gap-2 px-3"
        >
          <Bag size={16} />
          <span>Order Online</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <a
          href={business.links.reservations}
          target="_blank"
          rel="noopener"
          className="btn btn-outline-light btn-sm flex-1 gap-2 px-3"
        >
          <Calendar size={16} />
          <span>Reserve</span>
          <span className="sr-only"> a table (opens in a new tab)</span>
        </a>
        <a
          href={business.phone.href}
          className="btn btn-outline-light btn-sm w-12 shrink-0 px-0"
          aria-label={`Call ${business.name} at ${business.phone.display}`}
        >
          <Phone size={17} />
        </a>
      </div>
    </div>
  )
}
