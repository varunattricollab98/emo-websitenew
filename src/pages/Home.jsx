import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSearch from '../components/home/HeroSearch'
import LovedLocations from '../components/home/LovedLocations'
import TrustBar from '../components/home/TrustBar'
import WhyChooseHome from '../components/home/WhyChooseHome'
import ServicesProvided from '../components/home/ServicesProvided'
import TopCoworking from '../components/home/TopCoworking'
import ThreeStepSetup from '../components/home/ThreeStepSetup'
import ChooseByRequirement from '../components/home/ChooseByRequirement'
import TransparentPricing from '../components/home/TransparentPricing'
import WhyVirtualOffice from '../components/home/WhyVirtualOffice'
import MarketplacesGST from '../components/home/MarketplacesGST'
import HomeFAQ from '../components/home/HomeFAQ'
import BookYourSpace from '../components/home/BookYourSpace'
import SchemaScript from '../components/seo/SchemaScript'
import { localBusinessSchema, webPageSchema } from '../components/seo/schemas'

export default function Home() {
  const { hash } = useLocation()

  // Scroll to an in-page section (e.g. /#locations) when a hash is present.
  useEffect(() => {
    if (!hash) return
    const el = document.querySelector(hash)
    if (el) {
      // Defer to ensure the section has rendered before scrolling.
      requestAnimationFrame(() =>
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      )
    }
  }, [hash])

  return (
    <>
      <SchemaScript schemas={[
        localBusinessSchema('India', 'India', '₹799 - ₹1,999'),
        webPageSchema({
          title: 'EaseMyOffice — Virtual Offices & Business Compliance in India',
          description: 'India\'s most trusted platform for virtual offices, coworking spaces, meeting rooms and business compliance. GST & company registration made simple.',
          url: '/',
        }),
      ]} />
      <HeroSearch />
      <LovedLocations />
      <TrustBar />
      <WhyChooseHome />
      <ServicesProvided />
      <TopCoworking />
      <ThreeStepSetup />
      <ChooseByRequirement />
      <TransparentPricing />
      <WhyVirtualOffice />
      <MarketplacesGST />
      <HomeFAQ />
      <BookYourSpace />
    </>
  )
}
