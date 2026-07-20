import { motion } from 'framer-motion'
import Counter from '../ui/Counter'

const stats = [
  { to: 5000, suffix: '+', label: 'Businesses Served' },
  { to: 200, suffix: '+', label: 'Premium Addresses' },
  { to: 28, suffix: '', label: 'States Covered' },
  { to: 97, suffix: '%', label: 'Approval Rate' },
  { to: 4.9, suffix: '/5', label: 'Client Rating', decimals: 1 },
]

export default function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-navy-gradient py-16 lg:py-20">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-primary-800/40 blur-3xl" />
      <div className="container-custom relative">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-4xl font-extrabold text-white lg:text-5xl">
                <Counter to={s.to} suffix={s.suffix} decimals={s.decimals || 0} />
              </p>
              <p className="mt-2 text-sm font-medium text-primary-100">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
