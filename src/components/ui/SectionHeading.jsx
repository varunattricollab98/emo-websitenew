import { motion } from 'framer-motion'

/**
 * Premium section heading used across the whole site.
 * - Large standout eyebrow pill (with pulsing dot)
 * - Optional two-tone heading via `accent` (that substring renders in gradient)
 * - `light` variant for dark-background sections
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
  accent,
  className = '',
}) {
  const centered = align === 'center'

  const renderTitle = () => {
    if (accent && typeof title === 'string' && title.includes(accent)) {
      const idx = title.indexOf(accent)
      const before = title.slice(0, idx)
      const after = title.slice(idx + accent.length)
      return (
        <>
          {before}
          <span className={light ? 'text-primary-300' : 'gradient-text'}>{accent}</span>
          {after}
        </>
      )
    }
    return title
  }

  const eyebrowClass = light
    ? 'inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-9 py-2.5 text-base font-bold uppercase tracking-[0.18em] text-white shadow-soft backdrop-blur'
    : 'inline-flex items-center gap-3 rounded-full border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-primary-50 px-9 py-2.5 text-base font-bold uppercase tracking-[0.18em] text-primary shadow-soft ring-1 ring-primary-100/60'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`max-w-3xl ${centered ? 'mx-auto text-center' : 'text-left'} ${className}`}
    >
      {eyebrow && (
        <div className={`mb-6 ${centered ? 'flex justify-center' : ''}`}>
          <span className={eyebrowClass}>
            <span className="relative flex h-3 w-3">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                  light ? 'bg-gold/60' : 'bg-primary/50'
                }`}
              />
              <span
                className={`relative inline-flex h-3 w-3 rounded-full ${light ? 'bg-gold' : 'bg-primary'}`}
              />
            </span>
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        className={`text-3xl font-extrabold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] ${
          light ? 'text-white' : 'text-navy-dark'
        }`}
      >
        {renderTitle()}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            light ? 'text-primary-100' : 'text-slate-500'
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
