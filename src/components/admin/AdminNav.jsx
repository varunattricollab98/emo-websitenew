import { Link, useLocation } from 'react-router-dom'
import { LogOut, Settings } from 'lucide-react'
import { useAdminSession } from './useAdminSession'
import { PERMISSION_SECTIONS, ROLE_PRESETS } from '../../lib/permissions'

/**
 * Admin navigation. Links are derived from the permission catalogue, so a user
 * only ever sees the sections they can actually open — no hardcoded role flags.
 */
export default function AdminNav() {
  const location = useLocation()
  const { session, can, logout } = useAdminSession()

  // Settings gets its own icon button on the right, so keep it out of the row.
  const visibleLinks = PERMISSION_SECTIONS.filter(
    (section) => section.key !== 'settings' && can(`${section.key}.view`)
  )

  const preset = ROLE_PRESETS[session?.role]
  const isSettingsActive = location.pathname.startsWith('/admin/settings')

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3">
      <div className="flex flex-wrap items-center gap-1">
        {visibleLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path)
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="block text-sm font-medium text-slate-700">
            {session?.name || 'Admin'}
          </span>
          {preset && (
            <span
              className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${preset.badge}`}
            >
              {preset.label}
            </span>
          )}
        </div>

        {can('settings.view') && (
          <Link
            to="/admin/settings"
            title="Settings"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
              isSettingsActive
                ? 'bg-blue-600 text-white'
                : 'border border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="h-4 w-4" />
          </Link>
        )}

        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
