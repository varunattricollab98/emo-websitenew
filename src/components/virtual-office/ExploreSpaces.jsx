import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
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
  LayoutGrid,
  List,
} from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import { voCities, getSpaces, spacesByCity, cityMatches } from '../../data/spaces'
import { resolvePincode } from '../../data/pincodes'

// name lookup + a flat list of every space across all cities that has data
const cityNameBySlug = Object.fromEntries(voCities.map((c) => [c.slug, c.name]))
const allSpaces = Object.entries(spacesByCity).flatMap(([slug, arr]) =>
  arr.map((sp) => ({ ...sp, citySlug: slug, cityName: cityNameBySlug[slug] || slug }))
)

// Resolve a ?city= query (city name, old/alias name, or pincode) to a real city.
function resolveCityFromQuery(q) {
  const raw = String(q || '').trim()
  if (!raw) return null
  if (/^\d+$/.test(raw)) {
    const m = resolvePincode(raw)
    return m[0] ? { slug: m[0].slug, name: m[0].name } : null
  }
  const exact = voCities.find((c) => c.name.toLowerCase() === raw.toLowerCase())
  const match = exact || voCities.find((c) => cityMatches(c, raw))
  return match ? { slug: match.slug, name: match.name } : null
}

const VISIBLE = 8

// Official multicolour Google "G"
function GoogleG({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.93H1.3v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.31 14.32a7.2 7.2 0 0 1 0-4.63V6.6H1.3a12 12 0 0 0 0 10.81l4.01-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.95 1.14 15.24 0 12 0A11.99 11.99 0 0 0 1.3 6.6l4.01 3.09C6.25 6.85 8.89 4.75 12 4.75z"
      />
    </svg>
  )
}

