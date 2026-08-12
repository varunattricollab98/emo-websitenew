import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'
import AdminNav from '../../components/admin/AdminNav'

const PAGE_TYPES = ['All', 'city', 'coworking', 'service']

export default function AdminArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const navigate = useNavigate()

  const adminClient = getAdminClient()
  const adminRole = sessionStorage.getItem('admin_role')

  useEffect(() => {
    // Role-based access: editors cannot access articles
    if (adminRole === 'editor') {
      navigate('/admin/blog')
      return
    }
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

  const filteredArticles =
    filter === 'All' ? articles : articles.filter((a) => a.page_type === filter)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <AdminNav />

        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Articles</h1>
          <Link
            to="/admin/articles/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + New Article
          </Link>
        </div>

        {/* Quick-Action Buttons */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Quick Add:</span>
          <Link
            to="/admin/articles/new?type=city"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            + City Article
          </Link>
          <Link
            to="/admin/articles/new?type=coworking"
            className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
          >
            + Coworking Article
          </Link>
          <Link
            to="/admin/articles/new?type=service"
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
          >
            + Service Article
          </Link>
        </div>

        {/* Filter */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Filter:</span>
          {PAGE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {type === 'All' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-12 text-center text-slate-500">Loading articles...</div>
        )}

        {/* Empty state */}
        {!loading && filteredArticles.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No articles found.{' '}
            <Link to="/admin/articles/new" className="text-blue-600 underline">
              Create your first article
            </Link>
          </div>
        )}

        {/* Articles Table */}
        {!loading && filteredArticles.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Title</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Page Type</th>
                  <th className="px-4 py-3 font-medium text-slate-600">City Slug</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Service Slug</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Content</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Order</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">
                        {article.title || '(untitled)'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {article.page_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{article.city_slug || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{article.service_slug || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {article.content ? `${article.content.length} chars` : '0 chars'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          article.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {article.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{article.sort_order ?? '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/articles/edit/${article.id}`}
                          className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="rounded bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
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
