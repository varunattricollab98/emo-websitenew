import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'
import AdminNav from '../../components/admin/AdminNav'
import { sessionCan } from '../../lib/adminSession'

export default function AdminSpaces() {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const adminClient = getAdminClient()

  useEffect(() => {
    if (!adminClient) {
      navigate('/admin')
      return
    }
    fetchSpaces()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchSpaces() {
    setLoading(true)
    const { data, error: err } = await adminClient
      .from('spaces')
      .select('id, space_name, address_area, address_city, address_state, pricing_monthly, is_active, rating, badge, property_type')
      .order('space_name', { ascending: true })

    if (err) {
      setError(err.message)
    } else {
      setSpaces(data || [])
    }
    setLoading(false)
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return

    const { error: err } = await adminClient
      .from('spaces')
      .delete()
      .eq('id', id)

    if (err) {
      alert('Delete failed: ' + err.message)
    } else {
      setSpaces((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const filtered = spaces.filter((s) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (s.space_name || '').toLowerCase().includes(q) ||
      (s.address_city || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <AdminNav />

        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Virtual Offices</h1>
          {sessionCan('spaces.create') && (
            <Link
              to="/admin/spaces/new"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + New Space
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or city..."
            className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-12 text-center text-slate-500">Loading virtual offices...</div>
        )}

        {/* Empty state */}
        {!loading && spaces.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No virtual offices yet.{' '}
            <Link to="/admin/spaces/new" className="text-blue-600 underline">
              Create your first space
            </Link>
          </div>
        )}

        {/* Spaces Table */}
        {!loading && filtered.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Area</th>
                  <th className="px-4 py-3 font-medium text-slate-600">City</th>
                  <th className="px-4 py-3 font-medium text-slate-600">State</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Monthly Price</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Type</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((space) => (
                  <tr key={space.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">{space.space_name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{space.address_area || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{space.address_city || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{space.address_state || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {space.pricing_monthly ? `₹${space.pricing_monthly}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{space.property_type || '-'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          space.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {space.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/spaces/edit/${space.id}`}
                          className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                        >
                          Edit
                        </Link>
                        {sessionCan('spaces.delete') && (
                          <button
                            onClick={() => handleDelete(space.id, space.space_name)}
                            className="rounded bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No results after filter */}
        {!loading && spaces.length > 0 && filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No spaces match your search.
          </div>
        )}
      </div>
    </div>
  )
}
