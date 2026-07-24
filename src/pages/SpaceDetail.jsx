import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Star,
  Flame,
  ArrowRight,
  ArrowLeft,
  Check,
  Wifi,
  Presentation,
  Printer,
  Coffee,
  ShieldCheck,
  Clock,
  ParkingSquare,
  Mailbox,
  CalendarCheck,
  TrendingUp,
  Users,
  Building2,
  Phone,
  BadgeCheck,
} from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import SmartImage from '../components/ui/SmartImage'
import Counter from '../components/ui/Counter'
import { voCities, getSpaceBySlug, spaceStats } from '../data/spaces'
import { getCityBySlug } from '../data/cities'
import { useLeadModal } from '../context/LeadModalContext'

const amenities = [
  { icon: Wifi, label: 'High-speed Wi-Fi' },
  { icon: Presentation, label: 'Meeting rooms' },
  { icon: Users, label: 'Reception & front desk' },
  { icon: Mailbox, label: 'Mail & courier handling' },
  { icon: Coffee, label: 'Pantry & café' },
  { icon: Printer, label: 'Print & scan' },
  { icon: ParkingSquare, label: 'Parking' },
  { icon: ShieldCheck, label: '24x7 CCTV security' },
  { icon: Clock, label: 'Round-the-clock access' },
]

