import { Link } from 'react-router-dom'
import { MapPin, ArrowUpRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { cities } from '../../data/cities'

export default function CitySpaceCounts() {
  return (
    <section className="section-padding relative overflow-hidden bg-surface-light">
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_25%,#000,transparent)]" />
      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Our Coverage"
          title="Verified Spaces Across India"
          accent="Across India"
          subtitle="Live availability in every major business hub — pick your city and register in a premium address near you."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 4) * 0.05}>
              <Link
                to={`/virtual-office/${c.slug}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-primary-100/70 bg-white p-6 shadow-soft ring-1 ring-navy-dark/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card"
              >
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary-gradient group-hover:text-white">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-primary" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-bold text-navy-dark">{c.name}</h3>
                  <p className="text-xs text-slate-400">{c.region}</p>
                  <p className="mt-2 text-sm font-bold text-primary">
                    {c.addresses}+ <span className="font-medium text-slate-500">spaces available</span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
