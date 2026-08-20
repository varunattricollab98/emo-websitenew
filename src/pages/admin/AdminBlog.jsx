import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'
import AdminNav from '../../components/admin/AdminNav'
import { sessionCan } from '../../lib/adminSession'

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <AdminNav />

        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
          {sessionCan('blog.create') && (
            <Link
              to="/admin/blog/new"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + New Post
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
          <div className="py-12 text-center text-slate-500">Loading posts...</div>
        )}

        {/* Posts Table */}
        {!loading && posts.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No posts yet.{' '}
            <Link to="/admin/blog/new" className="text-blue-600 underline">
              Create your first post
            </Link>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Title</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Category</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Featured</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.slug} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">{post.title}</span>
                      <br />
                      <span className="text-xs text-slate-400">/{post.slug}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{post.category || '-'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          post.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {post.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {post.is_featured ? '⭐' : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/blog/edit/${post.slug}`}
                          className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                        >
                          Edit
                        </Link>
                        {sessionCan('blog.delete') && (
                          <button
                            onClick={() => handleDelete(post.slug)}
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
