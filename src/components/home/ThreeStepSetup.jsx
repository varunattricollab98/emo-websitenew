import { MapPinned, FileText, KeyRound } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

const steps = [
  {
    icon: MapPinned,
    title: 'Choose Location & Plan',
    desc: 'Pick your city and the plan that matches your requirement.',
  },
  {
    icon: FileText,
    title: 'Submit KYC Documents',
    desc: 'Upload your KYC online — our team verifies everything for you.',
  },
  {
    icon: KeyRound,
    title: 'Get Your Ready-to-Use Address',
    desc: 'Receive your compliant address & documents in just 2-3 days.',
  },
]

export default function ThreeStepSetup() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="How It Works"
          title="Get Set Up in 3 Simple Steps"
          accent="3 Simple Steps"
          subtitle="From choosing a location to a ready-to-use business address — fully online."
        />

        <div className="relative mt-16">
          {/* connecting timeline line */}
          <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-0.5 bg-gradient-to-r from-primary-100 via-primary/40 to-primary-100 lg:block" />

          <div className="grid gap-10 lg:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative">
                    <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                      <s.icon className="h-9 w-9" />
                    </span>
                    <span className="absolute -right-2 -top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-extrabold text-white shadow-gold-glow">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-navy-dark">{s.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
