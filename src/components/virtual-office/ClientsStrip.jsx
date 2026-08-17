import { motion } from 'framer-motion'
import { Users, MapPin, Building2, Star } from 'lucide-react'
import Counter from '../ui/Counter'

// Official multicolour Google "G"
function GoogleG({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.93H1.3v3.09A11.99 11.99 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.31 14.32a7.2 7.2 0 0 1 0-4.63V6.6H1.3a12 12 0 0 0 0 10.81l4.01-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.95 1.14 15.24 0 12 0A11.99 11.99 0 0 0 1.3 6.6l4.01 3.09C6.25 6.85 8.89 4.75 12 4.75z" />
    </svg>
  )
}

const stats = [
  { icon: Users, value: 5000, suffix: '+', label: 'Businesses Served', sub: 'Across 100+ cities', accent: '#10b981' },
  { icon: MapPin, value: 250, suffix: '+', label: 'Prime Locations', sub: 'Metro & tier-2 hubs', accent: '#3c82c2' },
  { icon: Building2, value: 28, suffix: '', label: 'States Covered', sub: 'Pan-India presence', accent: '#8b5cf6' },
  {
    icon: Star,
    value: 4.9,
    suffix: '/5',
    decimals: 1,
    label: 'Average Rating',
    sub: 'Highest Rated on Google',
    accent: '#f59e0b',
    rating: true,
  },
]

export default function ClientsStrip() {
  return (
    <section className="section-padding bg-surface-light">
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
          {/* Left — Bold heading */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-soft">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Our Impact
            </span>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.2] tracking-tight text-navy-dark sm:text-4xl">
              Numbers That{' '}
              <span className="gradient-text">Speak</span>
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-600">
              Trusted by thousands of founders, sellers and enterprises across India for compliant addresses and hassle-free business setup.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <GoogleG className="h-7 w-7" />
              <div>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <Star key={n} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                  <span className="ml-1.5 text-sm font-bold text-navy-dark">4.9</span>
                </div>
                <p className="text-xs text-slate-500">Rated on Google by customers</p>
              </div>
            </div>
          </motion.div>

          {/* Right — 2x2 stat cards */}
          <div className="grid grid-cols-2 gap-5">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-primary-100/70 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                {/* Colored accent line on top — thicker & more visible */}
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: s.accent }}
                />

                {/* Icon — white icon on colored rounded square */}
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md"
                  style={{ background: s.accent }}
                >
                  <s.icon className="h-6 w-6" />
                </span>

                {/* Number — large & bold */}
                <p className="mt-5 text-4xl font-extrabold tracking-tight text-navy-dark sm:text-5xl">
                  <Counter to={s.value} decimals={s.decimals || 0} />
                  <span className="font-bold" style={{ color: s.accent }}>{s.suffix}</span>
                </p>

                {/* Label & sub */}
                <p className="mt-2 text-base font-bold text-navy-dark">{s.label}</p>
                <p className="mt-0.5 text-sm text-slate-500">{s.sub}</p>

                {/* Google rating stars for rating card */}
                {s.rating && (
                  <div className="mt-3 flex items-center gap-2">
                    <GoogleG className="h-5 w-5" />
                    <div className="flex gap-0.5">
                      {[0, 1, 2, 3, 4].map((n) => (
                        <Star key={n} className="h-3.5 w-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
