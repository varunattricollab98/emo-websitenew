import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'
import AdminNav from '../../components/admin/AdminNav'
import { sessionCan } from '../../lib/adminSession'

export default function AdminCoworking() {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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
      .from('coworking_spaces')
      .select('id, name, city_name, locality, pricing_dedicated_desk, pricing_day_pass, is_active, sort_order')
      .order('sort_order', { ascending: true })

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
      .from('coworking_spaces')
      .delete()
      .eq('id', id)

    if (err) {
      alert('Delete failed: ' + err.message)
    } else {
      setSpaces((prev) => prev.filter((s) => s.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <AdminNav />

        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Coworking Spaces</h1>
          {sessionCan('coworking.create') && (
            <Link
              to="/admin/coworking/new"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + New Space
            </Link>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-12 text-center text-slate-500">Loading coworking spaces...</div>
        )}

        {/* Empty state */}
        {!loading && spaces.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No coworking spaces yet.{' '}
            <Link to="/admin/coworking/new" className="text-blue-600 underline">
              Create your first space
            </Link>
          </div>
        )}

        {/* Spaces Table */}
        {!loading && spaces.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-600">City</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Locality</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Dedicated Desk</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Day Pass</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Order</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {spaces.map((space) => (
                  <tr key={space.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">{space.name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{space.city_name || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{space.locality || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {space.pricing_dedicated_desk ? `₹${space.pricing_dedicated_desk}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {space.pricing_day_pass ? `₹${space.pricing_day_pass}` : '-'}
                    </td>
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
                    <td className="px-4 py-3 text-slate-600">{space.sort_order ?? '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/coworking/edit/${space.id}`}
                          className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                        >
                          Edit
                        </Link>
                        {sessionCan('coworking.delete') && (
                          <button
                            onClick={() => handleDelete(space.id, space.name)}
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
      </div>
    </div>
  )
}
