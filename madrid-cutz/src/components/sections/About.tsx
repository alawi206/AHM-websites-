import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import ceilingAngle from '../../assets/art/ceiling-angle.jpg?w=600;900;1300&format=avif;webp&as=picture'
import { shopPhotos } from '../../content/media'
import { reputation } from '../../content/site'
import { BookLink } from '../ui/BookLink'
import { Reveal, RevealLines } from '../ui/Reveal'
import { Eyebrow, HexMark, Picture, Stars } from '../ui/primitives'

const PRINCIPLES = [
  {
    title: 'Precision',
    text: 'Clean lines and seamless blends, checked from every angle before you leave the chair.',
  },
  {
    title: 'Craft',
    text: 'Clipper, scissor and razor work shaped to your hair and your head — never a one-size template.',
  },
  {
    title: 'Confidence',
    text: 'The goal is simple: you walk out looking sharp, and you feel it the rest of the week.',
  },
]

export function About() {
  const frameRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-7%', '7%'])

  const photo = shopPhotos.about
  const picture = photo ?? ceilingAngle

  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="mx-auto grid grid-cols-1 max-w-[1600px] items-start gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:sticky lg:top-28 lg:col-span-6">
          <motion.div
            ref={frameRef}
            className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-coal sm:aspect-[5/6] lg:aspect-[4/5]"
            initial={{ clipPath: 'inset(12% 8% 12% 8%)', opacity: 0.4 }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div className="absolute inset-[-8%_0]" style={{ y: imageY }}>
              <Picture
                picture={picture}
                alt={photo ? 'Inside Madrid Cutz barbershop in Auburn, WA' : ''}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="block h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/10" />
            <div className="absolute bottom-0 left-0 flex items-center gap-3 p-5 md:p-7">
              <HexMark className="size-5 text-bone" />
              <p className="eyebrow text-bone">Under the hexagon lights</p>
            </div>
          </motion.div>

          <Reveal
            delay={0.3}
            className="absolute -right-2 -bottom-8 hidden w-60 rounded-[3px] border border-line bg-coal/90 p-6 backdrop-blur-md sm:block lg:-right-10"
          >
            <Stars />
            <p className="display mt-4 text-5xl">{reputation.rating.toFixed(1)}</p>
            <p className="mt-2 text-sm leading-snug text-silver">
              Average rating across {reputation.reviewCountDisplay} reviews on {reputation.source}.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal>
            <Eyebrow index="02">The shop</Eyebrow>
          </Reveal>
          <RevealLines
            lines={[
              'More than',
              <>
                <span className="serif-accent text-[1.05em] text-champagne-soft">a</span> haircut.
              </>,
            ]}
            id="about-title"
            label="More than a haircut."
            className="display mt-6 text-[13vw] sm:text-7xl lg:text-[5.4vw] 2xl:text-[5.75rem]"
          />

          <Reveal delay={0.1} className="mt-8 space-y-5 text-base leading-relaxed text-silver text-pretty md:text-lg">
            <p>
              Walk into Madrid Cutz on Auburn Way North and the first thing you notice is the light — a ceiling of white hexagons
              over a row of black barber chairs. The second thing you notice is the work.
            </p>
            <p>
              Every cut is measured, blended and finished by hand. Fades that melt, lines that hold, beards shaped to your face.
              No shortcuts, no guesswork — just barbers who care how you look when you leave.
            </p>
          </Reveal>

          <ol className="mt-12 border-t border-line">
            {PRINCIPLES.map((p, i) => (
              <Reveal
                as="li"
                key={p.title}
                delay={0.1 + i * 0.08}
                y={16}
                className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-5"
              >
                <span className="font-mono text-xs text-champagne">0{i + 1}</span>
                <div>
                  <p className="font-display text-sm font-bold tracking-[0.14em] uppercase [font-stretch:115%]">{p.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-silver">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.2} className="mt-10">
            <BookLink placement="about" size="lg">
              Book appointment
            </BookLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
