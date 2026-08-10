import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Fetches related-resource links from the Supabase `related_resources` table.
 *
 * Returns an array of { label, url } objects sorted by sort_order.
 * First fetches service-specific links (matching the serviceSlug), then
 * falls back to generic links for the page_type (service_slug IS NULL).
 *
 * If Supabase is not configured or no rows are returned, returns null
 * so the calling component can fall back to hardcoded defaults.
 *
 * Usage:
 *   const links = useRelatedResources({ pageType: 'service-hub', serviceSlug: 'gst-registration' })
 *   // links = [{ label: 'All Virtual Office Locations', url: '/virtual-office' }, ...] or null
 */
export function useRelatedResources({ pageType = 'service-hub', serviceSlug = null } = {}) {
  const [links, setLinks] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    if (!pageType) return

    // Build query: fetch links for this page_type that are either
    // specific to this service OR generic (service_slug is NULL)
    let query = supabase
      .from('related_resources')
      .select('label, url, service_slug')
      .eq('page_type', pageType)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (serviceSlug) {
      // Get both service-specific AND generic links
      query = query.or(`service_slug.eq.${serviceSlug},service_slug.is.null`)
    } else {
      query = query.is('service_slug', null)
    }

    query.then(({ data, error }) => {
      if (error) {
        console.warn('[useRelatedResources] Error:', error.message)
        return
      }
      if (data && data.length > 0) {
        setLinks(
          data.map((row) => ({
            label: row.label,
            url: row.url,
          }))
        )
      }
    })
  }, [pageType, serviceSlug])

  return links
}
