import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import PlanCard from '../ui/PlanCard'

const plans = [
  {
    name: 'Company Registration',
    price: '1,199',
    period: '/mo',
    desc: 'MCA-accepted registered office address for company incorporation.',
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
    features: [
      'Prime business mailing address',
      'Mail receipt & notification',
      'Use on website & visiting cards',
      'Dedicated support',
    ],
    cta: 'Get Started',
    to: '/pricing',
  },
]

export default function TransparentPricing() {
  return (
    <section className="section-padding bg-surface-light">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, Transparent Pricing"
          subtitle="No hidden fees. Choose the plan that fits your requirement and get set up in days."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08}>
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
