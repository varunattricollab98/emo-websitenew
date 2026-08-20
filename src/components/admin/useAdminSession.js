import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminAuth,
  fetchAdminProfile,
  adminSignOut,
} from '../../lib/supabaseAdmin'
import {
  readSession,
  setCachedProfile,
  clearSession,
  isSessionExpired,
} from '../../lib/adminSession'
import { hasPermission, hasAnyPermission } from '../../lib/permissions'

/**
 * The hook every admin page uses.
 *
 * Returns:
 *   session  — { id, username, email, name, role, permissions } or null
 *   client   — authenticated Supabase client (null when signed out)
 *   can(p)   — permission check
 *   canAny([p]) — true if any permission matches
 *   logout() — signs out of Supabase Auth and returns to /admin
 *   ready    — false until the session has been resolved
 *
 * Authority is enforced by RLS in the database; these checks only shape the UI.
 */
export function useAdminSession() {
  const navigate = useNavigate()
  const [session, setSession] = useState(() => readSession())
  const [ready, setReady] = useState(false)

  const logout = useCallback(async () => {
    await adminSignOut()
    clearSession()
    setSession(null)
    navigate('/admin')
  }, [navigate])

  useEffect(() => {
    let cancelled = false

    async function resolve() {
      // Custom idle timeout on top of Supabase's token expiry
      if (readSession() && isSessionExpired()) {
        await adminSignOut()
        clearSession()
        if (!cancelled) {
          setSession(null)
          setReady(true)
          navigate('/admin?expired=1')
        }
        return
      }

      const { data } = await adminAuth.auth.getSession()
      if (cancelled) return

      if (!data?.session) {
        clearSession()
        setSession(null)
        setReady(true)
        return
      }

      // Signed in — make sure we have the profile (role + permissions).
      let profile = readSession()
      if (!profile) {
        const fetched = await fetchAdminProfile()
        if (cancelled) return
        if (fetched) {
          setCachedProfile(fetched)
          profile = readSession()
        } else {
          // Authenticated with Supabase but not an admin — sign out so they
          // aren't left in a half-logged-in state.
          await adminSignOut()
          clearSession()
          if (!cancelled) {
            setSession(null)
            setReady(true)
            navigate('/admin?notadmin=1')
          }
          return
        }
      }

      setSession(profile)
      setReady(true)
    }

    resolve()

    // React to sign-out / token refresh in other tabs
    const { data: sub } = adminAuth.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        clearSession()
        setSession(null)
      }
    })

    return () => {
      cancelled = true
      sub?.subscription?.unsubscribe()
    }
  }, [navigate])

  const client = session ? adminAuth : null

  const can = useCallback(
    (permission) => hasPermission(session?.permissions, permission),
    [session]
  )

  const canAny = useCallback(
    (list) => hasAnyPermission(session?.permissions, list),
    [session]
  )

  return { session, client, can, canAny, logout, ready }
}
