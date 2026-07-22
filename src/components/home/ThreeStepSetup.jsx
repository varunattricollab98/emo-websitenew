import { motion } from 'framer-motion'
import { MapPinned, FileText, KeyRound, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '../ui/SectionHeading'

const steps = [
  {
    icon: MapPinned,
    title: 'Choose Location & Plan',
    desc: 'Pick your city and the plan that matches your requirement.',
    chip: '250+ locations',
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
    glow: 'rgba(44,103,158,0.45)',
    color: '#2c679e',
  },
  {
    icon: FileText,
    title: 'Submit KYC Documents',
    desc: 'Upload your KYC online — our team verifies everything for you.',
    chip: '100% online',
    grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    glow: 'rgba(139,92,246,0.45)',
    color: '#6d28d9',
  },
  {
    icon: KeyRound,
    title: 'Get Your Ready-to-Use Address',
    desc: 'Receive your compliant address & documents in just 2–3 days.',
    chip: 'Ready in 2–3 days',
    grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    glow: 'rgba(245,158,11,0.5)',
    color: '#d97706',
  },
]

export default function ThreeStepSetup() {
  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-white via-primary-50/30 to-white">
      {/* tech dots + vibrant glows */}
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000,transparent)]" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-64 w-64 rounded-full bg-violet-300/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />

      <div className="container-custom relative">
        <SectionHeading
          eyebrow="How It Works"
          title="Get Set Up in 3 Simple Steps"
          accent="3 Simple Steps"
          subtitle="From choosing a location to a ready-to-use business address — fully online."
        />

        <div className="relative mt-20">
          {/* ===== animated green progress connector (desktop) ===== */}
          <div className="pointer-events-none absolute inset-x-[16.66%] top-10 hidden lg:block">
            {/* base track */}
            <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-primary-100" />
            {/* green fill draws forward on scroll */}
            <motion.div
              className="absolute inset-x-0 top-1/2 h-[3px] origin-left -translate-y-1/2 rounded-full"
              style={{ background: 'linear-gradient(90deg, #34d399, #10b981, #059669)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />
            {/* green pulse continuously flowing forward toward the final step */}
            <motion.span
              className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-accent-green"
              style={{ boxShadow: '0 0 14px 5px rgba(16,185,129,0.6)' }}
              initial={{ left: '0%' }}
              animate={{ left: ['0%', '100%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }}
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            {steps.map((s, i) => (
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
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                >
                  {/* soft colour glow */}
                  <div
                    className="absolute inset-0 -z-10 rounded-2xl blur-2xl transition-opacity duration-300 group-hover:opacity-90"
                    style={{ background: s.glow, opacity: 0.6 }}
                  />
                  <span
                    className="relative inline-flex h-20 w-20 items-center justify-center rounded-2xl text-white ring-4 ring-white shadow-card-hover transition-transform duration-300 group-hover:scale-110"
                    style={{ background: s.grad }}
                  >
                    <s.icon className="h-9 w-9" />
                  </span>
                  {/* gradient step badge — matches each step's colour */}
                  <span
                    className="absolute -right-3 -top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-card ring-[3px] ring-white"
                    style={{ background: s.grad }}
                  >
                    {i + 1}
                  </span>
                </motion.div>

                {/* content card */}
                <div className="mt-8 w-full rounded-2xl border border-primary-100/70 bg-white/80 p-6 shadow-soft backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-card-hover">
                  <h3 className="text-lg font-bold text-navy-dark">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                    {s.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {s.chip}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 flex justify-center"
        >
          <Link
            to="/virtual-office"
            className="btn-base bg-primary-gradient px-8 py-4 text-base text-white shadow-card transition-all hover:shadow-glow hover:brightness-110"
          >
            Start Your Setup Today
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
