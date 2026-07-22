import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Search, ChevronDown, Star, ArrowRight, Flame } from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import { voCities, spacesByCity } from '../../data/spaces'

const VISIBLE = 8

export default function ExploreSpaces() {
  const [city, setCity] = useState('bangalore')
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const cityName = voCities.find((c) => c.slug === city)?.name || 'Bangalore'

  const results = useMemo(() => {
    const list = spacesByCity[city] || []
    if (!query.trim()) return list
    const q = query.toLowerCase()
    return list.filter((s) => s.name.toLowerCase().includes(q))
  }, [city, query])

  const visible = showAll ? results : results.slice(0, VISIBLE)

  return (
    <>
      {/* ===== Hero with city search ===== */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 tech-dots opacity-40 [mask-image:radial-gradient(ellipse_65%_60%_at_50%_40%,#000,transparent)]" />

        <div className="container-custom relative py-16 text-center lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mx-auto max-w-3xl"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-primary-200 bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-soft">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              Virtual Office
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.14] tracking-tight text-navy-dark text-balance sm:text-4xl lg:text-5xl">
              Virtual Office in India for{' '}
              <span className="gradient-text">GST, Company Registration &amp; Business Address</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Get a premium, compliant business address without the cost of physical space — search
              your city and explore verified spaces in seconds.
            </p>
          </motion.div>

          {/* search / filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-9 max-w-3xl"
          >
            <div className="flex flex-col gap-3 rounded-2xl border border-primary-100 bg-white p-2.5 shadow-card-hover sm:flex-row sm:items-center">
              {/* city dropdown */}
              <div className="relative flex-none sm:w-48">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value)
                    setShowAll(false)
                  }}
                  aria-label="Select city"
                  className="w-full appearance-none rounded-xl bg-surface-light py-3.5 pl-10 pr-9 text-sm font-semibold text-navy-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {voCities.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              {/* search input */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search locality in ${cityName}…`}
                  aria-label="Search location"
                  className="w-full rounded-xl bg-surface-light py-3.5 pl-10 pr-4 text-sm text-navy-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <a
                href="#spaces"
                className="btn-base flex-none bg-primary-gradient px-7 py-3.5 text-sm text-white shadow-card hover:shadow-glow hover:brightness-110"
              >
                View Spaces
                <ArrowRight className="h-4 w-4" />
              </a>
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
              No spaces match “{query}”. Try another locality.
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
