import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { Lock, User, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react'
import { validateServiceKey } from '../../lib/supabaseAdmin'
import { verifyPassword, createPasswordFields } from '../../lib/adminPassword'
import { saveSession } from '../../lib/adminSession'
import { parsePermissions, permissionsForRole } from '../../lib/permissions'

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://oijtkvkyefqfwuycibcv.supabase.co'

// Bootstrap credentials — only used when the admin_users table does not exist
// yet (i.e. before the migration has been run). Once the table is created this
// path is dead.
const BOOTSTRAP_USERNAME = 'admin'
const BOOTSTRAP_PASSWORD = 'emo@2026'
const ENV_SERVICE_KEY = import.meta.env.VITE_ADMIN_SERVICE_KEY || ''

const DEFAULT_SETTINGS = {
  login_enabled: true,
  allow_password_reset: true,
  session_timeout_minutes: 480,
  max_failed_attempts: 5,
  lockout_minutes: 15,
}

function makeClient(key) {
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } })
}

function isMissingTable(err) {
  if (!err) return false
  const msg = err.message || String(err)
  return (
    err.code === '42P01' ||
    msg.includes('relation') ||
    msg.includes('does not exist')
  )
}

export default function AdminLogin() {
  const [step, setStep] = useState('credentials') // 'credentials' | 'serviceKey'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [serviceKey, setServiceKey] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [allowReset, setAllowReset] = useState(true)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('expired')) {
      setNotice('Your session timed out. Please sign in again.')
    }
    if (searchParams.get('reset')) {
      setNotice('Password updated. Sign in with your new password.')
    }
  }, [searchParams])

  /** Load global settings; falls back to defaults if the table is absent. */
  async function loadSettings(client) {
    try {
      const { data, error: err } = await client
        .from('admin_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle()
      if (err || !data) return DEFAULT_SETTINGS
      return { ...DEFAULT_SETTINGS, ...data }
    } catch {
      return DEFAULT_SETTINGS
    }
  }

  /**
   * Full authentication against admin_users, honouring lockout + settings.
   */
  async function authenticate(key) {
    const client = makeClient(key)
    const settings = await loadSettings(client)

    if (!settings.login_enabled) {
      return {
        success: false,
        error:
          settings.maintenance_note ||
          'Admin login is currently disabled. Contact your administrator.',
      }
    }
    setAllowReset(settings.allow_password_reset !== false)

    const uname = username.trim()

    let data, err
    try {
      const res = await client
        .from('admin_users')
        .select(
          'id, username, password, password_salt, name, role, permissions, is_active, failed_attempts, locked_until'
        )
        .eq('username', uname)
        .limit(1)
      data = res.data
      err = res.error
    } catch (caught) {
      err = caught
    }

    // Table not created yet → bootstrap path
    if (isMissingTable(err)) {
      if (uname === BOOTSTRAP_USERNAME && password.trim() === BOOTSTRAP_PASSWORD) {
        return {
          success: true,
          user: {
            id: '',
            role: 'admin',
            name: 'Administrator',
            permissions: ['*'],
          },
          settings,
        }
      }
      return { success: false, error: 'Invalid username or password.' }
    }

    if (err) {
      return {
        success: false,
        error: 'Could not reach the database. Check your connection and try again.',
      }
    }

    const user = data?.[0]
    // Same message whether the user is missing or the password is wrong, so we
    // don't leak which usernames exist.
    if (!user) return { success: false, error: 'Invalid username or password.' }

    if (!user.is_active) {
      return {
        success: false,
        error: 'This account has been deactivated. Contact your administrator.',
      }
    }

    // Locked out?
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const mins = Math.ceil(
        (new Date(user.locked_until) - new Date()) / 60000
      )
      return {
        success: false,
        error: `Too many failed attempts. Try again in ${mins} minute${mins === 1 ? '' : 's'}.`,
      }
    }

    const { ok, needsUpgrade } = await verifyPassword(
      password,
      user.password,
      user.password_salt
    )

    if (!ok) {
      // Count the failure and lock the account if we've hit the threshold.
      const attempts = (user.failed_attempts || 0) + 1
      const patch = { failed_attempts: attempts }
      let lockMsg = ''
      if (attempts >= settings.max_failed_attempts) {
        patch.locked_until = new Date(
          Date.now() + settings.lockout_minutes * 60000
        ).toISOString()
        patch.failed_attempts = 0
        lockMsg = ` Account locked for ${settings.lockout_minutes} minutes.`
      }
      try {
        await client.from('admin_users').update(patch).eq('id', user.id)
      } catch {
        /* non-fatal */
      }
      const left = settings.max_failed_attempts - attempts
      return {
        success: false,
        error:
          `Invalid username or password.${lockMsg}` +
          (!lockMsg && left > 0 && left <= 2
            ? ` ${left} attempt${left === 1 ? '' : 's'} remaining.`
            : ''),
      }
    }

    // Success — clear counters, stamp the login, and silently upgrade a legacy
    // plaintext password to a PBKDF2 hash.
    const patch = {
      failed_attempts: 0,
      locked_until: null,
      last_login_at: new Date().toISOString(),
    }
    if (needsUpgrade) {
      try {
        Object.assign(patch, await createPasswordFields(password.trim()))
      } catch {
        /* keep the plaintext row rather than failing the login */
      }
    }
    try {
      await client.from('admin_users').update(patch).eq('id', user.id)
    } catch {
      /* non-fatal */
    }

    const permissions = parsePermissions(user.permissions, user.role)
    return {
      success: true,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        permissions: permissions.length ? permissions : permissionsForRole(user.role),
      },
      settings,
    }
  }

  /** Shared success path for both steps. */
  function completeLogin(key, result) {
    saveSession({
      serviceKey: key,
      role: result.user.role,
      permissions: result.user.permissions,
      name: result.user.name,
      username: username.trim(),
      userId: result.user.id,
      timeoutMinutes: result.settings?.session_timeout_minutes,
    })
    // Land on the first section this user can actually see.
    const canLeads =
      result.user.permissions.includes('*') ||
      result.user.permissions.some((p) => p.startsWith('leads.'))
    navigate(canLeads ? '/admin/leads' : '/admin/blog')
  }

  async function handleCredentials(e) {
    e.preventDefault()
    setError('')
    setNotice('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    if (!ENV_SERVICE_KEY) {
      // No key baked in — we need one before we can query the users table.
      setStep('serviceKey')
      return
    }

    setLoading(true)
    const { valid } = await validateServiceKey(ENV_SERVICE_KEY)
    if (!valid) {
      setLoading(false)
      setStep('serviceKey')
      return
    }

    const result = await authenticate(ENV_SERVICE_KEY)
    setLoading(false)
    if (result.success) completeLogin(ENV_SERVICE_KEY, result)
    else setError(result.error)
  }

  async function handleServiceKey(e) {
    e.preventDefault()
    const key = serviceKey.trim()
    if (!key) {
      setError('Please enter the Supabase service key.')
      return
    }

    setLoading(true)
    setError('')

    const { valid, reason } = await validateServiceKey(key)
    if (!valid) {
      setLoading(false)
      setError(reason || 'Invalid service key. Please check and try again.')
      return
    }

    const result = await authenticate(key)
    setLoading(false)
    if (result.success) completeLogin(key, result)
    else setError(result.error)
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

          {step === 'credentials' && (
            <form onSubmit={handleCredentials} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-username"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Username
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="admin-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
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

              {allowReset && (
                <Link
                  to="/admin/forgot-password"
                  className="block text-center text-sm text-blue-600 transition hover:text-blue-700"
                >
                  Forgot your password?
                </Link>
              )}
            </form>
          )}

          {step === 'serviceKey' && (
            <form onSubmit={handleServiceKey} className="space-y-4">
              <p className="text-sm text-slate-500">
                Enter your Supabase <code className="text-xs">service_role</code>{' '}
                key to unlock database access. Required once per session.
              </p>
              <div>
                <label
                  htmlFor="service-key"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Supabase Service Key
                </label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="service-key"
                    type="password"
                    value={serviceKey}
                    onChange={(e) => setServiceKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIs…"
                    className={inputClass}
                    autoFocus
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
                {loading ? 'Verifying…' : 'Continue'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('credentials')
                  setError('')
                }}
                className="w-full text-center text-sm text-slate-500 transition hover:text-slate-700"
              >
                &larr; Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
