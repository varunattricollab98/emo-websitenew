import { motion } from 'framer-motion'
import { Users, MapPin, Building2, Star } from 'lucide-react'
import Counter from '../ui/Counter'

const stats = [
  { icon: Users, value: 5000, suffix: '+', label: 'Businesses served', sub: 'Across 100+ cities' },
  { icon: MapPin, value: 250, suffix: '+', label: 'Prime locations', sub: 'Metro & tier-2 hubs' },
  { icon: Building2, value: 28, suffix: '', label: 'States covered', sub: 'Pan-India presence' },
  {
    icon: Star,
    value: 4.9,
    suffix: '/5',
    decimals: 1,
    label: 'Average rating',
    sub: 'Highest Rated 4.9 on Google',
    rating: true,
  },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const item = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function ClientsStrip() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Animated gradient border wrapper */}
        <div className="relative rounded-[2rem] p-[1px]">
          {/* Animated border gradient */}
          <div
            className="absolute inset-0 rounded-[2rem] opacity-60"
            style={{
              background:
                'linear-gradient(135deg, #c4960a, #11417c, #c4960a, #16508f, #c4960a)',
              backgroundSize: '300% 300%',
              animation: 'borderGlow 6s ease-in-out infinite',
            }}
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={container}
            className="relative overflow-hidden rounded-[2rem] px-6 py-14 shadow-card-hover sm:px-12 sm:py-16"
            style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #0d2e5c 40%, #11417c 70%, #16508f 120%)' }}
          >
            {/* Animated background orbs */}
            <div
              className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full opacity-[0.07]"
              style={{
                background: 'radial-gradient(circle, #c4960a 0%, transparent 70%)',
                animation: 'floatOrb 8s ease-in-out infinite',
              }}
            />
            <div
              className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full opacity-[0.05]"
              style={{
                background: 'radial-gradient(circle, #4a9eff 0%, transparent 70%)',
                animation: 'floatOrb 10s ease-in-out infinite reverse',
              }}
            />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.03]"
              style={{
                background: 'radial-gradient(circle, #c4960a 0%, transparent 60%)',
                animation: 'pulse 4s ease-in-out infinite',
              }}
            />

            {/* Tech grid texture */}
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.03]" />

            {/* Shimmer sweep animation */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 5s ease-in-out infinite',
              }}
            />

            {/* Top gold accent line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            {/* Bottom subtle accent */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Header */}
            <motion.div variants={item} className="relative flex justify-center">
              <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-100/80">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />
                  <span className="absolute inline-flex h-full w-full rounded-full bg-gold/30 blur-[2px]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                Trusted by 5,000+ businesses across India
              </p>
            </motion.div>

            {/* Stats grid */}
            <div className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-y-10 lg:grid-cols-4">
              {/* Glassmorphism dividers for lg screens */}
              <div className="pointer-events-none absolute inset-y-0 left-1/4 hidden w-px lg:block">
                <div className="h-full w-full bg-gradient-to-b from-transparent via-white/[0.12] to-transparent" />
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px lg:block">
                <div className="h-full w-full bg-gradient-to-b from-transparent via-white/[0.12] to-transparent" />
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-3/4 hidden w-px lg:block">
                <div className="h-full w-full bg-gradient-to-b from-transparent via-white/[0.12] to-transparent" />
              </div>

              {stats.map((s, idx) => (
                <motion.div key={s.label} variants={item} className="group relative px-1 text-center lg:px-8">
                  {/* Icon with glow ring */}
                  <div className="flex items-center justify-center gap-2.5 text-primary-200/80">
                    <span className="relative flex items-center justify-center">
                      <span
                        className="absolute h-8 w-8 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background: 'radial-gradient(circle, rgba(196,150,10,0.2) 0%, transparent 70%)',
                        }}
                      />
                      <s.icon className="relative h-[18px] w-[18px] transition-colors duration-300 group-hover:text-gold/80" strokeWidth={1.75} />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em]">
                      {s.label}
                    </span>
                  </div>

                  {/* Stat number */}
                  <p className="mt-4 text-5xl font-black leading-none tracking-tight text-white sm:text-6xl">
                    <Counter to={s.value} decimals={s.decimals || 0} />
                    <span className="bg-gradient-to-r from-gold to-amber-400 bg-clip-text text-transparent">
                      {s.suffix}
                    </span>
                  </p>

                  {/* Decorative element below number */}
                  {s.rating ? (
                    <div className="mt-3 flex items-center justify-center gap-0.5">
                      {[0, 1, 2, 3, 4].map((n) => (
                        <Star key={n} className="h-3.5 w-3.5 fill-gold text-gold drop-shadow-[0_0_3px_rgba(196,150,10,0.5)]" />
                      ))}
                    </div>
                  ) : (
                    <div className="mx-auto mt-4 flex items-center justify-center gap-1">
                      <span
                        className="h-1 w-1 rounded-full bg-gold/70"
                        style={{ animation: `pulse 2s ease-in-out ${idx * 0.3}s infinite` }}
                      />
                      <span className="h-0.5 w-8 rounded-full bg-gradient-to-r from-gold/60 via-gold/40 to-transparent" />
                      <span
                        className="h-1 w-1 rounded-full bg-gold/70"
                        style={{ animation: `pulse 2s ease-in-out ${idx * 0.3 + 0.5}s infinite` }}
                      />
                    </div>
                  )}

                  {/* Subtitle */}
                  <p className="mt-3 text-xs font-medium text-primary-100/50 transition-colors duration-300 group-hover:text-primary-100/70">
                    {s.sub}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes borderGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(10px, -15px) scale(1.05); }
          66% { transform: translate(-8px, 10px) scale(0.95); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </section>
  )
}
