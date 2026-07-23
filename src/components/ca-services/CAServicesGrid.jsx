import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight, Clock, FileCheck2, Sparkles } from 'lucide-react'
import { caServices, caCategories } from '../../data/caServices'

const VISIBLE = 8
const catMap = Object.fromEntries(caCategories.map((c) => [c.key, c]))

export default function CAServicesGrid({ query = '', cat = '' }) {
  const [showAll, setShowAll] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = caServices
    if (cat) list = list.filter((s) => s.cat === cat)
    if (q) list = list.filter((s) => s.name.toLowerCase().includes(q))
    return list
  }, [query, cat])

  // collapse back to preview whenever the search/category changes
  useEffect(() => {
    setShowAll(false)
  }, [query, cat])

  const visible = showAll ? results : results.slice(0, VISIBLE)

  return (
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
  )
}
