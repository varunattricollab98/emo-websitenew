import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle, User } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

/**
 * Logged-out password reset request.
 *
 * The anon client can only INSERT into password_reset_requests (enforced by
 * RLS) — it cannot read admin_users or discover which usernames exist. An
 * administrator then sees the request in Admin → Users and either sets a
 * temporary password or generates a reset link to share.
 */
export default function AdminForgotPassword() {
  const [identifier, setIdentifier] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const value = identifier.trim()
    if (!value) {
      setError('Please enter your username or email.')
      return
    }

    setStatus('sending')
    setError('')

    if (!isSupabaseConfigured || !supabase) {
      setStatus('error')
      setError('Password reset is not available right now. Contact your administrator.')
      return
    }

    try {
      const { error: err } = await supabase
        .from('password_reset_requests')
        .insert({ identifier: value })

      if (err) {
        setStatus('error')
        setError(
          'Could not submit your request. Please contact your administrator directly.'
        )
        return
      }
      setStatus('sent')
    } catch {
      setStatus('error')
      setError(
        'Could not submit your request. Please contact your administrator directly.'
      )
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {status === 'sent' ? (
          <div className="text-center">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-xl font-bold text-slate-900">Request submitted</h1>
            <p className="mt-2 text-sm text-slate-500">
              An administrator has been notified. They will share a reset link or a
              temporary password with you shortly.
            </p>
            <Link
              to="/admin"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white">
                <KeyRound className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Forgot password</h1>
                <p className="text-xs text-slate-500">
                  We&apos;ll notify an administrator
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="identifier"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Username or email
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. kishan or kishan@easemyoffice.in"
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                disabled={status === 'sending'}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {status === 'sending' ? 'Submitting…' : 'Request password reset'}
              </button>

              <Link
                to="/admin"
                className="flex items-center justify-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
