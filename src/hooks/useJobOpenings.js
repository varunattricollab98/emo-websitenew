import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Fetches the open roles from the Supabase `job_openings` table for /careers.
 *
 * Returns a `loaded` flag so the page can tell "still fetching" apart from
 * "no open roles", which drives two different empty states.
 *
 * @returns {{ jobs: Array, loaded: boolean }}
 */
export function useJobOpenings() {
  const [jobs, setJobs] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoaded(true)
      return
    }

    let cancelled = false

    supabase
      .from('job_openings')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(100)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          // Most likely the table has not been created yet. Not fatal, the
          // page just shows "no open roles right now".
          console.warn('[useJobOpenings] Error:', error.message)
          setLoaded(true)
          return
        }
        setJobs(data || [])
        setLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { jobs, loaded }
}
