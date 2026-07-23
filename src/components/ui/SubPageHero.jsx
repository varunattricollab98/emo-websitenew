import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

/**
 * Premium split hero used across sub-pages.
 * - Left: eyebrow pill (pulsing dot), two-tone heading (accent renders in gradient),
 *   subtitle, optional check-chips, and action buttons (children).
 * - Right: optional `visual` node (glass card, stats, etc.). When absent the hero
 *   is single-column and centred.
 */
export default function SubPageHero({
  eyebrow,
  title,
  accent,
  subtitle,
  chips = [],
  visual,
  children,
}) {
  const renderTitle = () => {
    if (accent && typeof title === 'string' && title.includes(accent)) {
      const idx = title.indexOf(accent)
      return (
        <>
          {title.slice(0, idx)}
          <span className="gradient-text">{accent}</span>
          {title.slice(idx + accent.length)}
        </>
      )
    }
    return title
  }

  const hasVisual = Boolean(visual)

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_40%_40%,#000,transparent)]" />

      <div
        className={`container-custom relative py-16 lg:py-24 ${
          hasVisual ? 'grid items-center gap-12 lg:grid-cols-2' : ''
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={hasVisual ? '' : 'max-w-3xl'}
        >
          {eyebrow && (
            <span className="inline-flex items-center gap-2.5 rounded-full border border-primary-200 bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-soft">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              {eyebrow}
            </span>
          )}

          <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-navy-dark text-balance sm:text-4xl lg:text-[3.1rem] lg:leading-[1.08]">
            {renderTitle()}
          </h1>

          {subtitle && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">{subtitle}</p>
          )}

          {chips.length > 0 && (
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {chips.map((c) => (
                <li
                  key={c}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-4 py-2 text-sm font-semibold text-navy shadow-soft backdrop-blur"
                >
                  <span className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          )}

          {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
        </motion.div>

        {hasVisual && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="relative"
          >
            {visual}
          </motion.div>
        )}
      </div>
    </section>
  )
}