const purposes = [
  { v: '', l: 'Any purpose' },
  { v: 'GST', l: 'GST Registration' },
  { v: 'Company Reg', l: 'Company Registration' },
  { v: 'Compliance', l: 'Compliance Management' },
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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialCity = resolveCityFromQuery(searchParams.get('city'))

  const [city, setCity] = useState(initialCity?.slug || '') // '' = all cities
  const [query, setQuery] = useState('')
  const [purpose, setPurpose] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [view, setView] = useState('grid') // 'grid' | 'list'
  const [cityOpen, setCityOpen] = useState(false)
  const [cityInput, setCityInput] = useState(initialCity?.name || '')

  // keep the selection in sync when arriving with (or changing) a ?city= param
  useEffect(() => {
    const r = resolveCityFromQuery(searchParams.get('city'))
    if (r) {
      setCity(r.slug)
      setCityInput(r.name)
      setShowAll(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const cityName = city ? cityNameBySlug[city] || 'your city' : ''

  const filteredCities = useMemo(() => {
    const q = cityInput.trim().toLowerCase()
    // when the field still shows the selected city, show the full list
    if (!q || q === cityName.toLowerCase()) return voCities
    // numeric input → treat as a pincode and resolve to matching cities
    if (/^\d+$/.test(q)) return resolvePincode(q)
    return voCities.filter((c) => cityMatches(c, q))
  }, [cityInput, cityName])

  const results = useMemo(() => {
    // no city selected → show every space across India; else that city's spaces
    let list = city
      ? (getSpaces(city) || []).map((sp) => ({
          ...sp,
          citySlug: city,
          cityName: cityNameBySlug[city] || city,
        }))
      : allSpaces
    if (purpose === 'Compliance') {
      // compliance management covers GST + company/MCA-ready addresses
      list = list.filter((s) => s.tags.includes('GST') || s.tags.includes('Company Reg'))
    } else if (purpose) {
      list = list.filter((s) => s.tags.includes(purpose))
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.cityName.toLowerCase().includes(q)
      )
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

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.24] tracking-tight text-navy-dark text-balance sm:text-4xl lg:text-[2.9rem] lg:leading-[1.2]">
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

            {/* Google rating */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-primary-100 bg-white px-5 py-3 shadow-soft">
              <GoogleG className="h-7 w-7" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-navy-dark">4.9</span>
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <Star key={n} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500">Highly rated on Google</p>
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
                {/* city — searchable dropdown */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-primary" />
                    <input
                      value={cityInput}
                      onChange={(e) => {
                        setCityInput(e.target.value)
                        setCityOpen(true)
                      }}
                      onFocus={(e) => {
                        setCityOpen(true)
                        e.target.select()
                      }}
                      placeholder="Type a city, state or pincode…"
                      aria-label="City"
                      className="w-full rounded-xl border border-primary-100 bg-surface-light py-3.5 pl-10 pr-9 text-sm font-semibold text-navy-dark placeholder:font-normal placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <ChevronDown
                      className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform ${
                        cityOpen ? 'rotate-180' : ''
                      }`}
                    />

                    {cityOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => {
                            setCityOpen(false)
                            setCityInput(cityName)
                          }}
                        />
                        <div className="absolute left-0 right-0 z-40 mt-2 rounded-2xl border border-primary-100 bg-white p-2 shadow-card-hover">
                          <ul className="sky-scroll max-h-60 space-y-0.5 overflow-y-auto pr-1">
                            {!cityInput.trim() && (
                              <li>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCity('')
                                    setCityInput('')
                                    setCityOpen(false)
                                    setShowAll(false)
                                  }}
                                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left transition-colors ${
                                    !city ? 'bg-primary-50 text-primary' : 'text-navy-dark hover:bg-surface-light'
                                  }`}
                                >
                                  <span className="min-w-0">
                                    <span className={`block text-sm ${!city ? 'font-bold' : 'font-semibold'}`}>
                                      All Cities
                                    </span>
                                    <span className="block text-[11px] text-slate-400">
                                      Spaces across India
                                    </span>
                                  </span>
                                  {!city && <Check className="h-4 w-4 flex-none text-primary" />}
                                </button>
                              </li>
                            )}
                            {filteredCities.length === 0 ? (
                              <li className="px-3 py-2 text-sm text-slate-400">No city found</li>
                            ) : (
                              filteredCities.map((c) => (
                                <li key={c.slug}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCity(c.slug)
                                      setCityInput(c.name)
                                      setCityOpen(false)
                                      setShowAll(false)
                                    }}
                                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left transition-colors ${
                                      c.slug === city
                                        ? 'bg-primary-50 text-primary'
                                        : 'text-navy-dark hover:bg-surface-light'
                                    }`}
                                  >
                                    <span className="min-w-0">
                                      <span
                                        className={`block truncate text-sm ${
                                          c.slug === city ? 'font-bold' : 'font-semibold'
                                        }`}
                                      >
                                        {c.name}
                                      </span>
                                      <span className="block truncate text-[11px] text-slate-400">
                                        {c.state}
                                      </span>
                                    </span>
                                    {c.slug === city && (
                                      <Check className="h-4 w-4 flex-none text-primary" />
                                    )}
                                  </button>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      </>
                    )}
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
                      placeholder={city ? `Search locality in ${cityName}…` : 'Search locality across India…'}
                      aria-label="Search locality"
                      className="w-full rounded-xl border border-primary-100 bg-surface-light py-3.5 pl-10 pr-4 text-sm text-navy-dark placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (city) navigate(`/virtual-office/${city}`)
                    else document.getElementById('spaces')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="btn-base w-full bg-primary-gradient px-6 py-3.5 text-sm text-white shadow-card transition-all hover:shadow-glow hover:brightness-110"
                >
                  {city ? `View ${cityName} Spaces` : 'View Spaces'}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" />
                  {results.length}+ verified spaces {city ? `in ${cityName}` : 'across India'} · No spam,
                  ever
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
                {city ? cityName : 'All India'}
                {purpose && <span className="text-primary-400">· {purpose}</span>}
              </span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-dark sm:text-3xl">
                Virtual Offices{' '}
                <span className="gradient-text">{city ? `in ${cityName}` : 'Across India'}</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {results.length} verified {results.length === 1 ? 'space' : 'spaces'} available
              </p>
              {city && (
                <Link
                  to={`/virtual-office/${city}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-primary-700"
                >
                  View full {cityName} guide &amp; pricing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {/* grid / list view toggle */}
            <div className="inline-flex items-center gap-1 rounded-xl border border-primary-100 bg-white p-1 shadow-soft">
              <button
                type="button"
                onClick={() => setView('grid')}
                aria-label="Grid view"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                  view === 'grid'
                    ? 'bg-primary-gradient text-white shadow-card'
                    : 'text-slate-400 hover:text-primary'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                aria-label="List view"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                  view === 'list'
                    ? 'bg-primary-gradient text-white shadow-card'
                    : 'text-slate-400 hover:text-primary'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-dashed border-primary-200 bg-surface-light p-10 text-center text-slate-500">
              No spaces match your filters. Try another locality or purpose.
            </p>
          ) : (
            <div
              className={
                view === 'grid'
                  ? 'mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'
                  : 'mt-10 flex flex-col gap-4'
              }
            >
              {visible.map((sp, i) => (
                <motion.div
                  key={`${sp.name}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                >
                  <div
                    className={`group overflow-hidden rounded-2xl border border-primary-100/60 bg-white shadow-card transition-all duration-300 hover:shadow-card-hover ${
                      view === 'list'
                        ? 'flex flex-col sm:flex-row'
                        : 'flex h-full flex-col hover:-translate-y-1.5'
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden bg-primary-gradient ${
                        view === 'list' ? 'h-44 sm:h-auto sm:w-60 sm:flex-none' : 'h-40'
                      }`}
                    >
                      <SmartImage
                        src={sp.image}
                        alt={`${sp.name}, ${sp.cityName}`}
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
                        {sp.cityName}
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
                {showAll ? 'Show Less' : city ? `View More Spaces in ${cityName}` : 'View All Spaces'}
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
