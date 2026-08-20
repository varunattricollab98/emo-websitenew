import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Trash2, Pencil, AlertTriangle, CheckCircle2 } from 'lucide-react'
import AdminNav from '../../components/admin/AdminNav'
import { useAdminSession } from '../../components/admin/useAdminSession'
import { sendPasswordReset } from '../../lib/supabaseAdmin'
import { ROLE_PRESETS, parsePermissions } from '../../lib/permissions'
import { logAudit } from '../../lib/adminSession'

export default function AdminUsers() {
  const { client, session, can } = useAdminSession()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState('')

  const fetchUsers = useCallback(async () => {
    if (!client) return
    setLoading(true)

    const { data, error: err } = await client
      .from('admin_users')
      .select(
        'id, username, email, name, role, permissions, is_active, created_at, last_login_at, auth_user_id'
      )
      .order('created_at', { ascending: true })

    if (err) setError(err.message)
    else setUsers(data || [])
    setLoading(false)
  }, [client])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  function showFlash(msg) {
    setFlash(msg)
    setTimeout(() => setFlash(''), 5000)
  }

  async function handleSendReset(user) {
    if (!user.email) {
      alert('This user has no email address, so a reset link cannot be sent.')
      return
    }
    const res = await sendPasswordReset(user.email)
    if (!res.ok) {
      alert('Could not send reset email: ' + res.error)
      return
    }
    showFlash(`Password reset link emailed to ${user.email}.`)
    await logAudit(client, 'user.reset_email', user.email)
  }

  async function handleDelete(id, username) {
    if (session?.id === id) {
      alert('You cannot delete your own account.')
      return
    }

    const admins = users.filter((u) => u.role === 'admin')
    const target = users.find((u) => u.id === id)
    if (target?.role === 'admin' && admins.length <= 1) {
      alert('Cannot delete the last admin user. At least one admin must remain.')
      return
    }

    if (
      !window.confirm(
        `Delete "${username}"?\n\nThis removes their admin access immediately. Their Supabase Auth login is not deleted — remove it in Authentication → Users if you want it gone too.`
      )
    )
      return

    const { error: err } = await client.from('admin_users').delete().eq('id', id)
    if (err) {
      alert('Delete failed: ' + err.message)
      return
    }
    setUsers((prev) => prev.filter((u) => u.id !== id))
    await logAudit(client, 'user.delete', username)
  }

  async function handleToggleActive(user) {
    if (session?.id === user.id && user.is_active) {
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

  const canEdit = can('users.edit')
  const canDelete = can('users.delete')
  const unlinked = users.filter((u) => !u.auth_user_id)

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

        {flash && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" />
            <span>{flash}</span>
          </div>
        )}

        {unlinked.length > 0 && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
            <div>
              <p className="font-semibold">
                {unlinked.length} account{unlinked.length === 1 ? '' : 's'} cannot sign
                in yet
              </p>
              <p className="mt-1 text-xs">
                {unlinked.map((u) => u.email || u.username).join(', ')} — no Supabase
                Auth login exists for {unlinked.length === 1 ? 'this email' : 'these emails'}.
                Create {unlinked.length === 1 ? 'it' : 'them'} in{' '}
                <strong>Supabase → Authentication → Users → Add user</strong> using the
                same email, and the link happens automatically.
              </p>
            </div>
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
                  const isSelf = session?.id === user.id
                  const canLogIn = Boolean(user.auth_user_id)

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-900">
                          {user.name || user.username}
                        </span>
                        {isSelf && (
                          <span className="ml-2 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-blue-600">
                            You
                          </span>
                        )}
                        <span className="block text-xs text-slate-500">
                          {user.email || (
                            <span className="text-amber-600">no email set</span>
                          )}
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
                        {!canLogIn ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            <AlertTriangle className="h-3 w-3" />
                            No login
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
                          {canEdit && user.email && (
                            <button
                              onClick={() => handleSendReset(user)}
                              title="Email a password reset link"
                              className="inline-flex items-center gap-1 rounded bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                            >
                              <KeyRound className="h-3 w-3" />
                              Email reset
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
