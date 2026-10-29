import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { business, reputation } from '../../content/site'
import { heroVideo, shopPhotos } from '../../content/media'
import { HexLights } from '../hex/HexLights'
import { BookLink } from '../ui/BookLink'
import { RevealLines } from '../ui/Reveal'
import { Picture, Stars } from '../ui/primitives'

const EASE = [0.16, 1, 0.3, 1] as const

function Backdrop() {
  if (heroVideo) {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={shopPhotos.hero?.img.src}
        aria-hidden="true"
      >
        <source src={heroVideo.src} type={heroVideo.type} />
      </video>
    )
  }
  if (shopPhotos.hero) {
    return (
      <Picture
        picture={shopPhotos.hero}
        alt=""
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0"
        imgClassName="h-full w-full object-cover animate-[kenburns_24s_ease-out_both]"
      />
    )
  }
  return <HexLights mode="tunnel" interactive powerOn />
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.06])

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Madrid Cutz"
      className="relative isolate flex h-svh min-h-[640px] flex-col justify-end overflow-hidden md:min-h-[720px]"
    >
      <motion.div className="absolute inset-0 -z-10" style={{ scale: backdropScale }}>
        <Backdrop />
      </motion.div>

      {/* Legibility: deep floor fade + a soft pool of shadow behind the copy. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-[62%] bg-gradient-to-t from-ink via-ink/75 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_12%_92%,rgba(11,12,14,0.85),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-ink/85 via-ink/40 to-transparent"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-[1600px] px-5 pb-28 sm:pb-12 md:px-10 md:pb-14"
      >
        <motion.div
          className="mb-6 inline-flex items-center gap-3 rounded-full border border-line bg-ink/40 py-2 pr-4 pl-3 backdrop-blur-md md:mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
        >
          <Stars size="size-3" />
          <span className="font-mono text-[0.6875rem] tracking-wide text-bone">
            {reputation.rating.toFixed(1)} on {reputation.source}
          </span>
          <span aria-hidden="true" className="h-3 w-px bg-line-strong" />
          <span className="font-mono text-[0.6875rem] tracking-wide text-silver">{reputation.reviewCountDisplay} reviews</span>
        </motion.div>

        <RevealLines
          as="h1"
          immediate
          delay={0.65}
          stagger={0.1}
          label="Precision in every cut."
          className="display text-[15.5vw] leading-[0.86] [font-stretch:100%] xs:text-[15vw] sm:text-[11.5vw] sm:[font-stretch:112%] lg:text-[9.4vw] 2xl:text-[9.25rem]"
          lines={[
            'Precision',
            <>
              <span className="serif-accent mr-[0.12em] text-[0.92em] text-champagne-soft">in every</span>
              cut.
            </>,
          ]}
        />

        <div className="mt-8 grid grid-cols-1 items-end gap-8 md:mt-10 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 1.05 }}
          >
            <p className="max-w-md text-base leading-relaxed text-silver text-pretty md:text-lg">
              Sharp fades. Clean lines. Unmatched attention to detail. Experience Madrid Cutz in Auburn, Washington.
            </p>
            <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:items-center sm:gap-4">
              <BookLink placement="hero" size="lg">
                Book your cut
              </BookLink>
              <a
                href="#work"
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-full border border-line-strong bg-ink/20 px-7 text-[0.8125rem] font-semibold tracking-[0.16em] text-bone uppercase backdrop-blur-sm transition-colors duration-500 hover:border-bone/60"
              >
                Explore our work
                <ArrowDown
                  className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5"
                  strokeWidth={1.5}
                />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hidden items-end justify-end gap-10 lg:col-span-6 lg:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.4 }}
          >
            <address className="text-right font-mono text-[0.6875rem] leading-relaxed tracking-[0.14em] text-silver not-italic uppercase">
              {business.address.street}
              <br />
              {business.address.unit} · {business.address.city}, {business.address.state}
            </address>
            <a
              href="#trust"
              className="group flex flex-col items-center gap-3 text-silver"
              aria-label="Scroll to the next section"
            >
              <span className="eyebrow [writing-mode:vertical-rl]">Scroll</span>
              <span className="relative block h-14 w-px overflow-hidden bg-line-strong">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.4s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-bone" />
              </span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
