/**
 * Global spaces store — provides getSupabaseSpaces() for components
 * that need access outside React context (like HeroSearch).
 *
 * Now fetches ONCE with limited columns (not SELECT *) to reduce
 * payload size and avoid duplicate fetches with SpacesContext.
 */
import { supabase, isSupabaseConfigured } from './supabase'
import { slugifySpace } from '../data/spaces'

let _fetched = false
let _rows = []
let _listeners = []

// Fetch only columns needed for search/matching (not full content)
if (isSupabaseConfigured && supabase) {
  supabase
    .from('spaces')
    .select('address_area,address_city,address_state,space_name,listing_address,pricing_monthly,pricing_gst,pricing_br,pricing_ma,rating,featured_image,space_images,property_feature,description,overview,full_address,processing_time,property_type,map_query,map_location,badge,highlights')
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
    processingTime: row.processing_time || '2–3 business days',
    propertyType: row.property_type || 'Virtual Office & Coworking',
    amenities,
    badge: row.badge || null,
    mapQuery: row.map_query || row.map_location || '',
    overview: row.overview || '',
    highlights: row.highlights || '',
  }
}
