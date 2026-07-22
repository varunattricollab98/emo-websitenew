import { Link } from 'react-router-dom'
import { Star, Building2, ArrowRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import SmartImage from '../ui/SmartImage'

const locations = [
  {
    name: 'Delhi',
    slug: 'delhi',
    rating: 4.9,
    businesses: '3,200+',
    price: '899',
    image:
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Mumbai',
    slug: 'mumbai',
    rating: 4.9,
    businesses: '3,800+',
    price: '1,199',
    image:
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bangalore',
    slug: 'bangalore',
    rating: 4.8,
    businesses: '3,100+',
    price: '999',
    image:
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Gurgaon',
    slug: 'gurgaon',
    rating: 4.8,
    businesses: '2,400+',
    price: '999',
    image:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Hyderabad',
    slug: 'hyderabad',
    rating: 4.7,
    businesses: '2,100+',
    price: '999',
    image:
      'https://images.unsplash.com/photo-1587135941948-670b381f08ce?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Chennai',
    slug: 'chennai',
    rating: 4.7,
    businesses: '1,900+',
    price: '999',
    image:
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Kolkata',
    slug: 'kolkata',
    rating: 4.7,
    businesses: '1,500+',
    price: '899',
    image:
      'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Jaipur',
    slug: 'jaipur',
    rating: 4.8,
    businesses: '1,200+',
    price: '799',
    image:
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
  },
]

export default function LovedLocations() {
  return (
    <section id="locations" className="section-padding scroll-mt-24 bg-surface-light">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Locations"
          title="Explore Our Most-Loved Locations by Clients"
          accent="Most-Loved Locations"
          subtitle="Highest-rated business addresses across India — loved by founders and sellers alike."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {locations.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link
                to={`/virtual-office/${c.slug}`}
                className="group relative block h-64 overflow-hidden rounded-2xl bg-primary-gradient shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <SmartImage
                  src={c.image}
                  alt={`${c.name} business address`}
                  className="absolute inset-0 h-full w-full object-cover brightness-95 saturate-[1.15] transition-transform duration-500 group-hover:scale-110"
                />
                {/* cinematic gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/30 to-transparent" />

                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-navy-dark shadow-soft">
                  <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                  {c.rating}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="text-xl font-extrabold">{c.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/85">
                    <Building2 className="h-3.5 w-3.5" />
                    {c.businesses} businesses registered
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Starting ₹{c.price}
                      <span className="text-xs font-medium text-white/70">/mo</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-light">
                      Explore
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
