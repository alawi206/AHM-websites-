import { CateringFeature } from '../sections/home/CateringFeature'
import { Experience } from '../sections/home/Experience'
import { Hero } from '../sections/home/Hero'
import { MenuIndex } from '../sections/home/MenuIndex'
import { Signatures } from '../sections/home/Signatures'
import { Testimonials } from '../sections/home/Testimonials'
import { Welcome } from '../sections/home/Welcome'
import { Visit } from '../sections/Visit'

export function HomePage() {
  return (
    <>
      <Hero />
      <Welcome />
      <Signatures />
      <Experience />
      <MenuIndex />
      <CateringFeature />
      <Testimonials />
      <Visit />
    </>
  )
}
