import {
  Target,
  Eye,
  Heart,
  ArrowRight,
  MapPin,
  Users,
  ShieldCheck,
  Zap,
  Building2,
  Star,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import SubPageHero from '../components/ui/SubPageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import Counter from '../components/ui/Counter'
import CTABand from '../components/ui/CTABand'

const stats = [
  { to: 5000, suffix: '+', label: 'Businesses served' },
  { to: 200, suffix: '+', label: 'Premium addresses' },
  { to: 28, suffix: '', label: 'States covered' },
  { to: 4.9, suffix: '/5', label: 'Client rating', decimals: 1 },
]

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    desc: 'To make business setup and compliance effortless for every Indian entrepreneur.',
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    desc: 'A future where location never limits ambition — anyone can build from anywhere.',
    grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
  },
  {
    icon: Heart,
    title: 'Our Values',
    desc: 'Transparency, speed and trust guide every interaction and every document.',
    grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
  },
]

const whyUs = [
  { icon: MapPin, title: 'Premium Addresses', desc: 'Prime commercial locations nationwide.' },
  { icon: ShieldCheck, title: 'Fully Compliant', desc: 'Authority-accepted documentation.' },
  { icon: Zap, title: 'Fast Setup', desc: 'Live in just 2–3 business days.' },
  { icon: Users, title: 'Dedicated Support', desc: 'A personal manager for every client.' },
]

const highlights = [
  'Virtual offices for GST & company registration',
  'Coworking, cabins & meeting rooms',
  'CA-assisted GST, tax & compliance filings',
  'One dedicated manager, end to end',
]

export default function About() {
  return (
    <>
      <SubPageHero
        eyebrow="About Us"
        title="Making Business Compliance Effortless for India"
        accent="Effortless for India"
        subtitle="EaseMyOffice was founded to remove the friction from starting and running a business. Today we help thousands of founders get compliant, credible and ready to grow."
        chips={['5,000+ businesses', '28 states', '4.9/5 rating']}
        visual={
          <div className="relative">
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-primary-300/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-7 shadow-card-hover ring-1 ring-primary-100/70 backdrop-blur-xl">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                  <Building2 className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-bold text-navy-dark">One platform for your business</p>
                  <p className="text-xs text-slate-500">Address · Workspace · Compliance</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm font-medium text-navy">
                    <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                      <Sparkles className="h-3 w-3" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-primary-100 bg-white px-4 py-3 shadow-soft">
                <Star className="h-5 w-5 fill-gold text-gold" />
                <p className="text-sm font-semibold text-navy">
                  Trusted by 5,000+ businesses across India
                </p>
              </div>
            </div>
          </div>
        }
      >
        <Button to="/contact" size="lg">
          Get in Touch <ArrowRight className="h-5 w-5" />
        </Button>
        <Button to="/virtual-office" variant="outline" size="lg">
          Explore Services
        </Button>
      </SubPageHero>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-custom grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Our Story"
              title="Built to Remove the Friction of Doing Business"
              accent="Remove the Friction"
            />
            <div className="mt-6 space-y-4 text-slate-600">
              <p>
                Starting a business in India means juggling addresses, registrations, filings and
                deadlines — often before you have even made your first sale. We saw founders lose
                weeks to paperwork that should have taken days.
              </p>
              <p>
                So we built EaseMyOffice: a single platform that pairs prime business addresses and
                flexible workspaces with expert-assisted GST, tax and compliance support. One team,
                one dedicated manager, everything handled.
              </p>
              <p>
                Today, thousands of founders, freelancers and fast-growing teams trust us to keep
                them compliant, credible and free to focus on what they do best — building.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: TrendingUp, k: '5,000+', v: 'Businesses served' },
                { icon: MapPin, k: '200+', v: 'Premium addresses' },
                { icon: Building2, k: '14', v: 'Cities' },
                { icon: ShieldCheck, k: '98.7%', v: 'Approval rate' },
              ].map((s) => (
                <div key={s.v} className="premium-card p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-3xl font-extrabold text-navy-dark">{s.k}</p>
                  <p className="text-sm text-slate-500">{s.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission / vision / values */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Mission, Vision & Values"
            accent="Vision & Values"
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="premium-card h-full p-8">
                  <span
                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-card ring-1 ring-white/40"
                    style={{ background: v.grad }}
                  >
                    <v.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-navy-dark">{v.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden bg-navy-gradient py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.06]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="container-custom relative grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-white lg:text-5xl">
                  <Counter to={s.to} suffix={s.suffix} decimals={s.decimals || 0} />
                </p>
                <p className="mt-2 text-sm text-primary-100">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading eyebrow="Why EaseMyOffice" title="What Sets Us Apart" accent="Sets Us Apart" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((w, i) => (
              <Reveal key={w.title} delay={(i % 4) * 0.07}>
                <div className="premium-card h-full p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                    <w.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold text-navy-dark">{w.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  )
}
