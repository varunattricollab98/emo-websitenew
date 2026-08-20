import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react'
import { adminAuth, adminSignOut } from '../../lib/supabaseAdmin'
import { clearSession } from '../../lib/adminSession'
import { validatePasswordStrength } from '../../lib/adminPassword'

/**
 * Completes a Supabase Auth password recovery.
 *
 * Supabase redirects here from the emailed link. The client is configured with
 * `detectSessionInUrl: true`, so it exchanges the code/token in the URL for a
 * short-lived recovery session automatically — we just wait for that session to
 * appear, then call updateUser().
 */
export default function AdminResetPassword() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('checking') // checking | ready | invalid | saving | done
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    let settled = false

    function accept(session) {
      if (cancelled || settled) return
      settled = true
      setEmail(session.user?.email || '')
      setPhase('ready')
    }

    // The recovery session may already be established, or may arrive moments
    // later once detectSessionInUrl finishes the exchange — handle both.
    const { data: sub } = adminAuth.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN')) {
        accept(session)
      }
    })

    adminAuth.auth.getSession().then(({ data }) => {
      if (data?.session) accept(data.session)
    })

    // If nothing has arrived after a moment, the link is bad or expired.
    const timer = setTimeout(() => {
      if (!cancelled && !settled) {
        settled = true
        setPhase('invalid')
      }
    }, 3500)

    return () => {
      cancelled = true
      clearTimeout(timer)
      sub?.subscription?.unsubscribe()
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const strengthError = validatePasswordStrength(password)
    if (strengthError) {
      setError(strengthError)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setPhase('saving')
    const { error: err } = await adminAuth.auth.updateUser({ password })

    if (err) {
      setPhase('ready')
      setError(
        /same as the old|should be different/i.test(err.message || '')
          ? 'Please choose a password you have not used before.'
          : err.message || 'Could not update the password. Try the link again.'
      )
      return
    }

    // Force a fresh sign-in with the new password.
    await adminSignOut()
    clearSession()
    setPhase('done')
    setTimeout(() => navigate('/admin?reset=1'), 1800)
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {phase === 'checking' && (
          <div className="flex flex-col items-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
            <p className="mt-4 text-sm text-slate-500">Verifying your link…</p>
          </div>
        )}

        {phase === 'invalid' && (
          <div className="text-center">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertCircle className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-xl font-bold text-slate-900">
              This link is invalid or has expired
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Reset links can only be used once and expire after an hour.
            </p>
            <Link
              to="/admin/forgot-password"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Request a new link
            </Link>
            <Link
              to="/admin"
              className="mt-3 flex items-center justify-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        )}

        {phase === 'done' && (
          <div className="text-center">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-xl font-bold text-slate-900">Password updated</h1>
            <p className="mt-2 text-sm text-slate-500">
              Taking you to the login page…
            </p>
          </div>
        )}

        {(phase === 'ready' || phase === 'saving') && (
          <>
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Set a new password
                </h1>
                {email && (
                  <p className="text-xs text-slate-500">
                    for <span className="font-semibold">{email}</span>
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  New password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className={inputClass}
                    autoFocus
                    autoComplete="new-password"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Minimum 8 characters, with at least one letter and one number.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter the password"
                    className={inputClass}
                    autoComplete="new-password"
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
                disabled={phase === 'saving'}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {phase === 'saving' ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
