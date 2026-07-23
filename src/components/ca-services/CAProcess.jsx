import { MessageSquare, FileUp, ClipboardCheck, PartyPopper } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

const steps = [
  {
    icon: MessageSquare,
    title: 'Share your requirement',
    desc: 'Tell us what you need — a registration, a filing or full monthly compliance.',
  },
  {
    icon: FileUp,
    title: 'Upload documents online',
    desc: 'Submit your KYC and papers digitally. Your manager checks everything upfront.',
  },
  {
    icon: ClipboardCheck,
    title: 'We prepare & file',
    desc: 'Qualified professionals prepare, review and file with the concerned department.',
  },
  {
    icon: PartyPopper,
    title: 'Get your certificate',
    desc: 'Receive your registration or acknowledgement, plus reminders for what comes next.',
  },
]

export default function CAProcess() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="How It Works"
          title="A Simple, Guided 4-Step Process"
          accent="4-Step Process"
          subtitle="Fully online, from your first message to your final certificate — with a dedicated manager keeping you updated at every step."
        />

        <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent lg:block" />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="relative text-center">
                <span className="relative mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card ring-4 ring-white">
                  <s.icon className="h-6 w-6" />
                  <span className="absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-dark text-[11px] font-bold text-white shadow-gold-glow">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-4 font-bold text-navy-dark">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
