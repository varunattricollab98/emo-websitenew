import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Phone,
  Menu,
  X,
  ChevronDown,
  Building2,
  Users,
  CalendarClock,
  FileCheck2,
  ArrowRight,
} from 'lucide-react'
import Logo from './Logo'

const solutions = [
  {
    to: '/virtual-office',
    icon: Building2,
    title: 'Virtual Office',
    desc: 'Premium business address for GST & registration',
  },
  {
    to: '/coworking',
    icon: Users,
    title: 'Coworking Spaces',
    desc: 'Desks, cabins & hot seats across India',
  },
  {
    to: '/meeting-rooms',
    icon: CalendarClock,
    title: 'Meeting Rooms',
    desc: 'Book conference & training rooms by the hour',
  },
  {
    to: '/ca-services',
    icon: FileCheck2,
    title: 'CA Services',
    desc: 'GST, company & trademark registration',
  },
]

const navLinkClass = ({ isActive }) =>
  `text-sm font-semibold transition-colors ${
    isActive ? 'text-primary' : 'text-navy-dark hover:text-primary'
  }`

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="container-custom flex h-16 lg:h-20 items-center justify-between">
        <Logo />

        {/* Desktop menu */}
        <div className="hidden lg:flex items-center gap-7">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/virtual-office" className={navLinkClass}>
            Virtual Office
          </NavLink>
          <NavLink to="/ca-services" className={navLinkClass}>
            CA Services
          </NavLink>
          <Link
            to="/#locations"
            className="text-sm font-semibold text-navy-dark transition-colors hover:text-primary"
          >
            Locations
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-sm font-semibold text-navy-dark hover:text-primary transition-colors"
              onClick={() => setMegaOpen((v) => !v)}
            >
              All Solutions
              <ChevronDown
                className={`h-4 w-4 transition-transform ${megaOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-4"
                >
                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-primary-100 bg-white p-4 shadow-card-hover">
                    {solutions.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-primary-50"
                      >
                        <span className="mt-0.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary-gradient text-white">
                          <s.icon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="flex items-center gap-1 font-semibold text-navy-dark group-hover:text-primary">
                            {s.title}
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                            {s.desc}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/list-your-space" className={navLinkClass}>
            List Your Space
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact Us
          </NavLink>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:8882735038"
            className="btn-base bg-navy text-white px-5 py-2.5 text-sm hover:bg-navy-dark"
          >
            <Phone className="h-4 w-4" />
            888-273-5038
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl text-navy-dark hover:bg-primary-50"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-primary-100 bg-white"
          >
            <div className="container-custom flex flex-col gap-1 py-4">
              <MobileLink to="/" end>Home</MobileLink>
              <MobileLink to="/virtual-office">Virtual Office</MobileLink>
              <MobileLink to="/ca-services">CA Services</MobileLink>
              <Link
                to="/#locations"
                className="rounded-xl px-3 py-3 font-semibold text-navy-dark transition-colors hover:bg-primary-50"
              >
                Locations
              </Link>
              <p className="px-3 pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                All Solutions
              </p>
              {solutions.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-primary-50"
                >
                  <s.icon className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-navy-dark">{s.title}</span>
                </Link>
              ))}
              <div className="my-2 h-px bg-primary-100" />
              <MobileLink to="/list-your-space">List Your Space</MobileLink>
              <MobileLink to="/contact">Contact Us</MobileLink>
              <a
                href="tel:8882735038"
                className="btn-base mt-3 bg-navy text-white px-5 py-3"
              >
                <Phone className="h-4 w-4" />
                888-273-5038
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function MobileLink({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `rounded-xl px-3 py-3 font-semibold transition-colors ${
          isActive ? 'bg-primary-50 text-primary' : 'text-navy-dark hover:bg-primary-50'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
