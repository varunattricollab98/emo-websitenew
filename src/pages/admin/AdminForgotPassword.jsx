import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle, Mail } from 'lucide-react'
import { adminAuth } from '../../lib/supabaseAdmin'

/**
 * Password reset request — now handled entirely by Supabase Auth, which emails
 * a real recovery link. (The old flow stored a token ourselves and required an
 * admin to copy the link out of the panel and share it manually.)
 */
export default function AdminForgotPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setError('Please enter your email address.')
      return
    }

    setStatus('sending')
    setError('')

    const { error: err } = await adminAuth.auth.resetPasswordForEmail(value, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })

    // Deliberately show the same confirmation either way, so this page cannot
    // be used to discover which email addresses have accounts.
    if (err && /rate limit|too many/i.test(err.message || '')) {
      setStatus('idle')
      setError('Too many requests. Please wait a minute and try again.')
      return
    }

    setStatus('sent')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {status === 'sent' ? (
          <div className="text-center">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-xl font-bold text-slate-900">Check your email</h1>
            <p className="mt-2 text-sm text-slate-500">
              If an account exists for <strong>{email.trim()}</strong>, we&apos;ve sent
              a password reset link. It expires in one hour.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Not in your inbox? Check spam, or ask an administrator to reset it
              for you.
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
                  We&apos;ll email you a reset link
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="reset-email"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@easemyoffice.in"
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    autoFocus
                    autoComplete="username"
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
                {status === 'sending' ? 'Sending…' : 'Send reset link'}
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
