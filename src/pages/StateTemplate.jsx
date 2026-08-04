import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Building2,
  ArrowRight,
  Star,
  BadgeCheck,
  ShieldCheck,
  FileCheck2,
  Mailbox,
  Check,
  Clock,
  Phone,
  Store,
} from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import FaqAccordion from '../components/ui/FaqAccordion'
import BlogArticleSection from '../components/ui/BlogArticleSection'
import TrustBar from '../components/home/TrustBar'
import GoogleReviews from '../components/virtual-office/GoogleReviews'
import ClientsStrip from '../components/virtual-office/ClientsStrip'
import { voCities, citiesForState, slugifyState, getStateNameFromSlug, slugifySpace } from '../data/spaces'
import { useSpacesForCity, useSupabaseSpaces } from '../context/SpacesContext'
import { getCityBySlug } from '../data/cities'
import { cityFaqs as buildCityFaqs } from '../data/pageFaqs'
import { getStateDescription, toBlocks } from '../data/descriptions'
import { cityArticle } from '../data/blogArticles'
import { useBlogArticle } from '../hooks/useBlogArticle'
import ArticleBlocks from '../components/ui/ArticleBlocks'
import TalkToExpert from '../components/ui/TalkToExpert'
import { useLeadModal } from '../context/LeadModalContext'

