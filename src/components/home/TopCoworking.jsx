import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Wifi, Users, Coffee, ArrowRight, Flame, ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import SmartImage from '../ui/SmartImage'

const spaces = [
  {
    name: 'Prime Business Hub — Koramangala',
    city: 'Bangalore',
    rating: 4.8,
    price: '6,999',
    badge: 'Most Sold',
    image:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'The Workspace — Cyber City',
    city: 'Gurgaon',
    rating: 4.9,
    price: '8,499',
    badge: 'Trending',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Metro Coworking — Andheri East',
    city: 'Mumbai',
    rating: 4.7,
    price: '7,499',
    badge: null,
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Startup Nest — HITEC City',
    city: 'Hyderabad',
    rating: 4.8,
    price: '5,999',
    badge: null,
    image:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Business Bay — Baner',
    city: 'Pune',
    rating: 4.7,
    price: '5,499',
    badge: null,
    image:
      'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Tech Park Suites — OMR',
    city: 'Chennai',
    rating: 4.6,
    price: '5,999',
    badge: null,
    image:
      'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Corporate Square — Sector 62',
    city: 'Noida',
    rating: 4.8,
    price: '6,499',
    badge: 'Trending',
    image:
      'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Riverside Offices — Salt Lake',
    city: 'Kolkata',
    rating: 4.6,
    price: '4,999',
    badge: null,
    image:
      'https://images.unsplash.com/photo-1462826303086-329426d1aef5?auto=format&fit=crop&w=800&q=80',
  },
]

const amenities = [
  { icon: Wifi, label: 'WiFi' },
  { icon: Users, label: 'Meeting Room' },
  { icon: Coffee, label: 'Cafe' },
]

const STEP = 324 // card width (300) + gap (24)

export default function TopCoworking() {
  const trackRef = useRef(null)

  const scrollByCards = (dir) => {
    trackRef.current?.scrollBy({ left: dir * STEP, behavior: 'smooth' })
  }

  // auto-roll, looping back to start; pause on hover
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let paused = false
    const enter = () => (paused = true)
    const leave = () => (paused = false)
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    const id = setInterval(() => {
      if (paused) return
      const node = trackRef.current
      if (!node) return
      if (node.scrollLeft + node.clientWidth >= node.scrollWidth - 12) {
        node.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        node.scrollBy({ left: STEP, behavior: 'smooth' })
      }
    }, 3000)
    return () => {
      clearInterval(id)
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Premium Workspaces"
          title="Our Top Picked Premium Locations"
          accent="Premium Locations"
          subtitle="Handpicked, highest-rated workspaces and business addresses our clients love — verified and ready to move in."
        />

        <div className="relative mt-14">
          {/* prev / next switches */}
          <button
            type="button"
            aria-label="Previous locations"
            onClick={() => scrollByCards(-1)}
            className="absolute -left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-primary-100 bg-white text-navy shadow-card transition-all hover:-translate-y-1/2 hover:scale-105 hover:bg-primary hover:text-white sm:flex lg:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next locations"
            onClick={() => scrollByCards(1)}
            className="absolute -right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-primary-100 bg-white text-navy shadow-card transition-all hover:-translate-y-1/2 hover:scale-105 hover:bg-primary hover:text-white sm:flex lg:-right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* rolling track */}
          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
          >
            {spaces.map((s) => (
              <div key={s.name} className="w-[300px] flex-none snap-start">
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100/60 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
                  {/* image */}
                  <div className="relative h-44 overflow-hidden bg-primary-gradient">
                    <SmartImage
                      src={s.image}
                      alt={s.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {s.badge && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-white shadow-gold-glow">
                        <Flame className="h-3.5 w-3.5" />
                        {s.badge}
                      </span>
                    )}
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-navy-dark shadow-soft">
                      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                      {s.rating}
                    </span>
                  </div>

                  {/* body */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold leading-snug text-navy-dark">{s.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{s.city}</p>

                    <div className="mt-4 flex items-center gap-4">
                      {amenities.map((a) => (
                        <span key={a.label} className="flex items-center gap-1 text-xs text-slate-500">
                          <a.icon className="h-4 w-4 text-primary" />
                          {a.label}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-1 items-end justify-between">
                      <div>
                        <p className="text-xs text-slate-400">From</p>
                        <p className="text-lg font-extrabold text-navy-dark">
                          ₹{s.price}
                          <span className="text-sm font-medium text-slate-400">/mo</span>
                        </p>
                      </div>
                      <Link
                        to="/coworking"
                        className="btn-base bg-primary-50 px-4 py-2 text-xs text-primary-700 hover:bg-primary-100"
                      >
                        View Details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
