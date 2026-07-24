import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Building2, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react'
import { footerCities } from '../../data/cities'

const company = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Careers', to: '/about' },
  { label: 'Blog', to: '/about' },
  { label: 'List Your Space', to: '/list-your-space' },
]

const services = [
  { label: 'Virtual Office', to: '/virtual-office' },
  { label: 'Coworking', to: '/coworking' },
  { label: 'Meeting Rooms', to: '/meeting-rooms' },
  { label: 'GST Registration', to: '/ca-services' },
  { label: 'Company Registration', to: '/ca-services' },
  { label: 'Trademark', to: '/ca-services' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-slate-300">
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-5 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-gradient text-white">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="text-xl font-extrabold text-white">
                Ease<span className="text-primary-300">My</span>Office
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              India's most trusted platform for virtual offices, coworking and business
              compliance. 200+ premium addresses across 28 states.
            </p>
            <div className="mt-5 flex gap-3">
              {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition-colors hover:bg-primary hover:text-white"
                  aria-label="social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Company" links={company} />
          <FooterCol title="Services" links={services} />

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Virtual Office In
            </h4>
            <ul className="mt-4 space-y-2.5">
              {footerCities.map((city) => (
                <li key={city}>
                  <Link
                    to={`/virtual-office/${city.toLowerCase()}`}
                    className="text-sm text-slate-400 transition-colors hover:text-primary-300"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
            <ul className="mt-4 space-y-4 text-sm">
              <li>
                <a href="tel:8882735038" className="flex items-start gap-3 hover:text-primary-300">
                  <Phone className="mt-0.5 h-4 w-4 flex-none text-primary-300" />
                  888-273-5038
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@easemyoffice.in"
                  className="flex items-start gap-3 hover:text-primary-300"
                >
                  <Mail className="mt-0.5 h-4 w-4 flex-none text-primary-300" />
                  contact@easemyoffice.in
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 flex-none text-primary-300" />
                336, Udyog Vihar Phase 4, Sector 19, Gurugram, Haryana 122016
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-slate-500">
            © 2024 EaseMyOffice · Operated by Narula Technologies LLP. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link to="/privacy-policy" className="hover:text-primary-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary-300">
              Terms
            </Link>
            <Link to="/refund-policy" className="hover:text-primary-300">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-wider text-white">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-sm text-slate-400 transition-colors hover:text-primary-300"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
