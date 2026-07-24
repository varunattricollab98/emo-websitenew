import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Building2,
  FileCheck2,
  Mailbox,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  Star,
  Flame,
  BadgeCheck,
  Landmark,
  Store,
} from 'lucide-react'
import SubPageHero from '../components/ui/SubPageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import FaqAccordion from '../components/ui/FaqAccordion'
import SmartImage from '../components/ui/SmartImage'
import { voCities, getSpaces } from '../data/spaces'
import { getCityBySlug } from '../data/cities'
import { faqs } from '../data/faqs'
import { useLeadModal } from '../context/LeadModalContext'

function toTitle(str = '') {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function CityTemplate() {
  const { city } = useParams()
  const { openLeadModal } = useLeadModal()

  const vo = voCities.find((c) => c.slug === city)
  const extra = getCityBySlug(city)
  const cityName = vo?.name || extra?.name || toTitle(city)
  const region = vo?.state || extra?.region || 'India'
  const basePrice = extra?.price || 899
  const spaces = getSpaces(city)
  const addresses = extra?.addresses || spaces.length

  const openLead = (svc) =>
    openLeadModal({
      title: `Virtual Office in ${cityName}`,
      subtitle: 'Share your details and our team will call you back within one business day.',
      service: svc ? `${svc} — ${cityName}` : `Virtual Office — ${cityName}`,
    })

  const plans = [
    {
      name: 'Mailing Address',
      price: (basePrice - 200).toLocaleString('en-IN'),
      icon: Mailbox,
      grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
      desc: `A professional ${cityName} address for mail & branding.`,
      features: ['Premium business address', 'Mail & courier handling', 'Digital notifications'],
    },
    {
      name: 'GST Registration',
      price: basePrice.toLocaleString('en-IN'),
      icon: FileCheck2,
      grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
      popular: true,
      desc: `The complete GST-ready ${cityName} address kit.`,
      features: ['GST-ready address', 'Rent agreement + NOC', 'Utility bill', 'Priority activation'],
    },
    {
      name: 'Company Registration',
      price: (basePrice + 300).toLocaleString('en-IN'),
      icon: Landmark,
      grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
      desc: `Registered office address in ${cityName}.`,
      features: ['Registered office', 'Full MCA documentation', 'Board resolution support'],
    },
  ]

  const facts = [
    { icon: MapPin, label: `${addresses}+ addresses`, sub: `in ${cityName}` },
    { icon: FileCheck2, label: 'GST & MCA ready', sub: 'full documentation' },
    { icon: BadgeCheck, label: '98.7% approval', sub: 'success rate' },
    { icon: Clock, label: '2–3 day setup', sub: 'fast activation' },
  ]

  const benefits = [
    { icon: Building2, title: 'Prestigious Address', desc: `A credible ${cityName} business address that impresses clients and authorities.` },
    { icon: FileCheck2, title: 'GST & Company Ready', desc: 'Rent agreement, NOC and utility bill — the complete verification-ready kit.' },
    { icon: Store, title: 'Marketplace Approved', desc: `Use it for Amazon, Flipkart & APOB registrations in ${region}.` },
    { icon: ShieldCheck, title: 'Fully Compliant', desc: 'Authority-accepted paperwork with a dedicated relationship manager.' },
  ]

  return (
    <>
      <SubPageHero
        eyebrow={`Virtual Office · ${region}`}
        title={`Virtual Office in ${cityName}`}
        accent={cityName}
        subtitle={`Get a premium, compliant ${cityName} business address for GST and company registration — ${addresses}+ verified locations, activated in just 2–3 days.`}
        chips={[`${addresses}+ addresses`, 'GST & company ready', '2–3 day setup']}
        visual={
          <div className="relative">
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-primary-300/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-7 shadow-card-hover ring-1 ring-primary-100/70 backdrop-blur-xl">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                  <MapPin className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-bold text-navy-dark">{cityName}</p>
                  <p className="text-xs text-slate-500">{region}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { k: `${addresses}+`, v: 'Verified addresses' },
                  { k: `₹${(basePrice - 200).toLocaleString('en-IN')}`, v: 'Starting / year' },
                  { k: '98.7%', v: 'Approval rate' },
                  { k: '2–3 days', v: 'Activation' },
                ].map((s) => (
                  <div
                    key={s.v}
                    className="rounded-2xl border border-primary-100/70 bg-surface-light px-4 py-3"
                  >
                    <p className="text-xl font-extrabold text-navy-dark">{s.k}</p>
                    <p className="text-[11px] font-medium text-slate-500">{s.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-primary-100 bg-white px-4 py-3 shadow-soft">
                <Star className="h-5 w-5 fill-gold text-gold" />
                <p className="text-sm font-semibold text-navy">4.9/5 · trusted across {region}</p>
              </div>
            </div>
          </div>
        }
      >
        <Button onClick={() => openLead()} size="lg">
          Get Started <ArrowRight className="h-5 w-5" />
        </Button>
        <Button to="/virtual-office" variant="outline" size="lg">
          All Locations
        </Button>
      </SubPageHero>

      {/* Quick facts */}
      <section className="border-b border-primary-100 bg-white">
        <div className="container-custom grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary-50 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-navy-dark">{f.label}</p>
                <p className="text-xs text-slate-500">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Localities / spaces in this city */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Locations"
            title={`Virtual Office Locations in ${cityName}`}
            accent={cityName}
            subtitle={`Verified addresses across ${cityName}'s top commercial districts — pick the one that fits your business.`}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {spaces.map((sp, i) => (
              <Reveal key={`${sp.name}-${i}`} delay={(i % 4) * 0.05}>
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100/60 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
                  <div className="relative h-40 overflow-hidden bg-primary-gradient">
                    <SmartImage
                      src={sp.image}
                      alt={`${sp.name}, ${cityName}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {sp.badge && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-white shadow-gold-glow">
                        <Flame className="h-3 w-3" />
                        {sp.badge}
                      </span>
                    )}
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-xs font-bold text-navy-dark shadow-soft">
                      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                      {sp.rating}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold text-navy-dark">{sp.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3 text-primary/60" />
                      {cityName}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {sp.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-1 items-end justify-between">
                      <div>
                        <p className="text-[11px] text-slate-400">From</p>
                        <p className="text-lg font-extrabold text-navy-dark">
                          ₹{sp.price}
                          <span className="text-xs font-medium text-slate-400">/mo</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openLead(sp.name)}
                        className="btn-base bg-primary-50 px-3.5 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-100"
                      >
                        Enquire
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Plans & Pricing"
            title={`Virtual Office Plans in ${cityName}`}
            accent={cityName}
            subtitle="Transparent annual pricing with no lock-in and no hidden charges."
          />
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div
                  className={`group relative flex h-full flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                    p.popular
                      ? 'bg-gradient-to-b from-primary-50 via-white to-white shadow-card-hover ring-2 ring-gold lg:-translate-y-4'
                      : 'bg-white shadow-card ring-1 ring-primary-100/70 hover:shadow-card-hover'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute left-1/2 top-0 z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-gold-dark px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-gold-glow">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl text-white shadow-card ring-1 ring-white/40"
                      style={{ background: p.grad }}
                    >
                      <p.icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-xl font-bold text-navy-dark">{p.name}</h3>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">{p.desc}</p>
                  <div className="mt-5 flex items-end gap-1">
                    <span className="mb-1 text-2xl font-bold text-navy-dark">₹</span>
                    <span className="text-5xl font-extrabold leading-none text-navy-dark">{p.price}</span>
                    <span className="mb-1.5 text-sm font-medium text-slate-400">/year</span>
                  </div>
                  <p className="mt-1.5 text-xs font-medium text-slate-400">
                    Billed annually · No hidden charges
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => openLead(p.name)}
                    variant={p.popular ? 'gold' : 'primary'}
                    className="mt-8 w-full"
                  >
                    Choose {p.name}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Why EaseMyOffice"
            title={`Why Choose a Virtual Office in ${cityName}`}
            accent={cityName}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={(i % 4) * 0.07}>
                <div className="premium-card h-full p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                    <b.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold text-navy-dark">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Addresses note */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <Reveal>
            <div className="premium-card mx-auto max-w-4xl p-8 lg:p-10">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white">
                  <Mailbox className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold text-navy-dark">
                  Verified addresses across {cityName}
                </h3>
              </div>
              <p className="mt-4 text-slate-600">
                Our {cityName} addresses are located in reputed commercial districts, fully verified
                and accepted for GST and MCA filings. Exact address details are shared once you choose
                a plan — you can even register in multiple {cityName} locations to expand your reach.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  'Prime commercial locations',
                  'Authority-accepted paperwork',
                  'Mail handling & notifications',
                  'Dedicated relationship manager',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <Check className="h-4 w-4 flex-none text-accent-emerald" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading eyebrow="FAQ" title={`Virtual Office in ${cityName} — FAQs`} accent={cityName} />
          <Reveal className="mx-auto mt-12 max-w-3xl">
            <FaqAccordion items={faqs} />
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
            className="relative overflow-hidden rounded-3xl bg-navy-gradient px-6 py-14 text-center shadow-card-hover sm:px-12 lg:py-16"
          >
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.06]" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Set up your {cityName} business address today
              </h2>
              <p className="mt-4 text-lg text-primary-100">
                Join thousands of businesses registered with EaseMyOffice across {region}.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => openLead()}
                  className="btn-base bg-white px-8 py-4 text-base text-primary-800 shadow-card hover:bg-primary-50"
                >
                  Get Started <ArrowRight className="h-5 w-5" />
                </button>
                <Link
                  to="/virtual-office"
                  className="btn-base border-2 border-white/40 px-8 py-4 text-base text-white hover:bg-white/10"
                >
                  Explore All Cities
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
