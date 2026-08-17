import { motion } from 'framer-motion'
import { Users, MapPin, Building2, Star } from 'lucide-react'
import Counter from '../ui/Counter'

const stats = [
  { icon: Users, value: 5000, suffix: '+', label: 'Businesses served', sub: 'Across 100+ cities', glow: 'rgba(16,185,129,0.25)' },
  { icon: MapPin, value: 250, suffix: '+', label: 'Prime locations', sub: 'Metro & tier-2 hubs', glow: 'rgba(56,189,248,0.25)' },
  { icon: Building2, value: 28, suffix: '', label: 'States covered', sub: 'Pan-India presence', glow: 'rgba(139,92,246,0.2)' },
  {
    icon: Star,
    value: 4.9,
    suffix: '/5',
    decimals: 1,
    label: 'Average rating',
    sub: 'Highest Rated 4.9 on Google',
    rating: true,
    glow: 'rgba(245,158,11,0.25)',
  },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
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
          style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #0d2e5c 40%, #11417c 70%, #16508f 120%)' }}
        >
          {/* Background effects */}
          <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.04]" />
          <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary-300/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-emerald-400/8 blur-[60px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-violet-500/5 blur-[60px]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Header */}
          <motion.div variants={item} className="relative flex justify-center">
            <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary-100/80">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Trusted by 5,000+ businesses across India
            </p>
          </motion.div>

          {/* Glass Morphism Stat Cards */}
          <div className="relative mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={item}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-white/[0.07]"
              >
                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute -inset-2 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: s.glow }}
                />
                {/* Gradient border shine on top */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                {/* Content */}
                <div className="relative text-center">
                  {/* Label with icon */}
                  <div className="flex items-center justify-center gap-2 text-primary-200/60">
                    <s.icon className="h-4 w-4" strokeWidth={1.75} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
                      {s.label}
                    </span>
                  </div>

                  {/* Number */}
                  <p className="mt-4 text-4xl font-black leading-none tracking-tight text-white sm:text-5xl">
                    <Counter to={s.value} decimals={s.decimals || 0} />
                    <span className="text-emerald-400">{s.suffix}</span>
                  </p>

                  {/* Rating stars */}
                  {s.rating && (
                    <div className="mt-3 flex items-center justify-center gap-0.5">
                      {[0, 1, 2, 3, 4].map((n) => (
                        <Star key={n} className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
                      ))}
                    </div>
                  )}

                  {/* Subtitle */}
                  <p className="mt-3 text-[11px] font-medium text-primary-100/50">{s.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
