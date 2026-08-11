import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { markdownToBlocks } from '../utils/markdownToBlocks'

/**
 * Blog post hooks, backed by the Supabase `blog_posts` table.
 *
 * This is a DIFFERENT table from `blog_articles`:
 *   blog_articles = long-form sections embedded inside city/service pages
 *   blog_posts    = standalone posts with their own URL at /blog/{slug}
 *
 * Both hooks return a `loaded` flag so callers can tell "still fetching"
 * apart from "nothing there", which matters for the not-found state.
 */

/** Columns needed for the listing, deliberately excludes `content`. */
const LIST_COLUMNS =
  'slug, title, excerpt, cover_image, category, author, published_at, read_minutes, is_featured'

/**
 * Fetches the published blog posts, newest first.
 *
 * @returns {{ posts: Array, loaded: boolean }}
 */
export function useBlogPosts() {
  const [posts, setPosts] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoaded(true)
      return
    }

    let cancelled = false

    supabase
      .from('blog_posts')
      .select(LIST_COLUMNS)
      .eq('is_active', true)
      .order('published_at', { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          // Most likely the table has not been created yet. Not fatal, the
          // page just shows its empty state.
          console.warn('[useBlogPosts] Error:', error.message)
          setLoaded(true)
          return
        }
        setPosts(data || [])
        setLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { posts, loaded }
}

/**
 * Fetches one post by slug, with the markdown body parsed into ArticleBlocks.
 *
 * @returns {{ post: Object|null, loaded: boolean }}
 */
export function useBlogPost(slug) {
  const [post, setPost] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !slug) {
      setLoaded(true)
      return
    }

    let cancelled = false
    setLoaded(false)
    setPost(null)

    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .limit(1)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.warn('[useBlogPost] Error:', error.message)
          setLoaded(true)
          return
        }
        const row = data && data[0]
        if (!row) {
          setLoaded(true)
          return
        }

        // Body is markdown, mirroring how blog_articles content is handled.
        let blocks = []
        if (typeof row.content === 'string') {
          try {
            blocks =
              row.content_format === 'markdown'
                ? markdownToBlocks(row.content)
                : JSON.parse(row.content)
          } catch {
            blocks = markdownToBlocks(row.content)
          }
        } else if (Array.isArray(row.content)) {
          blocks = row.content
        }

        setPost({ ...row, blocks })
        setLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { post, loaded }
}

/** Shared date formatter so the listing and the detail page agree. */
export function formatPostDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
