import { useEffect, lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSearch from '../components/home/HeroSearch'
import LovedLocations from '../components/home/LovedLocations'
import TrustBar from '../components/home/TrustBar'
import WhyChooseHome from '../components/home/WhyChooseHome'
import ServicesProvided from '../components/home/ServicesProvided'
import TopCoworking from '../components/home/TopCoworking'
import SchemaScript from '../components/seo/SchemaScript'
import { localBusinessSchema, webPageSchema } from '../components/seo/schemas'

// Below-fold sections, lazy loaded for faster initial paint
const ThreeStepSetup = lazy(() => import('../components/home/ThreeStepSetup'))
const ChooseByRequirement = lazy(() => import('../components/home/ChooseByRequirement'))
const TransparentPricing = lazy(() => import('../components/home/TransparentPricing'))
const WhyVirtualOffice = lazy(() => import('../components/home/WhyVirtualOffice'))
const MarketplacesGST = lazy(() => import('../components/home/MarketplacesGST'))
const HomeFAQ = lazy(() => import('../components/home/HomeFAQ'))
const BookYourSpace = lazy(() => import('../components/home/BookYourSpace'))

export default function Home() {
  const { hash } = useLocation()

  // Scroll to an in-page section (e.g. /#locations) when a hash is present.
  //
  // The hash is NOT always a section id. Supabase sends auth failures back to
  // the Site URL as "#error=access_denied&error_code=otp_expired&…", which is
  // not a valid CSS selector — passing it to querySelector threw a SyntaxError
  // and took the whole homepage down with it. getElementById does no selector
  // parsing, so an unrecognised fragment simply matches nothing.
  useEffect(() => {
    const id = hash.replace(/^#/, '')
    if (!id) return
    const el = document.getElementById(id)
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
          title: 'EaseMyOffice, Virtual Offices & Business Compliance in India',
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
      <Suspense fallback={null}>
        <ThreeStepSetup />
        <ChooseByRequirement />
        <TransparentPricing />
        <WhyVirtualOffice />
        <MarketplacesGST />
        <HomeFAQ />
        <BookYourSpace />
      </Suspense>
    </>
  )
}