function toTitle(str = '') {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function StateTemplate() {
  const { first } = useParams()
  const stateSlug = first || ''
  const { openLeadModal } = useLeadModal()
  const { loaded } = useSupabaseSpaces()

  // Resolve state name from slug
  const stateName = getStateNameFromSlug(stateSlug) || toTitle(stateSlug)
  const cities = citiesForState(stateName)
  const topCity = cities[0]
  const basePrice = (topCity && getCityBySlug(topCity.slug)?.price) || 899

  // Get description for the state
  const stateDescBlocks = toBlocks(getStateDescription(stateName))

  // Blog article from Supabase or default
  const dbArticle = useBlogArticle({ pageType: 'city', citySlug: stateSlug })
  const articleBlocks = dbArticle?.blocks?.length ? dbArticle.blocks : cityArticle(stateName, stateName)

  // FAQs for the state (uses the top city's FAQ pattern)
  const stateFaqs = buildCityFaqs(stateName, stateName, basePrice)

  const openLead = () =>
    openLeadModal({
      title: `Virtual Office in ${stateName}`,
      subtitle: 'Tell us your city preference and we\'ll share the best options.',
      service: `Virtual Office — ${stateName}`,
      city: stateName,
    })

  if (!cities.length) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom max-w-lg text-center">
          <h1 className="text-2xl font-bold text-navy-dark">State not found</h1>
          <p className="mt-2 text-slate-500">We couldn't find virtual offices for this location.</p>
          <Button to="/virtual-office" className="mt-6">
            Explore All Locations <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" />
        <div className="container-custom relative py-16 lg:py-20">
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Link to="/virtual-office" className="hover:text-primary">Virtual Office</Link>
            <span>/</span>
            <span className="font-semibold text-navy-dark">{stateName}</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-soft">
              <MapPin className="h-3.5 w-3.5" />
              {stateName}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-dark sm:text-4xl lg:text-5xl">
              Virtual Office in <span className="gradient-text">{stateName}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              {cities.length} cities available across {stateName}. Get a premium business address for GST registration, company incorporation, and professional mail handling — starting at just ₹{basePrice}/mo.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button onClick={openLead} size="lg">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
              <a
                href="tel:8882735038"
                className="btn-base border-2 border-primary/30 px-6 py-3 text-sm text-primary hover:bg-primary-50"
              >
                <Phone className="h-4 w-4" />
                888-273-5038
              </a>
            </div>

            {/* Quick stats */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-primary" />
                {cities.length} cities
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-gold text-gold" />
                4.9/5 rating
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-accent-emerald" />
                98.7% approval
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                2–3 day setup
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* State description */}
      {stateDescBlocks.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-3xl">
            <SectionHeading
              eyebrow="About"
              title={`Why ${stateName} for Your Business?`}
              accent={stateName}
            />
            <Reveal className="mt-10">
              <ArticleBlocks blocks={stateDescBlocks} lead />
            </Reveal>
          </div>
        </section>
      )}

      {/* Cities Grid */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Cities"
            title={`Virtual Offices in ${stateName}`}
            accent={stateName}
            subtitle={`Choose a city in ${stateName} to explore verified business addresses.`}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cities.map((city, i) => {
              const extra = getCityBySlug(city.slug)
              const price = extra?.price || 899
              return (
                <Reveal key={city.slug} delay={(i % 4) * 0.06}>
                  <Link
                    to={`/virtual-office/${stateSlug}/${city.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100/70 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
                  >
                    <div className="flex flex-1 flex-col p-6">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                        <Building2 className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 text-lg font-bold text-navy-dark group-hover:text-primary transition-colors">
                        {city.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">{city.state}</p>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className="text-xs text-slate-400">Starting at</p>
                          <p className="text-lg font-extrabold text-primary">
                            ₹{price}<span className="text-xs font-medium text-slate-400">/mo</span>
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
        </div>
      </section>

      {/* Why Choose */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Why Us"
            title={`Why Choose EaseMyOffice in ${stateName}`}
            accent={stateName}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Building2, title: 'Prestigious Address', desc: `A credible ${stateName} business address that impresses clients and authorities.` },
              { icon: FileCheck2, title: 'GST & Company Ready', desc: 'Rent agreement, NOC and utility bill — the complete verification-ready kit.' },
              { icon: Store, title: 'Marketplace Approved', desc: `Use it for Amazon, Flipkart & APOB registrations across ${stateName}.` },
              { icon: ShieldCheck, title: 'Fully Compliant', desc: 'Authority-accepted paperwork with a dedicated relationship manager.' },
            ].map((w, i) => (
              <Reveal key={w.title} delay={(i % 4) * 0.07}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100/70 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-105">
                    <w.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold text-navy-dark">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.desc}</p>
                  <span className="mt-4 h-1 w-8 rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-300 group-hover:w-14" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Strip */}
      <ClientsStrip />

      {/* Google Reviews */}
      <GoogleReviews />

      {/* Verified Addresses */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <Reveal>
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-primary-100 bg-white p-8 shadow-card-hover ring-1 ring-primary-100/50 lg:p-10">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-50 blur-3xl" />
              <div className="relative flex items-start gap-4">
                <span className="inline-flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card ring-1 ring-white/30">
                  <Mailbox className="h-7 w-7" />
                </span>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-emerald">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    100% Verified
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-navy-dark sm:text-2xl">
                    Verified addresses across {stateName}
                  </h3>
                </div>
              </div>
              <p className="relative mt-5 max-w-2xl leading-relaxed text-slate-600">
                Our {stateName} addresses are located in reputed commercial districts, fully verified
                and accepted for GST and MCA filings. Exact address details are shared once you choose
                a plan — you can even register in multiple {stateName} locations to expand your reach.
              </p>
              <div className="relative mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  'Prime commercial locations',
                  'Authority-accepted paperwork',
                  'Mail handling & notifications',
                  'Dedicated relationship manager',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-primary-100/70 bg-surface-light px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-soft"
                  >
                    <span className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <span className="text-sm font-semibold text-navy-dark">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Blog Article */}
      <BlogArticleSection
        title={dbArticle?.title || `Virtual Office in ${stateName} — Complete Guide`}
        accent={stateName}
        eyebrow={dbArticle?.eyebrow || 'Guide'}
        subtitle={dbArticle?.subtitle || `Everything you need to know about getting a virtual office in ${stateName} for GST registration, company incorporation, and business growth.`}
        blocks={articleBlocks}
        bg="bg-white"
      />

      {/* FAQ */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading eyebrow="FAQ" title={`Virtual Office in ${stateName} — FAQs`} accent={stateName} />
          <Reveal className="mx-auto mt-12 max-w-3xl">
            <FaqAccordion items={stateFaqs} />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
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

            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-100 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                Ready in 2–3 days
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl">
                Set up your <span className="gold-text">{stateName}</span> business address today
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-100">
                Join <span className="font-bold text-white">5,000+ businesses</span> registered with
                EaseMyOffice across {stateName}.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
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
          </motion.div>
        </div>
      </section>

      <TalkToExpert city={stateName} />
    </>
  )
}
