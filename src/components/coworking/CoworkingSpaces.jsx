import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Star,
  ArrowRight,
  Users,
  Sun,
  ArrowDownWideNarrow,
  ChevronDown,
  Check,
  X,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import SmartImage from '../ui/SmartImage'
import Button from '../ui/Button'
import { coworkingCities, getCoworkingSpaces } from '../../data/coworkingSpaces'
import { voCities, cityMatches } from '../../data/spaces'
import { resolvePincode } from '../../data/pincodes'

const sortOptions = [
  { v: 'featured', l: 'Featured' },
  { v: 'low', l: 'Price: Low to High' },
  { v: 'high', l: 'Price: High to Low' },
]

const cityNameBySlug = Object.fromEntries(voCities.map((c) => [c.slug, c.name]))

export default function CoworkingSpaces() {
  const [searchParams] = useSearchParams()
  const paramCity = searchParams.get('city')
  const initialSlug = paramCity && cityNameBySlug[paramCity] ? paramCity : 'bangalore'

  const [active, setActive] = useState(initialSlug)
  const [sort, setSort] = useState('featured')
  const [cityInput, setCityInput] = useState(cityNameBySlug[initialSlug] || 'Bengaluru')
  const [cityOpen, setCityOpen] = useState(false)

  const isAll = active === 'all'
  const activeName = isAll ? '' : cityNameBySlug[active] || 'Bengaluru'

  // clear the city → show a mix of spaces across all cities
  const clearCity = () => {
    setActive('all')
    setCityInput('')
    setCityOpen(true)
  }

  // respond to ?city= changes (e.g. clicking a city chip elsewhere on the page)
  useEffect(() => {
    if (paramCity && cityNameBySlug[paramCity]) {
      setActive(paramCity)
      setCityInput(cityNameBySlug[paramCity])
      document
        .getElementById('coworking-browse')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [paramCity])

  const filteredCities = useMemo(() => {
    const q = cityInput.trim().toLowerCase()
    if (!q || q === activeName.toLowerCase()) return voCities
    if (/^\d+$/.test(q)) return resolvePincode(q)
    return voCities.filter((c) => cityMatches(c, q))
  }, [cityInput, activeName])

  const spaces = useMemo(() => {
    let list
    if (isAll) {
      // round-robin interleave across cities so the mix spans many cities
      const perCity = coworkingCities.map((c) =>
        getCoworkingSpaces(c.slug).map((sp) => ({ ...sp, cityName: c.name, citySlug: c.slug }))
      )
      list = []
      for (let i = 0; perCity.some((l) => l[i]); i++) {
        perCity.forEach((l) => l[i] && list.push(l[i]))
      }
      list = list.slice(0, 12)
    } else {
      list = getCoworkingSpaces(active).map((sp) => ({ ...sp, cityName: activeName, citySlug: active }))
    }
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price)
    else if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [active, sort, isAll, activeName])

  const selectCity = (slug, name) => {
    setActive(slug)
    setCityInput(name)
    setCityOpen(false)
  }

  return (
    <section
      id="coworking-browse"
      className="section-padding relative overflow-hidden bg-surface-light scroll-mt-24"
    >
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-40 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_20%,#000,transparent)]" />
      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Explore Spaces"
          title="Browse Coworking Spaces City by City"
          accent="City by City"
          subtitle="Search any city across India for move-in-ready workspaces — with transparent pricing and zero brokerage."
        />

        {/* city search + price sort */}
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* searchable city combobox */}
          <div className="relative w-full sm:max-w-sm">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-primary" />
            <input
              value={cityInput}
              onChange={(e) => {
                setCityInput(e.target.value)
                setCityOpen(true)
              }}
              onFocus={(e) => {
                setCityOpen(true)
                e.target.select()
              }}
              placeholder="Search a city, state or pincode…"
              aria-label="Search city"
              className="w-full rounded-full border border-primary-100 bg-white py-3 pl-10 pr-16 text-sm font-bold text-navy-dark shadow-soft placeholder:font-normal placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {/* clear button — resets to a mix of all cities */}
            {(cityInput || !isAll) && (
              <button
                type="button"
                onClick={clearCity}
                aria-label="Clear city and show all"
                className="absolute right-9 top-1/2 z-10 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown
              className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform ${
                cityOpen ? 'rotate-180' : ''
              }`}
            />
            {cityOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => {
                    setCityOpen(false)
                    setCityInput(activeName)
                  }}
                />
                <div className="absolute left-0 right-0 z-40 mt-2 rounded-2xl border border-primary-100 bg-white p-2 shadow-card-hover">
                  <ul className="sky-scroll max-h-60 space-y-0.5 overflow-y-auto pr-1">
                    {filteredCities.length === 0 ? (
                      <li className="px-3 py-2 text-sm text-slate-400">No city found</li>
                    ) : (
                      filteredCities.map((c) => (
                        <li key={c.slug}>
                          <button
                            type="button"
                            onClick={() => selectCity(c.slug, c.name)}
                            className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left transition-colors ${
                              c.slug === active
                                ? 'bg-primary-50 text-primary'
                                : 'text-navy-dark hover:bg-surface-light'
                            }`}
                          >
                            <span className="min-w-0">
                              <span
                                className={`block truncate text-sm ${
                                  c.slug === active ? 'font-bold' : 'font-semibold'
                                }`}
                              >
                                {c.name}
                              </span>
                              <span className="block truncate text-[11px] text-slate-400">
                                {c.state}
                              </span>
                            </span>
                            {c.slug === active && <Check className="h-4 w-4 flex-none text-primary" />}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* price sort */}
          <div className="relative flex-none">
            <ArrowDownWideNarrow className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-primary" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort spaces by price"
              className="w-full appearance-none rounded-full border border-primary-100 bg-white py-3 pl-10 pr-9 text-sm font-bold text-navy-dark shadow-soft focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-auto"
            >
              {sortOptions.map((o) => (
                <option key={o.v} value={o.v}>
                  {o.l}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* popular quick chips */}
        <div className="sky-scroll mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="flex-none text-xs font-semibold uppercase tracking-wider text-slate-400">
            Popular:
          </span>
          {coworkingCities.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => selectCity(c.slug, c.name)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                c.slug === active
                  ? 'bg-primary-gradient text-white shadow-card'
                  : 'border border-primary-100 bg-white text-navy-dark hover:border-primary/40 hover:text-primary'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* space cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {spaces.map((s) => (
              <div
                key={(s.citySlug || '') + s.name + s.locality}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-primary-100/70 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                {/* image */}
                <div className="relative h-44 overflow-hidden bg-primary-gradient">
                  <SmartImage
                    src={s.image}
                    alt={`${s.name}, ${s.locality}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-dark/50 to-transparent" />
                  {s.popular && (
                    <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-gold to-gold-dark px-3 py-1 text-[11px] font-bold text-white shadow-gold-glow">
                      POPULAR
                    </span>
                  )}
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-navy-dark shadow-soft backdrop-blur">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    {s.rating}
                  </span>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-semibold drop-shadow">
                      {s.locality}, {s.cityName || activeName}
                    </span>
                  </div>
                </div>

                {/* body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-navy-dark">{s.name}</h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    {s.seats}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-end justify-between border-t border-primary-100/70 pt-4">
                    <div>
                      <p className="text-[11px] font-medium text-slate-400">Dedicated desk</p>
                      <p className="text-lg font-extrabold text-navy-dark">
                        ₹{s.price.toLocaleString('en-IN')}
                        <span className="text-xs font-medium text-slate-400">/seat/mo</span>
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-surface-light px-2.5 py-1.5 text-[11px] font-semibold text-navy">
                      <Sun className="h-3.5 w-3.5 text-gold-dark" />
                      Day pass ₹{s.dayPass}
                    </span>
                  </div>

                  <Button to="/contact" className="mt-5 w-full">
                    Book a Tour
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <p className="mt-8 text-center text-sm text-slate-500">
          {isAll
            ? 'Showing a mix of spaces across cities. '
            : `Showing spaces in ${activeName}. `}
          Prices are indicative — get an exact, brokerage-free quote from your dedicated manager.
        </p>
      </div>
    </section>
  )
}
