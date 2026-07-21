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
import HomeFAQ from '../components/home/HomeFAQ'
import BookYourSpace from '../components/home/BookYourSpace'

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
      <HomeFAQ />
      <BookYourSpace />
    </>
  )
}
