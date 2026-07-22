import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileCheck2,
  Landmark,
  ShoppingBag,
  Store,
  Briefcase,
  Rocket,
  ArrowRight,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

const needs = [
  {
    icon: FileCheck2,
    title: 'For GST Registration',
    desc: 'A fully verified address with notarised rent agreement, NOC and utility bill — everything needed to secure your GSTIN.',
    tag: 'Proprietors · Firms · GSTIN',
    to: '/ca-services',
    grad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    glow: 'rgba(16,185,129,0.30)',
    accent: '#059669',
  },
  {
    icon: Landmark,
    title: 'For New Company Registration',
    desc: 'A registered office address accepted by the MCA for Pvt Ltd, LLP and OPC incorporation.',
    tag: 'Pvt Ltd · LLP · OPC',
    to: '/ca-services',
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
    glow: 'rgba(44,103,158,0.32)',
    accent: '#2c679e',
  },
  {
    icon: ShoppingBag,
    title: 'For E-commerce Sellers',
    desc: 'Additional Place of Business (APOB) addresses across states to sell on Amazon, Flipkart, Meesho & more — hassle-free.',
    tag: 'APOB · Multi-state GST',
    to: '/virtual-office',
    grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    glow: 'rgba(245,158,11,0.32)',
    accent: '#d97706',
  },
  {
    icon: Store,
    title: 'For Already-Registered Firms',
    desc: 'Already registered? Add a credible commercial address for banking, GST and correspondence — no lease, no deposit.',
    tag: 'Additional business address',
    to: '/virtual-office',
    grad: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
    glow: 'rgba(34,211,238,0.30)',
    accent: '#0891b2',
  },
  {
    icon: Briefcase,
    title: 'For Freelancers & Consultants',
    desc: 'Keep your home address private with a professional business address for invoices, clients and registration.',
    tag: 'Privacy · Professional image',
    to: '/virtual-office',
    grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    glow: 'rgba(139,92,246,0.30)',
    accent: '#6d28d9',
  },
  {
    icon: Rocket,
    title: 'For Startups & Founders',
    desc: 'A premium, prestigious address that builds instant trust with clients, banks and investors from day one.',
    tag: 'Investor-ready credibility',
    to: '/virtual-office',
    grad: 'linear-gradient(135deg, #38bdf8 0%, #2c679e 100%)',
    glow: 'rgba(56,189,248,0.30)',
    accent: '#2c679e',
  },
]

export default function ChooseByRequirement() {
  return (
    <section className="section-padding relative overflow-hidden bg-white">
      {/* subtle tech backdrop + glows */}
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000,transparent)]" />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-primary-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-violet-300/10 blur-3xl" />

      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Choose by Requirement"
          title="Not Sure Which Plan? Choose by Your Need"
          accent="Choose by Your Need"
          subtitle="Tell us what you're setting up — we'll match you with the right virtual office plan."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {needs.map((n, i) => (
            <motion.div
              key={n.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
            >
              <Link
                to={n.to}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100/70 bg-white p-7 shadow-soft ring-1 ring-navy-dark/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                {/* colour glow blob */}
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-80"
                  style={{ background: n.glow }}
                />
                {/* gradient hairline on hover */}
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-[3px] scale-x-0 opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"
                  style={{ background: n.grad }}
                />

                <div className="relative flex items-start justify-between">
                  <span
                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-card ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: n.grad }}
                  >
                    <n.icon className="h-7 w-7" />
                  </span>
                </div>

                <h3 className="relative mt-5 text-lg font-bold text-navy-dark">{n.title}</h3>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-slate-600">{n.desc}</p>

                <span
                  className="relative mt-4 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold"
                  style={{ backgroundColor: `${n.accent}14`, color: n.accent }}
                >
                  {n.tag}
                </span>

                <span
                  className="relative mt-5 inline-flex items-center gap-1 text-sm font-bold"
                  style={{ color: n.accent }}
                >
                  Get this plan
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
