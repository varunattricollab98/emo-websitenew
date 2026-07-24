import { Link } from 'react-router-dom'
import { MapPin, ArrowUpRight, Building2 } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import SmartImage from '../ui/SmartImage'
import { cities } from '../../data/cities'

const cityImg = {
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
  mumbai: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80',
  bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
  gurgaon:
    'https://upload.wikimedia.org/wikipedia/commons/7/76/DLF_Cyber_City_with_Rapid_Metro%2C_Gurgaon.jpg',
  hyderabad: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?auto=format&fit=crop&w=800&q=80',
  chennai: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
  pune: 'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=800&q=80',
  noida: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
}
const fallbackImg =
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'

export default function CitySpaceCounts() {
  return (
    <section className="section-padding relative overflow-hidden bg-surface-light">
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_25%,#000,transparent)]" />
      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Our Coverage"
          title="Verified Spaces Across India"
          accent="Across India"
          subtitle="Live availability in every major business hub — pick your city and register in a premium address near you."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 4) * 0.05}>
              <Link
                to={`/virtual-office/${c.slug}`}
                className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl shadow-card ring-1 ring-navy-dark/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <SmartImage
                  src={cityImg[c.slug] || fallbackImg}
                  alt={`${c.name} skyline`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/45 to-navy-dark/10" />
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15" />

                {/* top icons */}
                <span className="absolute left-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition-colors group-hover:bg-white group-hover:text-primary">
                  <ArrowUpRight className="h-4 w-4" />
                </span>

                {/* content */}
                <div className="relative p-5 text-white">
                  <h3 className="text-xl font-extrabold">{c.name}</h3>
                  <p className="text-xs font-medium text-blue-100/80">{c.region}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    <Building2 className="h-3.5 w-3.5 text-gold-light" />
                    {c.addresses}+ spaces available
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
