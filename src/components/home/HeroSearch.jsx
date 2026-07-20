import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Search,
  ChevronDown,
  Star,
  Building2,
  Layers,
  ShieldCheck,
  Zap,
  BadgeCheck,
} from 'lucide-react'
import SmartImage from '../ui/SmartImage'

const serviceTypes = [
  { value: 'virtual-office', label: 'Virtual Office' },
  { value: 'coworking', label: 'Coworking' },
  { value: 'meeting-room', label: 'Meeting Room' },
  { value: 'ca-services', label: 'CA Services' },
]

const serviceRoutes = {
  'virtual-office': '/virtual-office',
  coworking: '/coworking',
  'meeting-room': '/meeting-rooms',
  'ca-services': '/ca-services',
}

const popularCities = ['Delhi', 'Mumbai', 'Bangalore', 'Gurgaon', 'Hyderabad', 'Pune']

const trustRow = [
  { icon: Star, label: '4.9/5 Google' },
  { icon: Building2, label: '15,000+ businesses' },
  { icon: MapPin, label: '250+ locations' },
  { icon: ShieldCheck, label: '28 states' },
]

export default function HeroSearch() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [service, setService] = useState('virtual-office')

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(serviceRoutes[service] || '/virtual-office')
  }

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      {/* decorative blur shapes */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-48 h-80 w-80 rounded-full bg-primary-100/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(44,103,158,0.12),transparent_45%)]" />
      {/* subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#11417c 1px, transparent 1px), linear-gradient(90deg, #11417c 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ===== Floating decorative cards (desktop only) ===== */}
      {/* top-left: office image card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="pointer-events-none absolute left-6 top-32 z-10 hidden w-52 xl:block animate-float"
      >
        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white shadow-card-hover">
          <div className="relative h-28 bg-primary-gradient">
            <SmartImage
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80"
              alt="Coworking space"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-3">
            <div className="flex items-center gap-1 text-gold">
              <Star className="h-3.5 w-3.5 fill-gold" />
              <span className="text-xs font-bold text-navy-dark">4.9</span>
              <span className="text-[11px] text-slate-400">· Prime Hub</span>
            </div>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">Koramangala, Bangalore</p>
          </div>
        </div>
      </motion.div>

      {/* top-right: verified rating card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="pointer-events-none absolute right-8 top-40 z-10 hidden xl:block animate-float"
        style={{ animationDelay: '-3s' }}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-card-hover backdrop-blur">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <BadgeCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-extrabold leading-none text-navy-dark">99%</p>
            <p className="text-[11px] font-medium text-slate-500">GST Approval Rate</p>
          </div>
        </div>
      </motion.div>

      {/* bottom-left: fast setup pill */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="pointer-events-none absolute bottom-24 left-16 z-10 hidden xl:block animate-float"
        style={{ animationDelay: '-1.5s' }}
      >
        <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-4 py-2.5 shadow-card backdrop-blur">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-gold">
            <Zap className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold text-navy-dark">Ready in 2–3 days</span>
        </div>
      </motion.div>

      {/* bottom-right: city image card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="pointer-events-none absolute bottom-16 right-10 z-10 hidden w-44 xl:block animate-float"
        style={{ animationDelay: '-4.5s' }}
      >
        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white shadow-card-hover">
          <div className="relative h-24">
            <div className="absolute inset-0 bg-primary-gradient" />
            <SmartImage
              src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80"
              alt="Delhi"
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-bold text-navy-dark">
              Delhi · ₹899/mo
            </span>
          </div>
        </div>
      </motion.div>

      <div className="container-custom relative z-20 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-primary-700 shadow-sm backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-accent-green" />
            India&apos;s #1 Workspace &amp; Virtual Office Marketplace
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy-dark sm:text-5xl lg:text-6xl text-balance">
            Find Your Perfect <span className="gradient-text">Virtual Office</span> &amp; Workspace
            Across India
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Premium business addresses for GST &amp; company registration, coworking spaces, and
            meeting rooms — in 250+ locations across 28 states.
          </p>
        </motion.div>

        {/* Prominent search / filter card */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="relative mx-auto mt-10 max-w-4xl"
        >
          {/* glow behind search */}
          <div className="pointer-events-none absolute -inset-3 rounded-[28px] bg-primary/10 blur-2xl" />
          <div className="relative rounded-2xl border border-primary-100/70 bg-white p-4 shadow-card-hover sm:p-5">
            <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto]">
              {/* location input */}
              <div className="flex items-center gap-2 rounded-xl border border-primary-100 bg-surface-light px-4 py-3.5 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
                <MapPin className="h-5 w-5 flex-none text-primary" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Search your city or location…"
                  className="w-full bg-transparent text-sm font-medium text-navy-dark placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* service dropdown */}
              <div className="relative flex items-center rounded-xl border border-primary-100 bg-surface-light px-4 py-3.5 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
                <Layers className="h-5 w-5 flex-none text-primary" />
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  aria-label="Service type"
                  className="w-full appearance-none bg-transparent pl-2 pr-6 text-sm font-medium text-navy-dark focus:outline-none"
                >
                  {serviceTypes.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
              </div>

              {/* search button */}
              <button
                type="submit"
                className="btn-base bg-primary-gradient px-7 py-3.5 text-sm text-white shadow-card transition hover:shadow-glow hover:brightness-110"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>

            {/* popular city chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Popular:
              </span>
              {popularCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setLocation(city)}
                  className="rounded-full border border-primary-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:border-primary/40 hover:bg-primary-50"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </motion.form>

        {/* trust row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {trustRow.map((t) => (
            <div key={t.label} className="flex items-center gap-2">
              <t.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-navy-dark">{t.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
