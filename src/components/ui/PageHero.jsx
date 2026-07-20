import { motion } from 'framer-motion'
import Badge from './Badge'

export default function PageHero({ eyebrow, title, highlight, subtitle, children }) {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      {/* decorative shapes */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(44,103,158,0.08),transparent_45%)]" />

      <div className="container-custom relative py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          {eyebrow && <Badge className="mb-5">{eyebrow}</Badge>}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-navy-dark text-balance">
            {title} {highlight && <span className="gradient-text">{highlight}</span>}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">{subtitle}</p>
          )}
          {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
        </motion.div>
      </div>
    </section>
  )
}
