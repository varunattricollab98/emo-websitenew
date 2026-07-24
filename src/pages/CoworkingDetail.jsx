import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Star,
  ArrowRight,
  ArrowLeft,
  Check,
  Users,
  Sun,
  Armchair,
  DoorClosed,
  Building2,
  Phone,
  Clock,
  BadgeCheck,
  Wifi,
  Quote,
} from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import SmartImage from '../components/ui/SmartImage'
import FaqAccordion from '../components/ui/FaqAccordion'
import { getCoworkingSpaceBySlug, slugifyCoworking } from '../data/coworkingSpaces'
import { voCities, spaceStats } from '../data/spaces'
import { useLeadModal } from '../context/LeadModalContext'

const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80',
]

const BASE_AMENITIES = [
  'High-speed Wi-Fi',
  'Meeting & conference rooms',
  'Reception & front desk',
  'Printing & scanning',
  'Pantry & unlimited coffee',
  'Housekeeping',
  'Power backup',
  'CCTV security',
  'Ergonomic chairs',
]

function toTitle(str = '') {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const round100 = (n) => Math.round(n / 100) * 100

export default function CoworkingDetail() {
  const { city, space } = useParams()
  const { openLeadModal } = useLeadModal()

  const sp = getCoworkingSpaceBySlug(city, space)
  const cityName = voCities.find((c) => c.slug === city)?.name || toTitle(city)
  const region = voCities.find((c) => c.slug === city)?.state || 'India'

  if (!sp) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom max-w-lg text-center">
          <h1 className="text-2xl font-bold text-navy-dark">Coworking space not found</h1>
          <Button to="/coworking" className="mt-6">
            Explore Coworking Spaces <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    )
  }

  const [activeImg, setActiveImg] = useState(sp.image || DEFAULT_GALLERY[0])
  const thumbs = [...new Set([sp.image, ...DEFAULT_GALLERY].filter(Boolean))]
  const stats = spaceStats(`cowork-${city}-${space}`)
  const reviewCount = 40 + (stats.monthly % 120)

  // amenities = curated tags + base set (deduped)
  const amenities = [...new Set([...(sp.tags || []), ...BASE_AMENITIES])]

  const book = (plan) =>
    openLeadModal({
      title: `Book a tour — ${sp.name}, ${cityName}`,
      subtitle: 'Share your details and our team will schedule a visit and confirm availability.',
      service: `${plan ? plan + ' — ' : ''}${sp.name}, ${sp.locality}, ${cityName}`,
      city: cityName,
    })

  const plans = [
    {
      name: 'Hot Desk',
      price: round100(sp.price * 0.55),
      unit: '/seat/mo',
      icon: Armchair,
      note: 'Flexible open-desk access — sit anywhere, any day.',
    },
    {
      name: 'Dedicated Desk',
      price: sp.price,
      unit: '/seat/mo',
      icon: Users,
      note: 'Your own fixed desk with storage and 24x7 access.',
      popular: true,
    },
    {
      name: 'Private Cabin',
      price: round100(sp.price * 1.7),
      unit: '/seat/mo',
      icon: DoorClosed,
      note: 'A lockable private office for your team.',
    },
    {
      name: 'Day Pass',
      price: sp.dayPass,
      unit: '/day',
      icon: Sun,
      note: 'Drop in for a day with full amenity access.',
    },
  ]

  const reviews = [
    {
      name: 'Karan Mehta',
      role: 'Founder, SaaS Startup',
      rating: 5,
      text: `Great vibe at ${sp.name}. Fast Wi-Fi, clean meeting rooms and a helpful front desk — our team loves it.`,
    },
    {
      name: 'Priya Nair',
      role: 'Design Lead',
      rating: 5,
      text: `The ${sp.locality} location is super convenient and the day passes are great value. Booked a dedicated desk within a week.`,
    },
    {
      name: 'Aditya Rao',
      role: 'Operations Manager',
      rating: 4,
      text: `Solid coworking space in ${cityName}. Comfortable seating, good coffee and reliable power backup.`,
    },
  ]

  const faqs = [
    {
      q: `Can I book a single day at ${sp.name}?`,
      a: `Yes. A day pass at ${sp.name}, ${sp.locality} is ₹${sp.dayPass} and includes Wi-Fi, coffee and access to common areas.`,
    },
    {
      q: `Is ${sp.name} accessible 24x7?`,
      a: `Dedicated desks and private cabins come with round-the-clock secure access. Hot-desk access follows standard operating hours unless upgraded.`,
    },
    {
      q: `Are meeting rooms included?`,
      a: `Dedicated desk and private cabin members get monthly meeting-room credits. Extra hours can be booked on demand at member rates.`,
    },
    {
      q: `Can I use this ${cityName} address for GST or company registration?`,
      a: `Yes. ${sp.name} can double as a registrable business address in ${cityName}. Talk to our team to add GST or company registration documentation.`,
    },
    {
      q: `How many seats can I book?`,
      a: `${sp.name} supports teams from ${sp.seats}. Whether you are a solo founder or scaling team, we can tailor a plan for you.`,
    },
  ]

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-primary-100 bg-white">
        <div className="container-custom flex flex-wrap items-center gap-1.5 py-4 text-sm text-slate-500">
          <Link to="/coworking" className="hover:text-primary">
            Coworking
          </Link>
          <span>/</span>
          <Link to={`/coworking?city=${city}`} className="hover:text-primary">
            {cityName}
          </Link>
          <span>/</span>
          <span className="font-semibold text-navy-dark">{sp.name}</span>
        </div>
      </div>

      {/* ===== Hero ===== */}
      <section className="bg-white pt-8 lg:pt-10">
        <div className="container-custom grid gap-8 lg:grid-cols-2">
          {/* gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-3xl shadow-card-hover ring-1 ring-navy-dark/10">
              <div className="relative h-72 bg-primary-gradient sm:h-96">
                <SmartImage
                  src={activeImg}
                  alt={`${sp.name}, ${sp.locality}, ${cityName}`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-navy-dark shadow-soft backdrop-blur">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  {sp.rating}
                </span>
                {sp.popular && (
                  <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-gold to-gold-dark px-3 py-1.5 text-xs font-bold text-white shadow-gold-glow">
                    POPULAR
                  </span>
                )}
              </div>
            </div>
            <div className="sky-scroll mt-3 flex gap-3 overflow-x-auto pb-1">
              {thumbs.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(img)}
                  aria-label={`Photo ${i + 1}`}
                  className={`h-16 w-24 flex-none overflow-hidden rounded-xl ring-2 transition ${
                    activeImg === img ? 'ring-primary' : 'ring-transparent hover:ring-primary/40'
                  }`}
                >
                  <SmartImage src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              Coworking Space
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-dark sm:text-4xl">
              {sp.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {sp.locality}, {cityName} · {region}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-gold text-gold" />
                <span className="font-bold text-navy-dark">{sp.rating}</span>
                <span className="text-slate-400">({reviewCount} reviews)</span>
              </span>
            </div>

            {/* live activity strip */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                {stats.weekly} tours booked this week
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
                <Users className="h-4 w-4 text-primary" />
                {sp.seats}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-2">
              <div className="flex items-end gap-1">
                <span className="text-sm font-medium text-slate-400">Dedicated desk</span>
                <span className="ml-1 text-3xl font-extrabold text-navy-dark">
                  ₹{sp.price.toLocaleString('en-IN')}
                </span>
                <span className="mb-1 text-sm text-slate-400">/seat/mo</span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-light px-3 py-1.5 text-sm font-semibold text-navy">
                <Sun className="h-4 w-4 text-gold-dark" />
                Day pass ₹{sp.dayPass}
              </span>
            </div>

            <p className="mt-4 leading-relaxed text-slate-600">
              {sp.name} is a move-in-ready coworking space in {sp.locality}, {cityName} — designed for
              focused work with premium amenities, flexible plans and a vibrant community. No lock-in,
              no brokerage.
            </p>

            {/* quick tags */}
            <div className="mt-5 flex flex-wrap gap-2">
              {(sp.tags || []).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-white px-3 py-1.5 text-xs font-semibold text-navy-dark shadow-soft"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                  {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => book()} size="lg">
                Book a Tour <ArrowRight className="h-5 w-5" />
              </Button>
              <a
                href="tel:8882735038"
                className="btn-base border-2 border-primary/30 px-6 py-3 text-sm text-primary hover:bg-primary-50"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                No lock-in
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                Zero brokerage
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                Dedicated manager
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== About + quick facts ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            align="left"
            eyebrow="About the space"
            title={sp.name}
            accent={sp.locality}
            subtitle={`A flexible coworking space in ${sp.locality}, ${cityName} — built for productivity with premium amenities and a thriving community.`}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, label: 'Location', value: `${sp.locality}, ${cityName}` },
              { icon: Users, label: 'Capacity', value: sp.seats },
              { icon: Sun, label: 'Day pass', value: `₹${sp.dayPass}/day` },
              { icon: BadgeCheck, label: 'Registration', value: 'GST & MCA ready' },
            ].map((f) => (
              <div
                key={f.label}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100/70 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-105">
                  <f.icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {f.label}
                </p>
                <p className="mt-1 flex-1 text-sm font-bold leading-snug text-navy-dark">{f.value}</p>
                <span className="mt-4 h-1 w-8 rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-300 group-hover:w-14" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Amenities ===== */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading eyebrow="Amenities" title="What's Available Here" accent="Available" />
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
            {amenities.map((a) => (
              <div
                key={a}
                className="flex items-center gap-3 rounded-2xl border border-primary-100/70 bg-white px-4 py-3 shadow-soft"
              >
                <span className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span className="text-sm font-semibold text-navy-dark">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Plans ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Plans & Pricing"
            title={`Plans at ${sp.name}`}
            accent={sp.name}
            subtitle="Transparent, brokerage-free pricing — pick the plan that fits your team."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((p) => (
              <Reveal key={p.name}>
                <div
                  className={`group relative flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5 ${
                    p.popular
                      ? 'bg-gradient-to-b from-primary-50 via-white to-white shadow-card-hover ring-2 ring-gold'
                      : 'bg-white shadow-card ring-1 ring-primary-100/70 hover:shadow-card-hover'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute left-1/2 top-0 z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-gold-dark px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-gold-glow">
                      Most Popular
                    </span>
                  )}
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-navy-dark">{p.name}</h3>
                  <p className="mt-1 flex-1 text-sm text-slate-500">{p.note}</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="mb-1 text-lg font-bold text-navy-dark">₹</span>
                    <span className="text-3xl font-extrabold leading-none text-navy-dark">
                      {Number(p.price).toLocaleString('en-IN')}
                    </span>
                    <span className="mb-1 text-xs text-slate-400">{p.unit}</span>
                  </div>
                  <Button
                    onClick={() => book(p.name)}
                    variant={p.popular ? 'gold' : 'primary'}
                    className="mt-6 w-full"
                  >
                    Book a Tour <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Book band ===== */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <div
            className="relative overflow-hidden rounded-[2rem] px-6 py-12 text-center shadow-card-hover ring-1 ring-white/10 sm:px-12"
            style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 60%, #16508f 120%)' }}
          >
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.06]" />
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Tour <span className="gold-text">{sp.name}</span> in {cityName}
              </h2>
              <p className="mt-3 text-primary-100">
                Book a free tour, check availability and get a brokerage-free quote from your dedicated
                manager.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => book()}
                  className="btn-base bg-gradient-to-r from-gold to-gold-dark px-8 py-4 text-base text-white shadow-card hover:shadow-gold-glow hover:brightness-105"
                >
                  Book a Tour <ArrowRight className="h-5 w-5" />
                </button>
                <Link
                  to={`/coworking?city=${city}`}
                  className="btn-base border-2 border-white/40 px-8 py-4 text-base text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                  More in {cityName}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Reviews ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Client Reviews"
            title={`What Members Say About ${sp.name}`}
            accent={sp.name}
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.name + i} delay={i * 0.08}>
                <div className="premium-card h-full p-7">
                  <Quote className="h-8 w-8 text-primary-200" />
                  <div className="mt-3 flex gap-0.5">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <Star
                        key={n}
                        className={`h-4 w-4 ${
                          n < (r.rating || 5) ? 'fill-gold text-gold' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">“{r.text}”</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-primary-100/70 pt-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-gradient text-sm font-bold text-white">
                      {r.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-navy-dark">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="FAQ"
            title={`${sp.name} — Questions Answered`}
            accent="Questions Answered"
          />
          <Reveal className="mx-auto mt-12 max-w-3xl">
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>
    </>
  )
}
