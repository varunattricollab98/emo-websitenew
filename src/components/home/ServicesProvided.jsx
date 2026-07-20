import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Building2,
  Users,
  CalendarClock,
  FileCheck2,
  Landmark,
  BadgeCheck,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

// Small cards (bento)
const cards = [
  {
    n: '02',
    icon: Users,
    title: 'Coworking Spaces',
    desc: 'Flexible desks, private cabins & hot seats across India.',
    to: '/coworking',
  },
  {
    n: '03',
    icon: CalendarClock,
    title: 'Meeting Rooms',
    desc: 'Book conference & training rooms by the hour.',
    to: '/meeting-rooms',
  },
  {
    n: '04',
    icon: FileCheck2,
    title: 'GST Registration',
    desc: 'Fast, compliant GST registration with expert support.',
    to: '/ca-services',
  },
  {
    n: '05',
    icon: Landmark,
    title: 'Company Registration',
    desc: 'Incorporate your Pvt Ltd, LLP or OPC end-to-end.',
    to: '/ca-services',
  },
]

function trackGlow(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export default function ServicesProvided() {
  return (
    <section className="section-padding relative overflow-hidden bg-white">
      {/* subtle tech dot grid background */}
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000,transparent)]" />

      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Services We Provide"
          title="Everything Your Business Needs, One Platform"
          subtitle="From a compliant business address to full company setup — discover and book everything in one place."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {/* ===== Featured card — Virtual Office (dark, techy) ===== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Link
              to="/virtual-office"
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-8 lg:p-10"
              style={{ background: 'linear-gradient(135deg, #0f1a2e 0%, #11417c 55%, #1a5aa0 100%)' }}
            >
              {/* tech grid + glow */}
              <div className="pointer-events-none absolute inset-0 tech-grid opacity-40" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-400/30 blur-3xl transition-transform duration-500 group-hover:scale-125" />
              <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5 text-gold" />
                    Flagship Service
                  </span>
                  <span className="font-mono text-sm font-semibold text-white/30">01</span>
                </div>

                <div className="mt-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white shadow-glow ring-1 ring-white/20 backdrop-blur transition-transform duration-500 group-hover:scale-110">
                  <Building2 className="h-8 w-8" />
                </div>

                <h3 className="mt-6 text-2xl font-extrabold text-white lg:text-3xl">Virtual Office</h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-blue-100/80">
                  A premium, GST-compliant business address in 250+ prime locations — perfect for
                  company registration, GST, APOB & mailing. Ready in 2–3 days.
                </p>

                {/* feature chips */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {['GST Registration', 'Company Registration', 'APOB', 'Mail Handling'].map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-blue-100/90"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative mt-8 flex items-center gap-2 text-sm font-bold text-white">
                Explore Virtual Office
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-navy-dark transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* ===== Coworking (tall accent card) ===== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <Link
              to={cards[0].to}
              onMouseMove={trackGlow}
              className="svc-card group flex h-full flex-col justify-between rounded-3xl border border-primary-100 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-card-hover"
            >
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card transition-transform duration-300 group-hover:scale-110">
                    <Users className="h-7 w-7" />
                  </span>
                  <span className="font-mono text-sm font-semibold text-primary-200">{cards[0].n}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-navy-dark">{cards[0].title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{cards[0].desc}</p>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Explore
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </motion.div>

          {/* ===== 3 compact cards ===== */}
          {cards.slice(1).map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 + i * 0.06 }}
            >
              <Link
                to={s.to}
                onMouseMove={trackGlow}
                className="svc-card group flex h-full flex-col justify-between rounded-3xl border border-primary-100 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-card-hover"
              >
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card transition-transform duration-300 group-hover:scale-110">
                      <s.icon className="h-7 w-7" />
                    </span>
                    <span className="font-mono text-sm font-semibold text-primary-200">{s.n}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-navy-dark">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                </div>
                <span className="relative mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Explore
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}

          {/* ===== Wide card — Trademark & ITR ===== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <Link
              to="/ca-services"
              onMouseMove={trackGlow}
              className="svc-card group flex flex-col items-start justify-between gap-6 rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-primary-50/40 p-8 shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover sm:flex-row sm:items-center"
            >
              <div className="relative flex items-start gap-5">
                <span className="inline-flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-white text-primary shadow-card ring-1 ring-primary-100 transition-transform duration-300 group-hover:scale-110">
                  <BadgeCheck className="h-7 w-7" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-navy-dark">Trademark &amp; ITR Filing</h3>
                    <span className="font-mono text-xs font-semibold text-primary-300">06</span>
                  </div>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-600">
                    Protect your brand with trademark registration and stay compliant with expert-assisted
                    income tax return filing — all handled for you.
                  </p>
                </div>
              </div>
              <span className="relative inline-flex flex-none items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-navy-dark">
                Explore Services
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
