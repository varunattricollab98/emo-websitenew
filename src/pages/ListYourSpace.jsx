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
  MapPin,
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
  { icon: Building2, to: 200, suffix: '+', label: 'Partner spaces', sub: 'And growing weekly' },
  { icon: MapPin, to: 14, suffix: '', label: 'Cities', sub: 'Metro & tier-2 hubs' },
  { icon: Users2, to: 5000, suffix: '+', label: 'Businesses matched', sub: 'Verified demand' },
  {
    icon: ShieldCheck,
    to: 98.7,
    suffix: '%',
    label: 'Partner satisfaction',
    sub: 'Would refer us',
    decimals: 1,
  },
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
      <section className="section-padding">
        <div className="container-custom">
          <div
            className="relative overflow-hidden rounded-[2rem] px-6 py-14 shadow-card-hover ring-1 ring-white/10 sm:px-12 sm:py-16"
            style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 62%, #16508f 120%)' }}
          >
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.04]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-300/15 blur-3xl" />

            {/* header */}
            <div className="relative flex justify-center">
              <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-100/80">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                Join 200+ space partners earning with us
              </p>
            </div>

            {/* stats */}
            <div className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-white/[0.08]">
              {stats.map((s) => (
                <Reveal key={s.label}>
                  <div className="px-1 text-center lg:px-8">
                    <div className="flex items-center justify-center gap-2 text-primary-200/70">
                      <s.icon className="h-4 w-4" strokeWidth={1.75} />
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em]">
                        {s.label}
                      </span>
                    </div>
                    <p className="mt-3 text-5xl font-black leading-none tracking-tight text-white sm:text-6xl">
                      <Counter to={s.to} decimals={s.decimals || 0} />
                      <span className="text-gold">{s.suffix}</span>
                    </p>
                    <div className="mx-auto mt-3 h-0.5 w-8 rounded-full bg-gold/50" />
                    <p className="mt-3 text-xs font-medium text-primary-100/50">{s.sub}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
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
