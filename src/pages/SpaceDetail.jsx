import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Star,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Phone,
  Clock,
  BadgeCheck,
  FileCheck2,
  Landmark,
  Mailbox,
  Quote,
  FileText,
} from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import SmartImage from '../components/ui/SmartImage'
import FaqAccordion from '../components/ui/FaqAccordion'
import ArticleBlocks from '../components/ui/ArticleBlocks'
import { voCities, getSpaceBySlug, spaceStats } from '../data/spaces'
import { getCityBySlug } from '../data/cities'
import { getSpaceDetail } from '../data/spaceDetails'
import { getLocalityDescription, toBlocks } from '../data/descriptions'
import { useLeadModal } from '../context/LeadModalContext'

const DEFAULT_IMG =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'
const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
]
const DEFAULT_AMENITIES = [
  'High-speed Wi-Fi',
  'Meeting & conference rooms',
  'Reception & front desk',
  'Mail & courier handling',
  'Café & pantry',
  'Parking',
  'Power backup',
  'CCTV security',
  '24x7 access',
]

function toTitle(str = '') {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function SpaceDetail() {
  const { city, space } = useParams()
  const { openLeadModal } = useLeadModal()

  const basic = getSpaceBySlug(city, space)
  const detail = getSpaceDetail(city, space)
  const cityName = voCities.find((c) => c.slug === city)?.name || detail?.city || toTitle(city)
  const region = voCities.find((c) => c.slug === city)?.state || detail?.state || 'India'

  if (!basic && !detail) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom max-w-lg text-center">
          <h1 className="text-2xl font-bold text-navy-dark">Space not found</h1>
          <Button to="/virtual-office" className="mt-6">
            Explore Spaces <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    )
  }

  const areaName = detail?.area || basic?.name || toTitle(space)
  const spaceName = detail?.spaceName || `${areaName} Business Hub`
  const rating = detail?.rating || basic?.rating || 4.8
  const base = getCityBySlug(city)?.price || 999
  const pricing = detail?.pricing || {
    monthly: basic?.price || 999,
    gst: base,
    br: base + 300,
    ma: Math.max(499, base - 200),
  }
  const featuredImage = detail?.featuredImage || basic?.image || DEFAULT_IMG
  const gallery = detail?.gallery?.length ? detail.gallery : DEFAULT_GALLERY
  const amenities = detail?.amenities?.length ? detail.amenities : DEFAULT_AMENITIES
  const propertyType = detail?.propertyType || 'Virtual Office & Coworking'
  const processingTime = detail?.processingTime || '2\u20133 business days'
  const fullAddress = detail?.fullAddress || `${areaName}, ${cityName}, ${region}`
  const description =
    detail?.description ||
    `${areaName} is a sought-after business location in ${cityName}, ${region}. A virtual office here gives your company a credible address for GST and company registration, along with optional coworking desks and professional mail handling — activated in just 2\u20133 business days.`
  const reviews = detail?.reviews?.length
    ? detail.reviews
    : [
        { name: 'Rahul Sharma', role: 'Founder', rating: 5, text: `Smooth GST registration on the ${areaName} address — documents were ready in days.` },
        { name: 'Ananya Kapoor', role: 'Chartered Accountant', rating: 5, text: 'Verification-ready paperwork and a helpful, responsive team. Highly recommend.' },
        { name: 'Mohit Verma', role: 'Startup Co-founder', rating: 4, text: `Premium ${cityName} address at a fair price. Great value for a growing business.` },
      ]

  // description → blocks (supports a big blog: detail.article blocks, or paragraphs split by blank lines)
  const descriptionBlocks = detail?.article
    ? detail.article
    : typeof description === 'string'
      ? description.split('\n\n').filter(Boolean)
      : [String(description)]

  // optional locality (area) description — separate from the space description
  const localityBlocks = toBlocks(getLocalityDescription(city, space))

  const [activeImg, setActiveImg] = useState(featuredImage)
  // all photos — no cap, so any number from the CSV renders
  const thumbs = [...new Set([featuredImage, ...gallery].filter(Boolean))]

  // "live" activity numbers — auto-generated & stable per space, but any field
  // can be overridden per space via `stats` in spaceDetails.js (or a backend later).
  const stats = { ...spaceStats(`${city}-${space}`), ...(detail?.stats || {}) }
  const reviewCount = detail?.reviewCount || 40 + (stats.monthly % 120)

  const book = () =>
    openLeadModal({
      title: `Book ${spaceName}, ${cityName}`,
      subtitle: 'Share your details and our team will confirm this space with you shortly.',
      service: `${areaName} — ${cityName}`,
      city: cityName,
    })

  const plans = [
    { name: 'GST Registration', price: pricing.gst, icon: FileCheck2, note: 'GST-ready address + full document kit' },
    { name: 'Business Registration', price: pricing.br, icon: Landmark, note: 'Registered office + MCA documentation', popular: true },
    { name: 'Mailing Address', price: pricing.ma, icon: Mailbox, note: 'Professional address + mail handling' },
  ]

  const faqs = [
    { q: `Is the ${areaName} address valid for GST registration?`, a: `Yes. The ${areaName}, ${cityName} address comes with the complete GST documentation kit (rent agreement, NOC, utility bill) accepted by the department.` },
    { q: `How soon can I activate this ${cityName} space?`, a: `Your ${areaName} address and documents are typically ready within ${processingTime} of submitting your KYC.` },
    { q: `Can I use this address for company registration?`, a: `Absolutely. This ${areaName} space works as a registered office for Private Limited, LLP and OPC, with full MCA documentation.` },
    { q: `Will I receive mail and couriers here?`, a: `Yes. All letters, notices and couriers are received at the ${areaName} address, and we notify and forward them to you.` },
  ]

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-primary-100 bg-white">
        <div className="container-custom flex flex-wrap items-center gap-1.5 py-4 text-sm text-slate-500">
          <Link to="/virtual-office" className="hover:text-primary">
            Virtual Office
          </Link>
          <span>/</span>
          <Link to={`/virtual-office/${city}`} className="hover:text-primary">
            {cityName}
          </Link>
          <span>/</span>
          <span className="font-semibold text-navy-dark">{areaName}</span>
        </div>
      </div>

      {/* ===== Hero: gallery (left) + space info & explanation (right) ===== */}
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
                  alt={`${areaName}, ${cityName}`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-navy-dark shadow-soft backdrop-blur">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  {rating}
                </span>
                {basic?.badge && (
                  <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-gold to-gold-dark px-3 py-1.5 text-xs font-bold text-white shadow-gold-glow">
                    {basic.badge}
                  </span>
                )}
              </div>
            </div>
            {thumbs.length > 1 && (
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
            )}
            {thumbs.length > 1 && (
              <p className="mt-2 text-xs text-slate-400">{thumbs.length} photos · tap to preview</p>
            )}
          </motion.div>

          {/* info + explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                {propertyType}
              </span>
              {basic?.badge && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold to-gold-dark px-3 py-1 text-xs font-bold text-white shadow-gold-glow">
                  🔥 {basic.badge}
                </span>
              )}
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-dark sm:text-4xl">
              {areaName}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {areaName}, {cityName} · {region}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-gold text-gold" />
                <span className="font-bold text-navy-dark">{rating}</span>
                <span className="text-slate-400">({reviewCount} reviews)</span>
              </span>
            </div>

            {/* live activity strip — makes the listing feel alive */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                {stats.weekly} booked this week
              </span>
              <span className="text-sm font-semibold text-navy">
                {stats.monthly} this month
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
                <BadgeCheck className="h-4 w-4 text-primary" />
                {stats.seatsAvail} seats available
              </span>
            </div>

            <div className="mt-5 flex items-end gap-1">
              <span className="text-sm font-medium text-slate-400">From</span>
              <span className="ml-1 text-3xl font-extrabold text-navy-dark">
                ₹{Number(pricing.monthly).toLocaleString('en-IN')}
              </span>
              <span className="mb-1 text-sm text-slate-400">/mo</span>
              <span className="mb-1 ml-2 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary">
                Ready in {processingTime}
              </span>
            </div>

            {/* short lead — full description lives in the About section below */}
            <p className="mt-4 leading-relaxed text-slate-600">
              A premium, verified business address in {areaName}, {cityName} — ready for GST and
              company registration, activated in {processingTime}.
            </p>

            {/* what's included — quick trust chips */}
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {[
                { icon: FileCheck2, label: 'GST & MCA ready docs' },
                { icon: Mailbox, label: 'Mail & courier handling' },
                { icon: Building2, label: 'Meeting room access' },
                { icon: BadgeCheck, label: 'Verified prime address' },
              ].map((it) => (
                <span
                  key={it.label}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary-100/70 bg-white px-3 py-2 text-xs font-semibold text-navy-dark shadow-soft"
                >
                  <it.icon className="h-4 w-4 flex-none text-primary" />
                  {it.label}
                </span>
              ))}
            </div>

            {/* Book — top */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={book} size="lg">
                Book This Space <ArrowRight className="h-5 w-5" />
              </Button>
              <a
                href="tel:8882735038"
                className="btn-base border-2 border-primary/30 px-6 py-3 text-sm text-primary hover:bg-primary-50"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            </div>

            {/* trust footer */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                No hidden charges
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                Dedicated manager
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                {stats.occupancy}% occupancy
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== About the space ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            align="left"
            eyebrow="About the space"
            title={spaceName}
            accent={areaName}
            subtitle={`A verified virtual office & coworking address in ${cityName}, ${region} — accepted for GST and company registration, activated in ${processingTime}.`}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, label: 'Address', value: fullAddress },
              { icon: Building2, label: 'Property type', value: propertyType },
              { icon: Clock, label: 'Activation', value: processingTime },
              { icon: BadgeCheck, label: 'Compliance', value: 'GST & MCA accepted' },
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

          {/* quick highlight strip */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-primary-100 bg-surface-light px-5 py-4">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
              <Star className="h-4 w-4 fill-gold text-gold" />
              {rating}/5 rating
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
              <BadgeCheck className="h-4 w-4 text-accent-emerald" />
              Verification-ready documents
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
              <Building2 className="h-4 w-4 text-primary" />
              From ₹{Number(pricing.monthly).toLocaleString('en-IN')}/mo
            </span>
            <button
              type="button"
              onClick={book}
              className="ml-auto inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-700"
            >
              Book this space
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* full space description / blog + area guide — premium reading cards */}
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {/* main article */}
            <div className="lg:col-span-2">
              <article className="relative overflow-hidden rounded-3xl border border-primary-100/70 bg-white p-7 shadow-card sm:p-9">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary-400 to-gold" />
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Overview
                    </p>
                    <h3 className="text-lg font-bold leading-tight text-navy-dark">
                      About {areaName}, {cityName}
                    </h3>
                  </div>
                </div>
                <div className="mt-6">
                  <ArticleBlocks blocks={descriptionBlocks} lead />
                </div>
              </article>

              {/* about the locality / area (editable, optional) */}
              {localityBlocks.length > 0 && (
                <article className="relative mt-6 overflow-hidden rounded-3xl border border-primary-100/70 bg-surface-light p-7 shadow-card sm:p-9">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-dark text-white shadow-card">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Location guide
                      </p>
                      <h3 className="text-lg font-bold leading-tight text-navy-dark">
                        Why {areaName}?
                      </h3>
                    </div>
                  </div>
                  <div className="mt-6">
                    <ArticleBlocks blocks={localityBlocks} />
                  </div>
                </article>
              )}
            </div>

            {/* sticky quick-facts sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 rounded-3xl border border-primary-100/70 bg-white p-6 shadow-card">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  At a glance
                </p>
                <div className="mt-4 space-y-4">
                  {[
                    { icon: MapPin, label: 'Location', value: `${areaName}, ${cityName}` },
                    { icon: Building2, label: 'Property', value: propertyType },
                    { icon: Clock, label: 'Activation', value: processingTime },
                    { icon: BadgeCheck, label: 'Compliance', value: 'GST & MCA accepted' },
                  ].map((f) => (
                    <div key={f.label} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <f.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {f.label}
                        </p>
                        <p className="text-sm font-semibold leading-snug text-navy-dark">
                          {f.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-primary-100/70 pt-5">
                  <div className="flex items-end gap-1">
                    <span className="text-sm font-medium text-slate-400">From</span>
                    <span className="ml-1 text-2xl font-extrabold text-navy-dark">
                      ₹{Number(pricing.monthly).toLocaleString('en-IN')}
                    </span>
                    <span className="mb-0.5 text-sm text-slate-400">/mo</span>
                  </div>
                  <Button onClick={book} className="mt-4 w-full">
                    Book This Space <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ===== Amenities ===== */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading eyebrow="Amenities" title={`What's Available Here`} accent="Available" />
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

      {/* ===== Plans & pricing ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Plans & Pricing"
            title={`Plans at ${areaName}`}
            accent={areaName}
            subtitle="Transparent pricing with no hidden charges — pick what fits your business."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <Reveal key={p.name}>
                <div
                  className={`group relative flex h-full flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 ${
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
                  <p className="mt-1 text-sm text-slate-500">{p.note}</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="mb-1 text-xl font-bold text-navy-dark">₹</span>
                    <span className="text-4xl font-extrabold leading-none text-navy-dark">
                      {Number(p.price).toLocaleString('en-IN')}
                    </span>
                    <span className="mb-1 text-sm text-slate-400">/year</span>
                  </div>
                  <Button
                    onClick={book}
                    variant={p.popular ? 'gold' : 'primary'}
                    className="mt-6 w-full"
                  >
                    Book This Space <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Book this space — bottom band ===== */}
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
                Book <span className="gold-text">{areaName}</span> for your business
              </h2>
              <p className="mt-3 text-primary-100">
                Ready in {processingTime}. Transparent pricing, dedicated manager, no hidden charges.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={book}
                  className="btn-base bg-gradient-to-r from-gold to-gold-dark px-8 py-4 text-base text-white shadow-card hover:shadow-gold-glow hover:brightness-105"
                >
                  Book This Space <ArrowRight className="h-5 w-5" />
                </button>
                <Link
                  to={`/virtual-office/${city}`}
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

      {/* ===== Client reviews ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Client Reviews"
            title={`What Clients Say About ${areaName}`}
            accent={areaName}
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
          <SectionHeading eyebrow="FAQ" title={`${areaName} — Questions Answered`} accent="Questions Answered" />
          <Reveal className="mx-auto mt-12 max-w-3xl">
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>
    </>
  )
}
