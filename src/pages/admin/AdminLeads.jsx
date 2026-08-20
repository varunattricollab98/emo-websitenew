import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, UserPlus, Users, TrendingUp } from 'lucide-react'
import { getAdminClient } from '../../lib/supabaseAdmin'
import AdminNav from '../../components/admin/AdminNav'
import AdminTableSkeleton from '../../components/admin/AdminTableSkeleton'

export default function AdminLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const adminClient = getAdminClient()

  useEffect(() => {
    if (!adminClient) { navigate('/admin'); return }
    adminClient
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (error) console.warn(error.message)
        setLeads(data || [])
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = leads.filter((l) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (l.name || '').toLowerCase().includes(q) ||
      (l.phone || '').toLowerCase().includes(q) ||
      (l.email || '').toLowerCase().includes(q) ||
      (l.city || '').toLowerCase().includes(q)
    )
  })

  // Stats
  const today = new Date().toDateString()
  const todayLeads = leads.filter(
    (l) => l.created_at && new Date(l.created_at).toDateString() === today
  ).length

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <AdminNav />

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="mt-1 text-sm text-slate-500">Customer enquiries submitted through the website.</p>
        </div>

        {/* Stats cards */}
        {!loading && (
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-slate-500">Total Leads</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{leads.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-emerald-50 p-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-slate-500">Today</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{todayLeads}</p>
            </div>
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
              placeholder="Search by name, phone, email, city..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && <AdminTableSkeleton rows={6} cols={5} />}

        {/* Empty state */}
        {!loading && leads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <UserPlus className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No leads yet</h3>
            <p className="mt-1 text-sm text-slate-500">Leads will appear here once customers submit enquiries.</p>
          </div>
        )}

        {/* Table */}
        {!loading && filtered.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Name</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Phone</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Email</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">City</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Interest</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Source</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Message</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((l) => (
                    <tr key={l.id} className="transition hover:bg-slate-50/80">
                      <td className="px-5 py-3.5 font-medium text-slate-900">{l.name}</td>
                      <td className="px-5 py-3.5">
                        <a href={`tel:${l.phone}`} className="text-blue-600 hover:underline">{l.phone}</a>
                      </td>
                      <td className="px-5 py-3.5">
                        {l.email ? (
                          <a href={`mailto:${l.email}`} className="text-blue-600 hover:underline">{l.email}</a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{l.city || '-'}</td>
                      <td className="px-5 py-3.5 text-slate-600">{l.interest || '-'}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {l.source}
                        </span>
                      </td>
                      <td className="max-w-[200px] truncate px-5 py-3.5 text-slate-500">{l.message || '-'}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(l.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No results from search */}
        {!loading && leads.length > 0 && filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500">No leads match your search.</div>
        )}
      </div>
    </div>
  )
}
