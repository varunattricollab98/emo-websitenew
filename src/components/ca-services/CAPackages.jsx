import { ShieldCheck, Clock, Headset, FileCheck2 } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import PlanCard from '../ui/PlanCard'
import { caPackages } from '../../data/caServices'

const guarantees = [
  { icon: ShieldCheck, label: 'No hidden charges' },
  { icon: Clock, label: 'Every deadline tracked' },
  { icon: Headset, label: 'Dedicated manager' },
  { icon: FileCheck2, label: 'Filed by professionals' },
]

export default function CAPackages() {
  return (
    <section
      id="packages"
      className="section-padding relative scroll-mt-20 overflow-hidden bg-surface-light"
    >
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_25%,#000,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />

      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Compliance Packages"
          title="Ongoing Compliance, Handled for You"
          accent="Handled for You"
          subtitle="Bundle your bookkeeping, GST, income-tax, TDS, payroll and MCA filings into one simple monthly plan — so every due date is met, all year round."
        />

        <div className="mt-16 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caPackages.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.07}>
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-slate-400">
          Indicative monthly pricing — your exact quote is confirmed after a quick review of your
          entity type and transaction volume. All services are prepared and reviewed by qualified
          partner professionals.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
