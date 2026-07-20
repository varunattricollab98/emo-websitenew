import { useState } from 'react'
import {
  TrendingUp,
  Users2,
  ShieldCheck,
  Wallet,
  Handshake,
  FileSignature,
  Rocket,
  Send,
  CheckCircle2,
} from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'

const benefits = [
  { icon: Wallet, title: 'Extra Revenue', desc: 'Monetise unused desks, cabins and address capacity.' },
  { icon: Users2, title: 'Qualified Leads', desc: 'We bring verified businesses looking for space.' },
  { icon: ShieldCheck, title: 'Compliance Handled', desc: 'We manage documentation and verification for you.' },
  { icon: TrendingUp, title: 'Grow Occupancy', desc: 'Fill your space faster with our nationwide demand.' },
]

const steps = [
  { icon: FileSignature, title: 'Submit Details', desc: 'Share your space and location details with us.' },
  { icon: Handshake, title: 'Partner Onboarding', desc: 'We verify and list your space on our platform.' },
  { icon: Rocket, title: 'Start Earning', desc: 'Receive matched leads and grow your revenue.' },
]

export default function ListYourSpace() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', city: '', spaceType: '', message: '' })
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <PageHero
        eyebrow="For Space Owners"
        title="List your space and"
        highlight="grow your revenue"
        subtitle="Partner with EaseMyOffice to fill your workspace and virtual office capacity with verified businesses from across India."
      />

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading eyebrow="Benefits" title="Why partner with us" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={(i % 4) * 0.07}>
                <div className="premium-card h-full p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <b.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold text-navy-dark">{b.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading eyebrow="How It Works" title="Get listed in 3 simple steps" />
          <div className="relative mt-16 grid gap-8 lg:grid-cols-3">
            <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent lg:block" />
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="relative text-center">
                  <div className="relative mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-card ring-1 ring-primary-100">
                    <s.icon className="h-7 w-7 text-primary" />
                    <span className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-gradient text-xs font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy-dark">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading eyebrow="Get Started" title="Partner enquiry" subtitle="Tell us about your space and we'll get back to you within one business day." />
          <Reveal className="mx-auto mt-12 max-w-2xl">
            <div className="rounded-3xl border border-primary-100 bg-white p-8 shadow-card">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <CheckCircle2 className="h-16 w-16 text-accent-emerald" />
                  <h3 className="mt-4 text-2xl font-bold text-navy-dark">Thanks for your interest!</h3>
                  <p className="mt-2 text-slate-600">Our partnerships team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" name="name" value={form.name} onChange={handleChange} required />
                    <Field label="Company / Property" name="company" value={form.company} onChange={handleChange} />
                    <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                    <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                    <Field label="City" name="city" value={form.city} onChange={handleChange} required />
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-navy-dark">Space type</label>
                      <select
                        name="spaceType"
                        value={form.spaceType}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-navy-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Select type</option>
                        <option>Virtual office address</option>
                        <option>Coworking space</option>
                        <option>Meeting rooms</option>
                        <option>Full building</option>
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
                      placeholder="Tell us about your space, capacity and location..."
                      className="w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-navy-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button type="submit" className="btn-base w-full bg-primary-gradient px-6 py-3.5 text-white shadow-card hover:shadow-glow">
                    Submit Enquiry <Send className="h-4 w-4" />
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
