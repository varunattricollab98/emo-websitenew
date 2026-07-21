import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function BookYourSpace() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', city: '' })

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-navy-gradient px-6 py-14 shadow-card-hover sm:px-12 lg:py-20"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-primary-800/40 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            {/* copy + CTAs */}
            <div>
              <h2 className="text-3xl font-extrabold text-white text-balance sm:text-4xl">
                Ready to Set Up Your Business Address?
              </h2>
              <p className="mt-4 max-w-lg text-lg text-primary-100">
                Join 5,000+ businesses. Get a GST-compliant address in 2-3 days.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#book-form"
                  className="btn-base bg-gradient-to-r from-gold to-gold-dark px-8 py-4 text-base text-white shadow-card hover:shadow-gold-glow"
                >
                  Book Your Space
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="tel:8882735038"
                  className="btn-base border-2 border-white/40 px-8 py-4 text-base text-white hover:bg-white/10"
                >
                  <Phone className="h-5 w-5" />
                  888-273-5038
                </a>
              </div>
            </div>

            {/* inline form */}
            <div
              id="book-form"
              className="scroll-mt-24 rounded-2xl bg-white/95 p-6 shadow-card-hover backdrop-blur sm:p-8"
            >
              {submitted ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <CheckCircle2 className="h-14 w-14 text-accent-emerald" />
                  <h3 className="mt-4 text-xl font-bold text-navy-dark">Thank you!</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Our team will reach out to you shortly to book your space.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-navy-dark">Get a Callback</h3>
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Full name"
                      className="w-full rounded-xl border border-primary-100 bg-surface-light px-4 py-3 text-sm text-navy-dark placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="sr-only">
                      Phone number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="Phone number"
                      className="w-full rounded-xl border border-primary-100 bg-surface-light px-4 py-3 text-sm text-navy-dark placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="sr-only">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      placeholder="City"
                      className="w-full rounded-xl border border-primary-100 bg-surface-light px-4 py-3 text-sm text-navy-dark placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-base w-full bg-primary-gradient px-6 py-3 text-sm text-white shadow-card hover:shadow-glow hover:brightness-110"
                  >
                    Submit
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="text-center text-xs text-slate-400">
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
