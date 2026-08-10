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
        }
      } else {
        agg[slug].count++
        agg[slug].min = Math.min(agg[slug].min, price)
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
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cityList.map((c, i) => {
              const cityPrice =
                svc.fixedPrice ||
                Math.max(499, (getCityBySlug(c.slug)?.price || c.min) + (svc.priceOffset || 0))
              return (
                <Reveal key={c.slug} delay={(i % 4) * 0.06}>
                  <Link
                    to={spaceUrl(c.slug, svc.slug)}
                    className="group flex h-full flex-col rounded-2xl border border-primary-100/60 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
                  >
                    <div className="flex flex-1 flex-col p-6">
                      {/* Icon + City badge row */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary">
                          <MapPin className="h-3 w-3" />
                          {c.count}+ spots
                        </span>
                      </div>
                      {/* City name + state */}
                      <h3 className="mt-4 text-lg font-bold leading-tight text-navy-dark">
                        {c.name}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {c.state}
                      </p>
                      {/* Divider */}
                      <div className="my-4 border-t border-primary-100/50" />
                      {/* Price + CTA */}
                      <div className="mt-auto flex items-end justify-between">
                        <div>
                          <p className="text-xs font-medium text-slate-400">Starting at</p>
                          <p className="text-xl font-bold text-primary">
                            ₹{cityPrice.toLocaleString('en-IN')}
                            <span className="ml-0.5 text-xs font-medium text-slate-400">
                              {svc.period}
                            </span>
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
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
                className="flex items-center gap-3 rounded-2xl border border-primary-100/70 bg-white px-4 py-3 shadow-soft"
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
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Why EaseMyOffice"
            title={`Why Businesses Across India Choose Us for ${svc.name}`}
            accent={svc.name}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {svc.why.map((w, i) => (
              <Reveal key={w.title} delay={(i % 4) * 0.07}>
                <div className="premium-card h-full p-7">
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-card"
                    style={{ background: svc.grad }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold text-navy-dark">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {w.desc.replace('{city}', 'India')}
                  </p>
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
              {[
                { label: 'All Virtual Office Locations', to: '/virtual-office' },
                ...cityList.slice(0, 4).map((c) => ({
                  label: `Virtual Office in ${c.name}`,
                  to: cityUrl(c.slug),
                })),
                { label: 'Pricing & Plans', to: '/pricing' },
                { label: 'CA & Compliance Services', to: '/ca-services' },
              ].map((r) => (
                <Link
                  key={r.to + r.label}
                  to={r.to}
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
          <div
            className="relative overflow-hidden rounded-[2rem] px-6 py-14 text-center shadow-card-hover ring-1 ring-white/10 sm:px-12 lg:py-16"
            style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 60%, #16508f 120%)' }}
          >
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.06]" />
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Get your <span className="gold-text">{svc.name}</span> sorted, anywhere in India
              </h2>
              <p className="mt-4 text-lg text-primary-100">
                Ready in 2–3 days. Transparent pricing, no hidden charges.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={openLead}
                  className="btn-base bg-gradient-to-r from-gold to-gold-dark px-8 py-4 text-base text-white shadow-card hover:shadow-gold-glow hover:brightness-105"
                >
                  Book Now <ArrowRight className="h-5 w-5" />
                </button>
                <a
                  href="tel:8882735038"
                  className="btn-base border-2 border-white/40 px-8 py-4 text-base text-white hover:bg-white/10"
                >
                  <Phone className="h-5 w-5" />
                  888-273-5038
                </a>
              </div>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-7 text-sm font-medium text-primary-100/80">
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
          </div>
        </div>
      </section>

      <TalkToExpert city="India" />
    </>
  )
}
