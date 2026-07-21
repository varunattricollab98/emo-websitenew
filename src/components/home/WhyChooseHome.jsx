import { motion } from 'framer-motion'
import {
  BadgeCheck,
  MapPin,
  IndianRupee,
  Star,
  Headset,
  ShieldCheck,
  Clock,
  ArrowUpRight,
} from 'lucide-react'
import Reveal from '../ui/Reveal'
import Counter from '../ui/Counter'
import SmartImage from '../ui/SmartImage'

const reasons = [
  {
    icon: IndianRupee,
    title: 'Lowest Price, Zero Hidden Costs',
    desc: 'Transparent, all-inclusive pricing from ₹699/mo. The price you see is the price you pay — no surprise add-ons at checkout.',
  },
  {
    icon: BadgeCheck,
    title: '98.7% Document Approval Rate',
    desc: 'GST & company registration papers cleared the first time — one of the highest first-attempt approval rates in the industry.',
  },
  {
    icon: Star,
    title: 'Rated 4.9/5 by 5,000+ Businesses',
    desc: 'Trusted by founders, D2C sellers and enterprises across India, with a 4.9-star Google rating.',
  },
  {
    icon: MapPin,
    title: 'Real, Verified Premium Addresses',
    desc: 'Every address is a genuine, physically verified commercial premise — purpose-built for virtual office & GST use.',
  },
  {
    icon: Headset,
    title: 'Dedicated After-Sales Support',
    desc: 'A real relationship manager stays with you well beyond setup — for renewals, KYC and any authority query.',
  },
  {
    icon: ShieldCheck,
    title: 'Refund Assurance',
    desc: '100% refund if your GST gets rejected — so you can get started with complete confidence and zero risk.',
  },
]

const brands = [
  'Verizon',
  'IndiaMART',
  'Shiprocket',
  'Udaan',
  'Omnicuris',
  'Xpressbees',
  'Kalki Fashion',
  "Dr. Reddy's",
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
            <stop offset="100%" stopColor="#f4c04e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white">
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
      {/* subtle tech dot backdrop */}
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_75%_55%_at_50%_25%,#000,transparent)]" />

      <div className="container-custom relative">
        {/* ===== executive split header ===== */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
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
          {/* Left: numbered feature cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.05}>
                <div
                  onMouseMove={trackGlow}
                  className="svc-card group relative h-full rounded-2xl border border-primary-100/70 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
                >
                  {/* top gradient hairline reveals on hover */}
                  <span className="pointer-events-none absolute inset-x-6 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card ring-1 ring-primary-200/50 transition-transform duration-300 group-hover:scale-110">
                      <r.icon className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-sm font-semibold text-primary-200">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="relative mt-5 text-base font-bold text-navy-dark">{r.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-slate-600">{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Right: dark trust console */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col overflow-hidden rounded-3xl p-7 shadow-card-hover sm:p-8 lg:col-span-4"
            style={{ background: 'linear-gradient(160deg, #0a1a30 0%, #11417c 55%, #2c679e 120%)' }}
          >
            {/* faded office texture + tech grid + glows */}
            <SmartImage
              src="https://easemyoffice.in/wp-content/uploads/2024/09/pexels-photo-1102341.webp"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12] mix-blend-luminosity"
            />
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.07]" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-300/25 blur-3xl" />
            <div className="pointer-events-none absolute -left-12 -bottom-12 h-52 w-52 rounded-full bg-gold/10 blur-3xl" />

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

              {/* footer assurances */}
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
                  <Clock className="h-3.5 w-3.5 text-gold" />
                  Ready in 2–3 days
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                  100% refund if GST rejected
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== Trusted by brands ===== */}
        <div className="mt-16">
          <div className="flex items-center gap-4">
            <p className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-slate-400">
              Trusted by leading brands
            </p>
            <span className="h-px flex-1 bg-gradient-to-r from-primary-200/60 to-transparent" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {brands.map((b, i) => (
              <Reveal key={b} delay={i * 0.04}>
                <div className="group flex items-center justify-center gap-2 rounded-xl border border-primary-100/60 bg-white px-4 py-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card">
                  <span className="text-base font-extrabold tracking-tight text-navy/70 transition-colors group-hover:text-primary sm:text-lg">
                    {b}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-transparent transition-colors group-hover:text-primary/50" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
