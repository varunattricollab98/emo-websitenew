import { Routes, Route } from 'react-router-dom'
import { LeadModalProvider } from './context/LeadModalContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/layout/WhatsAppButton'
import ScrollToTop from './components/layout/ScrollToTop'

import Home from './pages/Home'
import VirtualOffice from './pages/VirtualOffice'
import Coworking from './pages/Coworking'
import MeetingRooms from './pages/MeetingRooms'
import CAServices from './pages/CAServices'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Contact from './pages/Contact'
import ListYourSpace from './pages/ListYourSpace'
import CityTemplate from './pages/CityTemplate'
import Faq from './pages/Faq'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import RefundPolicy from './pages/RefundPolicy'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <LeadModalProvider>
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/virtual-office" element={<VirtualOffice />} />
          <Route path="/virtual-office/:city" element={<CityTemplate />} />
          <Route path="/coworking" element={<Coworking />} />
          <Route path="/meeting-rooms" element={<MeetingRooms />} />
          <Route path="/ca-services" element={<CAServices />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/list-your-space" element={<ListYourSpace />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
    </LeadModalProvider>
  )
}
