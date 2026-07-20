import { motion } from 'framer-motion'
import Badge from './Badge'

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
  className = '',
}) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`max-w-3xl ${alignment} ${className}`}
    >
      {eyebrow && (
        <div className={align === 'center' ? 'flex justify-center' : ''}>
          <Badge variant={light ? 'white' : 'blue'} className="mb-4">
            {eyebrow}
          </Badge>
        </div>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-tight tracking-tight text-balance ${
          light ? 'text-white' : 'text-navy-dark'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            light ? 'text-primary-100' : 'text-slate-600'
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
