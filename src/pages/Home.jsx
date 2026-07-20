import Hero from '../components/home/Hero'
import TrustBar from '../components/home/TrustBar'
import SolutionsGrid from '../components/home/SolutionsGrid'
import StatsBand from '../components/home/StatsBand'
import WhyChooseUs from '../components/home/WhyChooseUs'
import HowItWorks from '../components/home/HowItWorks'
import PopularCities from '../components/home/PopularCities'
import Comparison from '../components/home/Comparison'
import Testimonials from '../components/home/Testimonials'
import HomeFAQ from '../components/home/HomeFAQ'
import CTABand from '../components/ui/CTABand'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <SolutionsGrid />
      <StatsBand />
      <WhyChooseUs />
      <HowItWorks />
      <PopularCities />
      <Comparison />
      <Testimonials />
      <HomeFAQ />
      <CTABand />
    </>
  )
}
