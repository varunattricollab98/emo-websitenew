import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileCheck2,
  Landmark,
  Mailbox,
  Armchair,
  MapPin,
  Building2,
  ArrowRight,
  Check,
  ShieldCheck,
  Clock,
  BadgeCheck,
  MapPinned,
  FileText,
  KeyRound,
  Sparkles,
  Star,
  Phone,
} from 'lucide-react'
import SmartImage from '../components/ui/SmartImage'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import FaqAccordion from '../components/ui/FaqAccordion'
import ArticleBlocks from '../components/ui/ArticleBlocks'
import BlogArticleSection from '../components/ui/BlogArticleSection'
import StepsFlow from '../components/ui/StepsFlow'
import TrustBar from '../components/home/TrustBar'
import ClientsStrip from '../components/virtual-office/ClientsStrip'
import GoogleReviews from '../components/virtual-office/GoogleReviews'
import TalkToExpert from '../components/ui/TalkToExpert'
import SchemaScript from '../components/seo/SchemaScript'
import {
  webPageSchema,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from '../components/seo/schemas'
import {
  voCities,
  cityAliases,
  slugifySpace,
  spaceUrl,
  cityUrl,
} from '../data/spaces'
import { cities as pricedCities, getCityBySlug } from '../data/cities'
import { useSupabaseSpaces } from '../context/SpacesContext'
import { useBlogArticle } from '../hooks/useBlogArticle'
import { useRelatedResources } from '../hooks/useRelatedResources'
import { useMeta } from '../hooks/useMeta'
import {
  serviceLandings,
  serviceOrder,
  getServiceLanding,
  getServiceNational,
  serviceHubUrl,
  resolveServiceSlug,
  isServiceAlias,
} from '../data/serviceLandings'
import { useLeadModal } from '../context/LeadModalContext'

// City landmark/skyline images for the grid cards. These are iconic
// representations of each city (not the interior office photos from Supabase).
// Supabase featured_images are office interiors which don't represent the CITY.
const CITY_LANDMARK_IMAGES = {
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80', // India Gate
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80', // Gateway of India
  bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80', // Bangalore skyline
  gurgaon: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80', // Cyber City towers
  hyderabad: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', // Charminar area
  chennai: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80', // Chennai skyline
  pune: 'https://images.unsplash.com/photo-1572782252655-9c8771392601?auto=format&fit=crop&w=600&q=80', // Pune cityscape
  noida: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80', // Noida expressway towers
  kolkata: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=600&q=80', // Howrah Bridge
  ahmedabad: 'https://images.unsplash.com/photo-1627894006066-b45960f68dc0?auto=format&fit=crop&w=600&q=80', // Ahmedabad heritage
  jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80', // Hawa Mahal
  lucknow: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80', // Bara Imambara
  chandigarh: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=600&q=80', // Rock Garden / Capitol
  kochi: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80', // Chinese fishing nets
  indore: 'https://images.unsplash.com/photo-1623070573928-6dc24b111073?auto=format&fit=crop&w=600&q=80', // Rajwada palace
  bhopal: 'https://images.unsplash.com/photo-1609766418204-94aae0eceb68?auto=format&fit=crop&w=600&q=80', // Upper Lake
  coimbatore: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80', // city temple
  patna: 'https://images.unsplash.com/photo-1590766940554-634826f0635e?auto=format&fit=crop&w=600&q=80', // Golghar
  vadodara: 'https://images.unsplash.com/photo-1609766418204-94aae0eceb68?auto=format&fit=crop&w=600&q=80', // Laxmi Vilas palace
  guwahati: 'https://images.unsplash.com/photo-1574356225002-cf03c5aea1b0?auto=format&fit=crop&w=600&q=80', // Brahmaputra river
  jodhpur: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=600&q=80', // Blue city / Mehrangarh
  udaipur: 'https://images.unsplash.com/photo-1602301312001-e0e3d3f6e4e3?auto=format&fit=crop&w=600&q=80', // Lake Palace
  vizag: 'https://images.unsplash.com/photo-1583330632802-c29797e4b592?auto=format&fit=crop&w=600&q=80', // Vizag beach
  ranchi: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80', // Dassam Falls area
  jammu: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=600&q=80', // Vaishno Devi hills
  gangtok: 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=600&q=80', // Kanchenjunga view
  dharamshala: 'https://images.unsplash.com/photo-1587391723581-1a51b4c17dbb?auto=format&fit=crop&w=600&q=80', // Himalayan town
  aizawl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80', // Hill city
  agartala: 'https://images.unsplash.com/photo-1590766940554-634826f0635e?auto=format&fit=crop&w=600&q=80', // Ujjayanta Palace
  bhubaneswar: 'https://images.unsplash.com/photo-1590766940554-634826f0635e?auto=format&fit=crop&w=600&q=80', // Lingaraj Temple area
  panaji: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', // Goa beaches
  puducherry: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80', // French quarter
}

const DEFAULT_CITY_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' // modern skyline

const iconMap = { FileCheck2, Landmark, Mailbox, Armchair }

const steps = [
  {
    icon: MapPinned,
    title: 'Pick your city',
    desc: 'Tell us which city or state you need the address in.',
    chip: 'Every major city',
  },
  {
    icon: FileText,
    title: 'Upload documents',
    desc: 'Submit your KYC online, we verify everything upfront.',
    chip: '100% online',
  },
  {
    icon: KeyRound,
    title: 'Get activated',
    desc: 'Your address and documents are ready in 2–3 days.',
    chip: 'Ready in 2–3 days',
  },
]

/** Resolve a raw city slug to its canonical slug (gurugram → gurgaon). */
function canonicalCitySlug(raw) {
  if (!raw) return ''
  return (
    voCities.find((c) => c.slug === raw)?.slug ||
    voCities.find((c) => slugifySpace(c.name) === raw)?.slug ||
    voCities.find((c) => (cityAliases[c.slug] || []).includes(raw))?.slug ||
    raw
  )
}

/**
 * All-India service hub page: /virtual-office/{service}
 *
 * The city pages (/virtual-office/{state}/{city}/{service}) are templated per
 * city. This is the dedicated, city-agnostic version of the same service, it
 * ranks for the national keyword ("virtual office for GST registration") and
 * funnels visitors down to the right city page.
 *
 * Content comes from the `national` block in src/data/serviceLandings.js, so
 * it never duplicates the city copy. The long-form article at the bottom is
 * pulled from Supabase with NO city filter, meaning ONE `blog_articles` row
 * (page_type='service', service_slug='<slug>', city_slug NULL) serves this page.
 */
export default function ServiceHub() {
  const params = useParams()
  const rawService = (params.first || params.service || '').toLowerCase()
  const urlSlug = rawService
    .replace(/gstregistration/i, 'gst-registration')
    .replace(/businessregistration/i, 'business-registration')
    .replace(/companyregistration/i, 'company-registration')
    .replace(/mailingaddress/i, 'mailing-address')
    .replace(/deskplan/i, 'desk-plan')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  // Aliases (e.g. company-registration) collapse onto the canonical service so
  // both URLs render the same page, and the alias URL redirects below.
  const serviceSlug = resolveServiceSlug(urlSlug)

  const svc = getServiceLanding(serviceSlug)
  const nat = getServiceNational(serviceSlug)
  const { openLeadModal } = useLeadModal()
  const { rows } = useSupabaseSpaces()

  // Shared (city-agnostic) article: cityIsNull pins the lookup to the single
  // city_slug IS NULL row, so adding per-city service articles later can never
  // leak one of those onto this national page.
  const dbArticle = useBlogArticle({
    pageType: 'service',
    serviceSlug,
    cityIsNull: true,
  })

  // Fetch related resource links from Supabase (falls back to hardcoded if empty)
  const dbRelatedLinks = useRelatedResources({
    pageType: 'service-hub',
    serviceSlug,
  })

  useMeta({
    title: nat?.metaTitle || 'EaseMyOffice',
    description: nat?.metaDescription,
    path: serviceHubUrl(serviceSlug),
  })

  // ── Cities that actually have listings, aggregated from live Supabase data,
  //    with the static priced list as a fallback before/without Supabase. ──
  const liveCities = (() => {
    const agg = {}
    for (const r of rows || []) {
      const slug = canonicalCitySlug(slugifySpace(r.address_city))
      if (!slug) continue
      const entry = voCities.find((c) => c.slug === slug)
      const price = Number(r.pricing_monthly) || 899
      if (!agg[slug]) {
        agg[slug] = {
          slug,
          name: entry?.name || r.address_city,
          state: entry?.state || r.address_state || 'India',
          count: 1,
          min: price,
          image: r.featured_image || '',
        }
      } else {
        agg[slug].count++
        agg[slug].min = Math.min(agg[slug].min, price)
        if (!agg[slug].image && r.featured_image) agg[slug].image = r.featured_image
      }
    }
    return Object.values(agg)
  })()

  const fallbackCities = pricedCities.map((c) => {
    const entry = voCities.find((v) => v.slug === c.slug)
    return {
      slug: c.slug,
      name: entry?.name || c.name,
      state: entry?.state || c.region,
      count: c.addresses,
      min: c.price,
    }
  })

  const cityList = (liveCities.length ? liveCities : fallbackCities)
    .slice()
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  if (!svc || !nat) return null

  // Alias URL, send the visitor to the canonical one so there is a single
  // indexable page per service. Placed after the hooks above so hook order
  // stays stable across renders.
  if (isServiceAlias(urlSlug)) {
    return <Navigate to={serviceHubUrl(serviceSlug)} replace />
  }

  const Icon = iconMap[svc.icon] || FileCheck2

  // National "from" price: cheapest city base + this service's offset.
  const baseMin = cityList.length ? Math.min(...cityList.map((c) => c.min)) : 899
  const price = svc.fixedPrice || Math.max(499, baseMin + (svc.priceOffset || 0))
  const totalAddresses = cityList.reduce((sum, c) => sum + (c.count || 0), 0)

  const openLead = () =>
    openLeadModal({
      title: `${svc.name} in India`,
      subtitle:
        'Tell us which city you need and our team will call you back within one business day.',
      service: `${svc.name}, India`,
      city: 'India',
    })

  const otherServices = serviceOrder.filter((s) => s !== svc.slug)

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Virtual Office', url: '/virtual-office' },
    { name: svc.name },
  ]

  const schemas = [
    webPageSchema({
      title: nat.metaTitle,
      description: nat.metaDescription,
      url: serviceHubUrl(serviceSlug),
      breadcrumbs: breadcrumbItems,
    }),
    breadcrumbSchema(breadcrumbItems),
    faqSchema(nat.faqs),
    serviceSchema({
      name: `${svc.name} in India`,
      description: nat.metaDescription,
      cityName: 'India',
      url: serviceHubUrl(serviceSlug),
      price,
    }),
  ].filter(Boolean)

  // Highlight the accent word ("India") inside the H1.
  const [headBefore, ...headRest] = nat.heading.split(nat.headingAccent)

  return (
    <>
      <SchemaScript schemas={schemas} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 tech-dots opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_40%_40%,#000,transparent)]" />
        <div className="container-custom relative py-12 lg:py-16">
          {/* breadcrumb */}
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link to="/virtual-office" className="hover:text-primary">
              Virtual Office
            </Link>
            <span>/</span>
            <span className="font-semibold text-navy-dark">{svc.name}</span>
          </div>

          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2.5 rounded-full border border-primary-200 bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-soft">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                {svc.eyebrow} · All India
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-navy-dark text-balance sm:text-4xl lg:text-[2.9rem] lg:leading-[1.1]">
                {headBefore}
                {headRest.length > 0 && (
                  <>
                    <span className="gradient-text">{nat.headingAccent}</span>
                    {headRest.join(nat.headingAccent)}
                  </>
                )}
              </h1>

              <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">{nat.lead}</p>

              <ul className="mt-6 flex flex-wrap gap-2.5">
                {nat.chips.map((c) => (
                  <li
                    key={c}
                    className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-4 py-2 text-sm font-semibold text-navy shadow-soft"
                  >
                    <span className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={openLead} size="lg">
                  Book Now <ArrowRight className="h-5 w-5" />
                </Button>
                <a
                  href="#cities"
                  className="btn-base border-2 border-primary/30 px-6 py-3 text-base text-primary hover:bg-primary-50"
                >
                  Choose Your City
                </a>
              </div>
            </motion.div>

            {/* side card */}
            <motion.div
              initial={{ opacity: 0, y: 26, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="relative"
            >
              <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-primary-300/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-7 shadow-card-hover ring-1 ring-primary-100/70 backdrop-blur-xl">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-card ring-1 ring-white/30"
                    style={{ background: svc.grad }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-dark">{svc.name}</p>
                    <p className="text-xs text-slate-500">across {cityList.length}+ cities</p>
                  </div>
                </div>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-sm font-medium text-slate-400">From</span>
                  <span className="ml-1 text-3xl font-extrabold text-navy-dark">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                  <span className="mb-1 text-sm text-slate-400">{svc.period}</span>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {svc.included.slice(0, 4).map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-navy">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={openLead}
                  className="btn-base mt-6 w-full bg-primary-gradient px-6 py-3 text-sm text-white shadow-card hover:shadow-glow"
                >
                  Book Now <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="border-y border-primary-100 bg-white">
        <div className="container-custom grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {[
            { icon: Building2, k: `${cityList.length}+`, v: 'cities covered' },
            { icon: MapPin, k: `${totalAddresses}+`, v: 'verified addresses' },
            { icon: BadgeCheck, k: '98.7%', v: 'approval rate' },
            { icon: Clock, k: '2–3 days', v: 'activation' },
          ].map((f) => (
            <div key={f.v} className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary-50 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-navy-dark">{f.k}</p>
                <p className="text-xs text-slate-500">{f.v}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <TrustBar />

      {/* National overview */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <SectionHeading
            align="left"
            eyebrow="Overview"
            title={`${svc.name} with a Virtual Office in India`}
            accent="India"
          />
          <Reveal className="mt-6">
            <ArticleBlocks blocks={nat.intro} lead />
          </Reveal>
        </div>
      </section>

      {/* Cities grid, the funnel into the per-city pages */}
      <section id="cities" className="section-padding bg-surface-light scroll-mt-24">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Choose Your City"
            title={`${svc.name} City by City`}
            accent="City by City"
            subtitle={`Pricing, addresses and documentation differ slightly by city. Pick yours to see local ${svc.name.toLowerCase()} details.`}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cityList.map((c, i) => {
              const cityPrice =
                svc.fixedPrice ||
                Math.max(499, (getCityBySlug(c.slug)?.price || c.min) + (svc.priceOffset || 0))
              const cityImage = CITY_LANDMARK_IMAGES[c.slug] || DEFAULT_CITY_IMAGE
              return (
                <Reveal key={c.slug} delay={(i % 4) * 0.06}>
                  <Link
                    to={spaceUrl(c.slug, svc.slug)}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100/60 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
                  >
                    {/* Image header */}
                    <div className="relative block h-32 overflow-hidden">
                      <SmartImage
                        src={cityImage}
                        alt={`${c.name} city skyline`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Spots badge */}
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm">
                        <MapPin className="h-2.5 w-2.5" />
                        {c.count}+ spots
                      </span>
                    </div>
                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-bold text-navy-dark">{c.name}</h3>
                      <p className="mt-0.5 text-xs text-slate-500">{c.state}</p>
                      {/* Divider + price row */}
                      <div className="mt-3 flex items-center justify-between border-t border-primary-100/40 pt-3">
                        <p className="text-lg font-bold text-primary">
                          ₹{cityPrice.toLocaleString('en-IN')}
                          <span className="ml-0.5 text-[11px] font-medium text-slate-400">
                            {svc.period}
                          </span>
                        </p>
                        <ArrowRight className="h-4 w-4 text-primary/60 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/virtual-office"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-700"
            >
              Browse every virtual office location
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="What's Included"
            title={`Everything You Get with ${svc.name}`}
            accent={svc.name}
          />
          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
            {svc.included.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-primary-100/70 bg-white px-4 py-3 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary-50/30 hover:shadow-card"
              >
                <span className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span className="text-sm font-semibold text-navy-dark">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 60%, #16508f 120%)' }}>
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 tech-dots opacity-30 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000,transparent)]" />
        <div className="pointer-events-none absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-primary-400/20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-gold/10 blur-[80px]" />

        <div className="container-custom relative">
          <SectionHeading
            light
            eyebrow="Why EaseMyOffice"
            title={`Why Businesses Across India Choose Us for ${svc.name}`}
            accent={svc.name}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {svc.why.map((w, i) => (
              <Reveal key={w.title} delay={(i % 4) * 0.07}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.07] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-white/[0.25] hover:bg-white/[0.12] hover:shadow-[0_8px_40px_-10px_rgba(44,103,158,0.4)]">
                  {/* Tech grid texture */}
                  <div className="pointer-events-none absolute inset-0 tech-grid opacity-40 rounded-2xl" />
                  {/* Number watermark */}
                  <span className="pointer-events-none absolute right-5 top-4 text-5xl font-black bg-gradient-to-br from-gold to-gold-dark bg-clip-text text-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* Icon with glow */}
                  <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-glow ring-1 ring-white/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_50px_-5px_rgba(44,103,158,0.6)]" style={{ background: svc.grad }}>
                    <Sparkles className="h-8 w-8" />
                    <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </span>
                  <h3 className="relative mt-5 text-base font-bold text-white">{w.title}</h3>
                  <p className="relative mt-2 flex-1 text-sm leading-relaxed text-primary-100/80">
                    {w.desc.replace('{city}', 'India')}
                  </p>
                  {/* Gold accent bar with glow on hover */}
                  <span className="relative mt-5 h-1 w-8 rounded-full bg-gradient-to-r from-gold to-gold-dark shadow-none transition-all duration-300 group-hover:w-16 group-hover:shadow-gold-glow" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works, same treatment as the homepage */}
      <StepsFlow
        title="Get Started in 3 Simple Steps"
        accent="3 Simple Steps"
        subtitle="From choosing your city to a ready-to-use business address, fully online."
        steps={steps}
        cta={{ label: 'Get Started Today', onClick: openLead }}
      />

      <ClientsStrip />
      <GoogleReviews />

      {/* Other service hubs */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading eyebrow="Explore More" title="Other Services" accent="Services" />
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {otherServices.map((slug) => {
              const o = serviceLandings[slug]
              const OIcon = iconMap[o.icon] || FileCheck2
              return (
                <Link
                  key={slug}
                  to={serviceHubUrl(slug)}
                  className="group flex items-center gap-4 rounded-2xl border border-primary-100/70 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
                >
                  <span
                    className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl text-white shadow-card"
                    style={{ background: o.grad }}
                  >
                    <OIcon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-navy-dark group-hover:text-primary">{o.name}</p>
                    <p className="truncate text-xs text-slate-500">across India</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 flex-none text-primary" />
                </Link>
              )
            })}
          </div>

          {/* related internal links for crawlability */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-primary-100 bg-surface-light p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Related resources
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {(dbRelatedLinks || [
                { label: 'All Virtual Office Locations', url: '/virtual-office' },
                ...cityList.slice(0, 4).map((c) => ({
                  label: `Virtual Office in ${c.name}`,
                  url: cityUrl(c.slug),
                })),
                { label: 'Pricing & Plans', url: '/pricing' },
                { label: 'CA & Compliance Services', url: '/ca-services' },
              ]).map((r) => (
                <Link
                  key={r.url + r.label}
                  to={r.url}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-semibold text-navy-dark shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-card"
                >
                  {r.label}
                  <ArrowRight className="h-3.5 w-3.5 text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*
        Long-form article, city-agnostic. Rendered only when a shared row exists
        in blog_articles (page_type='service', service_slug=<slug>, city_slug NULL),
        so the page never shows duplicate filler copy.
      */}
      <BlogArticleSection
        title={dbArticle?.title || `${svc.name} in India: Complete Guide`}
        eyebrow={dbArticle?.eyebrow || 'Guide'}
        blocks={dbArticle?.blocks || []}
        bg="bg-surface-light"
      />

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading eyebrow="FAQ" title={`${svc.name} in India: FAQs`} accent="FAQs" />
          <Reveal className="mx-auto mt-12 max-w-3xl">
            <FaqAccordion items={nat.faqs} />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[2rem] px-6 py-16 text-center shadow-card-hover ring-1 ring-white/10 sm:px-12 lg:py-20"
            style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 60%, #16508f 120%)' }}
          >
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.07]" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 animate-pulse-slow rounded-full bg-primary-300/25 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 animate-pulse-slow rounded-full bg-gold/12 blur-3xl" />
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

            <div className="relative grid items-center gap-12 text-center lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:text-left">
              {/* left: copy */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-100 backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                  </span>
                  Ready in 2–3 days
                </span>

                <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl lg:text-[2.6rem]">
                  Get your <span className="gold-text">{svc.name}</span> sorted, anywhere in India
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-primary-100 lg:mx-0">
                  Join <span className="font-bold text-white">5,000+ businesses</span> registered with
                  EaseMyOffice across India.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                  <button
                    type="button"
                    onClick={openLead}
                    className="btn-base bg-gradient-to-r from-gold to-gold-dark px-8 py-4 text-base text-white shadow-card transition-all hover:shadow-gold-glow hover:brightness-105"
                  >
                    Get Started <ArrowRight className="h-5 w-5" />
                  </button>
                  <a
                    href="tel:8882735038"
                    className="btn-base border-2 border-white/40 px-8 py-4 text-base text-white transition-colors hover:bg-white/10"
                  >
                    <Phone className="h-5 w-5" />
                    888-273-5038
                  </a>
                </div>

                {/* trust chips */}
                <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-7 text-sm font-medium text-primary-100/80 lg:justify-start">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-gold text-gold" />
                    4.9/5 on Google
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-emerald-300" />
                    98.7% approval
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                    No lock-in
                  </span>
                </div>
              </div>

              {/* right: verified address card mockup */}
              <div className="relative mx-auto w-full max-w-sm">
                <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gold/10 blur-2xl" />
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-6 text-left shadow-card-hover backdrop-blur-xl">
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-gold-dark to-gold" />
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300 ring-1 ring-emerald-300/30">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified Address
                    </span>
                  </div>

                  <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-primary-100/60">
                    Your registered address
                  </p>
                  <p className="mt-1.5 text-lg font-bold leading-snug text-white">
                    Your Company Pvt. Ltd.
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-primary-100/90">
                    Premium Business Centre, India
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                    {svc.included.slice(0, 4).map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-primary-100"
                      >
                        <Check className="h-3 w-3 text-emerald-300" strokeWidth={3} />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* floating rating badge */}
                <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl border border-white/15 bg-navy-dark/80 px-3 py-2 shadow-card-hover backdrop-blur">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="text-xs font-bold text-white">4.9/5</span>
                  <span className="text-[11px] text-primary-100/70">1,200+ reviews</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <TalkToExpert city="India" />
    </>
  )
}
