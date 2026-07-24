import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  ArrowRight,
  CheckCircle2,
  Check,
  Star,
  User,
  Briefcase,
  ChevronDown,
  Clock,
  ShieldCheck,
  FileCheck2,
  Headset,
} from 'lucide-react'
import { caServices } from '../../data/caServices'
import { useLeadModal } from '../../context/LeadModalContext'

const trustPoints = [
  { icon: Briefcase, label: '1,200+ business accounts managed' },
  { icon: FileCheck2, label: 'Filed by qualified professionals' },
  { icon: Clock, label: 'Every deadline tracked & met' },
  { icon: ShieldCheck, label: 'Transparent pricing, no hidden fees' },
]

export default function CACallback() {
  const { openLeadModal } = useLeadModal()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', service: '' })

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputClass =
    'w-full rounded-xl border border-primary-100 bg-surface-light py-3 pl-11 pr-4 text-sm text-navy-dark placeholder:text-slate-400 transition-all focus:border-primary/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20'

  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl px-6 py-14 shadow-card-hover ring-1 ring-white/10 sm:px-12 lg:py-16"
          style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 55%, #17559a 120%)' }}
        >
          <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.06]" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-300/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-gold/12 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* ===== copy + trust ===== */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                4.9/5 · Trusted by businesses across India
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl">
                Let&apos;s Keep Your Business{' '}
                <span className="gold-text">100% Compliant</span>
              </h2>
              <p className="mt-4 max-w-lg text-lg text-primary-100">
                Share a few details and a compliance expert will call you back with the right plan
                and a transparent quote.
              </p>

              {/* trust checklist */}
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {trustPoints.map((t) => (
                  <li key={t.label} className="flex items-center gap-2.5 text-sm text-blue-50/90">
                    <span className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-300/30">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {t.label}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() =>
                    openLeadModal({
                      title: 'Get a Free Consultation',
                      subtitle: 'Share your details and a compliance expert will call you back.',
                    })
                  }
                  className="btn-base bg-gradient-to-r from-gold to-gold-dark px-8 py-4 text-base text-white shadow-card transition-all hover:shadow-gold-glow hover:brightness-105"
                >
                  Get a Free Consultation
                  <ArrowRight className="h-5 w-5" />
                </button>
                <a
                  href="tel:8882735038"
                  className="btn-base border-2 border-white/40 px-8 py-4 text-base text-white transition-colors hover:bg-white/10"
                >
                  <Phone className="h-5 w-5" />
                  888-273-5038
                </a>
              </div>
            </div>

            {/* ===== callback form ===== */}
            <div
              id="ca-form"
              className="relative scroll-mt-24 overflow-hidden rounded-2xl bg-white p-6 shadow-card-hover ring-1 ring-white/60 sm:p-8"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
              {submitted ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <CheckCircle2 className="h-16 w-16 text-accent-emerald" />
                  <h3 className="mt-4 text-xl font-bold text-navy-dark">Thank you!</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Our compliance team will call you back shortly to help with your requirement.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2.5 text-lg font-bold text-navy-dark">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold-dark text-white shadow-gold-glow">
                        <Headset className="h-4 w-4" />
                      </span>
                      Talk to a CA Expert
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/10 px-2.5 py-1 text-[11px] font-bold text-accent-emerald">
                      Free consultation
                    </span>
                  </div>
                  <p className="-mt-1 text-xs text-slate-500">
                    We&apos;ll call you back within one business day.
                  </p>

                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Full name"
                      aria-label="Full name"
                      className={inputClass}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="Phone number"
                      aria-label="Phone number"
                      className={inputClass}
                    />
                  </div>
                  <div className="relative">
                    <FileCheck2 className="absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      required
                      aria-label="Service required"
                      className={`${inputClass} appearance-none pr-9 font-semibold`}
                    >
                      <option value="" disabled>
                        Select a service…
                      </option>
                      {caServices.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                      <option value="Other">Other / Not sure</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>

                  <button
                    type="submit"
                    className="btn-base w-full bg-gradient-to-r from-gold to-gold-dark px-6 py-3.5 text-base text-white shadow-card transition-all hover:shadow-gold-glow hover:brightness-105"
                  >
                    Get My Free Callback
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" />
                    We&apos;ll never share your details. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
