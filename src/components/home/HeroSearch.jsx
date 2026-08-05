import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { resolveCity, resolveState } from '../../utils/resolveCity'
import { voCities, slugifySpace, cityUrl, spaceUrl, slugifyState } from '../../data/spaces'
import { getSupabaseSpaces } from '../../lib/spacesStore'
import {
  MapPin,
  Search,
  ChevronDown,
  Star,
  Building2,
  Layers,
  ShieldCheck,
} from 'lucide-react'

const serviceTypes = [
  { value: 'virtual-office', label: 'Virtual Office' },
  { value: 'coworking', label: 'Coworking' },
  { value: 'meeting-room', label: 'Meeting Room' },
  { value: 'ca-services', label: 'CA Services' },
]

const serviceRoutes = {
  'virtual-office': '/virtual-office',
  coworking: '/coworking',
  'meeting-room': '/meeting-rooms',
  'ca-services': '/ca-services',
}

const popularCities = ['Delhi', 'Mumbai', 'Bangalore', 'Gurgaon', 'Hyderabad', 'Pune']

const trustRow = [
  { icon: Star, label: '4.9/5 Google' },
  { icon: Building2, label: '5,000+ businesses' },
  { icon: MapPin, label: '250+ locations' },
  { icon: ShieldCheck, label: '28 states' },
]

