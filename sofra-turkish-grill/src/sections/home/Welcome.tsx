import { TextLink } from '../../components/Button'
import { Photo } from '../../components/Photo'
import { StarMotif } from '../../components/icons'
import { Eyebrow, RevealWords, revealDelay } from '../../components/ui'

export function Welcome() {
  return (
    <section id="welcome" aria-labelledby="welcome-title" className="relative overflow-hidden bg-ivory py-[clamp(5rem,11vw,10rem)]">
      <div className="container-luxe grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5 lg:pr-4">
          <Eyebrow>Welcome to Sofra</Eyebrow>
          <RevealWords
            as="h2"
            id="welcome-title"
            text="Gather around the table."
            italic={['table.']}
            className="mt-6 font-display text-display-lg"
          />
          <div className="mt-8 max-w-md space-y-5" data-reveal style={revealDelay(150)}>
            <p className="text-lede text-ink">
              Sofra Turkish Grill was founded with a passion for sharing the flavors and hospitality of Turkey with the
              world.
            </p>
            <p className="text-ink-soft">
              Experience the true essence of Turkey through our carefully crafted dishes, made with traditional recipes
              and premium ingredients.
            </p>
          </div>

          <figure
            className="mt-10 flex max-w-md gap-5 border-t border-sand pt-7"
            data-reveal
            style={revealDelay(250)}
          >
            <span lang="tr" className="font-display text-[2.4rem] italic leading-none text-gold-deep">
              sofra
            </span>
            <figcaption className="text-sm leading-relaxed text-ink-soft">
              In Turkish, <em lang="tr">sofra</em> is the table — and the generous spread laid upon it for everyone to
              share.
            </figcaption>
          </figure>

          <div className="mt-9" data-reveal style={revealDelay(320)}>
            <TextLink href="/our-story" className="text-espresso">
              Read our story
            </TextLink>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <div className="relative ml-auto w-[84%] sm:w-[74%] lg:w-[78%]">
            {/* Gold arch outline, offset behind the photograph. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 400 500"
              preserveAspectRatio="none"
              className="absolute -left-4 top-4 h-full w-full text-gold sm:-left-6 sm:top-6"
            >
              <path
                d="M0 500V196C0 98 86 40 200 0c114 40 200 98 200 196v304Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="mask-arch relative aspect-[4/5]">
              <Photo slot="welcome-main" reveal labelPosition="bottom-right" sizes="(min-width: 1024px) 44vw, (min-width: 640px) 70vw, 84vw" />
            </div>
          </div>

          <div className="absolute -bottom-10 left-0 w-[46%] border-[8px] border-ivory shadow-[0_30px_60px_-30px_rgb(36_27_22/0.45)] sm:w-[38%] sm:border-[10px] lg:-bottom-12 lg:w-[40%]">
            <div className="relative aspect-square">
              <Photo slot="welcome-detail" reveal revealDelay={250} sizes="(min-width: 1024px) 22vw, 42vw" />
            </div>
          </div>

          <StarMotif
            size={64}
            strokeWidth={0.6}
            className="absolute -top-6 right-0 hidden text-gold sm:block lg:-right-4"
          />
          <p
            aria-hidden="true"
            className="eyebrow absolute -right-1 bottom-[18%] hidden origin-bottom-right -rotate-90 text-[0.62rem] text-ink-soft lg:block xl:-right-8"
          >
            Kent · Washington
          </p>
        </div>
      </div>
    </section>
  )
}
