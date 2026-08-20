import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Pencil, Trash2, FileText } from 'lucide-react'
import { getAdminClient } from '../../lib/supabaseAdmin'
import AdminNav from '../../components/admin/AdminNav'
import AdminTableSkeleton from '../../components/admin/AdminTableSkeleton'
import { sessionCan } from '../../lib/adminSession'

const PAGE_TYPES = ['All', 'city', 'coworking', 'service']

export default function AdminArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const adminClient = getAdminClient()

  useEffect(() => {
    if (!adminClient) {
      navigate('/admin')
      return
    }
    fetchArticles()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchArticles() {
    setLoading(true)
    const { data, error: err } = await adminClient
      .from('blog_articles')
      .select('id, title, page_type, city_slug, service_slug, content, is_active, sort_order')
      .order('sort_order', { ascending: true })

    if (err) {
      setError(err.message)
    } else {
      setArticles(data || [])
    }
    setLoading(false)
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return

    const { error: err } = await adminClient
      .from('blog_articles')
      .delete()
      .eq('id', id)

    if (err) {
      alert('Delete failed: ' + err.message)
    } else {
      setArticles((prev) => prev.filter((a) => a.id !== id))
    }
  }

  const filteredArticles = articles.filter((a) => {
    const matchType = filter === 'All' || a.page_type === filter
    if (!matchType) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (a.title || '').toLowerCase().includes(q) ||
      (a.city_slug || '').toLowerCase().includes(q) ||
      (a.service_slug || '').toLowerCase().includes(q)
    )
  })

  const activeCount = articles.filter((a) => a.is_active).length

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <AdminNav />

        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Articles</h1>
            <p className="mt-1 text-sm text-slate-500">Long-form content for city and service pages.</p>
          </div>
          {sessionCan('articles.create') && (
            <Link
              to="/admin/articles/new"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              New Article
            </Link>
          )}
        </div>

        {/* Stats */}
        {!loading && (
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{articles.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Active</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{activeCount}</p>
            </div>
          </div>
        )}

        {/* Quick-Add Buttons */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Quick Add:</span>
          <Link
            to="/admin/articles/new?type=city"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            <Plus className="h-3.5 w-3.5" />
            City Article
          </Link>
          <Link
            to="/admin/articles/new?type=coworking"
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
          >
            <Plus className="h-3.5 w-3.5" />
            Coworking Article
          </Link>
          <Link
            to="/admin/articles/new?type=service"
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
          >
            <Plus className="h-3.5 w-3.5" />
            Service Article
          </Link>
        </div>

        {/* Filter pills + Search */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 p-1 shadow-sm">
            {PAGE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                  filter === type
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {type === 'All' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <AdminTableSkeleton rows={5} cols={5} />}

        {/* Empty state */}
        {!loading && filteredArticles.length === 0 && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No articles yet</h3>
            <p className="mt-1 text-sm text-slate-500">Create your first article to get started.</p>
            <Link
              to="/admin/articles/new"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create Article
            </Link>
          </div>
        )}

        {/* Articles Table */}
        {!loading && filteredArticles.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Title</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Type</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Slug</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Content</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Status</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Order</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="transition hover:bg-slate-50/80">
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-slate-900">
                          {article.title || '(untitled)'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          article.page_type === 'city'
                            ? 'bg-emerald-50 text-emerald-700'
                            : article.page_type === 'coworking'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {article.page_type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs font-mono">
                        {article.city_slug || article.service_slug || '-'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {article.content ? (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-blue-500"
                                style={{ width: `${Math.min(100, (article.content.length / 2000) * 100)}%` }}
                              />
                            </div>
                            <span className="text-xs">{article.content.length}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Empty</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            article.is_active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${article.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {article.is_active ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{article.sort_order ?? '-'}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/articles/edit/${article.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          {sessionCan('articles.delete') && (
                            <button
                              onClick={() => handleDelete(article.id, article.title)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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
          </div>
        )}

        {/* No results from filter/search */}
        {!loading && articles.length > 0 && filteredArticles.length === 0 && (
          <div className="py-12 text-center text-slate-500">No articles match your filter or search.</div>
        )}
      </div>
    </div>
  )
}
