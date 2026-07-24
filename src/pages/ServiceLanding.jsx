import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileCheck2,
  Landmark,
  Mailbox,
  Armchair,
  MapPin,
  ArrowRight,
  Check,
  ShieldCheck,
  Clock,
  BadgeCheck,
  MessageSquare,
  FileUp,
  PartyPopper,
  Sparkles,
  Phone,
} from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import FaqAccordion from '../components/ui/FaqAccordion'
import ArticleBlocks from '../components/ui/ArticleBlocks'
import { voCities, getSpaces, slugifySpace } from '../data/spaces'
import { getCityBySlug } from '../data/cities'
import { getServiceLanding, serviceOrder, serviceLandings } from '../data/serviceLandings'
import { useLeadModal } from '../context/LeadModalContext'

const iconMap = { FileCheck2, Landmark, Mailbox, Armchair }

function toTitle(str = '') {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const steps = [
  { icon: MessageSquare, title: 'Share your requirement', desc: 'Tell us the city and service you need.' },
  { icon: FileUp, title: 'Upload documents', desc: 'Submit your KYC online — we verify everything upfront.' },
  { icon: PartyPopper, title: 'Get activated', desc: 'Your address & documents are ready in 2–3 days.' },
]

export default function ServiceLanding() {
  const params = useParams()
  const { city, locality } = params
  const serviceSlug = (params.service || params.space || '').toLowerCase()
  const { openLeadModal } = useLeadModal()

  const svc = getServiceLanding(serviceSlug)
  const cityName = voCities.find((c) => c.slug === city)?.name || toTitle(city)
  const region = voCities.find((c) => c.slug === city)?.state || 'India'
  const localityName = locality ? toTitle(locality) : ''

  if (!svc) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom max-w-lg text-center">
          <h1 className="text-2xl font-bold text-navy-dark">Page not found</h1>
          <Button to={`/virtual-office/${city}`} className="mt-6">
            Explore {cityName} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    )
  }

  const Icon = iconMap[svc.icon] || FileCheck2
  const base = getCityBySlug(city)?.price || 999
  const price = svc.fixedPrice || Math.max(499, base + (svc.priceOffset || 0))
  const where = localityName ? `${localityName}, ${cityName}` : cityName

  const openLead = () =>
    openLeadModal({
      title: `${svc.name} in ${cityName}`,
      subtitle: 'Share your details and our team will call you back within one business day.',
      service: `${svc.name} — ${where}`,
      city: cityName,
    })

  const otherServices = serviceOrder.filter((s) => s !== svc.slug)

  // ≥5 related internal links (pillar page + cluster) for SEO crawlability
  const topLocalities = (getSpaces(city) || []).slice(0, 3)
  const relatedLinks = [
    { label: `Virtual Office in ${cityName}`, to: `/virtual-office/${city}` },
    ...topLocalities.map((s) => ({
      label: `${s.name} Location`,
      to: `/space/${city}/${slugifySpace(s.name)}`,
    })),
    { label: 'Pricing & Plans', to: '/pricing' },
    { label: `Coworking in ${cityName}`, to: '/coworking' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 tech-dots opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_40%_40%,#000,transparent)]" />
        <div className="container-custom relative py-12 lg:py-16">
          {/* breadcrumb */}
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Link to="/virtual-office" className="hover:text-primary">
              Virtual Office
            </Link>
            <span>/</span>
            <Link to={`/virtual-office/${city}`} className="hover:text-primary">
              {cityName}
            </Link>
            {localityName && (
              <>
                <span>/</span>
                <span>{localityName}</span>
              </>
            )}
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
                {svc.eyebrow} · {cityName}
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-navy-dark text-balance sm:text-4xl lg:text-[2.9rem] lg:leading-[1.1]">
                {svc.heading(cityName)}
              </h1>
              {localityName && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <MapPin className="h-4 w-4" />
                  {localityName}, {cityName}
                </p>
              )}
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
                {svc.lead(cityName)}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2.5">
                {svc.chips.map((c) => (
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
                <Button to={`/virtual-office/${city}`} variant="outline" size="lg">
                  Explore Spaces
                </Button>
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
                    <p className="text-xs text-slate-500">in {cityName}</p>
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
            { icon: MapPin, k: `${getCityBySlug(city)?.addresses || 12}+`, v: `addresses in ${cityName}` },
            { icon: BadgeCheck, k: '98.7%', v: 'approval rate' },
            { icon: Clock, k: '2–3 days', v: 'activation' },
            { icon: ShieldCheck, k: '100%', v: 'compliant docs' },
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

      {/* Blog / SEO article */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <SectionHeading
            align="left"
            eyebrow="Overview"
            title={`${svc.name} with a Virtual Office in ${cityName}`}
            accent={cityName}
          />
          <Reveal className="mt-6">
            <ArticleBlocks
              blocks={svc.article ? svc.article(cityName, region) : svc.intro(cityName, region)}
            />
          </Reveal>
        </div>
      </section>

      {/* What's included */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="What's Included"
            title={`Everything You Get in ${cityName}`}
            accent={cityName}
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
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Why EaseMyOffice"
            title={`Why Choose Us for ${svc.name} in ${cityName}`}
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
                    {w.desc.replace('{city}', cityName)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading eyebrow="How It Works" title="Get Started in 3 Simple Steps" accent="3 Simple Steps" />
          <div className="relative mt-16 grid gap-8 lg:grid-cols-3">
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent lg:block" />
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="relative text-center">
                  <span className="relative mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card ring-4 ring-white">
                    <s.icon className="h-6 w-6" />
                    <span className="absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-dark text-[11px] font-bold text-white shadow-gold-glow">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-4 font-bold text-navy-dark">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Explore other services in this city */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Explore More"
            title={`Other Services in ${cityName}`}
            accent={cityName}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {otherServices.map((slug) => {
              const o = serviceLandings[slug]
              const OIcon = iconMap[o.icon] || FileCheck2
              return (
                <Link
                  key={slug}
                  to={`/space/${city}/${slug}`}
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
                    <p className="truncate text-xs text-slate-500">in {cityName}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 flex-none text-primary" />
                </Link>
              )
            })}
          </div>
          {/* related resources — internal links for SEO crawlability (pillar + cluster) */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-primary-100 bg-surface-light p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Related resources
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {relatedLinks.map((r) => (
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

          <div className="mt-8 text-center">
            <Link
              to={`/virtual-office/${city}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-700"
            >
              View the full {cityName} guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="FAQ"
            title={`${svc.name} in ${cityName} — FAQs`}
            accent={cityName}
          />
          <Reveal className="mx-auto mt-12 max-w-3xl">
            <FaqAccordion items={svc.faqs(cityName)} />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div
            className="relative overflow-hidden rounded-[2rem] px-6 py-14 text-center shadow-card-hover ring-1 ring-white/10 sm:px-12 lg:py-16"
            style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 60%, #16508f 120%)' }}
          >
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.06]" />
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Get your <span className="gold-text">{svc.name}</span> in {cityName} today
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
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
