import { Landmark, FileCheck2, Mail, Armchair, ShieldCheck, Clock, Headset } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import PlanCard from '../ui/PlanCard'

const plans = [
  {
    name: 'Business Registration',
    price: '1,199',
    period: '/mo',
    desc: 'MCA-accepted registered office for company incorporation.',
    icon: Landmark,
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
    features: [
      'MCA-accepted registered address',
      'Rent agreement + NOC + utility bill',
      'GST registration support',
      'Board resolution assistance',
      'Mail & courier handling',
      'Dedicated relationship manager',
    ],
    cta: 'Register My Business',
    to: '#book-form',
  },
  {
    name: 'GST Registration',
    price: '899',
    period: '/mo',
    desc: 'Everything for a smooth, first-attempt GST registration.',
    icon: FileCheck2,
    grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    popular: true,
    features: [
      'GST-ready business address',
      'Notarised rent agreement + NOC',
      'Utility bill proof',
      'APOB & PPOB support',
      'GST & department verification',
      'Professional business address',
    ],
    cta: 'Get My GST Address',
    to: '#book-form',
  },
  {
    name: 'Mailing Address',
    price: '699',
    period: '/mo',
    desc: 'A professional business address for mail & branding.',
    icon: Mail,
    grad: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
    features: [
      'Prime business mailing address',
      'Mail receipt & notification',
      'Use on website & visiting cards',
      'Use for Google Business listing',
      'Great for local SEO',
      'Dedicated support',
    ],
    cta: 'Get My Address',
    to: '#book-form',
  },
  {
    name: 'Dedicated Desk',
    price: '5,999',
    period: '/mo',
    desc: 'A reserved desk in a premium coworking space, all-inclusive.',
    icon: Armchair,
    grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    features: [
      'Your own fixed desk',
      'High-speed WiFi & power backup',
      'Meeting-room credits',
      'Reception & housekeeping',
      'Pantry / cafe access',
      'Business address included',
    ],
    cta: 'Book a Desk',
    to: '#book-form',
  },
]

const guarantees = [
  { icon: ShieldCheck, label: 'No hidden charges' },
  { icon: Clock, label: 'Ready in 2–3 days' },
  { icon: Headset, label: 'Dedicated support' },
]

export default function VOPricing() {
  return (
    <section id="pricing" className="section-padding relative scroll-mt-20 overflow-hidden bg-surface-light">
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_25%,#000,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />

      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Plans & Pricing"
          title="Simple, Transparent Pricing"
          accent="Transparent Pricing"
          subtitle="Choose the plan that fits your goal — from a mailing address to a dedicated desk. No hidden fees."
        />

        <div className="mt-16 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.07}>
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </div>

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
