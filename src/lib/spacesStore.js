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
    .select('address_area,address_city,space_name,listing_address,pricing_monthly,rating,featured_image')
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(200)
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
