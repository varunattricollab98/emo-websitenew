import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateServiceKey } from '../../lib/supabaseAdmin'

const VALID_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin'
const VALID_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'emo@2026'
const ENV_SERVICE_KEY = import.meta.env.VITE_ADMIN_SERVICE_KEY || ''

export default function AdminLogin() {
  const [step, setStep] = useState('credentials') // 'credentials' | 'serviceKey'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [serviceKey, setServiceKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleCredentials(e) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    if (username.trim() !== VALID_USERNAME || password.trim() !== VALID_PASSWORD) {
      setError('Invalid username or password.')
      return
    }

    // Credentials are valid. Check if we have the service key from env.
    if (ENV_SERVICE_KEY) {
      setLoading(true)
      const valid = await validateServiceKey(ENV_SERVICE_KEY)
      if (valid) {
        sessionStorage.setItem('admin_service_key', ENV_SERVICE_KEY)
        navigate('/admin/blog')
      } else {
        // Key from env is invalid, fall back to manual entry
        setError('')
        setStep('serviceKey')
      }
      setLoading(false)
    } else {
      // No env key, prompt for it
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
      sessionStorage.setItem('admin_service_key', serviceKey.trim())
      navigate('/admin/blog')
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
