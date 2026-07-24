import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Clock,
  CreditCard,
  ShieldCheck,
  Minus,
  Plus,
} from 'lucide-react'

// Live EaseMyOffice Razorpay payment page. Booking details (name, email,
// contact, amount, description) are appended as prefill query params.
const PAYMENT_GATEWAY_URL = 'https://pages.razorpay.com/easemyoffice'

const emptyForm = { name: '', phone: '', email: '' }

function prettyDate(d) {
  if (!d) return 'Selected date'
  return new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function BookingModal({ open, booking, onClose }) {
  const { room = 'Meeting Room', city = '', date = '', time = '', price = 499 } = booking || {}
  const [form, setForm] = useState(emptyForm)
  const [hours, setHours] = useState(1)

  useEffect(() => {
    if (open) {
      setForm(emptyForm)
      setHours(1)
    }
  }, [open])

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
  const total = Number(price) * hours
  const canBook = form.name.trim() && form.phone.trim() && form.email.trim()

  const handleBook = () => {
    if (!canBook) return
    const params = new URLSearchParams({
      'prefill[name]': form.name,
      'prefill[email]': form.email,
      'prefill[contact]': form.phone,
      amount: String(total),
      description: `${room} · ${city} · ${prettyDate(date)} · ${time} · ${hours}h`,
    })
    // redirect to the payment gateway with booking details prefilled
    window.location.href = `${PAYMENT_GATEWAY_URL}?${params.toString()}`
  }

  const inputClass =
    'w-full rounded-xl border border-primary-100 bg-surface-light py-3 pl-11 pr-4 text-sm text-navy-dark placeholder:text-slate-400 transition-all focus:border-primary/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20'

  const summary = [
    { icon: MapPin, label: 'Location', value: city || '—' },
    { icon: CalendarDays, label: 'Date', value: prettyDate(date) },
    { icon: Clock, label: 'Time', value: time || '—' },
  ]

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-navy-dark/60 backdrop-blur-sm" onClick={onClose} />

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

            <div className="p-6 sm:p-8">
              {/* header */}
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                  <CreditCard className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-navy-dark">Instant Booking</h3>
                  <p className="text-xs text-slate-500">Confirm your details and pay securely</p>
                </div>
              </div>

              {/* booking summary (auto-fetched) */}
              <div className="mt-5 rounded-2xl border border-primary-100 bg-surface-light p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-navy-dark">{room}</p>
                  <p className="text-sm font-extrabold text-primary">
                    ₹{Number(price).toLocaleString('en-IN')}
                    <span className="text-[11px] font-medium text-slate-400">/hour</span>
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {summary.map((s) => (
                    <div key={s.label} className="rounded-xl bg-white px-2.5 py-2 text-center">
                      <s.icon className="mx-auto h-4 w-4 text-primary" />
                      <p className="mt-1 truncate text-[11px] font-semibold text-navy-dark">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* duration */}
                <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-3 py-2">
                  <span className="text-sm font-semibold text-navy-dark">Duration</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setHours((h) => Math.max(1, h - 1))}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-primary-100 text-primary hover:bg-primary-50"
                      aria-label="Decrease hours"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-16 text-center text-sm font-bold text-navy-dark">
                      {hours} {hours === 1 ? 'hour' : 'hours'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setHours((h) => Math.min(12, h + 1))}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-primary-100 text-primary hover:bg-primary-50"
                      aria-label="Increase hours"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* client details */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleBook()
                }}
                className="mt-5 space-y-4"
              >
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
                      required
                      placeholder="Email"
                      aria-label="Email"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* total + pay */}
                <div className="flex items-center justify-between rounded-2xl bg-navy-dark px-4 py-3 text-white">
                  <span className="text-sm font-medium text-primary-100">Total payable</span>
                  <span className="text-xl font-extrabold">
                    ₹{total.toLocaleString('en-IN')}
                    <span className="ml-1 text-xs font-medium text-primary-100">+ GST</span>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!canBook}
                  className="btn-base w-full bg-gradient-to-r from-gold to-gold-dark px-6 py-3.5 text-base text-white shadow-card transition-all hover:shadow-gold-glow hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Book Now &amp; Pay
                  <CreditCard className="h-4 w-4" />
                </button>
                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" />
                  Secure payment · You&apos;ll be redirected to our payment gateway
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
