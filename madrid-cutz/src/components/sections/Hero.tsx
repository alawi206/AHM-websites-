import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { business, reputation } from '../../content/site'
import { heroVideo, shopPhotos } from '../../content/media'
import { HexLights } from '../hex/HexLights'
import { BookLink } from '../ui/BookLink'
import { BrandLogo } from '../ui/BrandLogo'
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
        className="absolute inset-0"
        imgClassName="h-full w-full object-cover animate-[kenburns_24s_ease-out_both]"
      />
    )
  }
  return <HexLights mode="tunnel" interactive powerOn />
}

/** Subtle 3D tilt of the emblem following the pointer (fine pointers only). */
function useEmblemTilt(enabled: boolean) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateY = useSpring(x, { stiffness: 50, damping: 16 })
  const rotateX = useSpring(y, { stiffness: 50, damping: 16 })
  useEffect(() => {
    if (!enabled || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 12)
      y.set((e.clientY / window.innerHeight - 0.5) * -9)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, x, y])
  return { rotateX, rotateY }
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -110])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08])
  const tilt = useEmblemTilt(!reduce)

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Madrid Cutz"
      className="relative isolate flex h-svh min-h-[640px] flex-col items-center justify-center overflow-hidden"
    >
      <motion.div className="absolute inset-0 -z-10" style={{ scale: backdropScale }}>
        <Backdrop />
      </motion.div>

      {/* Settle the tunnel behind the emblem, then fade into the page. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(42%_38%_at_50%_40%,rgba(11,12,14,0.55),transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-[55%] bg-gradient-to-t from-ink via-ink/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-ink/85 via-ink/40 to-transparent"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative flex w-full max-w-5xl flex-col items-center px-5 pt-20 pb-20 text-center sm:pb-16"
      >
        <motion.div
          className="w-[min(62vw,40svh,430px)] [@media(max-height:780px)]:w-[min(62vw,34svh,430px)]"
          initial={{ opacity: 0, scale: 0.88, filter: 'blur(14px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
          style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 1100 }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -7, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BrandLogo
              priority
              shine
              glow
              sizes="(min-width: 768px) 430px, 62vw"
              alt="Madrid Cutz — barbershop in Auburn, Washington"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-5 inline-flex items-center gap-3 rounded-full border border-line-gold bg-ink/50 py-2 pr-4 pl-3 backdrop-blur-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.85 }}
        >
          <Stars size="size-3" />
          <span className="font-mono text-[0.6875rem] tracking-wide text-bone">
            {reputation.rating.toFixed(1)} on {reputation.source}
          </span>
          <span aria-hidden="true" className="h-3 w-px bg-line-strong" />
          <span className="font-mono text-[0.6875rem] tracking-wide text-silver">{reputation.reviewCountDisplay} reviews</span>
        </motion.div>

        {/* Set like the logo: chrome serif capitals over tracked gold caps. */}
        <h1 aria-label="Precision in every cut." className="mt-5 flex flex-col items-center">
          <span aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="display chrome-text block text-[14vw] sm:text-[9vw] lg:text-[6.2vw] 2xl:text-[6.5rem] [@media(max-height:780px)]:lg:text-[5.4vw]"
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.95 }}
            >
              Precision
            </motion.span>
          </span>
          <motion.span
            aria-hidden="true"
            className="mt-2 flex items-center gap-4 sm:mt-3"
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 1.4, ease: EASE, delay: 1.2 }}
          >
            <span className="gold-hairline w-10 sm:w-16" />
            <span className="label text-xs text-gold sm:text-sm">In every cut</span>
            <span className="gold-hairline w-10 sm:w-16" />
          </motion.span>
        </h1>

        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 1.35 }}
        >
          <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-silver text-pretty sm:text-base md:max-w-lg md:text-lg [@media(max-height:780px)]:hidden">
            Sharp fades. Clean lines. Unmatched attention to detail. Experience Madrid Cutz in Auburn, Washington.
          </p>
          <div className="mt-7 flex w-full flex-col gap-3 xs:w-auto xs:flex-row xs:items-center sm:gap-4">
            <BookLink placement="hero" size="lg">
              Book your cut
            </BookLink>
            <a
              href="#work"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-full border border-line-strong bg-ink/30 px-7 text-[0.8125rem] font-semibold tracking-[0.16em] text-bone uppercase backdrop-blur-sm transition-colors duration-500 hover:border-gold/60 hover:text-gold-soft"
            >
              Explore our work
              <ArrowDown
                className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5"
                strokeWidth={1.5}
              />
            </a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-x-0 bottom-0 mx-auto hidden max-w-[1600px] items-end justify-between px-10 pb-8 lg:flex [@media(max-height:780px)]:lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.7 }}
      >
        <address className="eyebrow leading-loose text-silver not-italic">
          {business.address.street} · {business.address.unit}
          <br />
          {business.address.city}, {business.address.state}
        </address>
        <a href="#trust" className="flex flex-col items-center gap-3 text-silver" aria-label="Scroll to the next section">
          <span className="eyebrow">Scroll</span>
          <span className="relative block h-12 w-px overflow-hidden bg-line-strong">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.4s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-gold" />
          </span>
        </a>
      </motion.div>
    </section>
  )
}
