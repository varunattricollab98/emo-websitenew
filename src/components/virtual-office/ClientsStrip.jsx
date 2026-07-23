import { motion } from 'framer-motion'
import { Users, MapPin, Building2, Star } from 'lucide-react'
import Counter from '../ui/Counter'

const stats = [
  {
    icon: Users,
    value: 5000,
    suffix: '+',
    label: 'Businesses served',
    sub: 'Across 14+ cities',
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
  },
  {
    icon: MapPin,
    value: 250,
    suffix: '+',
    label: 'Prime locations',
    sub: 'Metro & tier-2 hubs',
    grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
  },
  {
    icon: Building2,
    value: 28,
    suffix: '',
    label: 'States covered',
    sub: 'Pan-India presence',
    grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
  },
  {
    icon: Star,
    value: 4.9,
    suffix: '/5',
    decimals: 1,
    label: 'Average rating',
    sub: '1,200+ reviews',
    rating: true,
    grad: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
]

// human-feeling avatar stack (initials, no external images)
const avatars = [
  { i: 'RS', c: 'linear-gradient(135deg,#3c82c2,#11417c)' },
  { i: 'AK', c: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { i: 'MP', c: 'linear-gradient(135deg,#8b5cf6,#6366f1)' },
  { i: 'SV', c: 'linear-gradient(135deg,#10b981,#059669)' },
  { i: 'Nth', c: 'linear-gradient(135deg,#0f1a2e,#255485)' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 22 },
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
          style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 55%, #17559a 120%)' }}
        >
          {/* textures + animated glows */}
          <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.07]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 animate-pulse-slow rounded-full bg-primary-300/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 animate-pulse-slow rounded-full bg-gold/12 blur-3xl" />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          {/* header: live pill + avatar stack */}
          <motion.div
            variants={item}
            className="relative flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <div className="flex -space-x-2.5">
              {avatars.map((a) => (
                <span
                  key={a.i}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: a.c, boxShadow: '0 0 0 2px #0d2b52' }}
                >
                  {a.i}
                </span>
              ))}
            </div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-100 backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              Trusted by 5,000+ businesses across India
            </p>
          </motion.div>

          {/* stats */}
          <div className="relative mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={item}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08]"
              >
                <span
                  className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-card ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: s.grad }}
                >
                  <s.icon className="h-6 w-6" />
                </span>
                <p className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                  <Counter to={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
                </p>
                {s.rating ? (
                  <div className="mt-1.5 flex items-center justify-center gap-0.5">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <Star key={n} className="h-3.5 w-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                ) : null}
                <p className="mt-1.5 text-sm font-semibold text-white">{s.label}</p>
                <p className="mt-0.5 text-xs font-medium text-primary-100/70">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
