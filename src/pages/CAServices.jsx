import {
  FileCheck2,
  Building2,
  Receipt,
  BadgeCheck,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Clock,
  IndianRupee,
  Check,
} from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import CTABand from '../components/ui/CTABand'

const services = [
  {
    icon: FileCheck2,
    title: 'GST Registration',
    desc: 'End-to-end GST registration with document prep, filing and ARN tracking.',
    price: 'From ₹1,499',
  },
  {
    icon: Building2,
    title: 'Company Registration',
    desc: 'Private Limited, LLP or OPC incorporation — DIN, DSC, MOA/AOA and PAN included.',
    price: 'From ₹6,999',
    popular: true,
  },
  {
    icon: Receipt,
    title: 'Income Tax E-Filing',
    desc: 'Accurate ITR filing for individuals and businesses by qualified professionals.',
    price: 'From ₹999',
  },
  {
    icon: BadgeCheck,
    title: 'Trademark Registration',
    desc: 'Protect your brand with class search, application and objection handling.',
    price: 'From ₹5,999',
  },
]

const process = [
  { title: 'Consultation', desc: 'Free call with a CA to understand your needs.' },
  { title: 'Documentation', desc: 'We collect and prepare all required documents.' },
  { title: 'Filing', desc: 'Your application is filed and tracked to approval.' },
  { title: 'Delivery', desc: 'Receive your certificates and ongoing support.' },
]

const whyUs = [
  { icon: UserCheck, title: 'Qualified CAs', desc: 'Work directly with experienced chartered accountants.' },
  { icon: ShieldCheck, title: '100% Compliant', desc: 'Every filing meets the latest regulatory standards.' },
  { icon: Clock, title: 'On-time Filing', desc: 'Never miss a deadline with proactive reminders.' },
  { icon: IndianRupee, title: 'Transparent Fees', desc: 'Clear, upfront pricing with no hidden charges.' },
]

export default function CAServices() {
  return (
    <>
      <PageHero
        eyebrow="CA Services"
        title="Business compliance handled by"
        highlight="expert chartered accountants"
        subtitle="From GST and company registration to tax filing and trademarks — get everything your business needs to stay compliant, all in one place."
      >
        <Button to="/contact" size="lg">
          Talk to a CA <ArrowRight className="h-5 w-5" />
        </Button>
        <Button to="/pricing" variant="outline" size="lg">
          View Pricing
        </Button>
      </PageHero>

      {/* Services */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Services"
            title="Complete compliance, one partner"
            subtitle="Trusted by thousands of founders to keep their businesses running smoothly."
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <div
                  className={`relative flex h-full flex-col p-7 ${
                    s.popular
                      ? 'rounded-3xl border-2 border-gold bg-gradient-to-br from-primary-50 via-white to-primary-100/50 shadow-card-hover'
                      : 'premium-card'
                  }`}
                >
                  {s.popular && (
                    <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-gold to-gold-dark px-2.5 py-1 text-[10px] font-bold text-white">
                      POPULAR
                    </span>
                  )}
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-gradient text-white">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-navy-dark">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-slate-600">{s.desc}</p>
                  <p className="mt-4 font-extrabold text-primary">{s.price}</p>
                  <Button to="/contact" variant="ghost" size="sm" className="mt-3 self-start px-0">
                    Get started <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading eyebrow="Process" title="A simple, guided 4-step process" />
          <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent lg:block" />
            {process.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div className="relative text-center">
                  <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-gradient text-lg font-bold text-white shadow-card">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-bold text-navy-dark">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading eyebrow="Why Us" title="Compliance you can rely on" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((w, i) => (
              <Reveal key={w.title} delay={(i % 4) * 0.07}>
                <div className="premium-card h-full p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <w.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold text-navy-dark">{w.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Ready to get compliant?"
        subtitle="Book a free consultation with a chartered accountant today."
        primaryLabel="Talk to a CA"
      />
    </>
  )
}
