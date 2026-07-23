import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  ChevronDown,
  ArrowRight,
  Star,
  FileCheck2,
  BadgeCheck,
  Clock,
  ShieldCheck,
  Briefcase,
  Sparkles,
} from 'lucide-react'
import { caServices, caCategories } from '../../data/caServices'

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

const catMap = Object.fromEntries(caCategories.map((c) => [c.key, c]))

const filters = [
  { v: '', l: 'All services' },
  ...caCategories.map((c) => ({ v: c.key, l: c.short })),
]

const highlights = [
  { icon: Briefcase, label: '1,200+ business accounts managed' },
  { icon: Clock, label: 'Timely GST, ITR & MCA filings' },
  { icon: BadgeCheck, label: 'Prepared by qualified professionals' },
  { icon: ShieldCheck, label: 'Transparent pricing, no hidden fees' },
]

export default function CAServiceHero() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('')
  const [open, setOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)

  // suggestions for the searchable combobox
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = caServices
    if (cat) list = list.filter((s) => s.cat === cat)
    if (q) list = list.filter((s) => s.name.toLowerCase().includes(q))
    return list.slice(0, 8)
  }, [query, cat])

  // results grid below hero
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = caServices
    if (cat) list = list.filter((s) => s.cat === cat)
    if (q) list = list.filter((s) => s.name.toLowerCase().includes(q))
    return list
  }, [query, cat])

  const visible = showAll ? results : results.slice(0, VISIBLE)

  return (
    <>
      {/* ===== Split hero: info left, search form right ===== */}
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
              CA &amp; Compliance Services
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.24] tracking-tight text-navy-dark text-balance sm:text-4xl lg:text-[2.9rem] lg:leading-[1.2]">
              Chartered Accountant Services for{' '}
              <span className="gradient-text">GST, Tax &amp; Business Compliance</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              From registration to timely filings — our teams manage{' '}
              <span className="font-bold text-navy-dark">1,200+ business accounts</span>, keeping
              your taxes and department requirements on track, all year round.
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

          {/* ---- right: search form ---- */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-primary-300/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-6 shadow-card-hover ring-1 ring-primary-100/70 backdrop-blur-xl sm:p-7">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                  <Search className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-navy-dark">Find Your Service</h2>
                  <p className="text-xs text-slate-500">Search 20+ CA &amp; compliance services</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* category */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </label>
                  <div className="relative">
                    <FileCheck2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                    <select
                      value={cat}
                      onChange={(e) => {
                        setCat(e.target.value)
                        setShowAll(false)
                      }}
                      aria-label="Category"
                      className="w-full appearance-none rounded-xl border border-primary-100 bg-surface-light py-3.5 pl-10 pr-9 text-sm font-semibold text-navy-dark focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {filters.map((f) => (
                        <option key={f.v} value={f.v}>
                          {f.l}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* service search (combobox) */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Service
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-primary" />
                    <input
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value)
                        setOpen(true)
                        setShowAll(false)
                      }}
                      onFocus={() => setOpen(true)}
                      placeholder="e.g. GST Registration, ITR, Trademark…"
                      aria-label="Search service"
                      className="w-full rounded-xl border border-primary-100 bg-surface-light py-3.5 pl-10 pr-9 text-sm font-semibold text-navy-dark placeholder:font-normal placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <ChevronDown
                      className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform ${
                        open ? 'rotate-180' : ''
                      }`}
                    />

                    {open && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
                        <div className="absolute left-0 right-0 z-40 mt-2 rounded-2xl border border-primary-100 bg-white p-2 shadow-card-hover">
                          <ul className="sky-scroll max-h-60 space-y-0.5 overflow-y-auto pr-1">
                            {suggestions.length === 0 ? (
                              <li className="px-3 py-2 text-sm text-slate-400">
                                No service found — tell us your requirement below.
                              </li>
                            ) : (
                              suggestions.map((s) => {
                                const c = catMap[s.cat]
                                return (
                                  <li key={s.name}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setQuery(s.name)
                                        setOpen(false)
                                      }}
                                      className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-navy-dark transition-colors hover:bg-surface-light"
                                    >
                                      <span className="min-w-0">
                                        <span className="block truncate text-sm font-semibold">
                                          {s.name}
                                        </span>
                                        <span className="block truncate text-[11px] text-slate-400">
                                          {c?.short}
                                        </span>
                                      </span>
                                      <span
                                        className="h-2 w-2 flex-none rounded-full"
                                        style={{ background: c?.accent }}
                                      />
                                    </button>
                                  </li>
                                )
                              })
                            )}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <a
                  href="#ca-services-list"
                  className="btn-base w-full bg-primary-gradient px-6 py-3.5 text-sm text-white shadow-card transition-all hover:shadow-glow hover:brightness-110"
                >
                  View Services
                  <ArrowRight className="h-4 w-4" />
                </a>
                <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" />
                  {results.length}+ expert-assisted services · Free consultation
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Services results grid ===== */}
      <section id="ca-services-list" className="section-padding scroll-mt-20 bg-white">
        <div className="container-custom">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {cat ? catMap[cat]?.short : 'All Services'}
              </span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-dark sm:text-3xl">
                CA &amp; Compliance <span className="gradient-text">Services</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {results.length} expert-assisted {results.length === 1 ? 'service' : 'services'}{' '}
                available
              </p>
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-dashed border-primary-200 bg-surface-light p-10 text-center text-slate-500">
              No services match your search. Tell us your requirement and our experts will help.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visible.map((s, i) => {
                const c = catMap[s.cat]
                return (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                  >
                    <div className="group flex h-full flex-col rounded-2xl border border-primary-100/60 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
                      <div className="flex items-center justify-between">
                        <span
                          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-card ring-1 ring-white/40"
                          style={{ background: c?.grad }}
                        >
                          <FileCheck2 className="h-5 w-5" />
                        </span>
                        {s.popular && (
                          <span className="rounded-full bg-gradient-to-r from-gold to-gold-dark px-2.5 py-1 text-[10px] font-bold text-white shadow-gold-glow">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <h3 className="mt-4 text-base font-bold leading-snug text-navy-dark">
                        {s.name}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{s.desc}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-primary-100/70 pt-4">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          {s.turn}
                        </span>
                        <a
                          href="#ca-form"
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-primary-700"
                        >
                          Get started
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {results.length > VISIBLE && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-6 py-3 text-sm font-bold text-primary shadow-soft transition-all hover:border-primary/40 hover:shadow-card"
              >
                {showAll ? 'Show Less' : `View All ${results.length} Services`}
                <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
