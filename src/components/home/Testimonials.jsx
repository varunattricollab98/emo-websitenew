import { Star, Quote } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { testimonials } from '../../data/testimonials'

export default function Testimonials() {
  return (
    <section className="section-padding bg-surface-light">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by founders across India"
          subtitle="Real stories from businesses that scaled faster with EaseMyOffice."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="premium-card flex h-full flex-col p-7">
                <Quote className="h-9 w-9 text-primary-200" />
                <div className="mt-3 flex gap-0.5">
                  {[...Array(t.rating)].map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-primary-100 pt-5">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-gradient text-sm font-bold text-white">
                    {t.initials}
                  </span>
                  <span>
                    <span className="block font-bold text-navy-dark">{t.name}</span>
                    <span className="block text-xs text-slate-500">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
