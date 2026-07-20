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

const stats = [
  { icon: Star, value: '4.9/5', label: 'Google rating' },
  { icon: Building2, value: '15,000+', label: 'Businesses served' },
  { icon: MapPin, value: '250+', label: 'Locations' },
  { icon: ShieldCheck, value: '28', label: 'States covered' },
]

const trustedBrands = ['Verizon', 'IndiaMART', 'Shiprocket', 'Udaan', "Dr. Reddy's", 'Xpressbees']

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
      {/* refined, subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(44,103,158,0.10),transparent_70%)]" />
      <div className="pointer-events-none absolute -right-40 top-10 h-[30rem] w-[30rem] rounded-full bg-primary-100/50 blur-3xl" />

      <div className="container-custom relative py-16 lg:py-24">
        {/* Headline block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700 shadow-sm backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-accent-green" />
            India&apos;s Trusted Virtual Office Platform
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy-dark sm:text-5xl lg:text-[3.75rem] text-balance">
            Your Business Address in{' '}
            <span className="gradient-text">Every Major City</span> of India
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Get a premium, GST-compliant virtual office, coworking space, or meeting room — across
            250+ locations in 28 states. Verified addresses, ready in 2–3 days.
          </p>
        </motion.div>

        {/* Prominent unified search bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="relative mx-auto mt-10 max-w-3xl"
        >
          <div className="pointer-events-none absolute -inset-2 rounded-[24px] bg-primary/10 blur-xl" />
          <div className="relative flex flex-col gap-2 rounded-2xl border border-primary-100 bg-white p-2 shadow-card-hover sm:flex-row sm:items-center sm:gap-0">
            {/* location */}
            <div className="flex flex-1 items-center gap-2.5 px-4 py-3">
              <MapPin className="h-5 w-5 flex-none text-primary" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search your city or location…"
                className="w-full bg-transparent text-sm font-medium text-navy-dark placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* divider */}
            <div className="hidden h-9 w-px bg-slate-200 sm:block" />

            {/* service */}
            <div className="relative flex items-center px-4 py-3 sm:min-w-[190px]">
              <Layers className="h-5 w-5 flex-none text-primary" />
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                aria-label="Service type"
                className="w-full appearance-none bg-transparent pl-2.5 pr-6 text-sm font-medium text-navy-dark focus:outline-none"
              >
                {serviceTypes.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
            </div>

            {/* button */}
            <button
              type="submit"
              className="btn-base bg-primary-gradient px-8 py-3.5 text-sm text-white shadow-card transition hover:brightness-110 sm:rounded-xl"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>

          {/* popular chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
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
        </motion.form>

        {/* Stats strip — clean, structured, professional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-primary-100/70 bg-white/70 px-4 py-5 text-center shadow-sm backdrop-blur"
            >
              <s.icon className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-2xl font-extrabold text-navy-dark">{s.value}</p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Trusted-by strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mx-auto mt-14 max-w-5xl"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Trusted by leading brands across India
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustedBrands.map((b) => (
              <span
                key={b}
                className="text-base font-bold tracking-tight text-slate-400 transition-colors hover:text-slate-600 sm:text-lg"
              >
                {b}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
