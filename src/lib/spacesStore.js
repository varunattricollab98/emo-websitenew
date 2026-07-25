/**
 * Global spaces store — fetches from Supabase once at app start and merges
 * with the static built-in data. Components that need live Supabase spaces
 * use the `useSpaces` hook; this store is for the getSpaces/getSpaceBySlug
 * functions that many components already rely on.
 *
 * On first call, it kicks off a fetch. Until the fetch completes (or if
 * Supabase isn't configured), the built-in static data is used seamlessly.
 */
import { supabase, isSupabaseConfigured } from './supabase'
import { slugifySpace } from '../data/spaces'

let _fetched = false
let _rows = [] // raw Supabase rows
let _listeners = []

// Kick off fetch immediately on module load (runs once).
if (isSupabaseConfigured && supabase) {
  supabase
    .from('spaces')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(500)
    .then(({ data }) => {
      _fetched = true
      _rows = data || []
      _listeners.forEach((fn) => fn())
    })
}

export function getSupabaseSpaces() {
  return _rows
}

export function isLoaded() {
  return _fetched
}

export function onLoad(fn) {
  if (_fetched) fn()
  else _listeners.push(fn)
}

/**
 * Get Supabase spaces for a given city slug.
 * Returns array in the card shape, or empty if not loaded / no matches.
 */
export function getSupabaseSpacesForCity(citySlug) {
  return _rows
    .filter((r) => slugifySpace(r.address_city) === citySlug)
    .map((r) => ({
      name: r.address_area,
      price: r.pricing_monthly || 799,
      rating: Number(r.rating) || 4.7,
      tags: r.pricing_gst ? ['GST', 'Company Reg', 'Mailing'] : ['GST', 'Company Reg', 'Mailing'],
      image: r.featured_image || '',
      badge: r.badge || null,
      _fromDb: true,
    }))
}

/**
 * Get a single Supabase space detail by city slug + area slug.
 */
export function getSupabaseSpaceDetail(citySlug, areaSlug) {
  const row = _rows.find(
    (r) => slugifySpace(r.address_city) === citySlug && slugifySpace(r.address_area) === areaSlug
  )
  if (!row) return null

  const gallery = (row.space_images || '')
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s.startsWith('http'))

  const amenities = (row.property_feature || '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)

  return {
    spaceName: row.space_name || `${row.address_area} Business Hub`,
    area: row.address_area,
    city: row.address_city,
    state: row.address_state || 'India',
    rating: Number(row.rating) || 4.7,
    description: row.description || '',
    featuredImage: row.featured_image || '',
    gallery,
    pricing: {
      monthly: row.pricing_monthly || 799,
      gst: row.pricing_gst || row.pricing_monthly || 799,
      br: row.pricing_br || (row.pricing_monthly || 799) + 300,
      ma: row.pricing_ma || Math.max(499, (row.pricing_monthly || 799) - 200),
    },
    fullAddress: row.full_address || `${row.address_area}, ${row.address_city}`,
    listingAddress: row.listing_address || '',
    processingTime: row.processing_time || '2–3 business days',
    propertyType: row.property_type || 'Virtual Office & Coworking',
    amenities,
    badge: row.badge || null,
  }
}
