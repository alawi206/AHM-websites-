import type { ReactNode } from 'react'
import { ButtonLink } from '../components/Button'
import { ArrowUpRight, Bag, Calendar, Instagram, StarMotif } from '../components/icons'
import { PageHero } from '../components/PageHero'
import { Eyebrow, revealDelay } from '../components/ui'
import { addressLines, business, maps } from '../data/business'
import { Visit } from '../sections/Visit'

function Way({
  icon,
  title,
  text,
  href,
  action,
  delay,
}: {
  icon: ReactNode
  title: string
  text: string
  href: string
  action: string
  delay: number
}) {
  const external = /^https?:/.test(href)
  return (
    <li data-reveal style={revealDelay(delay)}>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener' } : {})}
        className="group flex h-full flex-col bg-ivory p-7 transition-colors duration-500 hover:bg-espresso hover:text-ivory sm:p-8"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 text-gold-deep transition-colors group-hover:text-gold">
          {icon}
        </span>
        <h2 className="mt-8 font-display text-[1.9rem] leading-tight">{title}</h2>
        <p className="mt-2 flex-1 text-sm text-ink-soft transition-colors group-hover:text-parchment">{text}</p>
        <span className="eyebrow mt-7 inline-flex items-center gap-2 text-[0.65rem]">
          {action}
          <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    </li>
  )
}

export function ContactPage() {
  return (
    <>
      <PageHero
        slot="contact-hero"
        eyebrow="Contact"
        title="Visit Sofra"
        titleAccent="in Kent, Washington."
        intro={
          <address className="not-italic">
            {addressLines[0]}, {addressLines[1]}
          </address>
        }
        actions={
          <>
            <ButtonLink href={maps.directions} variant="gold" icon="external">
              Get Directions
            </ButtonLink>
            <ButtonLink href={business.phone.href} variant="outline-light" icon="none">
              Call {business.phone.display}
            </ButtonLink>
          </>
        }
      />

      <section aria-label="Ways to reach us" className="bg-cream py-[clamp(4rem,8vw,6.5rem)]">
        <div className="container-luxe">
          <Eyebrow>How can we help?</Eyebrow>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Way
              icon={<Calendar size={20} />}
              title="Reserve a table"
              text="Book your table online in a few taps."
              href={business.links.reservations}
              action="Reserve"
              delay={0}
            />
            <Way
              icon={<Bag size={20} />}
              title="Order online"
              text="Browse the menu and place your order online."
              href={business.links.orderOnline}
              action="Start an order"
              delay={80}
            />
            <Way
              icon={<StarMotif size={20} strokeWidth={1.6} />}
              title="Catering & events"
              text="Tell us about your event and we’ll prepare a quote."
              href={business.links.catering}
              action="Plan your event"
              delay={160}
            />
            <Way
              icon={<Instagram size={20} />}
              title="Follow along"
              text={`See what’s new at Sofra on Instagram, ${business.social.instagram.handle}.`}
              href={business.social.instagram.url}
              action="Instagram"
              delay={240}
            />
          </ul>
        </div>
      </section>

      <Visit title="We look forward to welcoming you to our table." />
    </>
  )
}
