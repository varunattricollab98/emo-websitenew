import { MapPin, FileCheck2, Zap, UserCheck, IndianRupee, Globe2 } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

const features = [
  {
    icon: MapPin,
    title: 'Premium Addresses',
    desc: 'Prestigious commercial addresses in prime business districts across every major city.',
  },
  {
    icon: FileCheck2,
    title: 'Compliant Paperwork',
    desc: 'Notarised rent agreement, NOC and utility bill — accepted by GST and MCA authorities.',
  },
  {
    icon: Zap,
    title: 'Fast 2-3 Day Setup',
    desc: 'Pre-verified documentation means your address is activated in just two to three days.',
  },
  {
    icon: UserCheck,
    title: 'Dedicated Manager',
    desc: 'A personal compliance manager guides you through every step, start to finish.',
  },
  {
    icon: IndianRupee,
    title: 'Transparent Pricing',
    desc: 'Simple annual plans with no hidden fees and no long-term lock-in. Ever.',
  },
  {
    icon: Globe2,
    title: 'Pan-India Coverage',
    desc: '200+ verified addresses across 28 states to expand your GST presence anywhere.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-surface-light">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Why EaseMyOffice"
          title="Built for founders who value speed and trust"
          subtitle="We handle the paperwork, approvals and compliance so you can focus on building your business."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08}>
              <div className="premium-card h-full p-7">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-navy-dark">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
