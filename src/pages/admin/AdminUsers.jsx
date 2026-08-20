import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Copy, Check, Trash2, Pencil, Clock } from 'lucide-react'
import AdminNav from '../../components/admin/AdminNav'
import { useAdminSession } from '../../components/admin/useAdminSession'
import { ROLE_PRESETS, parsePermissions } from '../../lib/permissions'
import { generateResetToken } from '../../lib/adminPassword'
import { logAudit } from '../../lib/adminSession'

const RESET_LINK_VALID_HOURS = 24

export default function AdminUsers() {
  const { client, session, can } = useAdminSession()
  const [users, setUsers] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resetLink, setResetLink] = useState(null) // { username, url }
  const [copied, setCopied] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!client) return
    setLoading(true)

    const { data, error: err } = await client
      .from('admin_users')
      .select(
        'id, username, email, name, role, permissions, is_active, created_at, last_login_at, locked_until'
      )
      .order('created_at', { ascending: true })

    if (err) setError(err.message)
    else setUsers(data || [])

    // Pending password-reset requests (table may not exist on older DBs)
    try {
      const { data: reqs } = await client
        .from('password_reset_requests')
        .select('id, identifier, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      setRequests(reqs || [])
    } catch {
      setRequests([])
    }

    setLoading(false)
  }, [client])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  /** Generate a single-use reset link the admin can share manually. */
  async function handleGenerateReset(user) {
    const token = generateResetToken()
    const expires = new Date(
      Date.now() + RESET_LINK_VALID_HOURS * 3600 * 1000
    ).toISOString()

    const { error: err } = await client
      .from('admin_users')
      .update({ reset_token: token, reset_expires_at: expires })
      .eq('id', user.id)

    if (err) {
      alert('Could not create reset link: ' + err.message)
      return
    }

    const url = `${window.location.origin}/admin/reset-password?token=${token}`
    setResetLink({ username: user.username, url })
    setCopied(false)
    await logAudit(client, 'user.reset_link', `Generated for ${user.username}`)
  }

  async function handleResolveRequest(id) {
    await client
      .from('password_reset_requests')
      .update({
        status: 'handled',
        handled_by: session?.username || null,
        handled_at: new Date().toISOString(),
      })
      .eq('id', id)
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  async function handleDelete(id, username) {
    if (session?.username && username === session.username) {
      alert('You cannot delete your own account.')
      return
    }

    const admins = users.filter((u) => u.role === 'admin')
    const target = users.find((u) => u.id === id)
    if (target?.role === 'admin' && admins.length <= 1) {
      alert('Cannot delete the last admin user. At least one admin must remain.')
      return
    }

    if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return

    const { error: err } = await client.from('admin_users').delete().eq('id', id)
    if (err) {
      alert('Delete failed: ' + err.message)
      return
    }
    setUsers((prev) => prev.filter((u) => u.id !== id))
    await logAudit(client, 'user.delete', username)
  }

  async function handleToggleActive(user) {
    if (session?.username === user.username && user.is_active) {
      alert('You cannot deactivate your own account.')
      return
    }
    const { error: err } = await client
      .from('admin_users')
      .update({ is_active: !user.is_active })
      .eq('id', user.id)

    if (err) {
      alert('Update failed: ' + err.message)
      return
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, is_active: !u.is_active } : u))
    )
    await logAudit(
      client,
      user.is_active ? 'user.deactivate' : 'user.activate',
      user.username
    )
  }

  async function handleUnlock(user) {
    await client
      .from('admin_users')
      .update({ locked_until: null, failed_attempts: 0 })
      .eq('id', user.id)
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, locked_until: null } : u))
    )
    await logAudit(client, 'user.unlock', user.username)
  }

  const canEdit = can('users.edit')
  const canDelete = can('users.delete')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <AdminNav />

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users &amp; Access</h1>
            <p className="mt-1 text-sm text-slate-500">
              Create accounts and control exactly what each person can do.
            </p>
          </div>
          {can('users.create') && (
            <Link
              to="/admin/users/new"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + New User
            </Link>
          )}
        </div>

        {/* Reset link banner */}
        {resetLink && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-amber-900">
                  Reset link for {resetLink.username}
                </p>
                <p className="mt-1 text-xs text-amber-700">
                  Valid for {RESET_LINK_VALID_HOURS} hours, single use. Share it
                  directly with the user — it is not emailed automatically.
                </p>
                <code className="mt-2 block truncate rounded bg-white px-2 py-1.5 text-xs text-slate-600">
                  {resetLink.url}
                </code>
              </div>
              <div className="flex flex-none items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(resetLink.url)
                    setCopied(true)
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-700"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => setResetLink(null)}
                  className="rounded-lg border border-amber-300 px-3 py-2 text-xs text-amber-800 transition hover:bg-amber-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending reset requests */}
        {requests.length > 0 && (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="mb-2 text-sm font-semibold text-blue-900">
              {requests.length} pending password reset request
              {requests.length === 1 ? '' : 's'}
            </p>
            <ul className="space-y-2">
              {requests.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2"
                >
                  <span className="text-sm text-slate-700">
                    <span className="font-semibold">{r.identifier}</span>
                    <span className="ml-2 text-xs text-slate-400">
                      {new Date(r.created_at).toLocaleString()}
                    </span>
                  </span>
                  <button
                    onClick={() => handleResolveRequest(r.id)}
                    className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
                  >
                    Mark handled
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="py-12 text-center text-slate-500">Loading users…</div>
        )}

        {!loading && users.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No users found.{' '}
            <Link to="/admin/users/new" className="text-blue-600 underline">
              Create your first user
            </Link>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">User</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Role</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Access</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Last login</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const perms = parsePermissions(user.permissions, user.role)
                  const isFull = perms.includes('*')
                  const preset = ROLE_PRESETS[user.role]
                  const isLocked =
                    user.locked_until && new Date(user.locked_until) > new Date()
                  const isSelf = session?.username === user.username

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-900">
                          {user.username}
                        </span>
                        {isSelf && (
                          <span className="ml-2 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-blue-600">
                            You
                          </span>
                        )}
                        <span className="block text-xs text-slate-500">
                          {user.name || '—'}
                          {user.email ? ` · ${user.email}` : ''}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            preset?.badge || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {preset?.label || user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {isFull ? (
                          <span className="font-semibold text-purple-700">
                            Full access
                          </span>
                        ) : (
                          `${perms.length} permission${perms.length === 1 ? '' : 's'}`
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            <Clock className="h-3 w-3" />
                            Locked
                          </span>
                        ) : (
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              user.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {canEdit && (
                            <Link
                              to={`/admin/users/edit/${user.id}`}
                              className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
                            </Link>
                          )}
                          {canEdit && (
                            <button
                              onClick={() => handleGenerateReset(user)}
                              title="Generate a password reset link"
                              className="inline-flex items-center gap-1 rounded bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                            >
                              <KeyRound className="h-3 w-3" />
                              Reset
                            </button>
                          )}
                          {canEdit && isLocked && (
                            <button
                              onClick={() => handleUnlock(user)}
                              className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                            >
                              Unlock
                            </button>
                          )}
                          {canEdit && !isSelf && (
                            <button
                              onClick={() => handleToggleActive(user)}
                              className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
                            >
                              {user.is_active ? 'Disable' : 'Enable'}
                            </button>
                          )}
                          {canDelete && !isSelf && (
                            <button
                              onClick={() => handleDelete(user.id, user.username)}
                              className="inline-flex items-center gap-1 rounded bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