export default function SpaceDetail() {
  const { city, space } = useParams()
  const { openLeadModal } = useLeadModal()

  const sp = getSpaceBySlug(city, space)
  const cityName = voCities.find((c) => c.slug === city)?.name || 'India'
  const region = voCities.find((c) => c.slug === city)?.state || 'India'
  const extra = getCityBySlug(city)

  // graceful fallback if the space isn't found
  if (!sp) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom max-w-lg text-center">
          <h1 className="text-2xl font-bold text-navy-dark">Space not found</h1>
          <p className="mt-3 text-slate-600">
            We couldn&apos;t find that space. Explore all our verified spaces instead.
          </p>
          <Button to="/virtual-office" className="mt-6">
            Explore Spaces <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    )
  }

  const stats = spaceStats(`${city}-${space}`)
  const basePrice = sp.price || extra?.price || 999

  const openLead = (svc) =>
    openLeadModal({
      title: `${sp.name}, ${cityName}`,
      subtitle: 'Share your details and our team will call you back within one business day.',
      service: `${svc || 'Virtual Office'} — ${sp.name}, ${cityName}`,
      city: cityName,
    })

  const plans = [
    { name: 'Mailing Address', price: basePrice - 200, note: 'Professional address + mail handling' },
    { name: 'GST Registration', price: basePrice, note: 'GST-ready kit: agreement, NOC & bill', popular: true },
    { name: 'Company Registration', price: basePrice + 300, note: 'Registered office + full MCA kit' },
  ]

  const liveStats = [
    { icon: TrendingUp, to: stats.monthly, suffix: '+', label: 'Bookings this month' },
    { icon: CalendarCheck, to: stats.weekly, suffix: '', label: 'Booked this week' },
    { icon: Users, to: stats.seatsAvail, suffix: '', label: 'Seats available now' },
    { icon: BadgeCheck, to: stats.occupancy, suffix: '%', label: 'Occupancy rate' },
  ]

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="pointer-events-none absolute inset-0 tech-dots opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_40%_40%,#000,transparent)]" />
        <div className="container-custom relative py-10 lg:py-14">
          {/* breadcrumb */}
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Link to="/virtual-office" className="hover:text-primary">
              Virtual Office
            </Link>
            <span>/</span>
            <Link to={`/virtual-office/${city}`} className="hover:text-primary">
              {cityName}
            </Link>
            <span>/</span>
            <span className="font-semibold text-navy-dark">{sp.name}</span>
          </div>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-2">
            {/* image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl shadow-card-hover ring-1 ring-navy-dark/10"
            >
              <div className="relative h-64 bg-primary-gradient sm:h-80">
                <SmartImage
                  src={sp.image}
                  alt={`${sp.name}, ${cityName}`}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-dark/40 to-transparent" />
                {sp.badge && (
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold to-gold-dark px-3 py-1.5 text-xs font-bold text-white shadow-gold-glow">
                    <Flame className="h-3.5 w-3.5" />
                    {sp.badge}
                  </span>
                )}
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-navy-dark shadow-soft backdrop-blur">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  {sp.rating}
                </span>
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold text-white shadow-soft backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  {sp.tags?.length ? 'Available now' : 'Available'}
                </span>
              </div>
            </motion.div>

            {/* info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-3xl font-extrabold tracking-tight text-navy-dark sm:text-4xl">
                {sp.name}
              </h1>
              <p className="mt-2 inline-flex items-center gap-1.5 text-slate-500">
                <MapPin className="h-4 w-4 text-primary" />
                {sp.name}, {cityName} · {region}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {sp.tags?.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-end gap-1">
                <span className="text-sm font-medium text-slate-400">From</span>
                <span className="ml-1 text-3xl font-extrabold text-navy-dark">
                  ₹{basePrice.toLocaleString('en-IN')}
                </span>
                <span className="mb-1 text-sm text-slate-400">/mo</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => openLead('Book a visit')}>
                  Book a Visit <ArrowRight className="h-4 w-4" />
                </Button>
                <button
                  type="button"
                  onClick={() => openLead('Enquiry')}
                  className="btn-base border-2 border-primary/30 px-6 py-3 text-sm text-primary hover:bg-primary-50"
                >
                  Enquire Now
                </button>
                <a
                  href="tel:8882735038"
                  className="btn-base border-2 border-primary/30 px-5 py-3 text-sm text-primary hover:bg-primary-50"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Live booking stats ===== */}
      <section className="bg-white py-10">
        <div className="container-custom">
          <div className="mb-5 flex items-center justify-center gap-2 sm:justify-start">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Live activity at this space
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {liveStats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-primary-100 bg-surface-light p-5 text-center shadow-soft"
              >
                <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-3xl font-extrabold text-navy-dark">
                  <Counter to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400 sm:text-left">
            Figures update automatically as bookings are made.
          </p>
        </div>
      </section>

      {/* ===== Amenities ===== */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Amenities"
            title={`What's Available at ${sp.name}`}
            accent="Available"
            subtitle="Everything your business needs, ready to use from day one."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {amenities.map((a, i) => (
              <Reveal key={a.label} delay={(i % 3) * 0.05}>
                <div className="group flex items-center gap-3 rounded-2xl border border-primary-100/70 bg-white p-4 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                  <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary-gradient group-hover:text-white">
                    <a.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-navy-dark">{a.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Availability + Plans ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* availability card */}
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-surface-light p-7 shadow-soft">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
              <h3 className="flex items-center gap-2 text-lg font-bold text-navy-dark">
                <CalendarCheck className="h-5 w-5 text-primary" />
                Availability
              </h3>
              <ul className="mt-5 space-y-3">
                {[
                  { k: 'Dedicated desks', v: `${stats.seatsAvail} available` },
                  { k: 'Private cabins', v: `${Math.max(1, Math.round(stats.seatsAvail / 8))} available` },
                  { k: 'Meeting rooms', v: 'On-demand, hourly' },
                  { k: 'Virtual office', v: 'Instant activation' },
                ].map((row) => (
                  <li
                    key={row.k}
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm"
                  >
                    <span className="font-semibold text-navy-dark">{row.k}</span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-accent-emerald">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {row.v}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl border border-primary-100 bg-white px-4 py-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Occupancy</span>
                  <span className="text-navy-dark">{stats.occupancy}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary-100">
                  <div
                    className="h-full rounded-full bg-primary-gradient"
                    style={{ width: `${stats.occupancy}%` }}
                  />
                </div>
              </div>
            </div>
          </Reveal>

          {/* plans */}
          <Reveal delay={0.1}>
            <h3 className="text-lg font-bold text-navy-dark">Plans at {sp.name}</h3>
            <p className="mt-1 text-sm text-slate-500">Transparent annual pricing, no hidden fees.</p>
            <div className="mt-5 space-y-3">
              {plans.map((p) => (
                <div
                  key={p.name}
                  className={`flex items-center justify-between gap-4 rounded-2xl border p-5 transition-all hover:shadow-card ${
                    p.popular
                      ? 'border-gold/50 bg-gradient-to-r from-primary-50 to-white ring-1 ring-gold/30'
                      : 'border-primary-100 bg-white'
                  }`}
                >
                  <div>
                    <p className="flex items-center gap-2 font-bold text-navy-dark">
                      {p.name}
                      {p.popular && (
                        <span className="rounded-full bg-gradient-to-r from-gold to-gold-dark px-2 py-0.5 text-[10px] font-bold text-white">
                          POPULAR
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{p.note}</p>
                  </div>
                  <div className="flex flex-none flex-col items-end">
                    <span className="text-lg font-extrabold text-navy-dark">
                      ₹{p.price.toLocaleString('en-IN')}
                      <span className="text-xs font-medium text-slate-400">/yr</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => openLead(p.name)}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-700"
                    >
                      Choose <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== About / location ===== */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom max-w-3xl">
          <SectionHeading
            align="left"
            eyebrow="About this space"
            title={`${sp.name}, ${cityName}`}
            accent={cityName}
          />
          <p className="mt-5 leading-relaxed text-slate-600">
            {sp.name} is a verified, premium business address in {cityName}, {region} — located in a
            reputed commercial district and fully accepted for GST and MCA filings. Whether you need
            a professional mailing address, a GST-ready virtual office, or a registered office for
            your company, this space is ready to activate in just 2–3 business days.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            Exact address details are shared once you choose a plan. You can also add on coworking
            desks, private cabins and meeting rooms whenever your team needs a place to sit.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => openLead('Book a visit')}>
              Book a Visit <ArrowRight className="h-4 w-4" />
            </Button>
            <Link
              to={`/virtual-office/${city}`}
              className="btn-base border-2 border-primary/30 px-6 py-3 text-sm text-primary hover:bg-primary-50"
            >
              <ArrowLeft className="h-4 w-4" />
              More in {cityName}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
