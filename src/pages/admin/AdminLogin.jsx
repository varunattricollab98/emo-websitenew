import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateServiceKey } from '../../lib/supabaseAdmin'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://oijtkvkyefqfwuycibcv.supabase.co'

const FALLBACK_USERNAME = 'admin'
const FALLBACK_PASSWORD = 'emo@2026'
const ENV_SERVICE_KEY = import.meta.env.VITE_ADMIN_SERVICE_KEY || ''

export default function AdminLogin() {
  const [step, setStep] = useState('credentials') // 'credentials' | 'serviceKey'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [serviceKey, setServiceKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function authenticateUser(key) {
    try {
      const client = createClient(SUPABASE_URL, key, {
        auth: { persistSession: false },
      })

      const { data, error: err } = await client
        .from('admin_users')
        .select('id, username, password, name, role, is_active')
        .eq('username', username.trim())
        .eq('is_active', true)
        .limit(1)

      // If table doesn't exist, fall back to hardcoded credentials
      if (err && (err.message.includes('relation') || err.code === '42P01' || err.message.includes('does not exist'))) {
        return fallbackAuth()
      }

      if (err) {
        return { success: false, error: 'Authentication failed.' }
      }

      if (!data || data.length === 0) {
        return { success: false, error: 'Invalid username or password.' }
      }

      const user = data[0]
      if (user.password !== password.trim()) {
        return { success: false, error: 'Invalid username or password.' }
      }

      return { success: true, role: user.role, name: user.name }
    } catch {
      // Network error or table doesn't exist - fall back
      return fallbackAuth()
    }
  }

  function fallbackAuth() {
    if (username.trim() === FALLBACK_USERNAME && password.trim() === FALLBACK_PASSWORD) {
      return { success: true, role: 'admin', name: 'Administrator' }
    }
    return { success: false, error: 'Invalid username or password.' }
  }

  async function handleCredentials(e) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    // If we have the service key from env, authenticate directly
    if (ENV_SERVICE_KEY) {
      setLoading(true)
      const valid = await validateServiceKey(ENV_SERVICE_KEY)
      if (valid) {
        const result = await authenticateUser(ENV_SERVICE_KEY)
        if (result.success) {
          sessionStorage.setItem('admin_service_key', ENV_SERVICE_KEY)
          sessionStorage.setItem('admin_role', result.role)
          sessionStorage.setItem('admin_name', result.name || '')
          navigate('/admin/blog')
        } else {
          setError(result.error)
        }
      } else {
        // Key from env is invalid, fall back to manual entry
        // But first check hardcoded credentials
        if (username.trim() === FALLBACK_USERNAME && password.trim() === FALLBACK_PASSWORD) {
          setStep('serviceKey')
        } else {
          setError('Invalid username or password.')
        }
      }
      setLoading(false)
    } else {
      // No env key, we need to prompt for service key
      // But we can't verify credentials without the key, so go to step 2
      setStep('serviceKey')
    }
  }

  async function handleServiceKey(e) {
    e.preventDefault()
    if (!serviceKey.trim()) {
      setError('Please enter the Supabase service key.')
      return
    }

    setLoading(true)
    setError('')

    const valid = await validateServiceKey(serviceKey.trim())
    if (valid) {
      // Now authenticate the user against admin_users table
      const result = await authenticateUser(serviceKey.trim())
      if (result.success) {
        sessionStorage.setItem('admin_service_key', serviceKey.trim())
        sessionStorage.setItem('admin_role', result.role)
        sessionStorage.setItem('admin_name', result.name || '')
        navigate('/admin/blog')
      } else {
        setError(result.error)
      }
    } else {
      setError('Invalid service key. Please check and try again.')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Admin Access</h1>

        {step === 'credentials' && (
          <>
            <p className="mb-6 text-sm text-slate-500">
              Sign in with your admin credentials to manage content.
            </p>

            <form onSubmit={handleCredentials} className="space-y-4">
              <div>
                <label htmlFor="admin-username" className="mb-1 block text-sm font-medium text-slate-700">
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  autoFocus
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-1 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </>
        )}

        {step === 'serviceKey' && (
          <>
            <p className="mb-6 text-sm text-slate-500">
              Enter your Supabase service_role key to enable database writes.
              This is required once per session.
            </p>

            <form onSubmit={handleServiceKey} className="space-y-4">
              <div>
                <label htmlFor="service-key" className="mb-1 block text-sm font-medium text-slate-700">
                  Supabase Service Key
                </label>
                <input
                  id="service-key"
                  type="password"
                  value={serviceKey}
                  onChange={(e) => setServiceKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIs..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Continue'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('credentials'); setError('') }}
                className="w-full text-center text-sm text-slate-500 transition hover:text-slate-700"
              >
                &larr; Back to login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
