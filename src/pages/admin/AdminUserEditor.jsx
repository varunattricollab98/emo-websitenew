import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Info, ShieldCheck } from 'lucide-react'
import { useAdminSession } from '../../components/admin/useAdminSession'
import {
  PERMISSION_SECTIONS,
  ACTION_LABELS,
  ROLE_PRESETS,
  ROLE_KEYS,
  permissionsForRole,
  parsePermissions,
} from '../../lib/permissions'
import { createPasswordFields, validatePasswordStrength } from '../../lib/adminPassword'
import { logAudit } from '../../lib/adminSession'

export default function AdminUserEditor() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { client, session, logout } = useAdminSession()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    role: 'editor',
    is_active: true,
  })
  const [permissions, setPermissions] = useState(() => permissionsForRole('editor'))
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!client || !isEdit) return

    let cancelled = false
    async function fetchUser() {
      setLoading(true)
      const { data, error: err } = await client
        .from('admin_users')
        .select('id, username, email, name, role, permissions, is_active')
        .eq('id', id)
        .limit(1)
        .single()

      if (cancelled) return
      if (err) {
        setError('Failed to load user: ' + err.message)
      } else if (data) {
        setForm({
          username: data.username || '',
          email: data.email || '',
          password: '', // never load the stored hash
          name: data.name || '',
          role: data.role || 'editor',
          is_active: data.is_active ?? true,
        })
        setPermissions(parsePermissions(data.permissions, data.role))
      }
      setLoading(false)
    }
    fetchUser()
    return () => {
      cancelled = true
    }
  }, [client, id, isEdit])

  const isFullAccess = permissions.includes('*')
  const editingSelf = isEdit && session?.username === form.username

  /** Switching role replaces the checkbox selection with that role's preset. */
  function handleRoleChange(role) {
    setForm((f) => ({ ...f, role }))
    setPermissions(permissionsForRole(role))
  }

  function togglePermission(key) {
    setPermissions((prev) => {
      // Leaving full-access mode: expand "*" into the role's concrete list first
      if (prev.includes('*')) {
        const expanded = permissionsForRole(form.role).filter((p) => p !== '*')
        return expanded.includes(key)
          ? expanded.filter((p) => p !== key)
          : [...expanded, key]
      }
      return prev.includes(key)
        ? prev.filter((p) => p !== key)
        : [...prev, key]
    })
  }

  function toggleSection(sectionKey, actions, allOn) {
    const keys = actions.map((a) => `${sectionKey}.${a}`)
    setPermissions((prev) => {
      const base = prev.includes('*')
        ? permissionsForRole(form.role).filter((p) => p !== '*')
        : prev
      return allOn
        ? base.filter((p) => !keys.includes(p))
        : [...new Set([...base, ...keys])]
    })
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
    if (form.password.trim()) {
      const strengthError = validatePasswordStrength(form.password.trim())
      if (strengthError) {
        setError(strengthError)
        return
      }
    }
    if (permissions.length === 0) {
      setError('Select at least one permission, or choose a role preset.')
      return
    }
    // Don't let an admin strip their own admin rights and lock themselves out.
    if (editingSelf && form.role !== 'admin' && session?.role === 'admin') {
      const confirmed = window.confirm(
        'You are removing your own administrator role. You may lose access to this section. Continue?'
      )
      if (!confirmed) return
    }

    setSaving(true)

    const payload = {
      username: form.username.trim(),
      email: form.email.trim() || null,
      name: form.name.trim() || null,
      role: form.role,
      is_active: form.is_active,
      permissions,
    }

    if (form.password.trim()) {
      try {
        Object.assign(payload, await createPasswordFields(form.password.trim()))
      } catch {
        setSaving(false)
        setError('Could not hash the password. Make sure you are on HTTPS.')
        return
      }
    }

    const result = isEdit
      ? await client.from('admin_users').update(payload).eq('id', id)
      : await client.from('admin_users').insert(payload)

    if (result.error) {
      const msg = result.error.message || ''
      setError(
        msg.includes('duplicate') || msg.includes('unique')
          ? 'That username or email is already taken.'
          : 'Save failed: ' + msg
      )
      setSaving(false)
      return
    }

    await logAudit(
      client,
      isEdit ? 'user.update' : 'user.create',
      `${payload.username} (${payload.role})`
    )
    navigate('/admin/users')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      </div>
    )
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* header */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to users
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{session?.name}</span>
            <button
              onClick={logout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>

        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          {isEdit ? 'Edit User' : 'New User'}
        </h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Account details ── */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
              Account details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. kishan"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Kishan Sharma"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputClass}
                  placeholder="name@easemyoffice.in"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Used to match password reset requests.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Password{' '}
                  {isEdit ? (
                    <span className="text-xs font-normal text-slate-400">
                      (leave blank to keep current)
                    </span>
                  ) : (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className={inputClass}
                  placeholder={isEdit ? '••••••••' : 'Min 8 chars, 1 letter, 1 number'}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">
                Account is active (can sign in)
              </span>
            </label>
          </div>

          {/* ── Role preset ── */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-500">
              Role
            </h2>
            <p className="mb-4 text-xs text-slate-400">
              Picking a role pre-selects a sensible set of permissions. You can
              then fine-tune them below.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {ROLE_KEYS.map((key) => {
                const preset = ROLE_PRESETS[key]
                const selected = form.role === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleRoleChange(key)}
                    className={`rounded-xl border p-4 text-left transition ${
                      selected
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${preset.badge}`}
                      >
                        {preset.label}
                      </span>
                      {selected && (
                        <ShieldCheck className="h-4 w-4 text-blue-600" />
                      )}
                    </span>
                    <span className="mt-2 block text-xs leading-relaxed text-slate-500">
                      {preset.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Granular permissions ── */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-500">
              Permissions
            </h2>
            <p className="mb-4 text-xs text-slate-400">
              Tick exactly what this user may do in each section.
            </p>

            {isFullAccess && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-purple-50 px-3 py-2.5 text-sm text-purple-800">
                <Info className="mt-0.5 h-4 w-4 flex-none" />
                <span>
                  This user has <strong>full access</strong> to everything,
                  including future sections. Untick a box below to switch to
                  granular permissions.
                </span>
              </div>
            )}

            <div className="space-y-3">
              {PERMISSION_SECTIONS.map((section) => {
                const keys = section.actions.map((a) => `${section.key}.${a}`)
                const allOn =
                  isFullAccess || keys.every((k) => permissions.includes(k))
                const someOn =
                  !allOn && keys.some((k) => permissions.includes(k))

                return (
                  <div
                    key={section.key}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {section.label}
                          {someOn && (
                            <span className="ml-2 text-xs font-normal text-amber-600">
                              partial
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400">
                          {section.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          toggleSection(section.key, section.actions, allOn)
                        }
                        className="flex-none rounded border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                      >
                        {allOn ? 'Clear all' : 'Select all'}
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3">
                      {section.actions.map((action) => {
                        const key = `${section.key}.${action}`
                        const checked = isFullAccess || permissions.includes(key)
                        return (
                          <label
                            key={key}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 transition hover:bg-slate-50"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermission(key)}
                              className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs font-medium text-slate-700">
                              {ACTION_LABELS[action] || action}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="mt-4 text-xs text-slate-400">
              {isFullAccess
                ? 'Full access (wildcard)'
                : `${permissions.length} permission${permissions.length === 1 ? '' : 's'} selected`}
            </p>
          </div>

          {/* actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create user'}
            </button>
            <Link
              to="/admin/users"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
