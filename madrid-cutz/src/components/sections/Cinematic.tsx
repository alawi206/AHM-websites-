import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { HexLights } from '../hex/HexLights'
import { HexMark } from '../ui/primitives'

/** Full-bleed pause between reviews and the visit info: the ceiling, straight up. */
export function Cinematic() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0.12, 0.5], reduce ? [1, 1] : [0.82, 1])
  const tracking = useTransform(scrollYProgress, [0.12, 0.5], reduce ? ['-0.025em', '-0.025em'] : ['0.1em', '-0.025em'])
  const secondY = useTransform(scrollYProgress, [0.25, 0.55], reduce ? ['0%', '0%'] : ['40%', '0%'])
  const secondOpacity = useTransform(scrollYProgress, [0.25, 0.5], reduce ? [1, 1] : [0, 1])
  const veil = useTransform(scrollYProgress, [0.75, 1], [0, 1])

  return (
    <section ref={ref} aria-labelledby="cinematic-title" className="relative h-[150svh] bg-ink">
      <div className="sticky top-0 h-svh overflow-hidden">
        <HexLights mode="overhead" exposure={1.1} />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_50%,rgba(11,12,14,0.82),rgba(11,12,14,0.25)_70%,rgba(11,12,14,0.6))]"
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

        <div className="absolute inset-0 grid place-items-center px-5 text-center">
          <motion.h2
            id="cinematic-title"
            style={{ scale }}
            className="display text-[12.5vw] leading-[0.88] [font-stretch:100%] md:text-[9.5vw] md:[font-stretch:118%] 2xl:text-[9rem]"
          >
            <motion.span className="block" style={{ letterSpacing: tracking }}>
              Look sharp.
            </motion.span>
            <motion.span className="block" style={{ y: secondY, opacity: secondOpacity }}>
              <span className="gold-text">Feel</span> different.
            </motion.span>
          </motion.h2>
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1600px] items-center justify-between px-5 pb-8 md:px-10 md:pb-10">
          <p className="eyebrow flex items-center gap-3 text-silver">
            <HexMark className="size-4 text-bone" /> Madrid Cutz
          </p>
          <p className="eyebrow text-silver">Auburn, Washington</p>
        </div>

        <motion.div aria-hidden="true" style={{ opacity: veil }} className="pointer-events-none absolute inset-0 bg-ink" />
      </div>
    </section>
  )
}
