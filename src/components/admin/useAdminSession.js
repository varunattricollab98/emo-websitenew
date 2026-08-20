import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'
import {
  readSession,
  clearSession,
  isSessionExpired,
} from '../../lib/adminSession'
import { hasPermission, hasAnyPermission } from '../../lib/permissions'

/**
 * The hook every admin page uses instead of poking sessionStorage directly.
 *
 * Returns:
 *   session  — { role, permissions, name, username, userId } or null
 *   client   — service_role Supabase client (null when not logged in)
 *   can(p)   — permission check
 *   canAny([p]) — true if any permission matches
 *   logout() — clears the session and returns to /admin
 *   ready    — false until the expiry check has run
 */
export function useAdminSession() {
  const navigate = useNavigate()
  const [session, setSession] = useState(() => readSession())
  const [ready, setReady] = useState(false)

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
    navigate('/admin')
  }, [navigate])

  // Expire stale sessions on mount and whenever the tab regains focus.
  useEffect(() => {
    function check() {
      if (readSession() && isSessionExpired()) {
        clearSession()
        setSession(null)
        navigate('/admin?expired=1')
        return
      }
      setSession(readSession())
      setReady(true)
    }
    check()
    window.addEventListener('focus', check)
    return () => window.removeEventListener('focus', check)
  }, [navigate])

  const client = useMemo(() => getAdminClient(), [session?.serviceKey])

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
