import { useState, useEffect, useCallback } from 'react'
import { Lock, Unlock, Save, AlertTriangle, ScrollText } from 'lucide-react'
import AdminNav from '../../components/admin/AdminNav'
import { useAdminSession } from '../../components/admin/useAdminSession'
import { ROLE_KEYS, ROLE_PRESETS } from '../../lib/permissions'
import { logAudit } from '../../lib/adminSession'

const DEFAULTS = {
  login_enabled: true,
  allow_password_reset: true,
  session_timeout_minutes: 480,
  max_failed_attempts: 5,
  lockout_minutes: 15,
  default_role: 'viewer',
  maintenance_note: '',
}

export default function AdminSettings() {
  const { client, session, can } = useAdminSession()
  const [form, setForm] = useState(DEFAULTS)
  const [audit, setAudit] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [tableMissing, setTableMissing] = useState(false)

  const canEdit = can('settings.edit')

  const fetchSettings = useCallback(async () => {
    if (!client) return
    setLoading(true)

    const { data, error: err } = await client
      .from('admin_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    if (err) {
      const msg = err.message || ''
      if (msg.includes('relation') || err.code === '42P01' || msg.includes('does not exist')) {
        setTableMissing(true)
      } else {
        setError(err.message)
      }
    } else if (data) {
      setForm({ ...DEFAULTS, ...data, maintenance_note: data.maintenance_note || '' })
    }

    // Recent activity (optional table)
    try {
      const { data: logs } = await client
        .from('admin_audit_log')
        .select('id, username, action, detail, created_at')
        .order('created_at', { ascending: false })
        .limit(15)
      setAudit(logs || [])
    } catch {
      setAudit([])
    }

    setLoading(false)
  }, [client])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSaved(false)

    if (form.session_timeout_minutes < 5) {
      setError('Session timeout must be at least 5 minutes.')
      return
    }
    if (form.max_failed_attempts < 1) {
      setError('Max failed attempts must be at least 1.')
      return
    }

    setSaving(true)
    const payload = {
      id: 1,
      login_enabled: form.login_enabled,
      allow_password_reset: form.allow_password_reset,
      session_timeout_minutes: Number(form.session_timeout_minutes),
      max_failed_attempts: Number(form.max_failed_attempts),
      lockout_minutes: Number(form.lockout_minutes),
      default_role: form.default_role,
      maintenance_note: form.maintenance_note.trim() || null,
    }

    const { error: err } = await client
      .from('admin_settings')
      .upsert(payload, { onConflict: 'id' })

    if (err) {
      setError('Save failed: ' + err.message)
    } else {
      setSaved(true)
      await logAudit(
        client,
        'settings.update',
        `login_enabled=${payload.login_enabled}, timeout=${payload.session_timeout_minutes}m`
      )
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-400'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <AdminNav />
          <div className="py-12 text-center text-slate-500">Loading settings…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <AdminNav />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Control admin login access, lockout rules and session behaviour.
          </p>
        </div>

        {tableMissing && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
            <div>
              <p className="font-semibold">Settings table not found</p>
              <p className="mt-1 text-xs">
                Run{' '}
                <code className="rounded bg-white px-1.5 py-0.5">
                  supabase/admin_setup_all_in_one.sql
                </code>{' '}
                in the Supabase SQL editor to enable these settings. Defaults are
                being used until then.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {saved && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            Settings saved.
          </div>
        )}

        {!canEdit && (
          <div className="mb-4 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-500">
            You have read-only access to settings.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* ── Login access ── */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
              Login access
            </h2>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50">
              <input
                type="checkbox"
                checked={form.login_enabled}
                disabled={!canEdit}
                onChange={(e) =>
                  setForm((f) => ({ ...f, login_enabled: e.target.checked }))
                }
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  {form.login_enabled ? (
                    <Unlock className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Lock className="h-4 w-4 text-red-600" />
                  )}
                  Admin login is {form.login_enabled ? 'enabled' : 'disabled'}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  Blocks sign-ins for everyone except full administrators, so you
                  can never lock yourself out. Existing sessions stay active until
                  they expire. Useful during maintenance.
                </span>
              </span>
            </label>

            {!form.login_enabled && (
              <div className="mt-3">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Message shown on the login screen
                </label>
                <input
                  type="text"
                  value={form.maintenance_note}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, maintenance_note: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="e.g. Admin panel is under maintenance until 6pm."
                />
              </div>
            )}

            <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50">
              <input
                type="checkbox"
                checked={form.allow_password_reset}
                disabled={!canEdit}
                onChange={(e) =>
                  setForm((f) => ({ ...f, allow_password_reset: e.target.checked }))
                }
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                <span className="text-sm font-semibold text-slate-800">
                  Allow self-service password reset requests
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  Shows the &ldquo;Forgot your password?&rdquo; link. Requests appear
                  under Users for an admin to action.
                </span>
              </span>
            </label>
          </div>

          {/* ── Security ── */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
              Security
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Session timeout (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  value={form.session_timeout_minutes}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      session_timeout_minutes: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Users are signed out after this long.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Max failed attempts
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.max_failed_attempts}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, max_failed_attempts: e.target.value }))
                  }
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Before the account locks.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Lockout duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.lockout_minutes}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lockout_minutes: e.target.value }))
                  }
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-400">
                  How long a lock lasts.
                </p>
              </div>
            </div>

            <div className="mt-4 sm:max-w-xs">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Default role for new users
              </label>
              <select
                value={form.default_role}
                disabled={!canEdit}
                onChange={(e) =>
                  setForm((f) => ({ ...f, default_role: e.target.value }))
                }
                className={inputClass}
              >
                {ROLE_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {ROLE_PRESETS[key].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {canEdit && (
            <button
              type="submit"
              disabled={saving || tableMissing}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save settings'}
            </button>
          )}
        </form>

        {/* ── Recent activity ── */}
        {audit.length > 0 && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
              <ScrollText className="h-4 w-4" />
              Recent admin activity
            </h2>
            <ul className="divide-y divide-slate-100">
              {audit.map((row) => (
                <li key={row.id} className="flex items-start justify-between gap-4 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">{row.username || 'system'}</span>
                      <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                        {row.action}
                      </span>
                    </p>
                    {row.detail && (
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {row.detail}
                      </p>
                    )}
                  </div>
                  <span className="flex-none text-xs text-slate-400">
                    {new Date(row.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-xs text-slate-400">
          Signed in as <span className="font-semibold">{session?.username}</span> (
          {session?.role})
        </p>
      </div>
    </div>
  )
}
