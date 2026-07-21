import { motion } from 'framer-motion'
import {
  BadgeCheck,
  MapPin,
  IndianRupee,
  Star,
  Headset,
  ShieldCheck,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
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

const clusterStats = [
  { value: 5000, suffix: '+', label: 'Businesses served' },
  { value: 250, suffix: '+', label: 'Locations' },
  { value: 28, suffix: '', label: 'States covered' },
  { value: 98.7, suffix: '%', decimals: 1, label: 'Approval rate' },
]

export default function WhyChooseHome() {
  return (
    <section className="section-padding bg-surface-light">
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: reasons */}
          <div>
            <SectionHeading
              eyebrow="Why EaseMyOffice"
              title="Why 5,000+ Businesses Choose EaseMyOffice"
              subtitle="Trusted by founders, sellers and enterprises for compliant addresses and hassle-free setup."
              align="left"
            />
            <div className="mt-10 space-y-4">
              {reasons.map((r, i) => (
                <Reveal key={r.title} delay={i * 0.06}>
                  <div className="flex items-start gap-4 rounded-2xl border border-primary-100/60 bg-white p-4 shadow-soft transition-shadow hover:shadow-card">
                    <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <r.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-bold text-navy-dark">{r.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{r.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right: stat cluster */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-navy-gradient p-8 shadow-card-hover sm:p-10"
          >
            {/* subtle office photo texture */}
            <SmartImage
              src="https://easemyoffice.in/wp-content/uploads/2024/09/pexels-photo-1102341.webp"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.18] mix-blend-luminosity"
            />
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
            <div className="pointer-events-none absolute -left-12 -bottom-12 h-52 w-52 rounded-full bg-primary-800/40 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <Star className="h-4 w-4 fill-gold text-gold" />
                Rated 4.9/5 by 5,000+ clients
              </div>
              <div className="mt-8 grid grid-cols-2 gap-5">
                {clusterStats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur"
                  >
                    <p className="text-3xl font-extrabold text-white sm:text-4xl">
                      <Counter to={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
                    </p>
                    <p className="mt-1 text-sm font-medium text-primary-100">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trusted by brands */}
        <div className="mt-16">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-400">
            Trusted by leading brands
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {brands.map((b, i) => (
              <Reveal key={b} delay={i * 0.04}>
                <div className="flex items-center justify-center rounded-xl border border-primary-100/60 bg-white px-4 py-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
                  <span className="text-base font-extrabold tracking-tight text-navy/70 sm:text-lg">
                    {b}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