export default function HeroSearch() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [service, setService] = useState('virtual-office')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // ── Build a searchable suggestions list from all available sources ─────
  const allSuggestions = useMemo(() => {
    const items = []
    // 1. Cities
    voCities.forEach((c) => {
      items.push({ type: 'city', label: c.name, sub: c.state, slug: c.slug })
    })
    // 2. Spaces / areas from Supabase
    const dbSpaces = getSupabaseSpaces()
    dbSpaces.forEach((s) => {
      if (s.address_area) {
        items.push({
          type: 'space',
          label: s.address_area,
          sub: s.address_city || '',
          slug: slugifySpace(s.address_area),
          citySlug: slugifySpace(s.address_city || ''),
        })
      }
      if (s.space_name && s.space_name !== s.address_area) {
        items.push({
          type: 'space',
          label: s.space_name,
          sub: s.address_city || '',
          slug: slugifySpace(s.address_area || s.space_name),
          citySlug: slugifySpace(s.address_city || ''),
        })
      }
    })
    return items
  }, [])

  // ── Fuzzy matching: Levenshtein distance for typo tolerance ────────────
  function fuzzyMatch(query, target) {
    const q = query.toLowerCase()
    const t = target.toLowerCase()
    // Starts with → strong match
    if (t.startsWith(q)) return 0
    // Contains → good match
    if (t.includes(q)) return 1
    // Levenshtein edit distance (for typos like "jayanagr" → "jayanagar")
    if (q.length >= 3 && t.length >= 3) {
      const maxDist = q.length <= 4 ? 1 : 2
      const dist = editDistance(q, t.slice(0, q.length + maxDist))
      if (dist <= maxDist) return 2 + dist
    }
    return -1 // no match
  }

  function editDistance(a, b) {
    const m = a.length
    const n = b.length
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
      }
    }
    return dp[m][n]
  }

  // ── Filtered & ranked suggestions based on current input ──────────────
  const suggestions = useMemo(() => {
    const q = location.trim()
    if (q.length < 2) return []

    const scored = []
    const seen = new Set()

    for (const item of allSuggestions) {
      const score = fuzzyMatch(q, item.label)
      if (score >= 0) {
        const key = `${item.type}-${item.label.toLowerCase()}`
        if (!seen.has(key)) {
          seen.add(key)
          scored.push({ ...item, score })
        }
      }
    }

    // Sort: starts-with first, then contains, then fuzzy
    scored.sort((a, b) => a.score - b.score)
    return scored.slice(0, 8)
  }, [location, allSuggestions])

  // ── Keyboard navigation ───────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      selectSuggestion(suggestions[activeIdx])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (item) => {
    setLocation(item.label)
    setShowSuggestions(false)
    setActiveIdx(-1)
    // Auto-navigate for convenience
    if (item.type === 'city') {
      navigate(cityUrl(item.slug))
    } else if (item.type === 'space' && item.citySlug) {
      navigate(spaceUrl(item.citySlug, item.slug))
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (
        inputRef.current && !inputRef.current.contains(e.target) &&
        listRef.current && !listRef.current.contains(e.target)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const loc = location.trim()
    if (!loc) return navigate(serviceRoutes[service] || '/virtual-office')

    // Virtual Office + a recognised city → that city's page; a state → all its spaces
    if (service === 'virtual-office') {
      const c = resolveCity(loc)
      if (c) return navigate(cityUrl(c.slug))
      const st = resolveState(loc)
      if (st) return navigate(`/virtual-office/${slugifyState(st)}`)

      // Try matching a space/area name (keyword search) → go to its detail page
      const q = loc.toLowerCase()
      const dbSpaces = getSupabaseSpaces()
      const match = dbSpaces.find(
        (s) =>
          s.address_area?.toLowerCase().includes(q) ||
          s.space_name?.toLowerCase().includes(q) ||
          s.listing_address?.toLowerCase().includes(q)
      )
      if (match) {
        const citySlug = slugifySpace(match.address_city)
        const areaSlug = slugifySpace(match.address_area)
        return navigate(spaceUrl(citySlug, areaSlug))
      }

      // Also check static city list for partial area matches in city names
      const cityByArea = voCities.find((c) => c.name.toLowerCase().includes(q))
      if (cityByArea) return navigate(cityUrl(cityByArea.slug))

      return navigate(`/virtual-office?city=${encodeURIComponent(loc)}`)
    }

    // Coworking, try keyword match against space names
    if (service === 'coworking') {
      const q = loc.toLowerCase()
      const dbSpaces = getSupabaseSpaces()
      const match = dbSpaces.find(
        (s) =>
          s.address_area?.toLowerCase().includes(q) ||
          s.space_name?.toLowerCase().includes(q)
      )
      if (match) {
        const citySlug = slugifySpace(match.address_city)
        return navigate(`/coworking?city=${citySlug}`)
      }
    }

    const base = serviceRoutes[service] || '/virtual-office'
    navigate(`${base}?city=${encodeURIComponent(loc)}`)
  }

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      {/* decorative blur shapes */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-48 h-80 w-80 rounded-full bg-primary-100/60 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(44,103,158,0.12),transparent_45%)]" />

      <div className="container-custom relative py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-primary-50 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-soft ring-1 ring-primary-100/60 sm:text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-green" />
            </span>
            India&apos;s #1 Workspace &amp; Virtual Office Marketplace
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy-dark sm:text-5xl lg:text-6xl text-balance">
            Find Your Perfect <span className="gradient-text">Virtual Office</span> &amp; Workspace
            Across India
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Premium business addresses for GST &amp; company registration, coworking spaces, and
            meeting rooms in 250+ locations across 28 states.
          </p>
        </motion.div>

        {/* Prominent search / filter card */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="mx-auto mt-10 max-w-4xl rounded-2xl border border-primary-100/70 bg-white p-4 shadow-card-hover sm:p-5"
        >
          <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto]">
            {/* location input with suggestions */}
            <div className="relative" ref={inputRef}>
              <div className="flex items-center gap-2 rounded-xl border border-primary-100 bg-surface-light px-4 py-3 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
                <MapPin className="h-5 w-5 flex-none text-primary" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    setShowSuggestions(true)
                    setActiveIdx(-1)
                  }}
                  onFocus={() => location.trim().length >= 2 && setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search city, area, space name or pincode…"
                  autoComplete="off"
                  className="w-full bg-transparent text-sm font-medium text-navy-dark placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Suggestion dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={listRef}
                  className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-primary-100 bg-white shadow-card-hover"
                >
                  {suggestions.map((item, idx) => (
                    <button
                      key={`${item.type}-${item.label}-${idx}`}
                      type="button"
                      onClick={() => selectSuggestion(item)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                        idx === activeIdx
                          ? 'bg-primary-50 text-primary'
                          : 'text-navy-dark hover:bg-surface-light'
                      }`}
                    >
                      <MapPin className="h-4 w-4 flex-none text-primary/60" />
                      <div className="min-w-0">
                        <span className="font-semibold">{item.label}</span>
                        {item.sub && (
                          <span className="ml-2 text-xs text-slate-400">
                            {item.type === 'city' ? item.sub : `in ${item.sub}`}
                          </span>
                        )}
                      </div>
                      <span className="ml-auto flex-none rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold uppercase text-primary/70">
                        {item.type === 'city' ? 'City' : 'Area'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* service dropdown */}
            <div className="relative flex items-center rounded-xl border border-primary-100 bg-surface-light px-4 py-3 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
              <Layers className="h-5 w-5 flex-none text-primary" />
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                aria-label="Service type"
                className="w-full appearance-none bg-transparent pl-2 pr-6 text-sm font-medium text-navy-dark focus:outline-none"
              >
                {serviceTypes.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
            </div>

            {/* search button */}
            <button
              type="submit"
              className="btn-base bg-primary-gradient px-7 py-3 text-sm text-white shadow-card hover:shadow-glow hover:brightness-110"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>

          {/* popular city chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Popular:
            </span>
            {popularCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setLocation(city)}
                className="rounded-full border border-primary-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:border-primary/40 hover:bg-primary-50"
              >
                {city}
              </button>
            ))}
          </div>
        </motion.form>

        {/* trust row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {trustRow.map((t) => (
            <div key={t.label} className="flex items-center gap-2">
              <t.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-navy-dark">{t.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
