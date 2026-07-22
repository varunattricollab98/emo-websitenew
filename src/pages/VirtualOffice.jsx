import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Building2,
  FileCheck2,
  Mail,
  Check,
  ArrowRight,
  MapPin,
  Clock,
  ShieldCheck,
  BadgeCheck,
  Star,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import SmartImage from '../components/ui/SmartImage'
import TrustBar from '../components/home/TrustBar'
import WhyVirtualOffice from '../components/home/WhyVirtualOffice'
import ChooseByRequirement from '../components/home/ChooseByRequirement'
import ThreeStepSetup from '../components/home/ThreeStepSetup'
import TransparentPricing from '../components/home/TransparentPricing'
import HomeFAQ from '../components/home/HomeFAQ'
import BookYourSpace from '../components/home/BookYourSpace'
import { cities } from '../data/cities'

const heroChips = [
  { icon: Clock, label: 'Ready in 2–3 days' },
  { icon: MapPin, label: '250+ locations' },
  { icon: BadgeCheck, label: '98.7% approval rate' },
  { icon: ShieldCheck, label: '100% refund if GST rejected' },
]

const useCases = [
  {
    icon: FileCheck2,
    title: 'GST Registration',
    desc: 'A GST-ready address with the complete, department-accepted documentation kit.',
    grad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  {
    icon: Building2,
    title: 'Company Registration',
    desc: 'An MCA-accepted registered office for Pvt Ltd, LLP or OPC incorporation.',
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
  },
  {
    icon: Mail,
    title: 'Mailing & Presence',
    desc: 'A professional address for mail, your website, visiting cards & Google listing.',
    grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
  },
]

const inclusions = [
  'Notarised rent / lease agreement',
  'No Objection Certificate (NOC)',
  'Recent utility bill copy',
  'Company signage at the location',
  'GST & MCA application support',
  'Mail & courier handling + notifications',
  'Dedicated relationship manager',
  'Verification assistance for officers',
]

export default function VirtualOffice() {
  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 tech-dots opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000,transparent)]" />

        <div className="container-custom relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-primary-200 bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-soft">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              Virtual Office
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-tight text-navy-dark text-balance sm:text-5xl">
              A Premium Business Address for{' '}
              <span className="gradient-text">GST &amp; Company Registration</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Get a prestigious, verified commercial address with all the compliant paperwork you
              need — without renting physical space. Activated in as little as 2–3 days.
            </p>

            {/* trust chips */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              {heroChips.map((c) => (
                <span
                  key={c.label}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-4 py-2 text-sm font-semibold text-navy shadow-soft backdrop-blur"
                >
                  <c.icon className="h-4 w-4 text-primary" />
                  {c.label}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#book-form" size="lg">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="#pricing" variant="outline" size="lg">
                View Pricing
              </Button>
            </div>
          </motion.div>

          {/* hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-card-hover ring-1 ring-white/60">
              <SmartImage
                src="https://easemyoffice.in/wp-content/uploads/2024/09/Millenia-Business-Park-Chennai.webp"
                alt="Premium business address"
                className="h-[420px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/40 to-transparent" />
            </div>
            {/* floating rating card */}
            <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white p-4 shadow-card-hover ring-1 ring-primary-100">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-gradient text-white">
                  <Star className="h-5 w-5 fill-white" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-navy-dark">4.9/5 · 5,000+ clients</p>
                  <p className="text-xs text-slate-500">Trusted across India</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Trusted-by brands ===== */}
      <TrustBar />

      {/* ===== What is a Virtual Office ===== */}
      <section className="section-padding relative overflow-hidden bg-surface-light">
        <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_25%,#000,transparent)]" />
        <div className="container-custom relative">
          <SectionHeading
            eyebrow="The Basics"
            title="What Is a Virtual Office?"
            accent="Virtual Office?"
            subtitle="A virtual office gives your business a real, verified commercial address for registration, compliance and mail — while you work from anywhere. Here's what you can use it for:"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {useCases.map((u, i) => (
              <Reveal key={u.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-primary-100/70 bg-white p-7 shadow-soft ring-1 ring-navy-dark/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
                  <span
                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-card ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: u.grad }}
                  >
                    <u.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-navy-dark">{u.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{u.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== What's included ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="What's Included"
              title="Everything You Need for Compliance"
              accent="Compliance"
              subtitle="Every virtual office plan comes with a complete, authority-accepted documentation kit — ready for GST and MCA."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {inclusions.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl shadow-card-hover ring-1 ring-primary-100">
              <SmartImage
                src="https://easemyoffice.in/wp-content/uploads/2024/09/pexels-photo-1102341.webp"
                alt="Compliant business address"
                className="h-full min-h-[320px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/50 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-5 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-green/15 text-accent-emerald">
                    <ShieldCheck className="h-6 w-6" />
                  </span>
                  <p className="text-sm font-semibold text-navy-dark">
                    100% authority-accepted documentation — built to clear GST verification the first
                    time.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Why a Virtual Office (benefits + comparison) ===== */}
      <WhyVirtualOffice />

      {/* ===== How it works ===== */}
      <ThreeStepSetup />

      {/* ===== Who is it for ===== */}
      <ChooseByRequirement />

      {/* ===== Pricing ===== */}
      <div id="pricing" className="scroll-mt-20">
        <TransparentPricing />
      </div>

      {/* ===== FAQ ===== */}
      <HomeFAQ />

      {/* ===== Locations ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Locations"
            title="Available Across India's Top Cities"
            accent="Top Cities"
            subtitle="250+ verified addresses across 28 states. Register in a premium location near you, or expand to multiple cities."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 4) * 0.05}>
                <Link
                  to={`/virtual-office/${c.slug}`}
                  className="group flex items-center justify-between rounded-2xl border border-primary-100/70 bg-white p-5 shadow-soft ring-1 ring-navy-dark/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary transition-colors group-hover:bg-primary-gradient group-hover:text-white">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="font-semibold text-navy-dark">{c.name}</span>
                  </span>
                  <span className="text-sm font-bold text-primary">₹{c.price}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <BookYourSpace />
    </>
  )
}
