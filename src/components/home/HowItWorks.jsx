import { ClipboardList, FileText, PenLine, MapPinned } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

const steps = [
  {
    icon: ClipboardList,
    title: 'Choose Your Plan',
    desc: 'Select the city and plan that fits your compliance needs — mailing, GST or company registration.',
  },
  {
    icon: FileText,
    title: 'Submit KYC',
    desc: 'Upload your basic KYC documents online. Our team pre-verifies everything for you.',
  },
  {
    icon: PenLine,
    title: 'Sign Agreement',
    desc: 'Receive your notarised rent agreement, NOC and utility bill, signed digitally.',
  },
  {
    icon: MapPinned,
    title: 'Get Your Address',
    desc: 'Your verified business address is activated and ready for GST or company registration.',
  },
]

export default function HowItWorks() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          eyebrow="How It Works"
          title="From sign-up to business address in 4 simple steps"
          subtitle="A completely online, guided process — no office visits, no paperwork headaches."
        />
        <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* connector line */}
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent lg:block" />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="relative text-center">
                <div className="relative mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-card ring-1 ring-primary-100">
                  <s.icon className="h-7 w-7 text-primary" />
                  <span className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-gradient text-xs font-bold text-white shadow-card">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy-dark">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
