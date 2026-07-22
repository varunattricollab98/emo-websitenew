import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  ArrowRight,
  CheckCircle2,
  Check,
  Star,
  User,
  MapPin,
  BadgeCheck,
  Clock,
  ShieldCheck,
} from 'lucide-react'

const trustPoints = [
  { icon: BadgeCheck, label: '98.7% document approval rate' },
  { icon: MapPin, label: '250+ prime locations across India' },
  { icon: Clock, label: 'Ready in just 2–3 days' },
  { icon: ShieldCheck, label: '100% refund if GST rejected' },
]

export default function BookYourSpace() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', city: '' })

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
          {/* tech grid + colour glows + top sheen */}
          <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.06]" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-300/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-gold/12 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* ===== copy + trust ===== */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                4.9/5 · Trusted by 5,000+ businesses
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl">
                Let&apos;s Bring You the{' '}
                <span className="gold-text">Best Premium Virtual Office Address</span>
              </h2>
              <p className="mt-4 max-w-lg text-lg text-primary-100">
                Share a few details and our experts will call you back — GST-compliant address ready
                in 2–3 days.
              </p>

              {/* social proof — avatar cluster */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[
                    { g: 'linear-gradient(135deg,#3c82c2,#11417c)', t: 'R' },
                    { g: 'linear-gradient(135deg,#8b5cf6,#6366f1)', t: 'A' },
                    { g: 'linear-gradient(135deg,#10b981,#059669)', t: 'S' },
                    { g: 'linear-gradient(135deg,#f59e0b,#d97706)', t: 'M' },
                  ].map((a, idx) => (
                    <span
                      key={idx}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-navy-dark"
                      style={{ background: a.g }}
                    >
                      {a.t}
                    </span>
                  ))}
                  <span className="inline-flex h-9 items-center justify-center rounded-full bg-white/15 px-3 text-[11px] font-bold text-white ring-2 ring-navy-dark backdrop-blur">
                    5,000+
                  </span>
                </div>
                <span className="text-sm text-blue-100/80">
                  Joined by <span className="font-bold text-white">founders &amp; sellers</span> across India
                </span>
              </div>

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
                <a
                  href="#book-form"
                  className="btn-base bg-gradient-to-r from-gold to-gold-dark px-8 py-4 text-base text-white shadow-card transition-all hover:shadow-gold-glow hover:brightness-105"
                >
                  Book Your Space
                  <ArrowRight className="h-5 w-5" />
                </a>
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
              id="book-form"
              className="relative scroll-mt-24 overflow-hidden rounded-2xl bg-white p-6 shadow-card-hover ring-1 ring-white/60 sm:p-8"
            >
              {/* gold top accent */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
              {submitted ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <CheckCircle2 className="h-16 w-16 text-accent-emerald" />
                  <h3 className="mt-4 text-xl font-bold text-navy-dark">Thank you!</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Our team will call you back shortly to set up your virtual office.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2.5 text-lg font-bold text-navy-dark">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold-dark text-white shadow-gold-glow">
                        <Phone className="h-4 w-4" />
                      </span>
                      Get a Callback
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
                      id="name"
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
                      id="phone"
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
                    <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      placeholder="City"
                      aria-label="City"
                      className={inputClass}
                    />
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
