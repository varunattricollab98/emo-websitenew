import { voCities, cityAliases } from '../data/spaces'
import { resolvePincode } from '../data/pincodes'

const STATES = [...new Set(voCities.map((c) => c.state).filter(Boolean))]

/**
 * Resolve a query to a CITY only (name, old/alias name, or pincode).
 * Deliberately does NOT match on state — a state name should not collapse
 * to a single arbitrary city. Returns { slug, name } or null.
 */
export function resolveCity(query) {
  const raw = String(query || '').trim()
  if (!raw) return null
  if (/^\d+$/.test(raw)) {
    const m = resolvePincode(raw)
    return m[0] ? { slug: m[0].slug, name: m[0].name } : null
  }
  const q = raw.toLowerCase()
  const exact = voCities.find((c) => c.name.toLowerCase() === q)
  if (exact) return { slug: exact.slug, name: exact.name }
  const byAlias = voCities.find((c) =>
    (cityAliases[c.slug] || []).some((a) => a === q || a.includes(q) || q.includes(a))
  )
  if (byAlias) return { slug: byAlias.slug, name: byAlias.name }
  const byName = voCities.find((c) => c.name.toLowerCase().includes(q))
  if (byName) return { slug: byName.slug, name: byName.name }
  return null
}

/**
 * Resolve a query to a STATE name (e.g. "haryana" -> "Haryana"). Returns the
 * canonical state string or null.
 */
export function resolveState(query) {
  const q = String(query || '')
    .trim()
    .toLowerCase()
  if (!q) return null
  return (
    STATES.find((s) => s.toLowerCase() === q) ||
    STATES.find((s) => q.length >= 4 && s.toLowerCase().includes(q)) ||
    null
  )
}
