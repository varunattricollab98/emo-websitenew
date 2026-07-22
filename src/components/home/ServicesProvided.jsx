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

const services = [
  {
    icon: Building2,
    title: 'Virtual Office',
    desc: 'A premium, GST-compliant business address in 250+ prime locations — ready in 2–3 days.',
    meta: 'From ₹799/mo',
    to: '/virtual-office',
    chip: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
    image: 'https://easemyoffice.in/wp-content/uploads/2024/09/Millenia-Business-Park-Chennai.webp',
    flagship: true,
  },
  {
    icon: Users,
    title: 'Coworking Spaces',
    desc: 'Flexible desks, private cabins & hot seats across India — book by the day or month.',
    meta: 'Flexible plans',
    to: '/coworking',
    chip: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
    image: 'https://easemyoffice.in/wp-content/uploads/2024/09/coworking-1024x576-1.webp',
  },
  {
    icon: CalendarClock,
    title: 'Meeting Rooms',
    desc: 'Book professional conference & training rooms by the hour, fully equipped.',
    meta: 'Hourly booking',
    to: '/meeting-rooms',
    chip: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    image:
      'https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: FileCheck2,
    title: 'GST Registration',
    desc: 'Fast, compliant GST registration with dedicated expert support end-to-end.',
    meta: 'Expert-assisted',
    to: '/ca-services',
    chip: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    image:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Landmark,
    title: 'Company Registration',
    desc: 'Incorporate your Pvt Ltd, LLP or OPC end-to-end with full compliance handled.',
    meta: 'Pvt Ltd · LLP · OPC',
    to: '/ca-services',
    chip: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    image:
      'https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: BadgeCheck,
    title: 'Trademark & ITR Filing',
    desc: 'Protect your brand with trademark registration and stay compliant with ITR filing.',
    meta: 'Brand + Tax',
    to: '/ca-services',
    chip: 'linear-gradient(135deg, #38bdf8 0%, #2c679e 100%)',
    image:
      'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
  },
]

export default function ServicesProvided() {
  return (
    <section className="section-padding relative overflow-hidden bg-white">
      {/* subtle tech dot backdrop */}
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000,transparent)]" />

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

        {/* uniform clean card grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link
                to={s.to}
                className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover ${
                  s.flagship ? 'ring-2 ring-gold/60' : 'ring-1 ring-primary-100/70 hover:ring-primary/40'
                }`}
              >
                {/* image header */}
                <div className="relative h-44 overflow-hidden">
                  <SmartImage
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/35 to-transparent" />
                  {/* colour-accent icon chip */}
                  <span
                    className="absolute left-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-card ring-1 ring-white/40"
                    style={{ background: s.chip }}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  {/* flagship badge */}
                  {s.flagship && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-gold-glow">
                      <Sparkles className="h-3.5 w-3.5" />
                      Flagship
                    </span>
                  )}
                </div>

                {/* body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-navy-dark">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.desc}</p>

                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="text-sm font-bold text-navy-dark">{s.meta}</span>
                    <span className="btn-base bg-primary-50 px-4 py-2 text-xs font-semibold text-primary-700 transition-colors group-hover:bg-primary-100">
                      Explore
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
