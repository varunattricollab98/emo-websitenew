import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://oijtkvkyefqfwuycibcv.supabase.co'

/**
 * Creates a Supabase client authenticated with the service_role key.
 * This bypasses RLS and allows write operations on blog_posts.
 * The key is stored in sessionStorage after the admin logs in.
 */
export function getAdminClient() {
  const serviceKey = sessionStorage.getItem('admin_service_key')
  if (!serviceKey) return null

  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false },
  })
}

/**
 * Validates that the provided key can access Supabase by attempting a simple query.
 */
export async function validateServiceKey(key) {
  try {
    const client = createClient(SUPABASE_URL, key, {
      auth: { persistSession: false },
    })
    // Try a simple read to verify the key works
    const { error } = await client.from('blog_posts').select('slug').limit(1)
    return !error
  } catch {
    return false
  }
}
