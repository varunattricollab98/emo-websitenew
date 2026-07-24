import { useState } from 'react'
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
  CalendarSearch,
  CalendarDays,
  ChevronDown,
  Handshake,
  UserCheck,
  Video,
  MapPin,
  Star,
} from 'lucide-react'
import SubPageHero from '../components/ui/SubPageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import CTABand from '../components/ui/CTABand'
import { useLeadModal } from '../context/LeadModalContext'
import { useBookingModal } from '../context/BookingModalContext'
import { voCities } from '../data/spaces'

const rooms = [
  {
    icon: Users,
    title: 'Meeting Room',
    capacity: '4–8 people',
    desc: 'Intimate, well-lit rooms perfect for client meetings and team huddles.',
    price: '499',
    unit: '/hour',
    avail: 6,
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
  },
  {
    icon: Presentation,
    title: 'Conference Room',
    capacity: '10–20 people',
    desc: 'Spacious boardrooms with premium AV for presentations and pitches.',
    price: '999',
    unit: '/hour',
    avail: 3,
    grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    popular: true,
  },
  {
    icon: GraduationCap,
    title: 'Training Room',
    capacity: '20–40 people',
    desc: 'Flexible layouts for workshops, training sessions and town halls.',
    price: '1,499',
    unit: '/hour',
    avail: 2,
    grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
  },
]

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
]

const amenities = [
  { icon: Monitor, label: '4K displays & screen share' },
  { icon: Wifi, label: 'High-speed Wi-Fi' },
  { icon: Mic, label: 'Video conferencing' },
  { icon: PenTool, label: 'Whiteboards & markers' },
  { icon: Coffee, label: 'Refreshments on request' },
  { icon: Clock, label: 'Flexible hourly booking' },
]

const useCases = [
  { icon: Handshake, title: 'Client Meetings', desc: 'Impress clients with a polished, professional setting.' },
  { icon: UserCheck, title: 'Interviews', desc: 'Private, distraction-free rooms for hiring rounds.' },
  { icon: Presentation, title: 'Pitches & Demos', desc: 'Premium AV to present your ideas flawlessly.' },
  { icon: Video, title: 'Video Calls', desc: 'Studio-quality conferencing for remote teams.' },
]

const steps = [
  { icon: CalendarSearch, title: 'Pick a room & slot', desc: 'Choose your city, room type and preferred time.' },
  { icon: Check, title: 'Confirm booking', desc: 'Reserve instantly — no membership required.' },
  { icon: Presentation, title: 'Walk in & present', desc: 'Everything is set up and ready when you arrive.' },
]

