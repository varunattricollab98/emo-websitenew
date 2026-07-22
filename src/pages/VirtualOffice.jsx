import ExploreSpaces from '../components/virtual-office/ExploreSpaces'
import CitySpaceCounts from '../components/virtual-office/CitySpaceCounts'
import GoogleReviews from '../components/virtual-office/GoogleReviews'
import VOPricing from '../components/virtual-office/VOPricing'
import KycDocs from '../components/virtual-office/KycDocs'
import ClientsStrip from '../components/virtual-office/ClientsStrip'
import TrustBar from '../components/home/TrustBar'
import HomeFAQ from '../components/home/HomeFAQ'
import BookYourSpace from '../components/home/BookYourSpace'

export default function VirtualOffice() {
  return (
    <>
      {/* Hero with city search + spaces grid (default: Bangalore) */}
      <ExploreSpaces />

      {/* Auto-rolling trusted-by brands */}
      <TrustBar />

      {/* Space counts per city */}
      <CitySpaceCounts />

      {/* Client reviews */}
      <GoogleReviews />

      {/* Plans & pricing (Business Reg · GST · Mailing · Dedicated Desk) */}
      <VOPricing />

      {/* KYC documents by entity type */}
      <KycDocs />

      {/* 5,000+ clients strip */}
      <ClientsStrip />

      {/* FAQ */}
      <HomeFAQ />

      {/* Contact / callback form */}
      <BookYourSpace />
    </>
  )
}
