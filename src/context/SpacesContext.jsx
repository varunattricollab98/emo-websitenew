import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { slugifySpace } from '../data/spaces'

const SpacesContext = createContext({ rows: [], loaded: false })

export function SpacesProvider({ children }) {
  const [rows, setRows] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      console.log('[SpacesContext] Supabase not configured')
      setLoaded(true)
      return
    }
    console.log('[SpacesContext] Fetching spaces from Supabase...')
    supabase
      .from('spaces')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(500)
      .then(({ data, error }) => {
        if (error) {
          console.error('[SpacesContext] Error:', error.message)
        } else {
          console.log('[SpacesContext] Loaded', (data||[]).length, 'spaces from Supabase')
        }
        setRows(data || [])
        setLoaded(true)
      })
  }, [])

  return (
    <SpacesContext.Provider value={{ rows, loaded }}>
      {children}
    </SpacesContext.Provider>
  )
}

export function useSupabaseSpaces() {
  return useContext(SpacesContext)
}

/**
 * Get spaces for a city slug from the Supabase context data.
 * Returns card-shaped objects.
 */
export function useSpacesForCity(citySlug) {
  const { rows } = useContext(SpacesContext)
  if (!citySlug) return rows.map(transformToCard)
  return rows
    .filter((r) => slugifySpace(r.address_city) === citySlug)
    .map(transformToCard)
}

/**
 * Get a single space detail from Supabase context.
 */
export function useSpaceDetailFromDb(citySlug, areaSlug) {
  const { rows } = useContext(SpacesContext)
  const row = rows.find(
    (r) => slugifySpace(r.address_city) === citySlug && slugifySpace(r.address_area) === areaSlug
  )
  return row ? transformToDetail(row) : null
}

// ── Transform helpers ──────────────────────────────────────

function transformToCard(row) {
  return {
    name: row.address_area,
    price: row.pricing_monthly || 799,
    rating: Number(row.rating) || 4.7,
    tags: buildTags(row),
    image: row.featured_image || '',
    badge: row.badge || null,
    citySlug: slugifySpace(row.address_city),
    cityName: row.address_city,
    _fromDb: true,
  }
}

function transformToDetail(row) {
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

function buildTags(row) {
  const tags = []
  if (row.pricing_gst) tags.push('GST')
  if (row.pricing_br) tags.push('Company Reg')
  if (row.pricing_ma) tags.push('Mailing')
  if (tags.length === 0) tags.push('GST', 'Company Reg', 'Mailing')
  return tags
}
