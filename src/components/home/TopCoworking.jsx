import { Link } from 'react-router-dom'
import { Star, Wifi, Users, Coffee, ArrowRight, Flame } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
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
]

const amenities = [
  { icon: Wifi, label: 'WiFi' },
  { icon: Users, label: 'Meeting Room' },
  { icon: Coffee, label: 'Cafe' },
]

export default function TopCoworking() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Premium Workspaces"
          title="Our Top Picked Premium Locations"
          accent="Premium Locations"
          subtitle="Handpicked, highest-rated workspaces and business addresses our clients love — verified and ready to move in."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {spaces.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.07}>
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
