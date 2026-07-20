import { Target, Eye, Heart, ArrowRight, MapPin, Users, ShieldCheck, Zap } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
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
  { icon: Target, title: 'Our Mission', desc: 'To make business setup and compliance effortless for every Indian entrepreneur.' },
  { icon: Eye, title: 'Our Vision', desc: 'A future where location never limits ambition — anyone can build from anywhere.' },
  { icon: Heart, title: 'Our Values', desc: 'Transparency, speed and trust guide every interaction and every document.' },
]

const whyUs = [
  { icon: MapPin, title: 'Premium Addresses', desc: 'Prime commercial locations nationwide.' },
  { icon: ShieldCheck, title: 'Fully Compliant', desc: 'Authority-accepted documentation.' },
  { icon: Zap, title: 'Fast Setup', desc: 'Live in just 2-3 business days.' },
  { icon: Users, title: 'Dedicated Support', desc: 'A personal manager for every client.' },
]

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Making business compliance"
        highlight="effortless for India"
        subtitle="EaseMyOffice was founded to remove the friction from starting and running a business. Today we help thousands of founders get compliant, credible and ready to grow."
      >
        <Button to="/contact" size="lg">
          Get in Touch <ArrowRight className="h-5 w-5" />
        </Button>
      </PageHero>

      {/* Mission / vision / values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-6 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="premium-card h-full p-8">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white">
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
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading eyebrow="Why EaseMyOffice" title="What sets us apart" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((w, i) => (
              <Reveal key={w.title} delay={(i % 4) * 0.07}>
                <div className="premium-card h-full p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
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
