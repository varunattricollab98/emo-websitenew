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
import SmartImage from '../ui/SmartImage'

const compactCards = [
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
          {/* ===== Featured card — Virtual Office (dark, techy, with photo) ===== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Link
              to="/virtual-office"
              className="group relative grid h-full overflow-hidden rounded-3xl lg:grid-cols-[1.25fr_0.75fr]"
              style={{ background: 'linear-gradient(115deg, #0a1a30 0%, #11417c 48%, #2c679e 100%)' }}
            >
              {/* very faded tech grid + soft glow */}
              <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.07] [mask-image:linear-gradient(90deg,#000,transparent_55%)]" />
              <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-primary-300/20 blur-3xl transition-transform duration-500 group-hover:scale-125" />

              {/* content */}
              <div className="relative p-7 lg:p-8">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5 text-gold" />
                    Flagship Service
                  </span>
                  <span className="font-mono text-sm font-semibold text-white/30">01</span>
                </div>

                <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition-transform duration-500 group-hover:scale-110">
                  <Building2 className="h-7 w-7" />
                </div>

                <h3 className="mt-5 text-2xl font-extrabold text-white">Virtual Office</h3>
                <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-blue-100/80">
                  A premium, GST-compliant business address in 250+ prime locations — perfect for
                  company registration, GST, APOB &amp; mailing. Ready in 2–3 days.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {['GST', 'Company Reg', 'APOB', 'Mail Handling'].map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-blue-100/90"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex items-center gap-2 text-sm font-bold text-white">
                  Explore Virtual Office
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-navy-dark transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {/* photo panel (desktop) */}
              <div className="relative hidden lg:block">
                <SmartImage
                  src="https://easemyoffice.in/wp-content/uploads/2024/09/Millenia-Business-Park-Chennai.webp"
                  alt="Premium business address"
                  className="h-full w-full object-cover"
                />
                {/* smooth blue → photo blend so the image melts into the card */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, #11417c 0%, rgba(17,65,124,0.96) 12%, rgba(17,65,124,0.6) 38%, rgba(17,65,124,0.22) 68%, rgba(17,65,124,0.05) 100%)',
                  }}
                />
                {/* soft bottom depth fade */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                  style={{ background: 'linear-gradient(0deg, rgba(10,26,48,0.5), transparent)' }}
                />
              </div>
            </Link>
          </motion.div>

          {/* ===== Coworking (photo card) ===== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <Link
              to="/coworking"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-card-hover"
            >
              {/* photo header */}
              <div className="relative h-36 overflow-hidden">
                <div className="absolute inset-0 bg-primary-gradient" />
                <SmartImage
                  src="https://easemyoffice.in/wp-content/uploads/2024/09/coworking-1024x576-1.webp"
                  alt="Coworking space"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute right-3 top-3 font-mono text-xs font-semibold text-white/70">02</span>
                <span className="absolute left-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 text-primary shadow-card backdrop-blur">
                  <Users className="h-5 w-5" />
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="text-xl font-bold text-navy-dark">Coworking Spaces</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Flexible desks, private cabins &amp; hot seats across India.
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Explore
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* ===== 3 compact cards ===== */}
          {compactCards.map((s, i) => (
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
                className="svc-card group flex h-full flex-col justify-between rounded-3xl border border-primary-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-card-hover"
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
