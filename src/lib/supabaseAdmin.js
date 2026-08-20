import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client.
 *
 * IMPORTANT CHANGE: this used to build a client from a service_role key held in
 * sessionStorage. Supabase now refuses elevated keys in the browser
 * ("Forbidden use of secret API key in browser"), and that design was never
 * safe anyway — it gave the browser unrestricted database access.
 *
 * Now the admin panel signs in as a real Supabase Auth user. This client uses
 * the same browser-safe publishable key as the public site; authority comes
 * from the signed-in user's JWT and is enforced by RLS policies in the
 * database (see supabase/admin_setup_all_in_one.sql).
 *
 * A separate client instance (with its own storageKey) is used so the admin
 * session is kept isolated from the public site's anonymous client.
 */

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://oijtkvkyefqfwuycibcv.supabase.co'

const PUBLISHABLE_KEY = 'sb_publishable_w7-240CdmLJ_xZy5Fg11Fg__ZI-wPO1'

const SUPABASE_PUBLIC_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  PUBLISHABLE_KEY

/** Singleton — Supabase Auth needs one client instance to own the session. */
export const adminAuth = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // needed for the password-recovery callback link
    storageKey: 'emo-admin-auth',
    flowType: 'pkce',
  },
})

/**
 * The client every admin page uses for queries.
 *
 * Returns the authenticated client, or null when nobody is signed in — the
 * existing `if (!client) navigate('/admin')` guards keep working unchanged.
 *
 * Note this is now synchronous-but-optimistic: it returns the client whenever a
 * session exists in storage. Actual authority is checked by the database on
 * every request, so a stale session simply gets empty results rather than
 * leaking anything.
 */
export function getAdminClient() {
  if (typeof window === 'undefined') return null
  try {
    // Supabase stores the session under `${storageKey}` in localStorage.
    const raw = window.localStorage.getItem('emo-admin-auth')
    if (!raw) return null
  } catch {
    return null
  }
  return adminAuth
}

/** Resolve the current Auth session (async — reads/refreshes the token). */
export async function getAdminSession() {
  const { data, error } = await adminAuth.auth.getSession()
  if (error) return null
  return data?.session ?? null
}

/**
 * Load the signed-in user's admin profile (role + permissions).
 * Returns null when the auth user has no active admin_users row — i.e. they
 * authenticated successfully but are not an admin.
 */
export async function fetchAdminProfile() {
  const session = await getAdminSession()
  if (!session?.user) return null

  const { data, error } = await adminAuth
    .from('admin_users')
    .select('id, username, email, name, role, permissions, is_active')
    .eq('auth_user_id', session.user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) return null
  return { ...data, authUserId: session.user.id, authEmail: session.user.email }
}

export async function adminSignOut() {
  try {
    await adminAuth.auth.signOut()
  } catch {
    /* ignore — we clear local state regardless */
  }
}

/**
 * Create a Supabase Auth account for a new admin.
 *
 * `auth.admin.inviteUserByEmail()` needs a secret key, which the browser is not
 * allowed to hold — so we sign the new user up instead. That is done through a
 * THROWAWAY client with `persistSession: false`, otherwise supabase-js would
 * swap the current admin's session for the new user's and effectively log the
 * admin out mid-action.
 *
 * A database trigger (link_auth_user_to_admin_profile) attaches the new auth
 * user to the matching admin_users row by email.
 *
 * @returns {Promise<{ ok: boolean, needsConfirmation?: boolean, error?: string }>}
 */
export async function createAuthUser(email, password) {
  const throwaway = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

  const { data, error } = await throwaway.auth.signUp({
    email: email.trim(),
    password,
  })

  if (error) {
    const msg = error.message || ''
    if (/already registered|already exists/i.test(msg)) {
      return {
        ok: true,
        alreadyExisted: true,
      }
    }
    if (/signups not allowed|disabled/i.test(msg)) {
      return {
        ok: false,
        error:
          'Email signups are disabled for this project. Enable them in Supabase → Authentication → Sign In / Providers, or create the user manually in Authentication → Users.',
      }
    }
    return { ok: false, error: msg }
  }

  // No session returned → Supabase is set to require email confirmation.
  return { ok: true, needsConfirmation: !data?.session }
}

/** Email a password-reset link to an existing admin. */
export async function sendPasswordReset(email) {
  const { error } = await adminAuth.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/reset-password`,
  })
  return error ? { ok: false, error: error.message } : { ok: true }
}
