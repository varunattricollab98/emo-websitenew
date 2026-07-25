import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import { slugifySpace } from '../data/spaces'

/**
 * Fetches spaces from Supabase (public.spaces table).
 * Returns { spaces, loading, error }.
 *
 * If Supabase isn't configured or the fetch fails, it returns an empty array
 * (the site falls back to its built-in static data seamlessly).
 *
 * Options:
 *   city   – filter by city name (case-insensitive partial match)
 *   limit  – max rows (default 100)
 */
export function useSpaces({ city, limit = 100 } = {}) {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    let query = supabase
      .from('spaces')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(limit)

    if (city) {
      query = query.ilike('address_city', `%${city}%`)
    }

    query.then(({ data, error: err }) => {
      if (err) {
        console.error('[useSpaces]', err.message)
        setError(err.message)
      } else {
        // Transform DB rows into the shape the UI components expect
        setSpaces((data || []).map(transformRow))
      }
      setLoading(false)
    })
  }, [city, limit])

  return { spaces, loading, error }
}

/**
 * Fetch a single space by city + area slug.
 */
export function useSpaceDetail(cityName, areaSlug) {
  const [space, setSpace] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !cityName || !areaSlug) {
      setLoading(false)
      return
    }

    supabase
      .from('spaces')
      .select('*')
      .eq('is_active', true)
      .ilike('address_city', `%${cityName}%`)
      .then(({ data }) => {
        const match = (data || []).find(
          (r) => slugifySpace(r.address_area) === areaSlug
        )
        if (match) setSpace(transformRow(match))
        setLoading(false)
      })
  }, [cityName, areaSlug])

  return { space, loading }
}

/**
 * Transform a Supabase row into the shape used by SpaceDetail and space cards.
 */
function transformRow(row) {
  const gallery = (row.space_images || '')
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s.startsWith('http'))

  const amenities = (row.property_feature || '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)

  return {
    // Card fields
    name: row.address_area,
    price: row.pricing_monthly || 799,
    rating: Number(row.rating) || 4.7,
    tags: buildTags(row),
    image: row.featured_image || '',
    badge: row.badge || null,
    citySlug: slugifySpace(row.address_city),
    cityName: row.address_city,

    // Detail fields
    spaceName: row.space_name || `${row.address_area} Business Hub`,
    area: row.address_area,
    city: row.address_city,
    state: row.address_state || 'India',
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

    // Raw DB row (for any extra fields)
    _raw: row,
  }
}

function buildTags(row) {
  const tags = []
  if (row.pricing_gst) tags.push('GST')
  if (row.pricing_br) tags.push('Company Reg')
  if (row.pricing_ma) tags.push('Mailing')
  if (tags.length === 0) tags.push('GST', 'Company Reg', 'Mailing')
  return tags
}
