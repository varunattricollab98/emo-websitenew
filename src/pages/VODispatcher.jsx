import { useParams, Navigate } from 'react-router-dom'
import { voCities, cityAliases, slugifySpace, slugifyState, getStateNameFromSlug, getStateSlugForCity, cityUrl, spaceUrl } from '../data/spaces'
import { getServiceLanding } from '../data/serviceLandings'
import { resolveCity } from '../utils/resolveCity'
import { useSupabaseSpaces } from '../context/SpacesContext'
import { lazy } from 'react'

const CityTemplate = lazy(() => import('./CityTemplate'))
const StateTemplate = lazy(() => import('./StateTemplate'))
const SpaceDetail = lazy(() => import('./SpaceDetail'))
const ServiceLanding = lazy(() => import('./ServiceLanding'))

/**
 * Smart URL dispatcher for all /virtual-office/* routes.
 *
 * Handles the consistent URL structure:
 *   /virtual-office/:state                     → State page (all cities in state)
 *   /virtual-office/:state/:city               → City page (all spaces in city)
 *   /virtual-office/:state/:city/:space        → Space detail page
 *   /virtual-office/:state/:city/:service      → Service landing page (GST, etc.)
 *
 * Also handles legacy/old URLs with redirects:
 *   /virtual-office/:city                      → redirect to /virtual-office/:state/:city
 *   /virtual-office/:city/:space               → redirect to /virtual-office/:state/:city/:space
 *
 * Alias resolution:
 *   /virtual-office/haryana/gurugram           → resolves "gurugram" → "gurgaon" slug
 */
export default function VODispatcher() {
  const { first, second, third } = useParams()
  const { loaded } = useSupabaseSpaces()

  // ── Helper: check if a slug is a known state ──
  const isState = (slug) => !!getStateNameFromSlug(slug)

  // ── Helper: resolve a city slug (handles aliases like gurugram → gurgaon) ──
  const resolveToCity = (slug) => {
    if (!slug) return null
    // Direct match
    const direct = voCities.find((c) => c.slug === slug)
    if (direct) return direct
    // Alias match
    const byAlias = voCities.find((c) =>
      (cityAliases[c.slug] || []).some((a) => a === slug.toLowerCase())
    )
    return byAlias || null
  }

  // ── Helper: check if a slug is a known service ──
  const isService = (slug) => !!getServiceLanding(slug)

  // ════════════════════════════════════════════════════════════
  // 3-segment: /virtual-office/:first/:second/:third
  // ════════════════════════════════════════════════════════════
  if (third) {
    // Pattern: /virtual-office/{state}/{city}/{space-or-service}
    const stateSlug = first
    const citySlugRaw = second
    const thirdSlug = third

    // Resolve city (handle aliases)
    const city = resolveToCity(citySlugRaw)
    const citySlug = city?.slug || citySlugRaw

    // If city alias used, redirect to canonical URL
    if (city && city.slug !== citySlugRaw) {
      return <Navigate to={`/virtual-office/${stateSlug}/${city.slug}/${thirdSlug}`} replace />
    }

    // Check if third segment is a service
    if (isService(thirdSlug)) {
      return <ServiceLanding />
    }

    // Otherwise it's a space detail page
    return <SpaceDetail />
  }

  // ════════════════════════════════════════════════════════════
  // 2-segment: /virtual-office/:first/:second
  // ════════════════════════════════════════════════════════════
  if (second) {
    const firstIsState = isState(first)
    const secondIsCity = !!resolveToCity(second)

    // Pattern A: /virtual-office/{state}/{city} → City page
    if (firstIsState && secondIsCity) {
      const city = resolveToCity(second)
      // Redirect alias to canonical
      if (city && city.slug !== second) {
        return <Navigate to={`/virtual-office/${first}/${city.slug}`} replace />
      }
      return <CityTemplate />
    }

    // Pattern B: /virtual-office/{state}/{city} where city is unknown
    // but first IS a state, might be a new city, show CityTemplate anyway
    if (firstIsState) {
      const city = resolveToCity(second)
      if (city && city.slug !== second) {
        return <Navigate to={`/virtual-office/${first}/${city.slug}`} replace />
      }
      return <CityTemplate />
    }

    // Pattern C: /virtual-office/{city}/{space} (old format without state)
    // → Redirect to /virtual-office/{state}/{city}/{space}
    const cityFromFirst = resolveToCity(first)
    if (cityFromFirst) {
      const stateSlug = getStateSlugForCity(cityFromFirst.slug)
      // Check if second is a service
      if (isService(second)) {
        return <Navigate to={`/virtual-office/${stateSlug}/${cityFromFirst.slug}/${second}`} replace />
      }
      // It's a space, redirect to canonical 3-segment URL
      return <Navigate to={`/virtual-office/${stateSlug}/${cityFromFirst.slug}/${second}`} replace />
    }

    // Fallback: treat first as state, second as city
    return <CityTemplate />
  }

  // ════════════════════════════════════════════════════════════
  // 1-segment: /virtual-office/:first
  // ════════════════════════════════════════════════════════════
  if (first) {
    // Check if it's a state → State page
    if (isState(first)) {
      return <StateTemplate />
    }

    // Check if it's a city → Redirect to /virtual-office/{state}/{city}
    const city = resolveToCity(first)
    if (city) {
      const stateSlug = getStateSlugForCity(city.slug)
      return <Navigate to={`/virtual-office/${stateSlug}/${city.slug}`} replace />
    }

    // Unknown slug, might be a state alias or typo, show not found
    return <StateTemplate />
  }

  // No params, shouldn't reach here (handled by /virtual-office route)
  return null
}
