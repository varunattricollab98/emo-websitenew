import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { markdownToBlocks } from '../utils/markdownToBlocks'

/**
 * Fetches a blog article from the Supabase `blog_articles` table.
 *
 * Supports TWO content formats:
 *   1. JSON array (content_format = 'json' or null), ArticleBlocks format
 *   2. Markdown text (content_format = 'markdown'), plain text, auto-converted
 *
 * If no article is found in the DB (or Supabase isn't configured),
 * returns null, the calling component should fall back to the
 * hardcoded default content from src/data/blogArticles.js.
 *
 * Usage:
 *   const article = useBlogArticle({ pageType: 'city', citySlug: 'gurgaon' })
 *   // article = { title, eyebrow, subtitle, blocks } or null
 */
export function useBlogArticle({ pageType, citySlug, areaSlug, serviceSlug }) {
  const [article, setArticle] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    if (!pageType) return

    let query = supabase
      .from('blog_articles')
      .select('title, eyebrow, subtitle, content, content_format')
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
        // Support both JSON blocks and Markdown text
        let blocks = []
        if (row.content_format === 'markdown' && typeof row.content === 'string') {
          blocks = markdownToBlocks(row.content)
        } else if (typeof row.content === 'string') {
          // Try parsing as JSON string
          try {
            blocks = JSON.parse(row.content)
          } catch {
            // If it fails, treat as markdown
            blocks = markdownToBlocks(row.content)
          }
        } else if (Array.isArray(row.content)) {
          blocks = row.content
        }

        setArticle({
          title: row.title,
          eyebrow: row.eyebrow || 'Guide',
          subtitle: row.subtitle || '',
          blocks,
        })
      }
    })
  }, [pageType, citySlug, areaSlug, serviceSlug])

  return article
}
