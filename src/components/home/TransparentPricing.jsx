import { Landmark, FileCheck2, Mail, ShieldCheck, Clock, Headset } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import PlanCard from '../ui/PlanCard'

const plans = [
  {
    name: 'Company Registration',
    price: '1,199',
    period: '/mo',
    desc: 'MCA-accepted registered office address for company incorporation.',
    icon: Landmark,
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
    features: [
      'MCA-accepted registered address',
      'Registered office address change',
      'GST registration support',
      'APOB & PPOB support',
      'Mail & courier handling & forwarding',
      'GST & department verification',
      'Professional business address',
      'Free temporary signage board',
    ],
    cta: 'Get Started',
    to: '/pricing',
  },
  {
    name: 'GST Registration',
    price: '899',
    period: '/mo',
    desc: 'Everything you need for a smooth, first-attempt GST registration.',
    icon: FileCheck2,
    grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    features: [
      'Notarised rent agreement',
      'NOC + utility bill proof',
      'GST-ready business address',
      'APOB & PPOB support',
      'GST & department verification',
      'Mail & courier handling & forwarding',
      'Professional business address',
      'GST registration support',
    ],
    popular: true,
    cta: 'Get Started',
    to: '/pricing',
  },
  {
    name: 'Mailing Address',
    price: '699',
    period: '/mo',
    desc: 'A professional business address for mail & courier handling.',
    icon: Mail,
    grad: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
    features: [
      'Prime business mailing address',
      'Mail receipt & notification',
      'Use on website & visiting cards',
      'Use for Google Business listing',
      'Great for local SEO & visibility',
      'Dedicated support',
    ],
    cta: 'Get Started',
    to: '/pricing',
  },
]

const guarantees = [
  { icon: ShieldCheck, label: 'No hidden charges' },
  { icon: Clock, label: 'Ready in 2–3 days' },
  { icon: Headset, label: 'Dedicated support' },
]

export default function TransparentPricing() {
  return (
    <section className="section-padding relative overflow-hidden bg-white">
      {/* tech backdrop + glows */}
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_25%,#000,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-primary-300/15 blur-3xl" />

      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, Transparent Pricing"
          accent="Transparent Pricing"
          subtitle="No hidden fees. Choose the plan that fits your requirement and get set up in days."
        />

        <div className="mt-16 grid items-start gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08}>
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </div>

        {/* guarantee trust row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {guarantees.map((g) => (
            <span
              key={g.label}
              className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-5 py-2.5 text-sm font-semibold text-navy shadow-soft"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                <g.icon className="h-3.5 w-3.5" />
              </span>
              {g.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
