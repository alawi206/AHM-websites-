import { ButtonLink } from '../components/Button'
import { Calendar, Mail, Phone, StarMotif } from '../components/icons'
import { PageHero } from '../components/PageHero'
import { Photo } from '../components/Photo'
import { Eyebrow, RevealWords, revealDelay } from '../components/ui'
import { business } from '../data/business'

// Occasions named on sofratg.com (homepage catering section and the
// "Groups and Parties" page).
const occasions = [
  { title: 'Corporate Events', text: 'Team lunches, client meetings and office celebrations.' },
  { title: 'Family Celebrations', text: 'Reunions, milestones and the dinners worth gathering for.' },
  { title: 'Birthdays', text: 'A Turkish spread for the guest of honor — and everyone they invite.' },
  { title: 'Private Gatherings', text: 'Get-togethers with friends, hosted with Turkish hospitality.' },
  { title: 'Holiday Parties', text: 'Seasonal celebrations with family, friends or colleagues.' },
  { title: 'Weddings & Rehearsal Dinners', text: 'Turkish flavors for the celebrations around the big day.' },
]

const steps = [
  {
    title: 'Share the details',
    text: 'Tell us your date, guest count and the kind of event through our catering request form.',
  },
  {
    title: 'Plan the menu',
    text: 'Our catering team will be in touch to discuss your requirements and prepare a quote.',
  },
  {
    title: 'Gather and enjoy',
    text: 'Set the date, invite your guests, and let Sofra take care of the table.',
  },
]

export function CateringPage() {
  return (
    <>
      <PageHero
        slot="catering-hero"
        eyebrow="Catering & Private Events"
        title="Turkish hospitality,"
        titleAccent="wherever you gather."
        intro="Catering and group dining for corporate events, celebrations and private gatherings in Kent and the surrounding area."
        actions={
          <>
            <ButtonLink href={business.links.catering} variant="gold" icon="external">
              Plan Your Event
            </ButtonLink>
            <ButtonLink href={business.phone.href} variant="outline-light" icon="none">
              Call {business.phone.display}
            </ButtonLink>
          </>
        }
      />

      <section aria-labelledby="occasions-title" className="bg-ivory py-[clamp(5rem,11vw,10rem)]">
        <div className="container-luxe">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <Eyebrow>Occasions</Eyebrow>
              <RevealWords
                id="occasions-title"
                text="For every kind of gathering."
                italic={['gathering.']}
                className="mt-6 font-display text-display-lg"
              />
            </div>
            <p className="text-ink-soft md:col-span-5 md:pb-2" data-reveal style={revealDelay(120)}>
              Whether it’s a working lunch or a family milestone, we’ll help you plan a menu your guests will remember.
            </p>
          </div>

          <ul className="mt-14 grid border-l border-t border-sand sm:grid-cols-2 lg:grid-cols-3">
            {occasions.map((occasion, i) => (
              <li
                key={occasion.title}
                className="group relative border-b border-r border-sand p-7 transition-colors duration-500 hover:bg-cream sm:p-9"
                data-reveal
                style={revealDelay((i % 3) * 100)}
              >
                <span className="eyebrow text-[0.62rem] text-gold-deep tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-6 font-display text-[1.9rem] leading-tight">{occasion.title}</h3>
                <p className="mt-3 text-ink-soft">{occasion.text}</p>
                <StarMotif
                  size={28}
                  strokeWidth={1.2}
                  className="absolute right-7 top-7 text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="process-title"
        className="grain relative overflow-hidden bg-olive py-[clamp(5rem,11vw,10rem)] text-ivory"
      >
        <div className="pattern-girih [--pattern-opacity:0.06]" />
        <div className="container-luxe relative grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Eyebrow tone="olive">How it works</Eyebrow>
            <RevealWords
              id="process-title"
              text="Three steps to a table worth sharing."
              italic={['sharing.']}
              className="mt-6 font-display text-display-lg"
            />
            <div className="mt-10 flex flex-col gap-3 min-[480px]:flex-row" data-reveal style={revealDelay(150)}>
              <ButtonLink href={business.links.catering} variant="gold" icon="external">
                Plan Your Event
              </ButtonLink>
            </div>
          </div>
          <ol className="grid gap-10 lg:col-span-6 lg:col-start-7">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-6 border-t border-ivory/15 pt-8" data-reveal style={revealDelay(i * 120)}>
                <span className="font-display text-5xl italic leading-none text-gold">{i + 1}</span>
                <div>
                  <h3 className="font-display text-[1.9rem] leading-tight">{step.title}</h3>
                  <p className="mt-2 max-w-md text-parchment">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="options-title" className="bg-cream py-[clamp(5rem,11vw,10rem)]">
        <div className="container-luxe">
          <Eyebrow>Two ways to celebrate</Eyebrow>
          <h2 id="options-title" className="sr-only">
            Catering or group dining
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
            <article className="flex flex-col bg-ivory" data-reveal>
              <div className="relative aspect-[16/10]">
                <Photo slot="catering-main" sizes="(min-width: 1024px) 45vw, 100vw" />
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-10">
                <h3 className="font-display text-display-md">Catering for your event</h3>
                <p className="mt-4 max-w-md flex-1 text-ink-soft">
                  Share your event details and our catering team will help you plan the menu and prepare a quote.
                </p>
                <div className="mt-8">
                  <ButtonLink href={business.links.catering} variant="espresso" icon="external">
                    Request Catering
                  </ButtonLink>
                </div>
              </div>
            </article>
            <article className="flex flex-col bg-ivory" data-reveal style={revealDelay(120)}>
              <div className="relative aspect-[16/10]">
                <Photo slot="story-hero" sizes="(min-width: 1024px) 45vw, 100vw" />
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-10">
                <h3 className="font-display text-display-md">Group dining at Sofra</h3>
                <p className="mt-4 max-w-md flex-1 text-ink-soft">
                  Bring everyone to our table for birthdays, rehearsal dinners and corporate events. Reserve online, or
                  call us to plan a larger party.
                </p>
                <div className="mt-8 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
                  <ButtonLink href={business.links.reservations} variant="espresso" icon="external">
                    Reserve for a Group
                  </ButtonLink>
                  <ButtonLink href={business.phone.href} variant="outline-dark" icon="none">
                    Call Us
                  </ButtonLink>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-14 grid gap-6 border-t border-sand pt-10 text-sm sm:grid-cols-3">
            <a href={business.links.catering} target="_blank" rel="noopener" className="group flex items-center gap-4">
              <Calendar size={20} className="text-gold-deep" />
              <span>
                <span className="block font-semibold text-ink group-hover:underline">Catering request form</span>
                <span className="text-ink-soft">Share your event details online</span>
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={business.phone.href} className="group flex items-center gap-4">
              <Phone size={20} className="text-gold-deep" />
              <span>
                <span className="block font-semibold text-ink group-hover:underline">{business.phone.display}</span>
                <span className="text-ink-soft">Speak with our team</span>
              </span>
            </a>
            <a href={`mailto:${business.email}?subject=Catering%20inquiry`} className="group flex min-w-0 items-center gap-4">
              <Mail size={20} className="shrink-0 text-gold-deep" />
              <span className="min-w-0">
                <span className="block font-semibold text-ink group-hover:underline">Email us</span>
                <span className="block break-all text-ink-soft">{business.email}</span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
