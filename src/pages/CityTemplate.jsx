import { useParams } from 'react-router-dom'
import { MapPin, Building2, FileCheck2, Mailbox, Check, ArrowRight, ShieldCheck } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import PlanCard from '../components/ui/PlanCard'
import FaqAccordion from '../components/ui/FaqAccordion'
import CTABand from '../components/ui/CTABand'
import { getCityBySlug } from '../data/cities'
import { faqs } from '../data/faqs'

function toTitle(str = '') {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function CityTemplate() {
  const { city } = useParams()
  const data = getCityBySlug(city)
  const cityName = data?.name || toTitle(city)
  const basePrice = data?.price || 899
  const addresses = data?.addresses || 12

  const plans = [
    {
      name: 'Mailing Address',
      price: (basePrice - 200).toLocaleString('en-IN'),
      desc: `A professional ${cityName} address for mail.`,
      features: ['Premium address', 'Mail & courier handling', 'Digital notifications'],
    },
    {
      name: 'GST Registration',
      price: basePrice.toLocaleString('en-IN'),
      desc: `GST-ready ${cityName} address kit.`,
      popular: true,
      features: ['GST-ready address', 'Rent agreement + NOC', 'Utility bill', 'Priority activation'],
    },
    {
      name: 'Company Registration',
      price: (basePrice + 300).toLocaleString('en-IN'),
      desc: `Registered office in ${cityName}.`,
      features: ['Registered office', 'Full MCA kit', 'Board resolution support'],
    },
  ]

  return (
    <>
      <PageHero
        eyebrow={`Virtual Office in ${cityName}`}
        title={`Premium virtual office in`}
        highlight={cityName}
        subtitle={`Get a prestigious ${cityName} business address for GST and company registration. ${addresses} verified locations, activated in 2-3 days.`}
      >
        <Button to="/contact" size="lg">
          Get Started <ArrowRight className="h-5 w-5" />
        </Button>
        <Button to="/virtual-office" variant="outline" size="lg">
          All Locations
        </Button>
      </PageHero>

      {/* Quick facts */}
      <section className="border-b border-primary-100 bg-white">
        <div className="container-custom grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {[
            { icon: MapPin, label: `${addresses}+ addresses`, sub: `in ${cityName}` },
            { icon: FileCheck2, label: 'GST ready', sub: 'full documentation' },
            { icon: ShieldCheck, label: '97% approval', sub: 'success rate' },
            { icon: Building2, label: `From ₹${(basePrice - 200)}`, sub: 'per year' },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary-50 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-navy-dark">{f.label}</p>
                <p className="text-xs text-slate-500">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Plans"
            title={`Virtual office plans in ${cityName}`}
            subtitle="Transparent annual pricing with no lock-in."
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

      {/* Local addresses note */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <Reveal>
            <div className="glossy-card mx-auto max-w-4xl p-8 lg:p-10">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white">
                  <Mailbox className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold text-navy-dark">
                  Verified addresses across {cityName}
                </h3>
              </div>
              <p className="mt-4 text-slate-600">
                Our {cityName} addresses are located in reputed commercial districts, fully verified
                and accepted for GST and MCA filings. Exact address details are shared once you choose
                a plan — you can even register in multiple {cityName} locations to expand your reach.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  'Prime commercial locations',
                  'Authority-accepted paperwork',
                  'Mail handling & notifications',
                  'Dedicated relationship manager',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <Check className="h-4 w-4 flex-none text-accent-emerald" />
                    {item}
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
          <SectionHeading eyebrow="FAQ" title={`Virtual office in ${cityName} — FAQs`} />
          <Reveal className="mt-12">
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <CTABand
        title={`Set up your ${cityName} business address today`}
        subtitle="Join thousands of businesses registered with EaseMyOffice across India."
      />
    </>
  )
}
