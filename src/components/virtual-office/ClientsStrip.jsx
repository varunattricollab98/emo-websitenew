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
  hidden: { opacity: 0, y: 18 },
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
          className="relative overflow-hidden rounded-[2rem] px-6 py-12 shadow-card-hover ring-1 ring-white/10 sm:px-10 sm:py-14"
          style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 60%, #16508f 120%)' }}
        >
          {/* subtle textures + glow */}
          <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.05]" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-300/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          {/* header pill */}
          <motion.div variants={item} className="relative flex justify-center">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-100 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              Trusted by 5,000+ businesses across India
            </p>
          </motion.div>

          {/* stats */}
          <div className="relative mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-y-8 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
            {stats.map((s) => (
              <motion.div key={s.label} variants={item} className="px-2 text-center lg:px-6">
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-gold">
                  <s.icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <p className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-[2.6rem] sm:leading-none">
                  <Counter to={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
                </p>
                {s.rating && (
                  <div className="mt-2 flex items-center justify-center gap-0.5">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <Star key={n} className="h-3.5 w-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                )}
                <p className="mt-2 text-sm font-semibold text-white">{s.label}</p>
                <p className="mt-0.5 text-xs font-medium text-primary-100/60">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
