import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Fetches coworking spaces from the dedicated `coworking_spaces` table.
 *
 * Returns a `loaded` flag so pages can tell "still fetching" apart from
 * "no data available", which drives fallback logic.
 *
 * @returns {{ spaces: Array, loaded: boolean }}
 */
export function useCoworkingSpaces() {
  const [spaces, setSpaces] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoaded(true)
      return
    }

    let cancelled = false

    supabase
      .from('coworking_spaces')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('rating', { ascending: false })
      .limit(500)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          // Table may not exist yet — not fatal, pages fall back gracefully
          console.warn('[useCoworkingSpaces] Error:', error.message)
          setLoaded(true)
          return
        }
        setSpaces(data || [])
        setLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { spaces, loaded }
}
