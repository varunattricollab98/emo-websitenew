import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Search,
  ChevronDown,
  Star,
  ArrowRight,
  Flame,
  Layers,
  Check,
  BadgeCheck,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import { voCities, spacesByCity } from '../../data/spaces'

const VISIBLE = 8

const purposes = [
  { v: '', l: 'Any purpose' },
  { v: 'GST', l: 'GST Registration' },
  { v: 'Company Reg', l: 'Company Registration' },
  { v: 'Mailing', l: 'Mailing Address' },
  { v: 'APOB', l: 'APOB / Multi-state' },
]

const highlights = [
  { icon: BadgeCheck, label: '98.7% document approval rate' },
  { icon: MapPin, label: '250+ prime locations, 28 states' },
  { icon: Clock, label: 'Ready in just 2–3 days' },
  { icon: ShieldCheck, label: '100% refund if GST rejected' },
]

export default function ExploreSpaces() {
  const [city, setCity] = useState('bangalore')
  const [query, setQuery] = useState('')
  const [purpose, setPurpose] = useState('')
  const [showAll, setShowAll] = useState(false)

  const cityName = voCities.find((c) => c.slug === city)?.name || 'Bangalore'

  const results = useMemo(() => {
    let list = spacesByCity[city] || []
    if (purpose) list = list.filter((s) => s.tags.includes(purpose))
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((s) => s.name.toLowerCase().includes(q))
    }
    return list
  }, [city, query, purpose])

  const visible = showAll ? results : results.slice(0, VISIBLE)

  return (
    <>
      {/* ===== Split hero: info left, filter form right ===== */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 tech-dots opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_40%_40%,#000,transparent)]" />

        <div className="container-custom relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          {/* ---- left: info ---- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-primary-200 bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-soft">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              Virtual Office
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.14] tracking-tight text-navy-dark text-balance sm:text-4xl lg:text-[2.9rem]">
              Virtual Office in India for{' '}
              <span className="gradient-text">GST, Company Registration &amp; Business Address</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Get a premium, compliant business address without the cost of physical space — with the
              full documentation kit, ready in days.
            </p>

            {/* info highlights as premium chips */}
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {highlights.map((h) => (
                <li
                  key={h.label}
                  className="flex items-center gap-3 rounded-xl border border-primary-100/70 bg-white/70 px-3.5 py-3 text-sm font-semibold text-navy shadow-soft backdrop-blur"
                >
                  <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-primary-50 text-primary">
                    <h.icon className="h-4 w-4" />
                  </span>
                  {h.label}
                </li>
              ))}
            </ul>

            {/* social proof */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  ['#3c82c2', '#11417c', 'R'],
                  ['#8b5cf6', '#6366f1', 'A'],
                  ['#10b981', '#059669', 'S'],
                  ['#f59e0b', '#d97706', 'M'],
                ].map((a, idx) => (
                  <span
                    key={idx}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-white"
                    style={{ background: `linear-gradient(135deg, ${a[0]}, ${a[1]})` }}
                  >
                    {a[2]}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <Star key={n} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mt-0.5 text-sm font-semibold text-navy-dark">
                  Trusted by <span className="text-primary">5,000+ businesses</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* ---- right: filter form ---- */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-primary-300/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-6 shadow-card-hover ring-1 ring-primary-100/70 backdrop-blur-xl sm:p-7">
              {/* gold executive accent */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                  <Search className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-navy-dark">Find Your Space</h2>
                  <p className="text-xs text-slate-500">Search verified virtual offices near you</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* city */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                    <select
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value)
                        setShowAll(false)
                      }}
                      aria-label="Select city"
                      className="w-full appearance-none rounded-xl border border-primary-100 bg-surface-light py-3.5 pl-10 pr-9 text-sm font-semibold text-navy-dark focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {voCities.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* purpose */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Purpose
                  </label>
                  <div className="relative">
                    <Layers className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                    <select
                      value={purpose}
                      onChange={(e) => {
                        setPurpose(e.target.value)
                        setShowAll(false)
                      }}
                      aria-label="Purpose"
                      className="w-full appearance-none rounded-xl border border-primary-100 bg-surface-light py-3.5 pl-10 pr-9 text-sm font-semibold text-navy-dark focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {purposes.map((p) => (
                        <option key={p.v} value={p.v}>
                          {p.l}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* locality */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Locality
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={`Search locality in ${cityName}…`}
                      aria-label="Search locality"
                      className="w-full rounded-xl border border-primary-100 bg-surface-light py-3.5 pl-10 pr-4 text-sm text-navy-dark placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <a
                  href="#spaces"
                  className="btn-base w-full bg-primary-gradient px-6 py-3.5 text-sm text-white shadow-card transition-all hover:shadow-glow hover:brightness-110"
                >
                  View Spaces
                  <ArrowRight className="h-4 w-4" />
                </a>
                <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" />
                  {results.length}+ verified spaces in {cityName} · No spam, ever
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Spaces grid ===== */}
      <section id="spaces" className="section-padding scroll-mt-20 bg-white">
        <div className="container-custom">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <MapPin className="h-3.5 w-3.5" />
                {cityName}
                {purpose && <span className="text-primary-400">· {purpose}</span>}
              </span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-dark sm:text-3xl">
                Virtual Offices in <span className="gradient-text">{cityName}</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {results.length} verified {results.length === 1 ? 'space' : 'spaces'} available
              </p>
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-dashed border-primary-200 bg-surface-light p-10 text-center text-slate-500">
              No spaces match your filters. Try another locality or purpose.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visible.map((sp, i) => (
                <motion.div
                  key={`${sp.name}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                >
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
                      <p className="mt-0.5 text-xs text-slate-500">{cityName}</p>
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
                        <a
                          href="#book-form"
                          className="btn-base bg-primary-50 px-3.5 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-100"
                        >
                          Enquire
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {results.length > VISIBLE && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-6 py-3 text-sm font-bold text-primary shadow-soft transition-all hover:border-primary/40 hover:shadow-card"
              >
                {showAll ? 'Show Less' : `View More Spaces in ${cityName}`}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
