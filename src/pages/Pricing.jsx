import { Check, X, ArrowRight, Crown, Mail, FileCheck2, Building2, ShieldCheck, Clock, Headset, BadgeCheck } from 'lucide-react'
import SubPageHero from '../components/ui/SubPageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import FaqAccordion from '../components/ui/FaqAccordion'
import CTABand from '../components/ui/CTABand'
import Button from '../components/ui/Button'
import { faqs } from '../data/faqs'

const plans = [
  {
    name: 'Mailing Address',
    price: '699',
    icon: Mail,
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
    desc: 'Professional address for mail & branding.',
    features: [
      'Premium business address',
      'Mail & courier handling',
      'Digital mail notifications',
      'Use on website & cards',
    ],
    cta: 'Choose Mailing',
  },
  {
    name: 'GST Registration',
    price: '899',
    icon: FileCheck2,
    grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    desc: 'The complete GST compliance kit.',
    popular: true,
    features: [
      'GST-ready business address',
      'Rent agreement, NOC & utility bill',
      'GST application assistance',
      'Priority 2–3 day activation',
      'Dedicated manager',
    ],
    cta: 'Choose GST',
  },
  {
    name: 'Company Registration',
    price: '1,199',
    icon: Building2,
    grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    desc: 'Registered office for incorporation.',
    features: [
      'Registered office address',
      'Full MCA documentation kit',
      'Board resolution support',
      'GST add-on available',
      'Dedicated manager',
    ],
    cta: 'Choose Company',
  },
]

const guarantees = [
  { icon: ShieldCheck, title: 'No Hidden Fees', desc: 'The price you see is the price you pay.' },
  { icon: Clock, title: '2–3 Day Setup', desc: 'Get your documents ready in days, not weeks.' },
  { icon: BadgeCheck, title: '98.7% Approval', desc: 'Authority-accepted, verification-ready docs.' },
  { icon: Headset, title: 'Dedicated Manager', desc: 'One expert with you end to end.' },
]

const compareRows = [
  { label: 'Business address', a: true, b: true, c: true },
  { label: 'Mail & courier handling', a: true, b: true, c: true },
  { label: 'Rent agreement + NOC', a: false, b: true, c: true },
  { label: 'Utility bill', a: false, b: true, c: true },
  { label: 'GST application support', a: false, b: true, c: true },
  { label: 'MCA / company docs', a: false, b: false, c: true },
  { label: 'Dedicated manager', a: false, b: true, c: true },
]

function Mark({ v }) {
  return v ? (
    <Check className="mx-auto h-5 w-5 text-accent-emerald" />
  ) : (
    <X className="mx-auto h-5 w-5 text-slate-300" />
  )
}

function PricingCard({ plan }) {
  return (
    <div
      className={`group relative flex h-full flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 ${
        plan.popular
          ? 'bg-gradient-to-b from-primary-50 via-white to-white shadow-card-hover ring-2 ring-gold lg:-translate-y-4'
          : 'bg-white shadow-card ring-1 ring-primary-100/70 hover:shadow-card-hover'
      }`}
    >
      {plan.popular && (
        <>
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-gold/15 blur-3xl" />
          </div>
          <span className="absolute left-1/2 top-0 z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-gold-dark px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-gold-glow">
            <Crown className="h-3.5 w-3.5" />
            Most Popular
          </span>
        </>
      )}

      <div className="relative flex items-center gap-3">
        <span
          className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl text-white shadow-card ring-1 ring-white/40"
          style={{ background: plan.grad }}
        >
          <plan.icon className="h-6 w-6" />
        </span>
        <h3 className="text-xl font-bold text-navy-dark">{plan.name}</h3>
      </div>

      <p className="relative mt-3 text-sm leading-relaxed text-slate-500">{plan.desc}</p>

      <div className="relative mt-5 flex items-end gap-1">
        <span className="mb-1 text-2xl font-bold text-navy-dark">₹</span>
        <span className="text-5xl font-extrabold leading-none text-navy-dark">{plan.price}</span>
        <span className="mb-1.5 text-sm font-medium text-slate-400">/year</span>
      </div>
      <p className="relative mt-1.5 text-xs font-medium text-slate-400">
        Billed annually · No hidden charges
      </p>

      <ul className="relative mt-6 flex-1 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
            <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Button to="/contact" variant={plan.popular ? 'gold' : 'primary'} className="relative mt-8 w-full">
        {plan.cta}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function Pricing() {
  return (
    <>
      <SubPageHero
        eyebrow="Pricing"
        title="Simple, Transparent Annual Pricing"
        accent="Annual Pricing"
        subtitle="No hidden fees. No lock-in. Pick a plan and get your business address ready in days."
        chips={['No hidden fees', '2–3 day setup', 'Cancel anytime']}
        visual={
          <div className="relative">
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-primary-300/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-7 shadow-card-hover ring-1 ring-primary-100/70 backdrop-blur-xl">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Starting at
              </p>
              <div className="mt-1 flex items-end gap-1">
                <span className="mb-1 text-2xl font-bold text-navy-dark">₹</span>
                <span className="text-5xl font-extrabold leading-none text-navy-dark">699</span>
                <span className="mb-1.5 text-sm font-medium text-slate-400">/year</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Everything you need to launch — address, documentation and a dedicated manager.
              </p>
              <ul className="mt-5 space-y-2.5">
                {['GST & company registration ready', 'Authority-accepted documents', 'Priority 2–3 day activation'].map(
                  (h) => (
                    <li key={h} className="flex items-center gap-3 text-sm font-medium text-navy">
                      <span className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {h}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        }
      >
        <Button to="/contact" size="lg">
          Get Started <ArrowRight className="h-5 w-5" />
        </Button>
      </SubPageHero>

      {/* Plans */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <PricingCard plan={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Our Promise"
            title="Pricing You Can Trust"
            accent="You Can Trust"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((g, i) => (
              <Reveal key={g.title} delay={(i % 4) * 0.07}>
                <div className="premium-card h-full p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                    <g.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold text-navy-dark">{g.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{g.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Compare Plans"
            title="Find the Right Fit for Your Business"
            accent="Right Fit"
            subtitle="A side-by-side look at what each plan includes."
          />
          <Reveal className="mt-12">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-card">
              <div className="grid grid-cols-4">
                <div className="p-5" />
                <div className="p-5 text-center text-sm font-bold text-navy-dark">Mailing</div>
                <div className="bg-gradient-to-b from-primary-50 to-primary-100/40 p-5 text-center text-sm font-extrabold text-primary-800">
                  GST
                </div>
                <div className="p-5 text-center text-sm font-bold text-navy-dark">Company</div>
                {compareRows.map((row, i) => (
                  <div key={row.label} className="contents">
                    <div
                      className={`p-4 text-sm font-medium text-navy-dark ${
                        i % 2 ? 'bg-surface-light/60' : ''
                      }`}
                    >
                      {row.label}
                    </div>
                    <div className={`p-4 ${i % 2 ? 'bg-surface-light/60' : ''}`}>
                      <Mark v={row.a} />
                    </div>
                    <div className="border-x border-primary-100 bg-primary-50/40 p-4">
                      <Mark v={row.b} />
                    </div>
                    <div className={`p-4 ${i % 2 ? 'bg-surface-light/60' : ''}`}>
                      <Mark v={row.c} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading eyebrow="FAQ" title="Pricing Questions, Answered" accent="Answered" />
          <Reveal className="mx-auto mt-12 max-w-3xl">
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  )
}
