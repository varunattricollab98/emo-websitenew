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
  Building2,
  Star,
  Sparkles,
} from 'lucide-react'
import SubPageHero from '../components/ui/SubPageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Counter from '../components/ui/Counter'

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

const stats = [
  { to: 200, suffix: '+', label: 'Partner spaces' },
  { to: 14, suffix: '', label: 'Cities' },
  { to: 5000, suffix: '+', label: 'Businesses matched' },
  { to: 98.7, suffix: '%', label: 'Partner satisfaction', decimals: 1 },
]

const accepted = [
  'Virtual office addresses',
  'Coworking & shared spaces',
  'Private cabins & managed offices',
  'Meeting & conference rooms',
]

export default function ListYourSpace() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    spaceType: '',
    message: '',
  })
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <SubPageHero
        eyebrow="For Space Owners"
        title="List Your Space and Grow Your Revenue"
        accent="Grow Your Revenue"
        subtitle="Partner with EaseMyOffice to fill your workspace and virtual office capacity with verified businesses from across India."
        chips={['Verified leads', 'Zero listing fee', 'Compliance handled']}
        visual={
          <div className="relative">
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-primary-300/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-7 shadow-card-hover ring-1 ring-primary-100/70 backdrop-blur-xl">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                  <Building2 className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-bold text-navy-dark">Turn empty space into income</p>
                  <p className="text-xs text-slate-500">Join 200+ partner spaces</p>
                </div>
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">
                We list
              </p>
              <ul className="mt-3 space-y-2.5">
                {accepted.map((a) => (
                  <li key={a} className="flex items-center gap-3 text-sm font-medium text-navy">
                    <span className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                      <Sparkles className="h-3 w-3" />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-primary-100 bg-white px-4 py-3 shadow-soft">
                <Star className="h-5 w-5 fill-gold text-gold" />
                <p className="text-sm font-semibold text-navy">Trusted by 200+ space partners</p>
              </div>
            </div>
          </div>
        }
      />

      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading eyebrow="Benefits" title="Why Partner With Us" accent="Partner With Us" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={(i % 4) * 0.07}>
                <div className="premium-card h-full p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
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

      {/* Stats band */}
      <section className="relative overflow-hidden bg-navy-gradient py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.06]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="container-custom relative grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-white lg:text-5xl">
                  <Counter to={s.to} suffix={s.suffix} decimals={s.decimals || 0} />
                </p>
                <p className="mt-2 text-sm text-primary-100">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="How It Works"
            title="Get Listed in 3 Simple Steps"
            accent="3 Simple Steps"
          />
          <div className="relative mt-16 grid gap-8 lg:grid-cols-3">
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent lg:block" />
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="relative text-center">
                  <span className="relative mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card ring-4 ring-white">
                    <s.icon className="h-6 w-6" />
                    <span className="absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-dark text-[11px] font-bold text-white shadow-gold-glow">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-navy-dark">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Get Started"
            title="Partner Enquiry"
            accent="Partner Enquiry"
            subtitle="Tell us about your space and we'll get back to you within one business day."
          />
          <Reveal className="mx-auto mt-12 max-w-2xl">
            <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-white p-8 shadow-card-hover">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <CheckCircle2 className="h-16 w-16 text-accent-emerald" />
                  <h3 className="mt-4 text-2xl font-bold text-navy-dark">Thanks for your interest!</h3>
                  <p className="mt-2 text-slate-600">
                    Our partnerships team will contact you shortly.
                  </p>
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
                  <button
                    type="submit"
                    className="btn-base w-full bg-primary-gradient px-6 py-3.5 text-white shadow-card hover:shadow-glow"
                  >
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
