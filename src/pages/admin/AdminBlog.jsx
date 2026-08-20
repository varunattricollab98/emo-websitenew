import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Pencil, Trash2, Newspaper } from 'lucide-react'
import { getAdminClient } from '../../lib/supabaseAdmin'
import AdminNav from '../../components/admin/AdminNav'
import AdminTableSkeleton from '../../components/admin/AdminTableSkeleton'
import { sessionCan } from '../../lib/adminSession'

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
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
    fetchPosts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchPosts() {
    setLoading(true)
    const { data, error: err } = await adminClient
      .from('blog_posts')
      .select('slug, title, category, is_active, is_featured, published_at, created_at')
      .order('created_at', { ascending: false })

    if (err) {
      setError(err.message)
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }

  async function handleDelete(slug) {
    if (!window.confirm(`Delete "${slug}"? This cannot be undone.`)) return

    const { error: err } = await adminClient
      .from('blog_posts')
      .delete()
      .eq('slug', slug)

    if (err) {
      alert('Delete failed: ' + err.message)
    } else {
      setPosts((prev) => prev.filter((p) => p.slug !== slug))
    }
  }

  const filtered = posts.filter((p) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (p.title || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.slug || '').toLowerCase().includes(q)
    )
  })

  const activeCount = posts.filter((p) => p.is_active).length
  const draftCount = posts.length - activeCount

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <AdminNav />

        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
            <p className="mt-1 text-sm text-slate-500">Manage all blog content and publications.</p>
          </div>
          {sessionCan('blog.create') && (
            <Link
              to="/admin/blog/new"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Link>
          )}
        </div>

        {/* Stats */}
        {!loading && (
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total Posts</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{posts.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Active</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{activeCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Drafts</p>
              <p className="mt-1 text-2xl font-bold text-slate-600">{draftCount}</p>
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
              placeholder="Search posts by title, category, slug..."
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
        {loading && <AdminTableSkeleton rows={5} cols={4} />}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <Newspaper className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No posts yet</h3>
            <p className="mt-1 text-sm text-slate-500">Create your first blog post to get started.</p>
            <Link
              to="/admin/blog/new"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create Post
            </Link>
          </div>
        )}

        {/* Posts Table */}
        {!loading && filtered.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Title</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Category</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Status</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Featured</th>
                    <th className="px-5 py-3.5 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((post) => (
                    <tr key={post.slug} className="transition hover:bg-slate-50/80">
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-slate-900">{post.title}</span>
                        <br />
                        <span className="text-xs text-slate-400">/{post.slug}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {post.category || '-'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            post.is_active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${post.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {post.is_active ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {post.is_featured ? '⭐' : '-'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/blog/edit/${post.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          {sessionCan('blog.delete') && (
                            <button
                              onClick={() => handleDelete(post.slug)}
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

        {/* No results from search */}
        {!loading && posts.length > 0 && filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500">No posts match your search.</div>
        )}
      </div>
    </div>
  )
}
