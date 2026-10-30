import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import ceilingWide from '../../assets/art/ceiling-wide.jpg?w=900;1600;2400&format=avif;webp&as=picture'
import { reputation } from '../../content/site'
import { BookLink } from '../ui/BookLink'
import { Reveal, RevealLines } from '../ui/Reveal'
import { BrandLogo } from '../ui/BrandLogo'
import { Eyebrow, Picture, Stars } from '../ui/primitives'

export function FinalCta() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-10%', '10%'])

  return (
    <section ref={ref} id="book" aria-labelledby="book-title" className="relative isolate overflow-hidden py-32 md:py-48">
      <motion.div aria-hidden="true" className="absolute inset-[-12%_0] -z-10" style={{ y }}>
        <Picture
          picture={ceilingWide}
          alt=""
          sizes="100vw"
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover opacity-55"
        />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink/55 to-ink" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_50%_55%,rgba(11,12,14,0.75),transparent_80%)]"
      />

      <div className="mx-auto flex max-w-[1600px] flex-col items-center px-5 text-center md:px-10">
        <Reveal y={20} className="mb-10 w-28 md:w-36">
          <BrandLogo sizes="150px" shine glow alt="Madrid Cutz" />
        </Reveal>
        <Reveal>
          <Eyebrow index="08">Book</Eyebrow>
        </Reveal>
        <RevealLines
          id="book-title"
          lines={[
            'Your next',
            <>
              great <span className="gold-text">cut</span>
            </>,
            'starts here.',
          ]}
          label="Your next great cut starts here."
          className="display mt-8 text-[12vw] leading-[0.92] sm:text-8xl lg:text-[7.5rem] xl:text-[8.5rem]"
        />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-md text-base leading-relaxed text-silver md:text-lg">
            Find your barber. Lock in your appointment. Leave looking your best.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-12 w-full sm:w-auto">
          <BookLink placement="final-cta" size="xl" className="w-full sm:w-auto">
            Book now on Booksy
          </BookLink>
        </Reveal>
        <Reveal delay={0.4} className="mt-8 flex items-center gap-3">
          <Stars size="size-3" />
          <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-silver">
            {reputation.rating.toFixed(1)} on {reputation.source} · {reputation.reviewCountDisplay} reviews
          </span>
        </Reveal>
      </div>
    </section>
  )
}
