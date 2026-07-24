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
  Phone,
} from 'lucide-react'
import SubPageHero from '../components/ui/SubPageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import FaqAccordion from '../components/ui/FaqAccordion'
import SmartImage from '../components/ui/SmartImage'
import TrustBar from '../components/home/TrustBar'
import GoogleReviews from '../components/virtual-office/GoogleReviews'
import ClientsStrip from '../components/virtual-office/ClientsStrip'
import { voCities, getSpaces } from '../data/spaces'
import { getCityBySlug } from '../data/cities'
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

  // City-specific FAQs (better for SEO + feels tailored to the city)
  const cityFaqs = [
    {
      q: `Is a virtual office in ${cityName} valid for GST registration?`,
      a: `Yes. Our ${cityName} virtual office plans include the complete GST documentation kit — a notarised rent agreement, NOC and a recent utility bill — accepted by the ${region} GST authorities.`,
    },
    {
      q: `Can I register my company at a ${cityName} address?`,
      a: `Absolutely. Our ${cityName} Company Registration plan provides a registered office address with the full MCA documentation kit for Private Limited, LLP or OPC incorporation.`,
    },
    {
      q: `Will my ${cityName} address clear GST physical verification?`,
      a: `Yes. Every ${cityName} address is a genuine, physically verified commercial premise supplied with the full paperwork set — built to clear GST department verification the first time.`,
    },
    {
      q: `How much does a virtual office in ${cityName} cost?`,
      a: `Plans in ${cityName} start from ₹${(basePrice - 200).toLocaleString('en-IN')}/year for a mailing address, with GST-ready and company registration plans available. Pricing is transparent — no deposits, no hidden charges.`,
    },
    {
      q: `How long does it take to set up my ${cityName} address?`,
      a: `Most ${cityName} addresses are activated within 2–3 business days of submitting your KYC. We pre-verify your documents so approvals go through smoothly the first time.`,
    },
    {
      q: `Which areas in ${cityName} are available?`,
      a: `We offer verified addresses across ${cityName}'s top commercial districts. Exact locality details are shared once you choose a plan, and you can register in multiple ${cityName} locations to expand your reach.`,
    },
    {
      q: `Can I receive mail and couriers at my ${cityName} office?`,
      a: `Yes. Letters, government notices and courier parcels are received and safely held at your ${cityName} address. We notify you on arrival and can forward everything to your preferred location.`,
    },
    {
      q: `Do I need to visit ${cityName} in person?`,
      a: `No — the entire process is 100% online. You submit your KYC digitally and we handle preparation, verification and activation, so no visit to ${cityName} is required.`,
    },
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

      {/* Quick facts — premium floating band overlapping the hero */}
      <section className="relative z-10 bg-white pb-6">
        <div className="container-custom -mt-8 sm:-mt-10">
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-card-hover ring-1 ring-primary-100/50 sm:grid-cols-4 sm:divide-x sm:divide-primary-100">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            {facts.map((f) => (
              <div
                key={f.label}
                className="group flex items-center gap-3.5 p-5 transition-colors hover:bg-surface-light"
              >
                <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-105">
                  <f.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-extrabold leading-tight text-navy-dark">{f.label}</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-rolling trusted-by brands */}
      <TrustBar />

      {/* Localities / spaces in this city */}
      <section className="section-padding relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 tech-dots opacity-40 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_20%,#000,transparent)]" />
        <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-primary-200/20 blur-3xl" />
        <div className="container-custom relative">
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
      <section className="section-padding relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary-300/10 blur-3xl" />
        <div className="container-custom relative">
          <SectionHeading
            eyebrow="Why EaseMyOffice"
            title={`Why Choose a Virtual Office in ${cityName}`}
            accent={cityName}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={(i % 4) * 0.07}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100/70 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover">
                  {/* faint number watermark */}
                  <span className="pointer-events-none absolute right-5 top-4 text-5xl font-black text-primary-50 transition-colors duration-300 group-hover:text-primary-100">
                    0{i + 1}
                  </span>

                  <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-105">
                    <b.icon className="h-7 w-7" />
                  </span>
                  <h3 className="relative mt-5 text-base font-bold text-navy-dark">{b.title}</h3>
                  <p className="relative mt-2 flex-1 text-sm leading-relaxed text-slate-600">{b.desc}</p>
                  <span className="relative mt-5 h-1 w-8 rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-300 group-hover:w-16" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof — animated stats + real reviews */}
      <ClientsStrip />
      <GoogleReviews />

      {/* Addresses note */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <Reveal>
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-primary-100 bg-white p-8 shadow-card-hover ring-1 ring-primary-100/50 lg:p-10">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary-100/50 blur-3xl" />
              <div className="pointer-events-none absolute inset-0 tech-dots opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_80%_10%,#000,transparent)]" />

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
                    Verified addresses across {cityName}
                  </h3>
                </div>
              </div>

              <p className="relative mt-5 max-w-2xl leading-relaxed text-slate-600">
                Our {cityName} addresses are located in reputed commercial districts, fully verified
                and accepted for GST and MCA filings. Exact address details are shared once you choose
                a plan — you can even register in multiple {cityName} locations to expand your reach.
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

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading eyebrow="FAQ" title={`Virtual Office in ${cityName} — FAQs`} accent={cityName} />
          <Reveal className="mx-auto mt-12 max-w-3xl">
            <FaqAccordion items={cityFaqs} />
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

            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-100 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                Ready in 2–3 days
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl lg:text-[2.75rem]">
                Set up your <span className="gold-text">{cityName}</span> business address today
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-100">
                Join <span className="font-bold text-white">5,000+ businesses</span> registered with
                EaseMyOffice across {region}.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => openLead()}
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
              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-white/10 pt-7 text-sm font-medium text-primary-100/80">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  4.9/5 on Google
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-emerald-300" />
                  98.7% approval rate
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  No lock-in · No hidden fees
                </span>
                <Link
                  to="/virtual-office"
                  className="inline-flex items-center gap-1.5 font-bold text-white underline-offset-4 hover:underline"
                >
                  Explore all cities
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
