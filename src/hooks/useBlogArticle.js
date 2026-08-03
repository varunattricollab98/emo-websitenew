import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Fetches a blog article from the Supabase `blog_articles` table.
 *
 * If no article is found in the DB (or Supabase isn't configured),
 * returns null — the calling component should fall back to the
 * hardcoded default content from src/data/blogArticles.js.
 *
 * Usage:
 *   const article = useBlogArticle({ pageType: 'city', citySlug: 'gurgaon' })
 *   // article = { title, eyebrow, subtitle, blocks } or null
 *
 * @param {Object} params
 * @param {string} params.pageType   — 'city' | 'space' | 'coworking' | 'service'
 * @param {string} [params.citySlug]  — city slug (e.g. 'gurgaon')
 * @param {string} [params.areaSlug]  — area/space slug (e.g. 'cyber-hub')
 * @param {string} [params.serviceSlug] — service slug (e.g. 'gst-registration')
 */
export function useBlogArticle({ pageType, citySlug, areaSlug, serviceSlug }) {
  const [article, setArticle] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    if (!pageType) return

    let query = supabase
      .from('blog_articles')
      .select('title, eyebrow, subtitle, content')
      .eq('page_type', pageType)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(1)

    // Add filters based on page type
    if (citySlug) query = query.eq('city_slug', citySlug)
    if (areaSlug) query = query.eq('area_slug', areaSlug)
    if (serviceSlug) query = query.eq('service_slug', serviceSlug)

    query.then(({ data, error }) => {
      if (error) {
        console.warn('[useBlogArticle] Error:', error.message)
        return
      }
      if (data && data.length > 0) {
        const row = data[0]
        setArticle({
          title: row.title,
          eyebrow: row.eyebrow || 'Guide',
          subtitle: row.subtitle || '',
          blocks: Array.isArray(row.content) ? row.content : [],
        })
      }
    })
  }, [pageType, citySlug, areaSlug, serviceSlug])

  return article
}
