import { motion } from 'framer-motion'
import { Users, MapPin, Building2, Star } from 'lucide-react'
import Counter from '../ui/Counter'

const stats = [
  { icon: Users, value: 5000, suffix: '+', label: 'Businesses served', sub: 'Across 14+ cities' },
  { icon: MapPin, value: 250, suffix: '+', label: 'Prime locations', sub: 'Metro & tier-2 hubs' },
  { icon: Building2, value: 28, suffix: '', label: 'States covered', sub: 'Pan-India presence' },
  {
    icon: Star,
    value: 4.9,
    suffix: '/5',
    decimals: 1,
    label: 'Average rating',
    sub: '1,200+ reviews',
    rating: true,
  },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function ClientsStrip() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={container}
          className="relative overflow-hidden rounded-[2rem] px-6 py-14 shadow-card-hover ring-1 ring-white/10 sm:px-12 sm:py-16"
          style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 62%, #16508f 120%)' }}
        >
          {/* subtle texture + single soft glow */}
          <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.04]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

          {/* header */}
          <motion.div variants={item} className="relative flex justify-center">
            <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-100/80">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              Trusted by 5,000+ businesses across India
            </p>
          </motion.div>

          {/* stats — numbers are the hero */}
          <div className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-white/[0.08]">
            {stats.map((s) => (
              <motion.div key={s.label} variants={item} className="px-1 text-center lg:px-8">
                <div className="flex items-center justify-center gap-2 text-primary-200/70">
                  <s.icon className="h-4 w-4" strokeWidth={1.75} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em]">
                    {s.label}
                  </span>
                </div>
                <p className="mt-3 text-5xl font-black leading-none tracking-tight text-white sm:text-6xl">
                  <Counter to={s.value} decimals={s.decimals || 0} />
                  <span className="text-gold">{s.suffix}</span>
                </p>
                {s.rating ? (
                  <div className="mt-3 flex items-center justify-center gap-0.5">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <Star key={n} className="h-3.5 w-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                ) : (
                  <div className="mx-auto mt-3 h-0.5 w-8 rounded-full bg-gold/50" />
                )}
                <p className="mt-3 text-xs font-medium text-primary-100/50">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
