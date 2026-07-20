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
} from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import CTABand from '../components/ui/CTABand'
import { cities } from '../data/cities'

const offerings = [
  {
    icon: Armchair,
    title: 'Dedicated Desks',
    desc: 'Your own reserved desk in a vibrant shared workspace, available round the clock.',
    price: 'From ₹6,999/mo',
    features: ['Reserved personal desk', '24x7 access', 'Ergonomic chair & storage'],
  },
  {
    icon: DoorClosed,
    title: 'Private Cabins',
    desc: 'Lockable private offices for teams of 2 to 20, fully furnished and move-in ready.',
    price: 'From ₹14,999/mo',
    features: ['Fully furnished cabin', 'Team privacy & security', 'Meeting room credits'],
    popular: true,
  },
  {
    icon: Users,
    title: 'Hot Desks',
    desc: 'Flexible any-seat access for freelancers and hybrid teams. Pay only for what you use.',
    price: 'From ₹3,999/mo',
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

export default function Coworking() {
  return (
    <>
      <PageHero
        eyebrow="Coworking Spaces"
        title="Flexible coworking spaces in"
        highlight="prime locations"
        subtitle="Dedicated desks, private cabins and hot seats designed for productivity — with premium amenities and a thriving community across India."
      >
        <Button to="/contact" size="lg">
          Book a Tour <ArrowRight className="h-5 w-5" />
        </Button>
        <Button to="/meeting-rooms" variant="outline" size="lg">
          Meeting Rooms
        </Button>
      </PageHero>

      {/* Offerings */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Workspaces"
            title="Spaces that flex with your team"
            subtitle="Whether you are a solo founder or a growing team, we have a workspace for you."
          />
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {offerings.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.08}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl p-8 ${
                    o.popular
                      ? 'border-2 border-primary bg-gradient-to-br from-primary-50 via-white to-primary-100/50 shadow-card-hover lg:-translate-y-3'
                      : 'premium-card'
                  }`}
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white">
                    <o.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-navy-dark">{o.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{o.desc}</p>
                  <p className="mt-4 text-lg font-extrabold text-primary">{o.price}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {o.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <Check className="h-4 w-4 text-accent-emerald" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button to="/contact" variant={o.popular ? 'primary' : 'outline'} className="mt-7 w-full">
                    Enquire Now
                  </Button>
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
            title="Premium amenities, included"
            subtitle="Everything you need to do your best work, taken care of."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {amenities.map((a, i) => (
              <Reveal key={a.label} delay={(i % 4) * 0.05}>
                <div className="premium-card flex flex-col items-center gap-3 p-6 text-center">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <a.icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-semibold text-navy-dark">{a.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading eyebrow="Locations" title="Coworking spaces near you" />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {cities.map((c) => (
              <span
                key={c.slug}
                className="rounded-full border border-primary-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-dark shadow-soft transition-colors hover:border-primary hover:text-primary"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Find your perfect workspace today"
        subtitle="Tour a coworking space near you and get a custom quote for your team."
        primaryLabel="Book a Tour"
      />
    </>
  )
}
