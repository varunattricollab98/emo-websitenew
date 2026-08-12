import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateServiceKey } from '../../lib/supabaseAdmin'

export default function AdminLogin() {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!key.trim()) {
      setError('Please enter the admin key.')
      return
    }

    setLoading(true)
    setError('')

    const valid = await validateServiceKey(key.trim())
    if (valid) {
      sessionStorage.setItem('admin_service_key', key.trim())
      navigate('/admin/blog')
    } else {
      setError('Invalid key. Please check and try again.')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Admin Access</h1>
        <p className="mb-6 text-sm text-slate-500">
          Enter your Supabase service_role key to manage blog posts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-key" className="mb-1 block text-sm font-medium text-slate-700">
              Admin Key
            </label>
            <input
              id="admin-key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
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
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
