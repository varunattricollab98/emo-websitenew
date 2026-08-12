import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'

export default function AdminUserEditor() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    role: 'editor',
    is_active: true,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const adminClient = getAdminClient()
  const role = sessionStorage.getItem('admin_role')

  useEffect(() => {
    // Role-based access: only admins can manage users
    if (role !== 'admin') {
      navigate('/admin/blog')
      return
    }
    if (!adminClient) {
      navigate('/admin')
      return
    }
    if (isEdit) {
      fetchUser()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchUser() {
    setLoading(true)
    const { data, error: err } = await adminClient
      .from('admin_users')
      .select('id, username, name, role, is_active')
      .eq('id', id)
      .limit(1)
      .single()

    if (err) {
      setError('Failed to load user: ' + err.message)
    } else if (data) {
      setForm({
        username: data.username || '',
        password: '', // Don't load existing password
        name: data.name || '',
        role: data.role || 'editor',
        is_active: data.is_active ?? true,
      })
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.username.trim()) {
      setError('Username is required.')
      return
    }
    if (!isEdit && !form.password.trim()) {
      setError('Password is required for new users.')
      return
    }

    setSaving(true)

    const payload = {
      username: form.username.trim(),
      name: form.name.trim() || null,
      role: form.role,
      is_active: form.is_active,
    }

    // Only include password if provided
    if (form.password.trim()) {
      payload.password = form.password.trim()
    }

    let result
    if (isEdit) {
      result = await adminClient
        .from('admin_users')
        .update(payload)
        .eq('id', id)
    } else {
      // Password is required for new users
      payload.password = form.password.trim()
      result = await adminClient
        .from('admin_users')
        .insert(payload)
    }

    if (result.error) {
      setError('Save failed: ' + result.error.message)
    } else {
      navigate('/admin/users')
    }
    setSaving(false)
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_service_key')
    sessionStorage.removeItem('admin_role')
    sessionStorage.removeItem('admin_name')
    sessionStorage.removeItem('admin_username')
    navigate('/admin')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <span className="text-slate-500">Loading...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'Edit User' : 'New User'}
          </h1>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/users"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Back to Users
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
          <div>
            <label htmlFor="user-username" className="mb-1 block text-sm font-medium text-slate-700">
              Username *
            </label>
            <input
              id="user-username"
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter username"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label htmlFor="user-password" className="mb-1 block text-sm font-medium text-slate-700">
              Password {isEdit ? '(leave blank to keep current)' : '*'}
            </label>
            <input
              id="user-password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter password'}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              autoComplete={isEdit ? 'new-password' : 'new-password'}
              required={!isEdit}
            />
          </div>

          <div>
            <label htmlFor="user-name" className="mb-1 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="user-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Display name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label htmlFor="user-role" className="mb-1 block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              id="user-role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="user-active"
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="user-active" className="text-sm font-medium text-slate-700">
              Active
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
            </button>
            <Link
              to="/admin/users"
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
