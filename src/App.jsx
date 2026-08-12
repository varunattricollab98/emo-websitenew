import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LeadModalProvider } from './context/LeadModalContext'
import { BookingModalProvider } from './context/BookingModalContext'
import { SpacesProvider } from './context/SpacesContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/layout/WhatsAppButton'
import ScrollToTop from './components/layout/ScrollToTop'
import AutoLeadPopup from './components/layout/AutoLeadPopup'
import ErrorBoundary from './components/layout/ErrorBoundary'
import SchemaScript from './components/seo/SchemaScript'
import { organizationSchema, webSiteSchema } from './components/seo/schemas'

// Home is eager so the landing page paints instantly (no chunk round-trip).
import Home from './pages/Home'

// Every other route is lazy-loaded → tiny initial bundle, fast first paint.
const VirtualOffice = lazy(() => import('./pages/VirtualOffice'))
const Coworking = lazy(() => import('./pages/Coworking'))
const CoworkingDetail = lazy(() => import('./pages/CoworkingDetail'))
const MeetingRooms = lazy(() => import('./pages/MeetingRooms'))
const CAServices = lazy(() => import('./pages/CAServices'))
const Pricing = lazy(() => import('./pages/Pricing'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const ListYourSpace = lazy(() => import('./pages/ListYourSpace'))
const CityTemplate = lazy(() => import('./pages/CityTemplate'))
const SpaceDetail = lazy(() => import('./pages/SpaceDetail'))
const SpaceOrService = lazy(() => import('./pages/SpaceOrService'))
const CityOrSpace = lazy(() => import('./pages/CityOrSpace'))
const ServiceLanding = lazy(() => import('./pages/ServiceLanding'))
const StateTemplate = lazy(() => import('./pages/StateTemplate'))
const VODispatcher = lazy(() => import('./pages/VODispatcher'))
const Faq = lazy(() => import('./pages/Faq'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Careers = lazy(() => import('./pages/Careers'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms = lazy(() => import('./pages/Terms'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'))
const Disclaimer = lazy(() => import('./pages/Disclaimer'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Admin pages (internal-only, not in sitemap or prerender)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'))
const AdminBlogEditor = lazy(() => import('./pages/admin/AdminBlogEditor'))
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles'))
const AdminArticleEditor = lazy(() => import('./pages/admin/AdminArticleEditor'))
const AdminJobs = lazy(() => import('./pages/admin/AdminJobs'))
const AdminJobEditor = lazy(() => import('./pages/admin/AdminJobEditor'))
const AdminPages = lazy(() => import('./pages/admin/AdminPages'))
const AdminPageEditor = lazy(() => import('./pages/admin/AdminPageEditor'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminUserEditor = lazy(() => import('./pages/admin/AdminUserEditor'))

// Lightweight fallback while a route chunk loads (no layout shift).
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary" />
    </div>
  )
}

export default function App() {
  return (
    <SpacesProvider>
    <LeadModalProvider>
      <BookingModalProvider>
        <ScrollToTop />
        <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Admin routes (no navbar/footer, internal-only) */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/blog/new" element={<AdminBlogEditor />} />
            <Route path="/admin/blog/edit/:slug" element={<AdminBlogEditor />} />
            <Route path="/admin/articles" element={<AdminArticles />} />
            <Route path="/admin/articles/new" element={<AdminArticleEditor />} />
            <Route path="/admin/articles/edit/:id" element={<AdminArticleEditor />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/jobs/new" element={<AdminJobEditor />} />
            <Route path="/admin/jobs/edit/:id" element={<AdminJobEditor />} />
            <Route path="/admin/pages" element={<AdminPages />} />
            <Route path="/admin/pages/new" element={<AdminPageEditor />} />
            <Route path="/admin/pages/edit/:slug" element={<AdminPageEditor />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/new" element={<AdminUserEditor />} />
            <Route path="/admin/users/edit/:id" element={<AdminUserEditor />} />

            {/* Public site routes with full layout */}
            <Route path="*" element={<SiteLayout />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </BookingModalProvider>
    </LeadModalProvider>
    </SpacesProvider>
  )
}

/** Main site layout with Navbar, Footer, and all public routes */
function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Opens the lead modal at 25% scroll depth or on exit intent */}
      <AutoLeadPopup />
      <SchemaScript schemas={[organizationSchema(), webSiteSchema()]} />
      <Navbar />
      {/* min-w-0: as a column flex item, main's width would otherwise be
          floored at its min-content size, so any non-wrapping row inside
          a page pushes the document wider than the screen. */}
      <main className="min-w-0 flex-1 pt-16 lg:pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/virtual-office" element={<VirtualOffice />} />
          {/* New consistent URL structure: /virtual-office/{state}/{city}/{space|service} */}
          <Route path="/virtual-office/:first/:second/:third" element={<VODispatcher />} />
          <Route path="/virtual-office/:first/:second" element={<VODispatcher />} />
          <Route path="/virtual-office/:first" element={<VODispatcher />} />
          {/* Legacy /space/ URLs still work (backward compatible) */}
          <Route path="/space/:city/:space" element={<SpaceOrService />} />
          <Route path="/space/:state/:city/:space" element={<SpaceOrService />} />
          <Route path="/space/:city/:locality/:service" element={<ServiceLanding />} />
          <Route path="/coworking" element={<Coworking />} />
          <Route path="/coworking/:city/:space" element={<CoworkingDetail />} />
          <Route path="/meeting-rooms" element={<MeetingRooms />} />
          <Route path="/ca-services" element={<CAServices />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/list-your-space" element={<ListYourSpace />} />
          <Route path="/careers" element={<Careers />} />
          {/* Blog listing must come before the :slug route */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
