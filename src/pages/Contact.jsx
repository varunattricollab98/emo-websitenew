import { useState } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Headset,
  Zap,
} from 'lucide-react'
import SubPageHero from '../components/ui/SubPageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import LocationSelect from '../components/ui/LocationSelect'

const details = [
  { icon: Phone, label: 'Call us', value: '888-273-5038', href: 'tel:8882735038' },
  {
    icon: Mail,
    label: 'Email us',
    value: 'contact@easemyoffice.in',
    href: 'mailto:contact@easemyoffice.in',
  },
  {
    icon: MapPin,
    label: 'Visit us',
    value: '336, Udyog Vihar Phase 4, Sector 19, Gurugram, Haryana 122016',
  },
  { icon: Clock, label: 'Working hours', value: 'Mon – Sat, 9:30 AM – 7:00 PM' },
]

const supportPoints = [
  { icon: Zap, title: 'Fast Response', desc: 'We reply within one business day.' },
  { icon: Headset, title: 'Dedicated Manager', desc: 'One expert, start to finish.' },
  { icon: ShieldCheck, title: 'No Spam, Ever', desc: 'Your details stay private.' },
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
      <SubPageHero
        eyebrow="Contact Us"
        title="Let's Set Up Your Business Address"
        accent="Business Address"
        subtitle="Have a question or ready to get started? Our team responds within one business day."
        chips={['1-day response', 'Dedicated manager', 'Pan-India support']}
        visual={
          <div className="relative">
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-primary-300/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-7 shadow-card-hover ring-1 ring-primary-100/70 backdrop-blur-xl">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
              <p className="text-sm font-bold text-navy-dark">Prefer to talk now?</p>
              <p className="mt-1 text-xs text-slate-500">Reach us on your favourite channel.</p>
              <div className="mt-5 space-y-3">
                <a
                  href="tel:8882735038"
                  className="flex items-center gap-3 rounded-2xl border border-primary-100 bg-surface-light px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-gradient text-white">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-dark">Call us</p>
                    <p className="text-xs text-slate-500">888-273-5038</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/918882735038"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-primary-100 bg-surface-light px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                  >
                    <WhatsAppLogo className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-dark">WhatsApp</p>
                    <p className="text-xs text-slate-500">Chat with our team</p>
                  </div>
                </a>
                <a
                  href="mailto:contact@easemyoffice.in"
                  className="flex items-center gap-3 rounded-2xl border border-primary-100 bg-surface-light px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-dark text-white">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-dark">Email us</p>
                    <p className="text-xs text-slate-500">contact@easemyoffice.in</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        }
      />

      <section className="section-padding bg-white">
        <div className="container-custom grid gap-12 lg:grid-cols-5">
          {/* Details */}
          <Reveal className="lg:col-span-2">
            <div className="space-y-5">
              {details.map((d) => (
                <div key={d.label} className="premium-card flex items-start gap-4 p-6">
                  <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                    <d.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {d.label}
                    </p>
                    {d.href ? (
                      <a
                        href={d.href}
                        className="mt-1 block font-semibold text-navy-dark hover:text-primary"
                      >
                        {d.value}
                      </a>
                    ) : (
                      <p className="mt-1 font-semibold text-navy-dark">{d.value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-3 gap-3">
                {supportPoints.map((s) => (
                  <div
                    key={s.title}
                    className="rounded-2xl border border-primary-100/70 bg-surface-light p-4 text-center"
                  >
                    <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <p className="mt-2 text-xs font-bold text-navy-dark">{s.title}</p>
                    <p className="mt-0.5 text-[11px] leading-tight text-slate-500">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-white p-8 shadow-card-hover">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
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
                      <label className="mb-1.5 block text-sm font-semibold text-navy-dark">
                        City / Location
                      </label>
                      <LocationSelect
                        name="city"
                        value={form.city}
                        onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                      />
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
                  <button
                    type="submit"
                    className="btn-base w-full bg-primary-gradient px-6 py-3.5 text-white shadow-card hover:shadow-glow"
                  >
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

// Official WhatsApp glyph
function WhatsAppLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.358.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.335-1.652a11.94 11.94 0 005.71 1.454h.006c6.585 0 11.946-5.359 11.949-11.895a11.9 11.9 0 00-3.481-8.458" />
    </svg>
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
