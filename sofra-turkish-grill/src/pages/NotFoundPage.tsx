import { ButtonLink } from '../components/Button'
import { StarMotif } from '../components/icons'

export function NotFoundPage() {
  return (
    <section className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-espresso text-ivory">
      <div className="pattern-girih [--pattern-opacity:0.07]" />
      <div className="container-luxe relative py-32 text-center">
        <StarMotif size={56} strokeWidth={1} className="mx-auto text-gold" />
        <p className="eyebrow mt-8 text-gold">Page not found</p>
        <h1 className="mx-auto mt-5 max-w-3xl font-display text-display-xl">
          This table <span className="italic text-gold-light">isn’t set.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-parchment">
          The page you’re looking for has moved or no longer exists. Let us show you to your seat.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 min-[480px]:flex-row">
          <ButtonLink href="/" variant="gold">
            Back to Home
          </ButtonLink>
          <ButtonLink href="/menu" variant="outline-light">
            View the Menu
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
