import { Link } from 'react-router-dom'
import {
  Building2,
  FileCheck2,
  Mailbox,
  Check,
  ArrowRight,
  MapPin,
  ClipboardList,
  FileText,
  PenLine,
  MapPinned,
} from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import PlanCard from '../components/ui/PlanCard'
import FaqAccordion from '../components/ui/FaqAccordion'
import CTABand from '../components/ui/CTABand'
import { cities } from '../data/cities'
import { faqs } from '../data/faqs'

const plans = [
  {
    name: 'Company Registration',
    price: '1,199',
    desc: 'Address proof for incorporating your company.',
    icon: Building2,
    features: [
      'Registered office address',
      'Notarised rent agreement + NOC',
      'Utility bill for MCA filing',
      'Board resolution support',
      'Dedicated compliance manager',
    ],
  },
  {
    name: 'GST / Business Compliance',
    price: '899',
    desc: 'The complete kit for GST registration.',
    icon: FileCheck2,
    popular: true,
    features: [
      'GST-ready business address',
      'Rent agreement, NOC & utility bill',
      'GST application assistance',
      'Signage & authorised verification',
      'Priority 2-3 day activation',
    ],
  },
  {
    name: 'Mailing Address',
    price: '699',
    desc: 'A professional address for mail & courier.',
    icon: Mailbox,
    features: [
      'Premium business mailing address',
      'Mail & courier handling',
      'Digital mail notifications',
      'Use on website & cards',
      'Optional mail forwarding',
    ],
  },
]

const inclusions = [
  'Notarised rent / lease agreement',
  'No Objection Certificate (NOC)',
  'Recent utility bill copy',
  'Company signage at location',
  'GST & MCA application support',
  'Mail handling & notifications',
  'Dedicated relationship manager',
  'Verification assistance for officers',
]

const steps = [
  { icon: ClipboardList, title: 'Choose Plan', desc: 'Pick your city and plan.' },
  { icon: FileText, title: 'Submit KYC', desc: 'Upload documents online.' },
  { icon: PenLine, title: 'Sign Agreement', desc: 'Digitally sign your kit.' },
  { icon: MapPinned, title: 'Get Address', desc: 'Activated in 2-3 days.' },
]

export default function VirtualOffice() {
  return (
    <>
      <PageHero
        eyebrow="Virtual Office"
        title="A premium business address for"
        highlight="GST & company registration"
        subtitle="Get a prestigious commercial address with all the compliant paperwork you need — without renting physical space. Activated in as little as 2-3 days."
      >
        <Button to="/contact" size="lg">
          Get Started <ArrowRight className="h-5 w-5" />
        </Button>
        <Button to="/pricing" variant="outline" size="lg">
          View Pricing
        </Button>
      </PageHero>

      {/* Plans */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Plans"
            title="Choose the plan that fits your goal"
            subtitle="Transparent annual pricing. No hidden fees, no lock-in."
          />
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <PlanCard plan={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusions */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="What's Included"
              title="Everything you need for compliance"
              subtitle="Every virtual office plan comes with a complete, authority-accepted documentation kit."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {inclusions.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glossy-card p-8">
              <div className="grid gap-4">
                {steps.map((s, i) => (
                  <div key={s.title} className="flex items-center gap-4 rounded-2xl bg-white/70 p-4">
                    <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary-gradient text-white">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-bold text-navy-dark">
                        {i + 1}. {s.title}
                      </p>
                      <p className="text-sm text-slate-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cities */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Locations"
            title="Available across India's top cities"
            subtitle="Register in a premium location near you, or expand to multiple cities."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 4) * 0.05}>
                <Link
                  to={`/virtual-office/${c.slug}`}
                  className="premium-card group flex items-center justify-between p-5"
                >
                  <span className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-navy-dark">{c.name}</span>
                  </span>
                  <span className="text-sm font-bold text-primary">₹{c.price}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading eyebrow="FAQ" title="Virtual office questions, answered" />
          <Reveal className="mt-12">
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  )
}
