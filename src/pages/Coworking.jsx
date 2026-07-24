import {
  Users,
  DoorClosed,
  Armchair,
  Wifi,
  Coffee,
  Printer,
  ShieldCheck,
  Clock,
  ParkingSquare,
  Presentation,
  ArrowRight,
  Check,
  MapPin,
  Building2,
  Sparkles,
  Star,
  CalendarCheck,
  Headset,
} from 'lucide-react'
import SubPageHero from '../components/ui/SubPageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import Counter from '../components/ui/Counter'
import CTABand from '../components/ui/CTABand'
import FaqAccordion from '../components/ui/FaqAccordion'
import CoworkingSpaces from '../components/coworking/CoworkingSpaces'
import { cities } from '../data/cities'

const offerings = [
  {
    icon: Armchair,
    title: 'Dedicated Desks',
    desc: 'Your own reserved desk in a vibrant shared workspace, available round the clock.',
    price: 'From ₹6,999/mo',
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
    features: ['Reserved personal desk', '24x7 access', 'Ergonomic chair & storage'],
  },
  {
    icon: DoorClosed,
    title: 'Private Cabins',
    desc: 'Lockable private offices for teams of 2 to 20, fully furnished and move-in ready.',
    price: 'From ₹14,999/mo',
    grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    features: ['Fully furnished cabin', 'Team privacy & security', 'Meeting room credits'],
    popular: true,
  },
  {
    icon: Users,
    title: 'Hot Desks',
    desc: 'Flexible any-seat access for freelancers and hybrid teams. Pay only for what you use.',
    price: 'From ₹3,999/mo',
    grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    features: ['Flexible seating', 'Community access', 'Day-pass options'],
  },
]

const amenities = [
  { icon: Wifi, label: 'High-speed Wi-Fi' },
  { icon: Coffee, label: 'Unlimited coffee & tea' },
  { icon: Printer, label: 'Print & scan' },
  { icon: Presentation, label: 'Meeting rooms' },
  { icon: ShieldCheck, label: '24x7 security' },
  { icon: Clock, label: 'Round-the-clock access' },
  { icon: ParkingSquare, label: 'Parking' },
  { icon: Users, label: 'Community events' },
]

const whyUs = [
  {
    icon: MapPin,
    title: 'Prime Locations',
    desc: 'Business-district addresses that impress clients and shorten commutes.',
  },
  {
    icon: CalendarCheck,
    title: 'Flexible Terms',
    desc: 'Daily, monthly or annual — scale up or down with zero long lock-ins.',
  },
  {
    icon: Sparkles,
    title: 'Move-in Ready',
    desc: 'Fully furnished, powered and connected. Just walk in and start working.',
  },
  {
    icon: Headset,
    title: 'On-site Support',
    desc: 'Front-desk, IT and community teams to keep your day running smoothly.',
  },
]

const stats = [
  { icon: Building2, to: 200, suffix: '+', label: 'Workspaces', sub: 'Move-in ready' },
  { icon: MapPin, to: 14, suffix: '', label: 'Cities', sub: 'Across India' },
  { icon: Users, to: 5000, suffix: '+', label: 'Members', sub: 'Founders & teams' },
  { icon: Star, to: 4.9, suffix: '/5', label: 'Member rating', decimals: 1, sub: '1,200+ reviews', rating: true },
]

const faqs = [
  {
    q: 'Can I book a desk for just a day?',
    a: 'Yes. We offer day passes for hot desks along with flexible monthly and annual plans, so you only pay for what you actually need.',
  },
  {
    q: 'Are meeting rooms included with a membership?',
    a: 'Dedicated desk and private cabin members receive monthly meeting-room credits. Additional hours can be booked on demand at member rates.',
  },
  {
    q: 'Is the space accessible 24x7?',
    a: 'Dedicated desks and private cabins come with round-the-clock secure access. Hot-desk access follows standard operating hours unless upgraded.',
  },
  {
    q: 'Can I use the address for GST or company registration?',
    a: 'Yes. Most of our coworking centres double as registrable business addresses. Talk to our team to add GST or company registration documentation.',
  },
]

