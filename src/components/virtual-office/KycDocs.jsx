import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Check, Building2, Users, User, Sparkles } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

const entities = [
  {
    key: 'proprietorship',
    label: 'Proprietorship',
    icon: User,
    grad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    accent: '#059669',
    docs: [
      'PAN card of the proprietor',
      'Aadhaar card of the proprietor',
      'Recent passport-size photograph',
      'Bank statement / cancelled cheque',
      'Rent agreement + NOC (provided by us)',
      'Latest utility bill of the premises',
    ],
  },
  {
    key: 'pvtltd',
    label: 'Private Limited',
    icon: Building2,
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
    accent: '#11417c',
    docs: [
      'Certificate of Incorporation',
      'Company PAN card',
      'MOA & AOA',
      'Board resolution / authorisation letter',
      'Directors\u2019 PAN & Aadhaar',
      'Rent agreement + NOC (provided by us)',
      'Latest utility bill of the premises',
    ],
  },
  {
    key: 'llp',
    label: 'LLP',
    icon: Users,
    grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    accent: '#6366f1',
    docs: [
      'LLP Incorporation Certificate',
      'LLP Agreement',
      'LLP PAN card',
      'Designated partners\u2019 PAN & Aadhaar',
      'Partner authorisation letter',
      'Rent agreement + NOC (provided by us)',
      'Latest utility bill of the premises',
    ],
  },
]

export default function KycDocs() {
  const [active, setActive] = useState('proprietorship')
  const current = entities.find((e) => e.key === active)

  return (
    <section className="section-padding relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000,transparent)]" />
      <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-primary-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-56 w-56 rounded-full bg-violet-300/10 blur-3xl" />

      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Documentation"
          title="KYC Documents Required"
          accent="Documents Required"
          subtitle="Pick your entity type to see exactly what's needed. We prepare the rent agreement, NOC and utility bill for you."
        />

        {/* entity tabs with glow */}
        <div className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-3">
          {entities.map((e) => {
            const isActive = e.key === active
            return (
              <button
                key={e.key}
                type="button"
                onClick={() => setActive(e.key)}
                className={`group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'border border-primary-100 bg-white text-navy hover:border-transparent hover:shadow-md'
                }`}
                style={isActive ? { background: e.grad } : undefined}
              >
                {/* Hover glow for inactive tabs */}
                {!isActive && (
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40"
                    style={{ background: e.grad }}
                  />
                )}
                {/* Active glow ring */}
                {isActive && (
                  <span
                    className="pointer-events-none absolute -inset-1 rounded-full opacity-40 blur-lg"
                    style={{ background: e.grad }}
                  />
                )}
                <e.icon className="relative h-4 w-4" />
                <span className="relative">{e.label}</span>
              </button>
            )
          })}
        </div>

        {/* doc list with animations */}
        <Reveal className="mx-auto mt-10 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-3xl border border-primary-100/70 bg-surface-light p-7 shadow-card sm:p-9"
            >
              {/* Top accent line */}
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-1 transition-all"
                style={{ background: current.grad }}
              />
              {/* Corner glow */}
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20 blur-3xl"
                style={{ background: current.grad }}
              />

              <div className="relative flex items-center gap-3">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-card ring-1 ring-white/30"
                  style={{ background: current.grad }}
                >
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-navy-dark">
                    Documents for {current.label}
                  </h3>
                  <p className="text-xs text-slate-500">
                    <Sparkles className="mr-1 inline h-3 w-3 text-gold" />
                    Items marked "provided by us" are handled by our team
                  </p>
                </div>
              </div>

              <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
                {current.docs.map((d, i) => {
                  const isProvided = d.includes('provided by us')
                  return (
                    <motion.div
                      key={d}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                      className={`group/item relative flex items-start gap-3 overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card ${
                        isProvided
                          ? 'border-gold/30 bg-gradient-to-r from-gold/5 to-transparent'
                          : 'border-primary-100/60 bg-white hover:border-primary/30'
                      }`}
                    >
                      {/* Item hover glow */}
                      <span
                        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover/item:opacity-100"
                        style={{
                          background: `radial-gradient(ellipse at 50% 50%, ${current.accent}08, transparent 70%)`,
                        }}
                      />
                      <span className={`relative mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full ${
                        isProvided ? 'bg-gold/15 text-gold-dark' : 'bg-accent-green/10 text-accent-emerald'
                      }`}>
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <span className={`relative text-sm ${isProvided ? 'font-semibold text-navy-dark' : 'text-slate-700'}`}>
                        {d}
                      </span>
                    </motion.div>
                  )
                })}
              </div>

              <p className="relative mt-6 flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-50 text-primary">
                  <FileText className="h-3 w-3" />
                </span>
                Documents may vary slightly by state — your relationship manager will confirm the exact list.
              </p>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  )
}
