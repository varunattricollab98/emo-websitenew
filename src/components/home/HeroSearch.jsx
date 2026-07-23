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
} from 'lucide-react'

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
  { icon: Building2, label: '5,000+ businesses' },
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(44,103,158,0.12),transparent_45%)]" />

      <div className="container-custom relative py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-primary-50 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-soft ring-1 ring-primary-100/60 sm:text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-green" />
            </span>
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

        {/* Executive booking-style search bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="relative mx-auto mt-10 max-w-4xl"
        >
          {/* soft glow behind bar */}
          <div className="pointer-events-none absolute -inset-x-6 -bottom-4 top-2 rounded-[2rem] bg-primary-300/20 blur-2xl" />

          <div className="relative rounded-2xl border border-white/80 bg-white/90 p-2 shadow-card-hover ring-1 ring-primary-100/70 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center">
              {/* location */}
              <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-surface-light">
                <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary-50 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <div className="flex-1 text-left">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Location
                  </p>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search your city or area…"
                    className="w-full bg-transparent text-sm font-semibold text-navy-dark placeholder:font-normal placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* divider */}
              <span className="mx-2 hidden h-10 w-px bg-primary-100 md:block" />

              {/* service */}
              <div className="relative flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-surface-light md:w-60">
                <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary-50 text-primary">
                  <Layers className="h-5 w-5" />
                </span>
                <div className="flex-1 text-left">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Looking for
                  </p>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    aria-label="Service type"
                    className="w-full appearance-none bg-transparent pr-6 text-sm font-semibold text-navy-dark focus:outline-none"
                  >
                    {serviceTypes.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              {/* search button */}
              <button
                type="submit"
                className="btn-base m-1 justify-center rounded-xl bg-primary-gradient px-8 py-4 text-sm text-white shadow-card transition-all hover:shadow-glow hover:brightness-110"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>
          </div>

          {/* popular city chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Popular:
            </span>
            {popularCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setLocation(city)}
                className="rounded-full border border-primary-100 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-primary-700 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-50"
              >
                {city}
              </button>
            ))}
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
