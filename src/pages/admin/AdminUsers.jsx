import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Trash2, Pencil, AlertTriangle, CheckCircle2, Search, Plus, Shield } from 'lucide-react'
import AdminNav from '../../components/admin/AdminNav'
import AdminTableSkeleton from '../../components/admin/AdminTableSkeleton'
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
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState([])

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
    setSelectedIds((prev) => prev.filter((sid) => sid !== id))
    await logAudit(client, 'user.delete', username)
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return
    // Filter out self from selected
    const idsToDelete = selectedIds.filter((id) => id !== session?.id)
    if (idsToDelete.length === 0) {
      alert('You cannot delete your own account.')
      return
    }

    // Check if deleting would remove all admins
    const admins = users.filter((u) => u.role === 'admin')
    const adminIdsToDelete = admins.filter((u) => idsToDelete.includes(u.id))
    if (adminIdsToDelete.length >= admins.length) {
      alert('Cannot delete all admin users. At least one admin must remain.')
      return
    }

    if (!window.confirm(`Delete ${idsToDelete.length} selected user(s)? This cannot be undone.`)) return

    const { error: err } = await client.from('admin_users').delete().in('id', idsToDelete)
    if (err) {
      alert('Bulk delete failed: ' + err.message)
      return
    }
    setUsers((prev) => prev.filter((u) => !idsToDelete.includes(u.id)))
    setSelectedIds([])
    await logAudit(client, 'user.bulk_delete', `${idsToDelete.length} users`)
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

  const filtered = users.filter((u) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    )
  })

  const allSelected = filtered.length > 0 && filtered.every((u) => selectedIds.includes(u.id))

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filtered.some((u) => u.id === id)))
    } else {
      const newIds = filtered.map((u) => u.id)
      setSelectedIds((prev) => [...new Set([...prev, ...newIds])])
    }
  }

  function toggleSelect(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
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
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              New User
            </Link>
          )}
        </div>

        {/* Stats */}
        {!loading && (
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{users.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Active</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{users.filter((u) => u.is_active).length}</p>
            </div>
            {unlinked.length > 0 && (
              <div className="rounded-xl border border-amber-200/80 bg-amber-50 p-4 shadow-sm">
                <p className="text-sm font-medium text-amber-700">Unlinked</p>
                <p className="mt-1 text-2xl font-bold text-amber-600">{unlinked.length}</p>
              </div>
            )}
          </div>
        )}

        {/* Search bar */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, username, email, role..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
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
                {unlinked.map((u) => u.email || u.username).join(', ')} - no Supabase
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

        {/* Loading skeleton */}
        {loading && <AdminTableSkeleton rows={4} cols={5} />}

        {/* Empty state */}
        {!loading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <Shield className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No users found</h3>
            <p className="mt-1 text-sm text-slate-500">Create your first user to get started.</p>
            <Link
              to="/admin/users/new"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create User
            </Link>
          </div>
        )}

        {/* Bulk action bar */}
        {selectedIds.length > 0 && canDelete && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 shadow-sm">
            <span className="text-sm font-medium text-blue-800">
              {selectedIds.length} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="ml-auto text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="w-10 px-3 py-3.5">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="w-12 px-3 py-3.5 font-semibold text-slate-600">#</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">User</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Role</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Access</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Status</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Last login</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((user, index) => {
                    const perms = parsePermissions(user.permissions, user.role)
                    const isFull = perms.includes('*')
                    const preset = ROLE_PRESETS[user.role]
                    const isSelf = session?.id === user.id
                    const canLogIn = Boolean(user.auth_user_id)

                    return (
                      <tr key={user.id} className="transition hover:bg-slate-50/80">
                        <td className="w-10 px-3 py-3.5">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(user.id)}
                            onChange={() => toggleSelect(user.id)}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="w-12 px-3 py-3.5 text-slate-500 font-medium">{index + 1}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                              {(user.name || user.username || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
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
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              preset?.badge || 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {preset?.label || user.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500">
                          {isFull ? (
                            <span className="font-semibold text-purple-700">
                              Full access
                            </span>
                          ) : (
                            `${perms.length} permission${perms.length === 1 ? '' : 's'}`
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {!canLogIn ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                              <AlertTriangle className="h-3 w-3" />
                              No login
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                user.is_active
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500">
                          {user.last_login_at
                            ? new Date(user.last_login_at).toLocaleDateString()
                            : 'Never'}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {canEdit && (
                              <Link
                                to={`/admin/users/edit/${user.id}`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </Link>
                            )}
                            {canEdit && user.email && (
                              <button
                                onClick={() => handleSendReset(user)}
                                title="Email a password reset link"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                              >
                                <KeyRound className="h-3.5 w-3.5" />
                                Reset
                              </button>
                            )}
                            {canEdit && !isSelf && (
                              <button
                                onClick={() => handleToggleActive(user)}
                                className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
                              >
                                {user.is_active ? 'Disable' : 'Enable'}
                              </button>
                            )}
                            {canDelete && !isSelf && (
                              <button
                                onClick={() => handleDelete(user.id, user.username)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
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
          </div>
        )}

        {/* No results from search */}
        {!loading && users.length > 0 && filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500">No users match your search.</div>
        )}
      </div>
    </div>
  )
}
