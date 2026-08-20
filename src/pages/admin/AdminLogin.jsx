import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react'
import { adminAuth, fetchAdminProfile, adminSignOut } from '../../lib/supabaseAdmin'
import { setCachedProfile, clearSession } from '../../lib/adminSession'
import { PERMISSION_SECTIONS, hasPermission } from '../../lib/permissions'

/**
 * Admin sign-in via Supabase Auth.
 *
 * The old two-step flow (credentials → paste service_role key) is gone:
 * Supabase now refuses elevated keys in the browser, and the panel's authority
 * comes from the signed-in user's JWT + RLS policies instead.
 */
export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('expired')) {
      setNotice('Your session timed out. Please sign in again.')
    } else if (searchParams.get('reset')) {
      setNotice('Password updated. Sign in with your new password.')
    } else if (searchParams.get('notadmin')) {
      setError(
        'That account is not set up for admin access. Ask an administrator to add you.'
      )
    }
  }, [searchParams])

  /** Already signed in? Skip straight through. */
  useEffect(() => {
    let cancelled = false
    async function check() {
      const { data } = await adminAuth.auth.getSession()
      if (cancelled || !data?.session) return
      const profile = await fetchAdminProfile()
      if (cancelled) return
      if (profile) {
        setCachedProfile(profile)
        navigate(landingRoute(profile), { replace: true })
      }
    }
    check()
    return () => {
      cancelled = true
    }
  }, [navigate])

  /** First section this user is allowed to open. */
  function landingRoute(profile) {
    const perms = Array.isArray(profile.permissions) ? profile.permissions : []
    const section = PERMISSION_SECTIONS.find((s) =>
      hasPermission(perms, `${s.key}.view`)
    )
    return section?.path || '/admin/blog'
  }

  function friendlyError(message = '') {
    const msg = message.toLowerCase()
    if (msg.includes('invalid login credentials')) {
      return 'Invalid email or password.'
    }
    if (msg.includes('email not confirmed')) {
      return 'This email has not been confirmed yet. Check your inbox for the confirmation link, or ask an administrator to confirm it for you.'
    }
    if (msg.includes('rate limit') || msg.includes('too many')) {
      return 'Too many attempts. Please wait a minute and try again.'
    }
    return message || 'Could not sign in. Please try again.'
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')

    if (!email.trim() || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)

    // 1. Authenticate with Supabase Auth
    const { data, error: authError } = await adminAuth.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError || !data?.session) {
      setLoading(false)
      setError(friendlyError(authError?.message))
      return
    }

    // 2. Confirm they have an active admin profile
    const profile = await fetchAdminProfile()
    if (!profile) {
      await adminSignOut()
      clearSession()
      setLoading(false)
      setError(
        'Signed in, but this account has no active admin profile. Ask an administrator to grant you access.'
      )
      return
    }

    // 3. Honour the global login switch.
    //    Checked *after* sign-in because RLS only lets admins read settings.
    //    Full administrators can always get in, so the switch can never lock
    //    every last admin out of their own panel.
    let timeoutMinutes
    try {
      const { data: settings } = await adminAuth
        .from('admin_settings')
        .select('login_enabled, maintenance_note, session_timeout_minutes')
        .eq('id', 1)
        .maybeSingle()

      timeoutMinutes = settings?.session_timeout_minutes

      if (settings && settings.login_enabled === false && profile.role !== 'admin') {
        await adminSignOut()
        clearSession()
        setLoading(false)
        setError(
          settings.maintenance_note ||
            'Admin login is currently disabled. Contact your administrator.'
        )
        return
      }
    } catch {
      /* settings table missing → fall through with defaults */
    }

    // 4. Cache the profile for synchronous UI permission checks
    setCachedProfile(profile, timeoutMinutes)
    setLoading(false)
    navigate(landingRoute(profile))
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Access</h1>
              <p className="text-xs text-slate-500">EaseMyOffice control panel</p>
            </div>
          </div>

          {notice && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-blue-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
              <span>{notice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@easemyoffice.in"
                  className={inputClass}
                  autoFocus
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={inputClass}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <Link
              to="/admin/forgot-password"
              className="block text-center text-sm text-blue-600 transition hover:text-blue-700"
            >
              Forgot your password?
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
