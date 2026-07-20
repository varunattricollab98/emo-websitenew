import {
  Users,
  Presentation,
  GraduationCap,
  Wifi,
  Monitor,
  Coffee,
  Mic,
  PenTool,
  ArrowRight,
  Check,
  Clock,
} from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import CTABand from '../components/ui/CTABand'

const rooms = [
  {
    icon: Users,
    title: 'Meeting Room',
    capacity: '4-8 people',
    desc: 'Intimate, well-lit rooms perfect for client meetings and team huddles.',
    price: '₹499',
    unit: '/hour',
  },
  {
    icon: Presentation,
    title: 'Conference Room',
    capacity: '10-20 people',
    desc: 'Spacious boardrooms with premium AV for presentations and pitches.',
    price: '₹999',
    unit: '/hour',
    popular: true,
  },
  {
    icon: GraduationCap,
    title: 'Training Room',
    capacity: '20-40 people',
    desc: 'Flexible layouts for workshops, training sessions and town halls.',
    price: '₹1,499',
    unit: '/hour',
  },
]

const amenities = [
  { icon: Monitor, label: '4K displays & screen share' },
  { icon: Wifi, label: 'High-speed Wi-Fi' },
  { icon: Mic, label: 'Video conferencing' },
  { icon: PenTool, label: 'Whiteboards & markers' },
  { icon: Coffee, label: 'Refreshments on request' },
  { icon: Clock, label: 'Flexible hourly booking' },
]

export default function MeetingRooms() {
  return (
    <>
      <PageHero
        eyebrow="Meeting Rooms"
        title="Book professional meeting rooms"
        highlight="by the hour"
        subtitle="Fully-equipped meeting, conference and training rooms in prime locations. Pay only for the hours you need — no membership required."
      >
        <Button to="/contact" size="lg">
          Check Availability <ArrowRight className="h-5 w-5" />
        </Button>
      </PageHero>

      {/* Room types */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Room Types"
            title="The right room for every occasion"
            subtitle="From quick catch-ups to full-day workshops — hourly and daily rates available."
          />
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {rooms.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.08}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl p-8 ${
                    r.popular
                      ? 'border-2 border-primary bg-gradient-to-br from-primary-50 via-white to-primary-100/50 shadow-card-hover lg:-translate-y-3'
                      : 'premium-card'
                  }`}
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white">
                    <r.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-navy-dark">{r.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-primary">{r.capacity}</p>
                  <p className="mt-3 text-sm text-slate-600">{r.desc}</p>
                  <div className="mt-5 flex items-end gap-1">
                    <span className="text-3xl font-extrabold text-navy-dark">{r.price}</span>
                    <span className="mb-1 text-sm text-slate-500">{r.unit}</span>
                  </div>
                  <Button to="/contact" variant={r.popular ? 'primary' : 'outline'} className="mt-7 w-full">
                    Book Now
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Daily rates and full-day packages available — contact us for custom bookings and bulk discounts.
          </p>
        </div>
      </section>

      {/* Amenities */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading eyebrow="Amenities" title="Every room comes fully equipped" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((a, i) => (
              <Reveal key={a.label} delay={(i % 3) * 0.06}>
                <div className="premium-card flex items-center gap-4 p-6">
                  <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <a.icon className="h-6 w-6" />
                  </span>
                  <span className="font-semibold text-navy-dark">{a.label}</span>
                  <Check className="ml-auto h-5 w-5 text-accent-emerald" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Need a room for your next meeting?"
        subtitle="Check real-time availability and book a professional space in minutes."
        primaryLabel="Check Availability"
      />
    </>
  )
}
