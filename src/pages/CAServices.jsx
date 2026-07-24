import { useState } from 'react'
import CAServiceHero from '../components/ca-services/CAServiceHero'
import ComplianceServices from '../components/ca-services/ComplianceServices'
import CAServicesGrid from '../components/ca-services/CAServicesGrid'
import CAServiceFinder from '../components/ca-services/CAServiceFinder'
import CAPackages from '../components/ca-services/CAPackages'
import CAProcess from '../components/ca-services/CAProcess'
import CAFaq from '../components/ca-services/CAFaq'
import CACallback from '../components/ca-services/CACallback'
import TrustBar from '../components/home/TrustBar'
import ClientsStrip from '../components/virtual-office/ClientsStrip'
import GoogleReviews from '../components/virtual-office/GoogleReviews'

export default function CAServices() {
  // shared search state between the hero search box and the results grid
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('')

  return (
    <>
      {/* Hero: 1,200+ accounts highlight + searchable service finder */}
      <CAServiceHero query={query} setQuery={setQuery} cat={cat} setCat={setCat} />

      {/* Flagship CA services — "Get started" opens the contact popup (no routing) */}
      <ComplianceServices />

      {/* Tabbed service finder by category (moved up) */}
      <CAServiceFinder />

      {/* Auto-rolling trusted-by brands */}
      <TrustBar />

      {/* Services results grid (driven by hero search) */}
      <CAServicesGrid query={query} cat={cat} />

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
