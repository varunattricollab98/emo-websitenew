import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'
import AdminNav from '../../components/admin/AdminNav'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const adminClient = getAdminClient()
  const role = sessionStorage.getItem('admin_role')

  useEffect(() => {
    // Role-based access: only admins can view users
    if (role !== 'admin') {
      navigate('/admin/blog')
      return
    }
    if (!adminClient) {
      navigate('/admin')
      return
    }
    fetchUsers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchUsers() {
    setLoading(true)
    const { data, error: err } = await adminClient
      .from('admin_users')
      .select('id, username, name, role, is_active, created_at')
      .order('created_at', { ascending: true })

    if (err) {
      setError(err.message)
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  async function handleDelete(id, username) {
    // Prevent self-deletion: compare against logged-in username
    const currentUsername = sessionStorage.getItem('admin_username')
    if (currentUsername && username === currentUsername) {
      alert('You cannot delete your own account.')
      return
    }

    // Prevent deletion if only 1 admin user remains
    const adminUsers = users.filter((u) => u.role === 'admin')
    const targetUser = users.find((u) => u.id === id)
    if (targetUser?.role === 'admin' && adminUsers.length <= 1) {
      alert('Cannot delete the last admin user. At least one admin must remain.')
      return
    }

    if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return

    const { error: err } = await adminClient
      .from('admin_users')
      .delete()
      .eq('id', id)

    if (err) {
      alert('Delete failed: ' + err.message)
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <AdminNav />

        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <Link
            to="/admin/users/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + New User
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-12 text-center text-slate-500">Loading users...</div>
        )}

        {/* Empty state */}
        {!loading && users.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No users found.{' '}
            <Link to="/admin/users/new" className="text-blue-600 underline">
              Create your first user
            </Link>
          </div>
        )}

        {/* Users Table */}
        {!loading && users.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Username</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Role</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">{user.username}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{user.name || '-'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/users/edit/${user.id}`}
                          className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          className="rounded bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
