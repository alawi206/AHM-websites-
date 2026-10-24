import { TextLink } from '../../components/Button'
import { SignatureDishes } from '../../components/SignatureDishes'
import { Eyebrow, RevealWords, revealDelay } from '../../components/ui'

export function Signatures() {
  return (
    <section
      aria-labelledby="signatures-title"
      className="relative overflow-hidden bg-cream pb-[clamp(5rem,11vw,10rem)] pt-[clamp(6rem,12vw,11rem)]"
    >
      <div className="container-luxe">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow>Signature Dishes</Eyebrow>
            <RevealWords
              id="signatures-title"
              text="From our grill to your table."
              italic={['your', 'table.']}
              className="mt-6 font-display text-display-lg"
            />
          </div>
          <div className="md:col-span-5 md:pb-2" data-reveal style={revealDelay(150)}>
            <p className="max-w-sm text-ink-soft">
              A few of our favorites — kebabs and lamb chops from the grill, manti, and pide fresh from the oven.
            </p>
            <TextLink href="/menu" className="mt-5 text-espresso">
              View the full menu
            </TextLink>
          </div>
        </div>

        <div className="mt-14 md:mt-20">
          <SignatureDishes />
        </div>
      </div>
    </section>
  )
}
