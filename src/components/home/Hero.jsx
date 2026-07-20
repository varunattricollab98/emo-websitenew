import { motion } from 'framer-motion'
import { Star, ArrowRight, ShieldCheck, MapPin, Building2, CheckCircle2 } from 'lucide-react'
import Button from '../ui/Button'

const trustItems = [
  { icon: Star, label: '4.9/5 Google' },
  { icon: Building2, label: '5,000+ businesses' },
  { icon: MapPin, label: '200+ addresses' },
  { icon: ShieldCheck, label: '28 states' },
]

const stats = [
  { value: '5,000+', label: 'Businesses served' },
  { value: '200+', label: 'Premium addresses' },
  { value: '97%', label: 'GST approval rate' },
  { value: '2-3 days', label: 'Avg. setup time' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-primary-100/60 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(44,103,158,0.10),transparent_45%)]" />

      <div className="container-custom relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        {/* Left copy */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-primary-700 backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-accent-green" />
            India's #1 Virtual Office Platform
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy-dark sm:text-5xl lg:text-6xl text-balance">
            India's Most Trusted Platform for{' '}
            <span className="gradient-text">Virtual Offices</span> & Business Compliance
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Get a premium business address for GST and company registration, coworking spaces and
            end-to-end compliance — set up in as little as 2–3 days, fully online.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button to="/contact" size="lg">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button to="/virtual-office" variant="outline" size="lg">
              Explore Solutions
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {trustItems.map((t) => (
              <div key={t.label} className="flex items-center gap-2">
                <t.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-navy-dark">{t.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right visual card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          className="relative"
        >
          <div className="glass-card relative z-10 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Your Business Address</p>
                <p className="mt-1 text-lg font-bold text-navy-dark">Sector 19, Gurugram</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white">
                <Building2 className="h-6 w-6" />
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {['GST registration ready', 'Notarised rent agreement + NOC', 'Dedicated compliance manager'].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-primary-50/70 px-4 py-3">
                    <CheckCircle2 className="h-5 w-5 flex-none text-accent-emerald" />
                    <span className="text-sm font-medium text-navy-dark">{item}</span>
                  </div>
                )
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-primary-100 bg-white p-4">
                  <p className="text-2xl font-extrabold gradient-text">{s.value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* floating badge */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-4 -top-5 z-20 rounded-2xl bg-white p-4 shadow-card-hover"
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
            </div>
            <p className="mt-1 text-xs font-semibold text-navy-dark">Rated 4.9/5 by clients</p>
          </motion.div>

          <div className="pointer-events-none absolute -inset-4 -z-0 rounded-[2rem] bg-primary/10 blur-2xl" />
        </motion.div>
      </div>
    </section>
  )
}
