import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from './SectionHeading'

/**
 * Premium "How It Works" step flow.
 *
 * Extracted from the homepage ThreeStepSetup so the service pages can use the
 * same treatment instead of a plainer inline version. Everything is driven by
 * props, so each page keeps its own wording.
 *
 * Visual features:
 *   - floating, colour-graded icon tiles with a completed-step check badge
 *   - animated green progress connector that draws in on scroll, plus a pulse
 *     that keeps travelling toward the final step (desktop only)
 *   - content card per step with an optional highlight chip
 *
 * Props:
 *   eyebrow, title, accent, subtitle , passed through to SectionHeading
 *   steps    , [{ icon, title, desc, chip, grad, glow }]
 *   cta      , optional { label, to } for a link, or { label, onClick } for a button
 *   bg       , section background classes (defaults to the homepage gradient)
 *   decorate , show the ambient dots/glows (default true)
 */

// Shared palette so every step flow on the site reads the same way:
// primary blue -> violet -> gold, i.e. start, in progress, done.
export const STEP_STYLES = [
  { grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)', glow: 'rgba(44,103,158,0.45)' },
  { grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', glow: 'rgba(139,92,246,0.45)' },
  { grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', glow: 'rgba(245,158,11,0.5)' },
  { grad: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', glow: 'rgba(16,185,129,0.45)' },
]

export default function StepsFlow({
  eyebrow = 'How It Works',
  title,
  accent,
  subtitle,
  steps = [],
  cta,
  bg = 'bg-gradient-to-b from-white via-primary-50/30 to-white',
  decorate = true,
}) {
  if (!steps.length) return null

  // The connector spans between the first and last icon centres. With N equal
  // columns each centre sits at (i + 0.5)/N, so inset by half a column.
  const halfCol = `${50 / steps.length}%`
  const gridCols =
    steps.length === 4 ? 'lg:grid-cols-4' : steps.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'

  return (
    <section className={`section-padding relative overflow-hidden ${bg}`}>
      {decorate && (
        <>
          <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000,transparent)]" />
          <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-1/4 h-64 w-64 rounded-full bg-violet-300/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        </>
      )}

      <div className="container-custom relative">
        <SectionHeading eyebrow={eyebrow} title={title} accent={accent} subtitle={subtitle} />

        <div className="relative mt-20">
          {/* animated green progress connector (desktop) */}
          <div
            className="pointer-events-none absolute top-10 hidden lg:block"
            style={{ left: halfCol, right: halfCol }}
          >
            <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-primary-100" />
            <motion.div
              className="absolute inset-x-0 top-1/2 h-[3px] origin-left -translate-y-1/2 rounded-full"
              style={{ background: 'linear-gradient(90deg, #34d399, #10b981, #059669)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />
            <motion.span
              className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-accent-green"
              style={{ boxShadow: '0 0 14px 5px rgba(16,185,129,0.6)' }}
              initial={{ left: '0%' }}
              animate={{ left: ['0%', '100%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }}
            />
          </div>

          <div className={`grid gap-10 ${gridCols}`}>
            {steps.map((s, i) => {
              const style = STEP_STYLES[i % STEP_STYLES.length]
              const grad = s.grad || style.grad
              const glow = s.glow || style.glow
              const Icon = s.icon
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55, delay: i * 0.18 }}
                  className="group relative flex flex-col items-center text-center"
                >
                  {/* floating icon tile */}
                  <motion.div
                    className="relative"
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.5,
                    }}
                  >
                    <div
                      className="absolute inset-0 -z-10 rounded-2xl blur-2xl transition-opacity duration-300 group-hover:opacity-90"
                      style={{ background: glow, opacity: 0.6 }}
                    />
                    <span
                      className="relative inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-white ring-4 ring-white shadow-card-hover transition-transform duration-300 group-hover:scale-110"
                      style={!s.emoji ? { background: grad } : undefined}
                    >
                      {s.emoji ? (
                        <span className="text-4xl">{s.emoji}</span>
                      ) : Icon ? (
                        <Icon className="h-9 w-9" />
                      ) : null}
                    </span>
                    <span
                      className="absolute -right-3 -top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-white shadow-card ring-[3px] ring-white"
                      style={{ background: grad }}
                    >
                      <Check className="h-5 w-5" strokeWidth={3} />
                    </span>
                  </motion.div>

                  {/* content card */}
                  <div className="mt-8 w-full rounded-2xl border border-primary-100/70 bg-white/80 p-6 shadow-soft backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-card-hover">
                    <h3 className="text-lg font-bold text-navy-dark">{s.title}</h3>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                      {s.desc}
                    </p>
                    {s.chip && (
                      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {s.chip}
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-14 flex justify-center"
          >
            {cta.to ? (
              <Link
                to={cta.to}
                className="btn-base bg-primary-gradient px-8 py-4 text-base text-white shadow-card transition-all hover:shadow-glow hover:brightness-110"
              >
                {cta.label}
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={cta.onClick}
                className="btn-base bg-primary-gradient px-8 py-4 text-base text-white shadow-card transition-all hover:shadow-glow hover:brightness-110"
              >
                {cta.label}
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
