import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group" aria-label="EaseMyOffice home">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card transition-transform duration-300 group-hover:scale-105">
        <Building2 className="h-5 w-5" />
      </span>
      <span
        className={`text-xl font-extrabold tracking-tight ${
          light ? 'text-white' : 'text-navy-dark'
        }`}
      >
        Ease<span className="text-primary">My</span>Office
      </span>
    </Link>
  )
}
