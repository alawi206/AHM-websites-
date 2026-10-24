import { ButtonLink, TextLink } from '../../components/Button'
import { Photo } from '../../components/Photo'
import { StarMotif } from '../../components/icons'
import { Eyebrow, RevealWords, revealDelay } from '../../components/ui'
import { business } from '../../data/business'

export const occasions = ['Corporate events', 'Family celebrations', 'Birthdays', 'Private gatherings']

export function CateringFeature() {
  return (
    <section
      aria-labelledby="catering-title"
      className="grain relative overflow-hidden bg-olive py-[clamp(5rem,11vw,10rem)] text-ivory"
    >
      <div className="pattern-girih [--pattern-opacity:0.06]" />
      <div className="container-luxe relative grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="relative order-2 lg:order-1 lg:col-span-6">
          <div className="relative aspect-[4/5] w-[86%] sm:w-[72%] lg:w-[82%]">
            <Photo slot="catering-main" reveal labelPosition="center" sizes="(min-width: 1024px) 40vw, 80vw" />
          </div>
          <div className="absolute -bottom-8 right-0 w-[48%] border-[8px] border-olive sm:w-[40%] sm:border-[10px] lg:right-2">
            <div className="relative aspect-[4/5]">
              <Photo slot="catering-detail" reveal revealDelay={250} sizes="(min-width: 1024px) 20vw, 44vw" />
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
          <Eyebrow tone="olive">Catering &amp; Private Events</Eyebrow>
          <RevealWords
            id="catering-title"
            text="Let us set the table for your occasion."
            italic={['occasion.']}
            className="mt-6 font-display text-display-lg"
          />
          <p className="mt-7 max-w-md text-lede text-parchment" data-reveal style={revealDelay(120)}>
            From the office to the family table, Sofra brings Turkish hospitality to your gathering. Share your date and
            guest count, and our catering team will help plan the menu and prepare a quote.
          </p>

          <ul className="mt-9 grid grid-cols-1 gap-x-8 gap-y-3 border-y border-ivory/15 py-6 min-[420px]:grid-cols-2" data-reveal style={revealDelay(200)}>
            {occasions.map((occasion) => (
              <li key={occasion} className="flex items-center gap-3 text-[0.95rem]">
                <StarMotif size={14} strokeWidth={2} className="shrink-0 text-gold" />
                {occasion}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-center" data-reveal style={revealDelay(260)}>
            <ButtonLink href={business.links.catering} variant="gold" icon="external">
              Plan Your Event
            </ButtonLink>
            <TextLink href="/catering" className="text-ivory min-[480px]:ml-3">
              Catering &amp; groups
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  )
}
