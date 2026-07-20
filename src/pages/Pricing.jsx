import { Check, X, ArrowRight } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import PlanCard from '../components/ui/PlanCard'
import FaqAccordion from '../components/ui/FaqAccordion'
import CTABand from '../components/ui/CTABand'
import Button from '../components/ui/Button'
import { faqs } from '../data/faqs'

const plans = [
  {
    name: 'Mailing Address',
    price: '699',
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
    desc: 'The complete GST compliance kit.',
    popular: true,
    features: [
      'GST-ready business address',
      'Rent agreement, NOC & utility bill',
      'GST application assistance',
      'Priority 2-3 day activation',
      'Dedicated manager',
    ],
    cta: 'Choose GST',
  },
  {
    name: 'Company Registration',
    price: '1,199',
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

export default function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple, transparent"
        highlight="annual pricing"
        subtitle="No hidden fees. No lock-in. Pick a plan and get your business address ready in days."
      >
        <Button to="/contact" size="lg">
          Get Started <ArrowRight className="h-5 w-5" />
        </Button>
      </PageHero>

      {/* Plans */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="mt-4 grid gap-6 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <PlanCard plan={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Compare Plans"
            title="Find the right fit for your business"
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
                    <div className={`p-4 text-sm font-medium text-navy-dark ${i % 2 ? 'bg-surface-light/60' : ''}`}>
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
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading eyebrow="FAQ" title="Pricing questions, answered" />
          <Reveal className="mt-12">
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  )
}
