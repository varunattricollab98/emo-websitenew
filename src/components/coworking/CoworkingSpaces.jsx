import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Star, ArrowRight, Users, Sun } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import SmartImage from '../ui/SmartImage'
import Button from '../ui/Button'
import { coworkingCities, getCoworkingSpaces } from '../../data/coworkingSpaces'

export default function CoworkingSpaces() {
  const [active, setActive] = useState('bangalore')
  const spaces = getCoworkingSpaces(active)
  const activeName = coworkingCities.find((c) => c.slug === active)?.name

  return (
    <section className="section-padding relative overflow-hidden bg-surface-light">
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-40 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_20%,#000,transparent)]" />
      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Explore Spaces"
          title="Browse Coworking Spaces City by City"
          accent="City by City"
          subtitle="Hand-picked, move-in-ready workspaces in India's top business districts — with transparent pricing and zero brokerage."
        />

        {/* city tabs */}
        <div className="sky-scroll mt-12 flex gap-2.5 overflow-x-auto pb-3">
          {coworkingCities.map((c) => {
            const isActive = c.slug === active
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setActive(c.slug)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary-gradient text-white shadow-card'
                    : 'border border-primary-100 bg-white text-navy-dark shadow-soft hover:border-primary/40 hover:text-primary'
                }`}
              >
                {c.name}
              </button>
            )
          })}
        </div>

        {/* space cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {spaces.map((s) => (
              <div
                key={s.name + s.locality}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-primary-100/70 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                {/* image */}
                <div className="relative h-44 overflow-hidden bg-primary-gradient">
                  <SmartImage
                    src={s.image}
                    alt={`${s.name}, ${s.locality}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-dark/50 to-transparent" />
                  {s.popular && (
                    <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-gold to-gold-dark px-3 py-1 text-[11px] font-bold text-white shadow-gold-glow">
                      POPULAR
                    </span>
                  )}
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-navy-dark shadow-soft backdrop-blur">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    {s.rating}
                  </span>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-semibold drop-shadow">
                      {s.locality}, {activeName}
                    </span>
                  </div>
                </div>

                {/* body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-navy-dark">{s.name}</h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    {s.seats}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-end justify-between border-t border-primary-100/70 pt-4">
                    <div>
                      <p className="text-[11px] font-medium text-slate-400">Dedicated desk</p>
                      <p className="text-lg font-extrabold text-navy-dark">
                        ₹{s.price.toLocaleString('en-IN')}
                        <span className="text-xs font-medium text-slate-400">/seat/mo</span>
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-surface-light px-2.5 py-1.5 text-[11px] font-semibold text-navy">
                      <Sun className="h-3.5 w-3.5 text-gold-dark" />
                      Day pass ₹{s.dayPass}
                    </span>
                  </div>

                  <Button to="/contact" className="mt-5 w-full">
                    Book a Tour
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <p className="mt-8 text-center text-sm text-slate-500">
          Showing top spaces in {activeName}. Prices are indicative — get an exact, brokerage-free
          quote from your dedicated manager.
        </p>
      </div>
    </section>
  )
}
