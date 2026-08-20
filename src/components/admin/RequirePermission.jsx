import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { useAdminSession } from './useAdminSession'
import { PERMISSION_SECTIONS } from '../../lib/permissions'

/**
 * Wraps an admin page so it only renders when the signed-in user holds the
 * required permission. Replaces the ad-hoc `useEffect` + `navigate()` checks
 * that were duplicated across the admin pages.
 *
 * Usage:
 *   <RequirePermission permission="blog.view">
 *     <AdminBlog />
 *   </RequirePermission>
 *
 * Pass `anyOf={['blog.view','articles.view']}` to allow either.
 */
export default function RequirePermission({ permission, anyOf, children }) {
  const navigate = useNavigate()
  const { session, can, canAny, ready } = useAdminSession()

  // Not logged in → bounce to login before anything renders.
  useEffect(() => {
    if (ready && !session) navigate('/admin', { replace: true })
  }, [ready, session, navigate])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      </div>
    )
  }

  if (!session) return null

  const allowed = anyOf ? canAny(anyOf) : can(permission)
  if (allowed) return children

  // Logged in but lacks the permission — show a clear message plus a link to
  // the first section they *can* reach, so they're never stranded.
  const firstAllowed = PERMISSION_SECTIONS.find((s) => can(`${s.key}.view`))

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-slate-900">
          You don&apos;t have access to this section
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Your account ({session.role}) is missing the{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-700">
            {anyOf ? anyOf.join(' or ') : permission}
          </code>{' '}
          permission. Ask an administrator to grant it.
        </p>

        {firstAllowed ? (
          <Link
            to={firstAllowed.path}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to {firstAllowed.label}
          </Link>
        ) : (
          <p className="mt-6 text-sm text-slate-400">
            No sections are available to your account yet.
          </p>
        )}
      </div>
    </div>
  )
}
