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
  Clock,
  MapPin,
  ShieldCheck,
  Star,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import SmartImage from '../ui/SmartImage'

const trustBadges = [
  { icon: Clock, label: 'Ready in 2–3 days' },
  { icon: MapPin, label: '250+ prime locations' },
  { icon: ShieldCheck, label: '100% refund if GST rejected' },
  { icon: Star, label: '4.9★ rated by 5,000+' },
]

const compactCards = [
  {
    n: '03',
    icon: CalendarClock,
    title: 'Meeting Rooms',
    desc: 'Book conference & training rooms by the hour.',
    tag: 'Hourly booking',
    to: '/meeting-rooms',
    chip: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    image:
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
  },
  {
    n: '04',
    icon: FileCheck2,
    title: 'GST Registration',
    desc: 'Fast, compliant GST registration with expert support.',
    tag: 'Expert-assisted',
    to: '/ca-services',
    chip: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    image:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
  },
  {
    n: '05',
    icon: Landmark,
    title: 'Company Registration',
    desc: 'Incorporate your Pvt Ltd, LLP or OPC end-to-end.',
    tag: 'Pvt Ltd · LLP · OPC',
    to: '/ca-services',
    chip: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    image: 'https://easemyoffice.in/wp-content/uploads/2024/09/mumbai5.webp',
  },
]

export default function ServicesProvided() {
  return (
    <section className="section-padding relative overflow-hidden bg-white">
      {/* tech dot grid + faint colour glows */}
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000,transparent)]" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-primary-300/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-violet-300/10 blur-3xl" />

      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Services We Provide"
          title="Everything Your Business Needs, One Platform"
          subtitle="From a compliant business address to full company setup — discover and book everything in one place."
        />

        {/* quick trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {trustBadges.map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-4 py-2 text-sm font-semibold text-navy shadow-soft backdrop-blur"
            >
              <b.icon className="h-4 w-4 text-primary" />
              {b.label}
            </span>
          ))}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
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
              className="group relative grid h-full overflow-hidden rounded-3xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover lg:grid-cols-[1.25fr_0.75fr]"
              style={{ background: 'linear-gradient(115deg, #0a1a30 0%, #11417c 48%, #2c679e 100%)' }}
            >
              {/* faded tech grid + soft glows + glossy sheen */}
              <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.07] [mask-image:linear-gradient(90deg,#000,transparent_55%)]" />
              <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-primary-300/20 blur-3xl transition-transform duration-500 group-hover:scale-125" />
              <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

              {/* content */}
              <div className="relative p-7 lg:p-8">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5 text-gold" />
                    Flagship Service
                  </span>
                  <span className="font-mono text-sm font-semibold text-white/30">01</span>
                </div>

                <span className="mt-5 inline-flex items-baseline gap-1 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold ring-1 ring-gold/30">
                  Starts at ₹799<span className="font-medium text-gold/80">/mo</span>
                </span>

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
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, #11417c 0%, rgba(17,65,124,0.96) 12%, rgba(17,65,124,0.6) 38%, rgba(17,65,124,0.22) 68%, rgba(17,65,124,0.05) 100%)',
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                  style={{ background: 'linear-gradient(0deg, rgba(10,26,48,0.5), transparent)' }}
                />
              </div>
            </Link>
          </motion.div>

          {/* ===== Coworking (cinematic full-image card) ===== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <Link
              to="/coworking"
              className="group relative flex h-full min-h-[280px] flex-col justify-end overflow-hidden rounded-3xl shadow-card ring-1 ring-primary-100/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <SmartImage
                src="https://easemyoffice.in/wp-content/uploads/2024/09/coworking-1024x576-1.webp"
                alt="Coworking space"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* cinematic overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/45 to-navy-dark/10" />
              <span className="absolute right-4 top-4 font-mono text-sm font-semibold text-white/70">02</span>
              <span className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/30 backdrop-blur">
                <Users className="h-5 w-5" />
              </span>

              <div className="relative p-6 text-white">
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {['Desks', 'Cabins', 'Hot Seats'].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-extrabold">Coworking Spaces</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-blue-100/85">
                  Flexible desks, private cabins &amp; hot seats across India.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-gold-light">
                  Explore
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* ===== 3 compact cards (crystal glass + colour accents) ===== */}
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
                className="group relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-3xl shadow-card ring-1 ring-primary-100/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <SmartImage
                  src={s.image}
                  alt={s.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/45 to-navy-dark/10" />
                <span className="absolute right-4 top-4 font-mono text-sm font-semibold text-white/70">{s.n}</span>
                <span
                  className="absolute left-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-card ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: s.chip }}
                >
                  <s.icon className="h-6 w-6" />
                </span>

                <div className="relative p-6 text-white">
                  <span className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur">
                    {s.tag}
                  </span>
                  <h3 className="text-xl font-extrabold">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-blue-100/85">{s.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-gold-light">
                    Explore
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
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
              className="group relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-3xl shadow-card ring-1 ring-primary-100/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <SmartImage
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80"
                alt="Trademark & ITR filing"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/70 to-navy-dark/20" />
              <span className="absolute right-5 top-5 font-mono text-sm font-semibold text-white/60">06</span>
              <span
                className="absolute left-5 top-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-card ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #2c679e 100%)' }}
              >
                <BadgeCheck className="h-6 w-6" />
              </span>

              <div className="relative flex flex-col items-start justify-between gap-5 p-7 sm:flex-row sm:items-end">
                <div className="max-w-xl text-white">
                  <h3 className="text-xl font-extrabold sm:text-2xl">Trademark &amp; ITR Filing</h3>
                  <p className="mt-2 text-sm leading-relaxed text-blue-100/85">
                    Protect your brand with trademark registration and stay compliant with
                    expert-assisted income tax return filing — all handled for you.
                  </p>
                </div>
                <span className="inline-flex flex-none items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-navy-dark shadow-card transition-all duration-300 group-hover:bg-primary-50">
                  Explore Services
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
