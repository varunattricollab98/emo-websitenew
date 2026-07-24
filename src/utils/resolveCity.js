import { voCities, cityMatches } from '../data/spaces'
import { resolvePincode } from '../data/pincodes'

/**
 * Resolve a free-text query (city name, old/alias name, or pincode) to a
 * known city { slug, name }. Returns null if nothing matches.
 */
export function resolveCity(query) {
  const raw = String(query || '').trim()
  if (!raw) return null
  if (/^\d+$/.test(raw)) {
    const m = resolvePincode(raw)
    return m[0] ? { slug: m[0].slug, name: m[0].name } : null
  }
  const exact = voCities.find((c) => c.name.toLowerCase() === raw.toLowerCase())
  const match = exact || voCities.find((c) => cityMatches(c, raw))
  return match ? { slug: match.slug, name: match.name } : null
}
