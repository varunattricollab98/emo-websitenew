import { Link } from 'react-router-dom'
import {
  FileCheck2,
  Landmark,
  ShoppingBag,
  Rocket,
  Briefcase,
  ArrowRight,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

const needs = [
  {
    icon: FileCheck2,
    title: 'For GST Registration',
    desc: 'A verified address with rent agreement, NOC & utility bill for GSTIN.',
  },
  {
    icon: Landmark,
    title: 'For New Company Registration',
    desc: 'Registered office address accepted by MCA for incorporation.',
  },
  {
    icon: ShoppingBag,
    title: 'For E-commerce Sellers',
    desc: 'Multi-state GST addresses to sell on every marketplace, hassle-free.',
  },
  {
    icon: Rocket,
    title: 'For Startups & Founders',
    desc: 'A premium business address that builds instant credibility.',
  },
  {
    icon: Briefcase,
    title: 'For Freelancers & Consultants',
    desc: 'Keep your home private with a professional business address.',
  },
]

export default function ChooseByRequirement() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Choose by Requirement"
          title="Not Sure Which Plan? Choose by Your Need"
          accent="Choose by Your Need"
          subtitle="Tell us what you're setting up — we'll match you with the right virtual office plan."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {needs.map((n, i) => (
            <Reveal key={n.title} delay={i * 0.06}>
              <Link
                to="/virtual-office"
                className="group flex h-full flex-col rounded-2xl border border-primary-100/60 bg-surface-light p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:bg-white hover:shadow-card-hover"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-soft transition-colors group-hover:bg-primary-gradient group-hover:text-white">
                  <n.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-navy-dark">{n.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{n.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Get this plan
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
