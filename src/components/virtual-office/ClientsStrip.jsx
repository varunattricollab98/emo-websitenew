import { motion } from 'framer-motion'
import { Users, MapPin, Building2, Star } from 'lucide-react'
import Counter from '../ui/Counter'

const stats = [
  { icon: Users, value: 5000, suffix: '+', label: 'Businesses served' },
  { icon: MapPin, value: 250, suffix: '+', label: 'Prime locations' },
  { icon: Building2, value: 28, suffix: '', label: 'States covered' },
  { icon: Star, value: 4.9, suffix: '/5', decimals: 1, label: 'Average rating' },
]

export default function ClientsStrip() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl px-6 py-12 shadow-card-hover ring-1 ring-white/10 sm:px-10"
          style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 55%, #17559a 120%)' }}
        >
          <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.06]" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-300/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-gold/12 blur-3xl" />

          <p className="relative text-center text-sm font-bold uppercase tracking-widest text-primary-100">
            Trusted by 5,000+ businesses across India
          </p>
          <div className="relative mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-gold ring-1 ring-white/15">
                  <s.icon className="h-6 w-6" />
                </span>
                <p className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                  <Counter to={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
                </p>
                <p className="mt-1 text-sm font-medium text-primary-100">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
