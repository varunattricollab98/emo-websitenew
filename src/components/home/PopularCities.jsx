import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { cities } from '../../data/cities'

export default function PopularCities() {
  return (
    <section className="section-padding bg-surface-light">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Popular Cities"
          title="Virtual offices in India's top business hubs"
          subtitle="Register your business in a premium location. Choose from 200+ verified addresses across the country."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city, i) => (
            <Reveal key={city.slug} delay={(i % 4) * 0.06}>
              <Link
                to={`/virtual-office/${city.slug}`}
                className="premium-card group relative block h-full overflow-hidden p-6"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-50 transition-transform group-hover:scale-150" />
                <div className="relative">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-gradient text-white">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-navy-dark">{city.name}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">{city.addresses} premium addresses</p>
                  <div className="mt-4 flex items-end justify-between">
                    <p className="text-sm text-slate-500">
                      Starting at{' '}
                      <span className="text-lg font-extrabold text-primary">₹{city.price}</span>
                      <span className="text-xs">/yr</span>
                    </p>
                    <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
