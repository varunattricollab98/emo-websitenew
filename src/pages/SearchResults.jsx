import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Star, Flame, ArrowRight, Search } from 'lucide-react'
import { useSupabaseSpaces } from '../context/SpacesContext'
import { slugifySpace, spaceUrl, cityAliases, voCities } from '../data/spaces'
import SmartImage from '../components/ui/SmartImage'

/**
 * Given a search query, returns the set of alternate city names that should
 * also be considered a match. For example, searching "bangalore" should also
 * match spaces where address_city is "Bengaluru".
 */
function getAliasExpansions(query) {
  const q = query.toLowerCase()
  const expansions = new Set()

  for (const [slug, aliases] of Object.entries(cityAliases)) {
    // Check if the query matches the slug or any alias
    const allNames = [slug, ...aliases]
    const matches = allNames.some((name) => name.includes(q) || q.includes(name))
    if (matches) {
      // Add all related names to the expansion set
      allNames.forEach((name) => expansions.add(name))
      // Also add the display name from voCities
      const city = voCities.find((c) => c.slug === slug)
      if (city) expansions.add(city.name.toLowerCase())
    }
  }

  return expansions
}

function buildTags(row) {
  const tags = []
  if (row.pricing_gst) tags.push('GST')
  if (row.pricing_br) tags.push('Company Reg')
  if (row.pricing_ma) tags.push('Mailing')
  if (tags.length === 0) tags.push('GST', 'Company Reg', 'Mailing')
  return tags
}

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { rows, loaded } = useSupabaseSpaces()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const aliasExpansions = getAliasExpansions(q)

    return rows.filter((row) => {
      const city = (row.address_city || '').toLowerCase()
      const area = (row.address_area || '').toLowerCase()
      const name = (row.space_name || '').toLowerCase()
      const address = (row.listing_address || '').toLowerCase()

      // Direct keyword match
      if (
        city.includes(q) ||
        area.includes(q) ||
        name.includes(q) ||
        address.includes(q)
      ) {
        return true
      }

      // Alias-based match: if the query expands to city aliases,
      // check if the row's city matches any of those aliases
      if (aliasExpansions.size > 0) {
        const citySlug = slugifySpace(row.address_city)
        if (aliasExpansions.has(city) || aliasExpansions.has(citySlug)) {
          return true
        }
      }

      return false
    })
  }, [query, rows])

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Search className="h-3.5 w-3.5" />
            Search Results
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-dark sm:text-3xl">
            {query ? (
              <>
                Results for{' '}
                <span className="gradient-text">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              'Search Spaces'
            )}
          </h1>
          {loaded && (
            <p className="mt-2 text-sm text-slate-500">
              {results.length} verified {results.length === 1 ? 'space' : 'spaces'} found
            </p>
          )}
        </motion.div>

        {/* Loading state */}
        {!loaded && (
          <div className="mt-16 flex items-center justify-center">
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary" />
          </div>
        )}

        {/* No results */}
        {loaded && query && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-12 rounded-2xl border border-dashed border-primary-200 bg-surface-light p-10 text-center"
          >
            <p className="text-lg font-semibold text-navy-dark">
              No spaces found for &ldquo;{query}&rdquo;
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Try a different city name, area, or keyword. You can also browse our{' '}
              <Link to="/virtual-office" className="font-semibold text-primary hover:underline">
                all locations
              </Link>{' '}
              page.
            </p>
          </motion.div>
        )}

        {/* No query */}
        {loaded && !query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-12 rounded-2xl border border-dashed border-primary-200 bg-surface-light p-10 text-center"
          >
            <p className="text-lg font-semibold text-navy-dark">
              Enter a keyword to search
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Search by city, area, space name, or address to find virtual offices across India.
            </p>
          </motion.div>
        )}

        {/* Results grid */}
        {loaded && results.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((sp, i) => {
              const citySlug = slugifySpace(sp.address_city)
              const areaSlug = slugifySpace(sp.address_area)
              const tags = buildTags(sp)

              return (
                <motion.div
                  key={`${sp.address_area}-${sp.address_city}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                >
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100/60 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
                    <Link
                      to={spaceUrl(citySlug, areaSlug)}
                      className="relative block h-40 overflow-hidden bg-primary-gradient"
                    >
                      <SmartImage
                        src={sp.featured_image || ''}
                        alt={`${sp.address_area}, ${sp.address_city}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {sp.badge && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-white shadow-gold-glow">
                          <Flame className="h-3 w-3" />
                          {sp.badge}
                        </span>
                      )}
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-xs font-bold text-navy-dark shadow-soft">
                        <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                        {Number(sp.rating) || 4.7}
                      </span>
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      <Link
                        to={spaceUrl(citySlug, areaSlug)}
                        className="text-base font-bold text-navy-dark transition-colors hover:text-primary"
                      >
                        {sp.address_area}
                      </Link>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3 text-primary/60" />
                        {sp.address_city}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-1 items-end justify-between">
                        <div>
                          <p className="text-[11px] text-slate-400">From</p>
                          <p className="text-lg font-extrabold text-navy-dark">
                            ₹{sp.pricing_monthly || 799}
                            <span className="text-xs font-medium text-slate-400">/mo</span>
                          </p>
                        </div>
                        <Link
                          to={spaceUrl(citySlug, areaSlug)}
                          className="btn-base bg-primary-50 px-3.5 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-100"
                        >
                          Enquire
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
