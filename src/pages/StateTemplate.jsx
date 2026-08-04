import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Building2, ArrowRight, Star, BadgeCheck, ShieldCheck } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import FaqAccordion from '../components/ui/FaqAccordion'
import { voCities, citiesForState, slugifyState, getStateNameFromSlug, slugifySpace } from '../data/spaces'
import { useSpacesForCity, useSupabaseSpaces } from '../context/SpacesContext'
import { getCityBySlug } from '../data/cities'
import { cityFaqs as buildCityFaqs } from '../data/pageFaqs'
import { getStateDescription, toBlocks } from '../data/descriptions'
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

  // Get description for the state
  const stateDescBlocks = toBlocks(getStateDescription(stateName))

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
              {cities.length} cities available across {stateName}. Get a premium business address for GST registration, company incorporation, and professional mail handling.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button onClick={openLead} size="lg">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* State description */}
      {stateDescBlocks.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-3xl">
            <ArticleBlocks blocks={stateDescBlocks} lead />
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

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <SectionHeading
            eyebrow="Get Started"
            title={`Ready to Set Up in ${stateName}?`}
            accent={stateName}
            subtitle="Choose your city, pick a plan, and get your verified business address in 2–3 days."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button onClick={openLead} size="lg">
              Get a Free Consultation <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <TalkToExpert city={stateName} />
    </>
  )
}
