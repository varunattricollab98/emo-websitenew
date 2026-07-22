import { motion } from 'framer-motion'
import {
  BadgeCheck,
  MapPin,
  IndianRupee,
  Star,
  Headset,
  ShieldCheck,
  Clock,
  ArrowRight,
  Check,
} from 'lucide-react'
import Reveal from '../ui/Reveal'
import Counter from '../ui/Counter'
import Button from '../ui/Button'

const included = [
  'End-to-end paperwork handled for you',
  'One address for GST, MCA & mailing',
  'Dedicated relationship manager',
]

const reasons = [
  {
    icon: IndianRupee,
    title: 'Lowest Price, Zero Hidden Costs',
    desc: 'Transparent, all-inclusive pricing from ₹699/mo. The price you see is the price you pay — no surprise add-ons at checkout.',
    chip: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    glow: 'rgba(16,185,129,0.35)',
  },
  {
    icon: BadgeCheck,
    title: '98.7% Document Approval Rate',
    desc: 'GST & company registration papers cleared the first time — one of the highest first-attempt approval rates in the industry.',
    chip: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
    glow: 'rgba(44,103,158,0.38)',
  },
  {
    icon: Star,
    title: 'Rated 4.9/5 by 5,000+ Businesses',
    desc: 'Trusted by founders, D2C sellers and enterprises across India, with a 4.9-star Google rating.',
    chip: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    glow: 'rgba(245,158,11,0.38)',
  },
  {
    icon: MapPin,
    title: 'Real, Verified Premium Addresses',
    desc: 'Every address is a genuine, physically verified commercial premise — purpose-built for virtual office & GST use.',
    chip: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    glow: 'rgba(139,92,246,0.34)',
  },
  {
    icon: Headset,
    title: 'Dedicated After-Sales Support',
    desc: 'A real relationship manager stays with you well beyond setup — for renewals, KYC and any authority query.',
    chip: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
    glow: 'rgba(34,211,238,0.34)',
  },
  {
    icon: ShieldCheck,
    title: 'Refund Assurance',
    desc: '100% refund if your GST gets rejected — so you can get started with complete confidence and zero risk.',
    chip: 'linear-gradient(135deg, #38bdf8 0%, #2c679e 100%)',
    glow: 'rgba(56,189,248,0.34)',
  },
]

const miniStats = [
  { value: 5000, suffix: '+', label: 'Businesses served' },
  { value: 250, suffix: '+', label: 'Prime locations' },
  { value: 28, suffix: '', label: 'States covered' },
]

function trackGlow(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

// animated circular approval ring
function ApprovalRing() {
  const size = 168
  const stroke = 12
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = 0.987

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          whileInView={{ strokeDashoffset: circ * (1 - pct) }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7db8e8" />
            <stop offset="55%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#f4c04e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white drop-shadow">
          <Counter to={98.7} suffix="%" decimals={1} />
        </span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-primary-100">
          Approval rate
        </span>
      </div>
    </div>
  )
}

export default function WhyChooseHome() {
  return (
    <section className="section-padding relative overflow-hidden bg-surface-light">
      {/* tech dot backdrop + faint multi-colour glows (subtle, on-brand) */}
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_75%_55%_at_50%_25%,#000,transparent)]" />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-primary-300/25 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 -top-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-300/15 blur-3xl" />

      <div className="container-custom relative">
        {/* ===== executive split header ===== */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-3 rounded-full border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-primary-50 px-9 py-2.5 text-base font-bold uppercase tracking-[0.18em] text-primary shadow-soft ring-1 ring-primary-100/60">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
              </span>
              Why EaseMyOffice
            </span>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight text-navy-dark sm:text-4xl lg:text-[2.6rem]">
              Why 5,000+ businesses<br className="hidden sm:block" /> choose{' '}
              <span className="gradient-text">EaseMyOffice</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-slate-500 lg:pb-2">
            Trusted by founders, sellers and enterprises for compliant addresses and hassle-free
            setup — built on transparency, speed and genuine after-sales care.
          </p>
        </div>

        {/* ===== main bento ===== */}
        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          {/* Left: crystal-glass feature cards with colour accents */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.05}>
                <div
                  onMouseMove={trackGlow}
                  className="svc-card group relative h-full overflow-hidden rounded-2xl border border-white/70 bg-white/60 p-6 shadow-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  {/* soft coloured glow blob per card */}
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-80"
                    style={{ background: r.glow }}
                  />
                  {/* crystal glossy sheen */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/70 via-white/10 to-transparent" />
                  {/* bright top edge */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />

                  <div className="relative flex items-center justify-between">
                    <span
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-card ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: r.chip }}
                    >
                      <r.icon className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-sm font-semibold text-slate-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="relative mt-5 text-base font-bold text-navy-dark">{r.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-slate-600">{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Right: crystal dark trust console (no photo) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col overflow-hidden rounded-3xl p-7 shadow-card-hover ring-1 ring-white/10 sm:p-8 lg:col-span-4"
            style={{ background: 'linear-gradient(160deg, #0a1a30 0%, #11417c 55%, #2c679e 120%)' }}
          >
            {/* tech grid + multi-colour mesh glows (crystal, colourful) */}
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.08]" />
            <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-primary-300/30 blur-3xl" />
            <div className="pointer-events-none absolute -left-14 top-1/3 h-52 w-52 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-14 right-0 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
            {/* glossy diagonal sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            <div className="relative flex h-full flex-col">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <Star className="h-4 w-4 fill-gold text-gold" />
                Highly rated 4.9 on Google
              </div>

              {/* hero ring */}
              <div className="mt-8">
                <ApprovalRing />
                <p className="mx-auto mt-4 max-w-[15rem] text-center text-xs leading-relaxed text-blue-100/70">
                  One of the highest first-attempt document approval rates in the industry.
                </p>
              </div>

              {/* mini stats */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                {miniStats.map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-extrabold text-white sm:text-2xl">
                      <Counter to={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium leading-tight text-primary-100">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* what's included — glassy checklist fills the panel */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-[11px] font-bold uppercase tracking-wider text-primary-100/80">
                  Every plan includes
                </p>
                <div className="mt-3 space-y-2.5">
                  {included.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-blue-50/90">
                      <span className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-300/30">
                        <Check className="h-3 w-3" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* footer assurances + CTA */}
              <div className="mt-auto pt-6">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white ring-1 ring-white/10 backdrop-blur">
                    <Clock className="h-3.5 w-3.5 text-gold" />
                    Ready in 2–3 days
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white ring-1 ring-white/10 backdrop-blur">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                    100% refund if GST rejected
                  </span>
                </div>
                <Button to="/contact" variant="white" className="mt-5 w-full">
                  Get your business address
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