export default function MeetingRooms() {
  const { openLeadModal } = useLeadModal()
  const { openBooking } = useBookingModal()

  const today = new Date().toISOString().split('T')[0]
  const [bCity, setBCity] = useState('Bengaluru')
  const [bDate, setBDate] = useState(today)
  const [bTime, setBTime] = useState('10:00 AM')

  const prettyDate = (d) => {
    if (!d) return 'your date'
    return new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  // instant booking → opens booking form with auto-fetched details, then payment
  const bookRoom = (name, price) =>
    openBooking({
      room: name,
      price: Number(String(price).replace(/,/g, '')),
      city: bCity,
      date: bDate,
      time: bTime,
    })

  const checkAvailability = () =>
    openLeadModal({
      title: 'Check Room Availability',
      subtitle: `${bCity} · ${prettyDate(bDate)} · ${bTime}`,
      city: bCity,
      message: `Looking for an available room in ${bCity} on ${prettyDate(bDate)} at ${bTime}.`,
    })

  return (
    <>
      <SubPageHero
        eyebrow="Meeting Rooms"
        title="Book Professional Meeting Rooms by the Hour"
        accent="by the Hour"
        subtitle="Fully-equipped meeting, conference and training rooms in prime locations. Pay only for the hours you need — no membership required."
        chips={['No membership', 'Hourly & daily rates', 'Premium AV included']}
        visual={
          <div className="relative">
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-primary-300/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-6 shadow-card-hover ring-1 ring-primary-100/70 backdrop-blur-xl sm:p-7">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />

              {/* header + live badge */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                    <CalendarSearch className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-dark">Instant booking</p>
                    <p className="text-xs text-slate-500">Rooms from ₹499/hour</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-2.5 py-1 text-[11px] font-bold text-accent-emerald">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Live
                </span>
              </div>

              {/* booking selectors — city / date (calendar) / time */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                {/* city */}
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-primary" />
                  <select
                    aria-label="City"
                    value={bCity}
                    onChange={(e) => setBCity(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-primary-100 bg-surface-light py-2.5 pl-8 pr-6 text-xs font-bold text-navy-dark focus:border-primary/60 focus:outline-none"
                  >
                    {voCities.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>

                {/* date — opens calendar */}
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-primary" />
                  <input
                    type="date"
                    min={today}
                    value={bDate}
                    onChange={(e) => setBDate(e.target.value)}
                    aria-label="Date"
                    className="w-full rounded-xl border border-primary-100 bg-surface-light py-2.5 pl-8 pr-1.5 text-xs font-bold text-navy-dark focus:border-primary/60 focus:outline-none"
                  />
                </div>

                {/* time slot */}
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-primary" />
                  <select
                    aria-label="Time"
                    value={bTime}
                    onChange={(e) => setBTime(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-primary-100 bg-surface-light py-2.5 pl-8 pr-6 text-xs font-bold text-navy-dark focus:border-primary/60 focus:outline-none"
                  >
                    {timeSlots.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* room rows with availability */}
              <div className="mt-4 space-y-2.5">
                {rooms.map((r) => (
                  <div
                    key={r.title}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-primary-100/70 bg-surface-light px-3.5 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg text-white"
                        style={{ background: r.grad }}
                      >
                        <r.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-navy-dark">{r.title}</p>
                        <p className="flex items-center gap-1.5 text-[11px] font-medium text-accent-emerald">
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {r.avail} available today
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-none items-center gap-2.5">
                      <p className="text-sm font-extrabold text-primary">
                        ₹{r.price}
                        <span className="text-[11px] font-medium text-slate-400">{r.unit}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => bookRoom(r.title, r.price)}
                        className="rounded-lg bg-primary-gradient px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:shadow-glow hover:brightness-110"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* rating footer */}
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-primary-100 bg-white px-4 py-2.5 shadow-soft">
                <Star className="h-4 w-4 fill-gold text-gold" />
                <p className="text-xs font-semibold text-navy">Rated 4.9/5 by 5,000+ professionals</p>
              </div>
            </div>
          </div>
        }
      >
        <Button onClick={checkAvailability} size="lg">
          Check Availability <ArrowRight className="h-5 w-5" />
        </Button>
      </SubPageHero>

      {/* Room types */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Room Types"
            title="The Right Room for Every Occasion"
            accent="Every Occasion"
            subtitle="From quick catch-ups to full-day workshops — hourly and daily rates available."
          />
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {rooms.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.08}>
                <div
                  className={`group relative flex h-full flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                    r.popular
                      ? 'bg-gradient-to-b from-primary-50 via-white to-white shadow-card-hover ring-2 ring-gold lg:-translate-y-4'
                      : 'bg-white shadow-card ring-1 ring-primary-100/70 hover:shadow-card-hover'
                  }`}
                >
                  {r.popular && (
                    <span className="absolute left-1/2 top-0 z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-gold-dark px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-gold-glow">
                      Most Popular
                    </span>
                  )}
                  <span
                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-card ring-1 ring-white/40"
                    style={{ background: r.grad }}
                  >
                    <r.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-navy-dark">{r.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-primary">{r.capacity}</p>
                  <p className="mt-3 text-sm text-slate-600">{r.desc}</p>
                  <div className="mt-5 flex items-end gap-1">
                    <span className="mb-1 text-lg font-bold text-navy-dark">₹</span>
                    <span className="text-4xl font-extrabold leading-none text-navy-dark">
                      {r.price}
                    </span>
                    <span className="mb-1 text-sm text-slate-500">{r.unit}</span>
                  </div>
                  <Button
                    onClick={() => bookRoom(r.title, r.price)}
                    variant={r.popular ? 'gold' : 'primary'}
                    className="mt-7 w-full"
                  >
                    Book Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Daily rates and full-day packages available — contact us for custom bookings and bulk
            discounts.
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Use Cases"
            title="Perfect for Every Kind of Meeting"
            accent="Every Kind of Meeting"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((u, i) => (
              <Reveal key={u.title} delay={(i % 4) * 0.07}>
                <div className="premium-card h-full p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                    <u.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold text-navy-dark">{u.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{u.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Amenities"
            title="Every Room Comes Fully Equipped"
            accent="Fully Equipped"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((a, i) => (
              <Reveal key={a.label} delay={(i % 3) * 0.06}>
                <div className="group flex items-center gap-4 rounded-2xl border border-primary-100/70 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                  <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary-gradient group-hover:text-white">
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

      {/* Booking steps */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="How It Works"
            title="Book a Room in Three Simple Steps"
            accent="Three Simple Steps"
          />
          <div className="relative mt-16 grid gap-8 lg:grid-cols-3">
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent lg:block" />
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="relative text-center">
                  <span className="relative mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card ring-4 ring-white">
                    <s.icon className="h-6 w-6" />
                    <span className="absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-dark text-[11px] font-bold text-white shadow-gold-glow">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-4 font-bold text-navy-dark">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy shadow-soft">
              <MapPin className="h-4 w-4 text-primary" />
              Available across all major cities in India
            </span>
          </div>
        </div>
      </section>

      <CTABand
        title="Need a Room for Your Next Meeting?"
        subtitle="Check real-time availability and book a professional space in minutes."
        primaryLabel="Check Availability"
      />
    </>
  )
}
