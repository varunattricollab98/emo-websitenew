import { Link } from 'react-router-dom'
import { Building2, Users, CalendarClock, FileCheck2, ArrowRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

const solutions = [
  {
    to: '/virtual-office',
    icon: Building2,
    title: 'Virtual Office',
    desc: 'Premium business addresses for GST & company registration, mail handling and more.',
  },
  {
    to: '/coworking',
    icon: Users,
    title: 'Coworking Spaces',
    desc: 'Flexible dedicated desks, private cabins and hot seats in prime locations.',
  },
  {
    to: '/meeting-rooms',
    icon: CalendarClock,
    title: 'Meeting Rooms',
    desc: 'Book fully-equipped meeting, conference and training rooms by the hour.',
  },
  {
    to: '/ca-services',
    icon: FileCheck2,
    title: 'CA Services',
    desc: 'End-to-end GST, company incorporation, ITR filing and trademark registration.',
  },
]

export default function SolutionsGrid() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Our Solutions"
          title="Everything your business needs, in one place"
          subtitle="From a prestigious address to complete compliance — pick a solution built for modern Indian businesses."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((s, i) => (
            <Reveal key={s.to} delay={i * 0.08}>
              <Link to={s.to} className="premium-card group block h-full p-7">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card transition-transform group-hover:scale-110">
                  <s.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-navy-dark">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Learn more
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
