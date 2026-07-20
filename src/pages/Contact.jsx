import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import Reveal from '../components/ui/Reveal'
import { cities } from '../data/cities'

const details = [
  { icon: Phone, label: 'Call us', value: '888-273-5038', href: 'tel:8882735038' },
  { icon: Mail, label: 'Email us', value: 'connect@easemyoffice.in', href: 'mailto:connect@easemyoffice.in' },
  {
    icon: MapPin,
    label: 'Visit us',
    value: '336, Udyog Vihar Phase 4, Sector 19, Gurugram, Haryana 122016',
  },
  { icon: Clock, label: 'Working hours', value: 'Mon – Sat, 9:30 AM – 7:00 PM' },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', message: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let's set up your"
        highlight="business address"
        subtitle="Have a question or ready to get started? Our team responds within one business day."
      />

      <section className="section-padding">
        <div className="container-custom grid gap-12 lg:grid-cols-5">
          {/* Details */}
          <Reveal className="lg:col-span-2">
            <div className="space-y-5">
              {details.map((d) => (
                <div key={d.label} className="premium-card flex items-start gap-4 p-6">
                  <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-primary-gradient text-white">
                    <d.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {d.label}
                    </p>
                    {d.href ? (
                      <a href={d.href} className="mt-1 block font-semibold text-navy-dark hover:text-primary">
                        {d.value}
                      </a>
                    ) : (
                      <p className="mt-1 font-semibold text-navy-dark">{d.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="rounded-3xl border border-primary-100 bg-white p-8 shadow-card">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle2 className="h-16 w-16 text-accent-emerald" />
                  <h3 className="mt-4 text-2xl font-bold text-navy-dark">Thank you!</h3>
                  <p className="mt-2 text-slate-600">
                    Your enquiry has been received. Our team will reach out within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-navy-dark">Send us a message</h3>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" name="name" value={form.name} onChange={handleChange} required />
                    <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                    <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-navy-dark">City</label>
                      <select
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-navy-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Select a city</option>
                        {cities.map((c) => (
                          <option key={c.slug} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-navy-dark">Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-navy-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <button type="submit" className="btn-base w-full bg-primary-gradient px-6 py-3.5 text-white shadow-card hover:shadow-glow">
                    Send Message <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function Field({ label, name, type = 'text', value, onChange, required }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-navy-dark">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-navy-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}
