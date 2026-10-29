import { MotionConfig } from 'motion/react'
import { Footer } from './components/layout/Footer'
import { MobileBookBar } from './components/layout/MobileBookBar'
import { Nav } from './components/layout/Nav'
import { About } from './components/sections/About'
import { Barbers } from './components/sections/Barbers'
import { Cinematic } from './components/sections/Cinematic'
import { FinalCta } from './components/sections/FinalCta'
import { Gallery } from './components/sections/Gallery'
import { Hero } from './components/sections/Hero'
import { Reviews } from './components/sections/Reviews'
import { Services } from './components/sections/Services'
import { TrustStrip } from './components/sections/TrustStrip'
import { Visit } from './components/sections/Visit'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main id="main">
        <Hero />
        <TrustStrip />
        <About />
        <Services />
        <Gallery />
        <Barbers />
        <Reviews />
        <Cinematic />
        <Visit />
        <FinalCta />
      </main>
      <Footer />
      <MobileBookBar />
    </MotionConfig>
  )
}
