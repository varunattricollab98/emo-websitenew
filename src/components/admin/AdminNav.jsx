import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LogOut,
  Settings,
  Users,
  Newspaper,
  FileText,
  Building2,
  MapPin,
  Briefcase,
  LayoutDashboard,
  Shield,
  Menu,
  X,
  UserPlus,
} from 'lucide-react'
import { useAdminSession } from './useAdminSession'
import { PERMISSION_SECTIONS, ROLE_PRESETS } from '../../lib/permissions'

/** Map permission section keys to lucide icons */
const SECTION_ICONS = {
  leads: UserPlus,
  blog: Newspaper,
  articles: FileText,
  coworking: Building2,
  spaces: MapPin,
  jobs: Briefcase,
  pages: LayoutDashboard,
  users: Shield,
}

/**
 * Modern admin navigation bar with icons, branding, and mobile menu.
 */
export default function AdminNav() {
  const location = useLocation()
  const { session, can, logout } = useAdminSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const visibleLinks = PERMISSION_SECTIONS.filter(
    (section) => section.key !== 'settings' && can(`${section.key}.view`)
  )

  const preset = ROLE_PRESETS[session?.role]
  const isSettingsActive = location.pathname.startsWith('/admin/settings')

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* Top accent gradient */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />

      <div className="px-5 py-3">
        {/* Desktop layout */}
        <div className="flex items-center justify-between">
          {/* Brand + nav links */}
          <div className="flex items-center gap-4">
            {/* Brand mark */}
            <Link to="/admin/leads" className="flex items-center gap-2 pr-3 border-r border-slate-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                <span className="text-xs font-bold">EM</span>
              </div>
              <span className="hidden text-sm font-bold text-slate-800 sm:block">Admin</span>
            </Link>

            {/* Nav links - desktop */}
            <div className="hidden flex-wrap items-center gap-1 md:flex">
              {visibleLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.path)
                const Icon = SECTION_ICONS[link.key] || LayoutDashboard
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side: user info + settings + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
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
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <Settings className="h-4 w-4" />
              </Link>
            )}

            <button
              onClick={logout}
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-800 sm:inline-flex"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 md:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav links */}
        {mobileOpen && (
          <div className="mt-3 flex flex-col gap-1 border-t border-slate-100 pt-3 md:hidden">
            {visibleLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path)
              const Icon = SECTION_ICONS[link.key] || LayoutDashboard
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
            <button
              onClick={logout}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
