import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileCheck2, Landmark, Award, ArrowRight, Check, Clock } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { caCategories, caServices } from '../../data/caServices'
import { useLeadModal } from '../../context/LeadModalContext'

const icons = { gst: FileCheck2, registration: Landmark, licenses: Award }

export default function CAServiceFinder() {
  const { openLeadModal } = useLeadModal()
  const [active, setActive] = useState('gst')
  const current = caCategories.find((c) => c.key === active)
  const list = caServices.filter((s) => s.cat === active)

  return (
    <section className="section-padding relative overflow-hidden bg-surface-light">
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_25%,#000,transparent)]" />
      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Find Your Service"
          title="Pick Your Requirement, Find the Right Service"
          accent="Find the Right Service"
          subtitle="Not sure where to start? Choose a category and explore the exact registration, filing or license your business needs — each one handled by qualified professionals."
        />

        {/* category filter */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {caCategories.map((cat) => {
            const Icon = icons[cat.key]
            const isActive = cat.key === active
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActive(cat.key)}
                className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ${
                  isActive
                    ? 'border-transparent text-white shadow-card-hover'
                    : 'border-primary-100/70 bg-white text-navy-dark shadow-soft hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card'
                }`}
                style={isActive ? { background: cat.grad } : undefined}
              >
                <span
                  className={`inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl ${
                    isActive ? 'bg-white/20 text-white ring-1 ring-white/30' : 'text-white'
                  }`}
                  style={!isActive ? { background: cat.grad } : undefined}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold">{cat.short}</span>
                  <span
                    className={`block text-[11px] ${isActive ? 'text-white/80' : 'text-slate-400'}`}
                  >
                    {cat.tagline}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* services list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-10 rounded-3xl border border-primary-100 bg-white p-6 shadow-soft sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-navy-dark">
                <span style={{ color: current.accent }}>{current.short}</span>
              </h3>
              <span className="rounded-full bg-surface-light px-3 py-1 text-xs font-bold text-slate-500 shadow-soft">
                {list.length} services
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() =>
                    openLeadModal({
                      title: s.name,
                      subtitle: 'Share your details and our experts will get in touch.',
                      service: s.name,
                    })
                  }
                  className="group flex items-start gap-3 rounded-2xl border border-primary-100/70 bg-surface-light p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white hover:shadow-card"
                >
                  <span
                    className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full text-white"
                    style={{ background: current.grad }}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-navy-dark">{s.name}</span>
                    <span className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                      <Clock className="h-3 w-3" />
                      {s.turn}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                openLeadModal({
                  title: 'Tell us your requirement',
                  subtitle: "Describe what you need and our experts will help you out.",
                })
              }
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary-gradient px-6 py-3 text-sm font-bold text-white shadow-card transition-all hover:shadow-glow hover:brightness-110"
            >
              Not listed? Tell us your requirement
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
