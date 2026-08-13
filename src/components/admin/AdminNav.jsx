import { Link, useNavigate, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Blog Posts', path: '/admin/blog' },
  { label: 'Articles', path: '/admin/articles', adminOnly: true },
  { label: 'Jobs', path: '/admin/jobs', adminOnly: true },
  { label: 'Coworking', path: '/admin/coworking', adminOnly: true },
  { label: 'Pages', path: '/admin/pages', adminOnly: true },
  { label: 'Users', path: '/admin/users', adminOnly: true },
]

export default function AdminNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const adminRole = sessionStorage.getItem('admin_role')
  const adminName = sessionStorage.getItem('admin_name') || 'Admin'

  function handleLogout() {
    sessionStorage.removeItem('admin_service_key')
    sessionStorage.removeItem('admin_role')
    sessionStorage.removeItem('admin_name')
    sessionStorage.removeItem('admin_username')
    navigate('/admin')
  }

  const visibleLinks = NAV_LINKS.filter(
    (link) => !link.adminOnly || adminRole === 'admin'
  )

  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3">
      <div className="flex items-center gap-1">
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
        <span className="text-sm text-slate-500">{adminName}</span>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
