import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://oijtkvkyefqfwuycibcv.supabase.co'

/**
 * Creates a Supabase client authenticated with an elevated key
 * (new-style `sb_secret_…` or a legacy service_role JWT).
 * This bypasses RLS so the admin panel can read/write every table.
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
 * Verifies a key is genuinely elevated (secret / service_role), not just valid.
 *
 * We probe `admin_users`, which has an RLS policy allowing ONLY the service
 * role. That distinguishes the three cases we care about:
 *
 *   - request errors           → key is wrong, revoked or disabled
 *   - succeeds but 0 rows      → it's a publishable/anon key (RLS filtered it)
 *   - succeeds with rows       → genuinely elevated ✓
 *
 * The old version probed `blog_posts`, which is publicly readable — so a
 * publishable key passed validation and then silently failed on every write.
 *
 * @returns {Promise<{ valid: boolean, reason?: string }>}
 */
export async function validateServiceKey(key) {
  const trimmed = (key || '').trim()
  if (!trimmed) return { valid: false, reason: 'Please enter a key.' }

  try {
    const client = createClient(SUPABASE_URL, trimmed, {
      auth: { persistSession: false },
    })

    // NOTE: do not use `head: true` here — it discards the response body, which
    // means Supabase's actual error message ("Legacy API keys are disabled",
    // "Invalid API key", …) is lost and we can only show a useless blank error.
    const { data, error } = await client.from('admin_users').select('id').limit(1)

    if (error) {
      const msg = error.message || ''

      if (/legacy api keys are disabled/i.test(msg)) {
        return {
          valid: false,
          reason:
            'This is an old service_role key and legacy keys are disabled on this project. Create a new secret key in Supabase → API Keys → Secret keys.',
        }
      }
      if (/invalid api key|jwt|unauthorized|401/i.test(msg)) {
        return {
          valid: false,
          reason: 'That key was rejected by Supabase. Check you copied it fully.',
        }
      }
      if (/relation|does not exist|42P01/i.test(msg)) {
        // Table missing — can't prove elevation, but the key itself reached the
        // API. Let it through so a fresh project can still be bootstrapped.
        return { valid: true }
      }
      return { valid: false, reason: msg }
    }

    if (!data || data.length === 0) {
      return {
        valid: false,
        reason:
          'That looks like a publishable key. The admin panel needs a secret key (sb_secret_…) from Supabase → API Keys → Secret keys.',
      }
    }

    return { valid: true }
  } catch (err) {
    return {
      valid: false,
      reason: err?.message || 'Could not reach Supabase. Check your connection.',
    }
  }
}
