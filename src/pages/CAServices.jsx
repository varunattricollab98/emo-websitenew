import CAServiceHero from '../components/ca-services/CAServiceHero'
import CAServiceFinder from '../components/ca-services/CAServiceFinder'
import CAPackages from '../components/ca-services/CAPackages'
import CAProcess from '../components/ca-services/CAProcess'
import CAFaq from '../components/ca-services/CAFaq'
import CACallback from '../components/ca-services/CACallback'
import TrustBar from '../components/home/TrustBar'
import ClientsStrip from '../components/virtual-office/ClientsStrip'
import GoogleReviews from '../components/virtual-office/GoogleReviews'

export default function CAServices() {
  return (
    <>
      {/* Hero: 1,200+ accounts highlight + searchable service finder + results grid */}
      <CAServiceHero />

      {/* Auto-rolling trusted-by brands */}
      <TrustBar />

      {/* Tabbed service finder by category */}
      <CAServiceFinder />

      {/* Ongoing monthly compliance packages */}
      <CAPackages />

      {/* Simple 4-step process */}
      <CAProcess />

      {/* 5,000+ clients / stats strip */}
      <ClientsStrip />

      {/* Client reviews */}
      <GoogleReviews />

      {/* CA-specific FAQ */}
      <CAFaq />

      {/* Contact / callback form */}
      <CACallback />
    </>
  )
}
