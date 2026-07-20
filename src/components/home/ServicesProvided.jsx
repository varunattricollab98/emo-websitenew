import { Link } from 'react-router-dom'
import {
  Building2,
  Users,
  CalendarClock,
  FileCheck2,
  Landmark,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

const services = [
  {
    icon: Building2,
    title: 'Virtual Office',
    desc: 'Premium business address for GST & company registration.',
    to: '/virtual-office',
  },
  {
    icon: Users,
    title: 'Coworking Spaces',
    desc: 'Flexible desks, cabins & hot seats across India.',
    to: '/coworking',
  },
  {
    icon: CalendarClock,
    title: 'Meeting Rooms',
    desc: 'Book conference & training rooms by the hour.',
    to: '/meeting-rooms',
  },
  {
    icon: FileCheck2,
    title: 'GST Registration',
    desc: 'Fast, compliant GST registration with expert support.',
    to: '/ca-services',
  },
  {
    icon: Landmark,
    title: 'Company Registration',
    desc: 'Incorporate your Pvt Ltd, LLP or OPC end-to-end.',
    to: '/ca-services',
  },
  {
    icon: BadgeCheck,
    title: 'Trademark & ITR',
    desc: 'Trademark filing and income tax return services.',
    to: '/ca-services',
  },
]

export default function ServicesProvided() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Services We Provide"
          title="Everything Your Business Needs, One Platform"
          subtitle="From a compliant business address to full company setup — discover and book everything in one place."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <Link
                to={s.to}
                className="group flex h-full flex-col rounded-2xl border border-primary-100/60 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card transition-transform group-hover:scale-105">
                  <s.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-navy-dark">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Explore
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
