import { ButtonLink } from '../components/Button'
import { Photo } from '../components/Photo'
import { PageHero } from '../components/PageHero'
import { StarMotif } from '../components/icons'
import { Eyebrow, Ornament, RevealWords, revealDelay } from '../components/ui'
import { business } from '../data/business'

/** The restaurant's own stated values, as published on sofratg.com. */
const values = [
  {
    numeral: 'I',
    title: 'Authenticity',
    text: 'We uphold the true essence of Turkish cuisine through traditional recipes and genuine hospitality.',
  },
  {
    numeral: 'II',
    title: 'Quality',
    text: 'We source the finest ingredients and adhere to meticulous preparation methods.',
  },
  {
    numeral: 'III',
    title: 'Community',
    text: 'We foster a sense of belonging and togetherness.',
  },
]

export function StoryPage() {
  return (
    <>
      <PageHero
        slot="story-hero"
        eyebrow="Our Story"
        title="Sharing the flavors"
        titleAccent="and hospitality of Turkey."
        intro="A Turkish grill in the heart of Kent, Washington."
      />

      <section aria-labelledby="story-intro" className="bg-ivory py-[clamp(5rem,11vw,10rem)]">
        <div className="container-luxe">
          <div className="mx-auto max-w-5xl text-center">
            <StarMotif size={40} strokeWidth={1} className="mx-auto text-gold" />
            <RevealWords
              id="story-intro"
              text="Sofra Turkish Grill was founded with a passion for sharing the flavors and hospitality of Turkey with the world."
              italic={['flavors', 'hospitality']}
              className="mt-8 font-display text-display-md lg:text-[3.4rem] lg:leading-[1.08]"
            />
            <Ornament className="mx-auto mt-12 max-w-xs text-gold-deep" />
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-10 md:grid-cols-2 md:gap-16">
            <div data-reveal>
              <h2 className="eyebrow text-gold-deep">The name</h2>
              <p className="mt-4 text-lede text-ink">
                In Turkish, <em lang="tr">sofra</em> is the table — and the generous spread laid upon it for everyone
                to share. It is where family, friends and guests gather, and it is the spirit we bring to every meal.
              </p>
            </div>
            <div data-reveal style={revealDelay(120)}>
              <h2 className="eyebrow text-gold-deep">The food</h2>
              <p className="mt-4 text-lede text-ink">
                Experience the true essence of Turkey through our carefully crafted dishes, made with traditional
                recipes and premium ingredients.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Inside Sofra" className="bg-ivory pb-[clamp(5rem,11vw,10rem)]">
        <div className="container-luxe grid gap-6 md:grid-cols-12 md:gap-8">
          <div className="relative aspect-[4/5] md:col-span-5 md:mt-24">
            <Photo slot="story-kitchen" reveal sizes="(min-width: 768px) 40vw, 100vw" />
          </div>
          <div className="relative md:col-span-7">
            <div className="mask-arch relative aspect-[4/5]">
              <Photo slot="story-table" reveal revealDelay={200} sizes="(min-width: 768px) 55vw, 100vw" />
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="values-title"
        className="grain relative overflow-hidden bg-espresso py-[clamp(5rem,11vw,10rem)] text-ivory"
      >
        <div className="pattern-girih [--pattern-opacity:0.06]" />
        <div className="container-luxe relative">
          <Eyebrow tone="light">What guides us</Eyebrow>
          <RevealWords
            id="values-title"
            text="The values at the heart of our kitchen."
            italic={['heart']}
            className="mt-6 max-w-3xl font-display text-display-lg"
          />
          <ol className="mt-16 grid gap-12 border-t border-ivory/15 pt-12 md:grid-cols-3 md:gap-10">
            {values.map((value, i) => (
              <li key={value.title} data-reveal style={revealDelay(i * 120)}>
                <span className="font-display text-3xl italic text-gold">{value.numeral}</span>
                <h3 className="mt-4 font-display text-[2.2rem] leading-none">{value.title}</h3>
                <p className="mt-4 max-w-xs text-parchment">{value.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="story-cta" className="bg-cream py-[clamp(4.5rem,9vw,7.5rem)]">
        <div className="container-luxe flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>Join us</Eyebrow>
            <h2 id="story-cta" className="mt-5 font-display text-display-lg">
              Your seat at the <span className="italic">sofra</span> is waiting.
            </h2>
          </div>
          <div className="flex w-full flex-col gap-3 min-[480px]:w-auto min-[480px]:flex-row">
            <ButtonLink href={business.links.reservations} variant="espresso" icon="external">
              Reserve a Table
            </ButtonLink>
            <ButtonLink href="/menu" variant="outline-dark">
              Explore the Menu
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