export default function Coworking() {
  return (
    <>
      <SubPageHero
        eyebrow="Coworking Spaces"
        title="Flexible Coworking Spaces in Prime Locations"
        accent="Prime Locations"
        subtitle="Dedicated desks, private cabins and hot seats built for productivity — with premium amenities and a thriving community across India."
        chips={['Move-in ready', '24x7 access', 'No long lock-ins']}
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
                  <p className="text-sm font-bold text-navy-dark">Workspaces near you</p>
                  <p className="text-xs text-slate-500">Across all major cities in India</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { k: '200+', v: 'Ready workspaces' },
                  { k: '14', v: 'Cities' },
                  { k: '5,000+', v: 'Members' },
                  { k: '4.9/5', v: 'Member rating' },
                ].map((s) => (
                  <div
                    key={s.v}
                    className="rounded-2xl border border-primary-100/70 bg-surface-light px-4 py-3"
                  >
                    <p className="text-2xl font-extrabold text-navy-dark">{s.k}</p>
                    <p className="text-xs font-medium text-slate-500">{s.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-primary-100 bg-white px-4 py-3 shadow-soft">
                <Star className="h-5 w-5 fill-gold text-gold" />
                <p className="text-sm font-semibold text-navy">
                  Loved by founders, freelancers &amp; fast-growing teams
                </p>
              </div>
            </div>
          </div>
        }
      >
        <Button to="/contact" size="lg">
          Book a Tour <ArrowRight className="h-5 w-5" />
        </Button>
        <Button to="/meeting-rooms" variant="outline" size="lg">
          Meeting Rooms
        </Button>
      </SubPageHero>

      {/* Offerings */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Workspaces"
            title="Spaces That Flex With Your Team"
            accent="Flex With Your Team"
            subtitle="Whether you are a solo founder or a growing team, we have a workspace built for you."
          />
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {offerings.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.08}>
                <div
                  className={`group relative flex h-full flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                    o.popular
                      ? 'bg-gradient-to-b from-primary-50 via-white to-white shadow-card-hover ring-2 ring-gold lg:-translate-y-4'
                      : 'bg-white shadow-card ring-1 ring-primary-100/70 hover:shadow-card-hover'
                  }`}
                >
                  {o.popular && (
                    <span className="absolute left-1/2 top-0 z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-gold-dark px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-gold-glow">
                      Most Popular
                    </span>
                  )}
                  <span
                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-card ring-1 ring-white/40"
                    style={{ background: o.grad }}
                  >
                    <o.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-navy-dark">{o.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{o.desc}</p>
                  <p className="mt-4 text-lg font-extrabold text-primary">{o.price}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {o.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <span className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    to="/contact"
                    variant={o.popular ? 'gold' : 'primary'}
                    className="mt-7 w-full"
                  >
                    Enquire Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* City-wise coworking listings */}
      <CoworkingSpaces />

      {/* Why us */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Why EaseMyOffice"
            title="Coworking Done the Premium Way"
            accent="Premium Way"
            subtitle="Everything is handled so you can simply walk in and do your best work."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((w, i) => (
              <Reveal key={w.title} delay={(i % 4) * 0.07}>
                <div className="premium-card h-full p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                    <w.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold text-navy-dark">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Amenities"
            title="Premium Amenities, Included"
            accent="Included"
            subtitle="Everything you need to do your best work, taken care of."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {amenities.map((a, i) => (
              <Reveal key={a.label} delay={(i % 4) * 0.05}>
                <div className="group flex flex-col items-center gap-3 rounded-2xl border border-primary-100/70 bg-white p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary-gradient group-hover:text-white">
                    <a.icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-semibold text-navy-dark">{a.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="section-padding">
        <div className="container-custom">
          <div
            className="relative overflow-hidden rounded-[2rem] px-6 py-14 shadow-card-hover ring-1 ring-white/10 sm:px-12 sm:py-16"
            style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 62%, #16508f 120%)' }}
          >
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.05]" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

            {/* header */}
            <Reveal className="relative flex justify-center">
              <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-100/80">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                A thriving community across India
              </p>
            </Reveal>

            <div className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-white/[0.08]">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.08}>
                  <div className="px-1 text-center lg:px-8">
                    <div className="flex items-center justify-center gap-2 text-primary-200/70">
                      <s.icon className="h-4 w-4" strokeWidth={1.75} />
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em]">
                        {s.label}
                      </span>
                    </div>
                    <p className="mt-3 text-5xl font-black leading-none tracking-tight text-white sm:text-6xl">
                      <Counter to={s.to} decimals={s.decimals || 0} />
                      <span className="text-gold">{s.suffix}</span>
                    </p>
                    {s.rating ? (
                      <div className="mt-3 flex items-center justify-center gap-0.5">
                        {[0, 1, 2, 3, 4].map((n) => (
                          <Star key={n} className="h-3.5 w-3.5 fill-gold text-gold" />
                        ))}
                      </div>
                    ) : (
                      <div className="mx-auto mt-3 h-0.5 w-8 rounded-full bg-gold/50" />
                    )}
                    <p className="mt-3 text-xs font-medium text-primary-100/50">{s.sub}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Locations"
            title="Coworking Spaces Near You"
            accent="Near You"
          />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {cities.map((c) => (
              <span
                key={c.slug}
                className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-dark shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-card"
              >
                <MapPin className="h-4 w-4 text-primary" />
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="FAQ"
            title="Coworking Questions, Answered"
            accent="Answered"
          />
          <Reveal className="mx-auto mt-12 max-w-3xl">
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <CTABand
        title="Find Your Perfect Workspace Today"
        subtitle="Tour a coworking space near you and get a custom quote for your team."
        primaryLabel="Book a Tour"
      />
    </>
  )
}
