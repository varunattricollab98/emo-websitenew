import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  User,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Headset,
} from 'lucide-react'
import LocationSelect from './LocationSelect'

const emptyForm = { name: '', phone: '', email: '', interest: '', city: '', message: '' }

export default function LeadModal({ open, config = {}, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)

  const {
    title = 'Get a Free Consultation',
    subtitle = "Share a few details and our team will call you back within one business day.",
    service = '',
    city = '',
    message = '',
  } = config

  // reset + prefill whenever the modal (re)opens
  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, interest: service, city, message })
      setSubmitted(false)
    }
  }, [open, service, city, message])

  // escape to close + lock body scroll
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputClass =
    'w-full rounded-xl border border-primary-100 bg-surface-light py-3 pl-11 pr-4 text-sm text-navy-dark placeholder:text-slate-400 transition-all focus:border-primary/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20'

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-navy-dark/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-card-hover"
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-gold via-gold-dark to-gold" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-light text-slate-500 transition-colors hover:bg-primary-50 hover:text-primary"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <CheckCircle2 className="h-16 w-16 text-accent-emerald" />
                <h3 className="mt-4 text-2xl font-bold text-navy-dark">Thank you!</h3>
                <p className="mt-2 max-w-sm text-slate-600">
                  Your request has been received. Our team will reach out within one business day.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-base mt-6 bg-primary-gradient px-6 py-3 text-sm text-white shadow-card hover:shadow-glow"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                    <Headset className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-navy-dark">{title}</h3>
                    <p className="text-xs text-slate-500">{subtitle}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.name}
                      onChange={set('name')}
                      required
                      placeholder="Full name"
                      aria-label="Full name"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={form.phone}
                        onChange={set('phone')}
                        type="tel"
                        required
                        placeholder="Phone"
                        aria-label="Phone"
                        className={inputClass}
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={form.email}
                        onChange={set('email')}
                        type="email"
                        placeholder="Email (optional)"
                        aria-label="Email"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.interest}
                      onChange={set('interest')}
                      placeholder="Service / plan you're interested in"
                      aria-label="Interested in"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <LocationSelect
                      value={form.city}
                      onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                      placeholder="City, state or pincode…"
                    />
                  </div>

                  <textarea
                    value={form.message}
                    onChange={set('message')}
                    rows={3}
                    placeholder="Tell us a bit more (optional)"
                    aria-label="Message"
                    className="w-full rounded-xl border border-primary-100 bg-surface-light px-4 py-3 text-sm text-navy-dark placeholder:text-slate-400 transition-all focus:border-primary/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />

                  <button
                    type="submit"
                    className="btn-base w-full bg-gradient-to-r from-gold to-gold-dark px-6 py-3.5 text-base text-white shadow-card transition-all hover:shadow-gold-glow hover:brightness-105"
                  >
                    Submit Request
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" />
                    We&apos;ll never share your details. No spam, ever.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
