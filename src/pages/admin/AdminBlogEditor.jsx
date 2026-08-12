import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'
import { markdownToBlocks } from '../../utils/markdownToBlocks'
import ArticleBlocks from '../../components/ui/ArticleBlocks'

const CATEGORIES = [
  'Virtual Office',
  'Coworking',
  'Business Registration',
  'GST',
  'Compliance',
  'Startup',
  'General',
]

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const EMPTY_POST = {
  title: '',
  slug: '',
  excerpt: '',
  category: '',
  cover_image: '',
  content: '',
  content_format: 'markdown',
  read_minutes: 5,
  is_featured: false,
  is_active: false,
  meta_title: '',
  meta_description: '',
  author: 'EMO Team',
}

export default function AdminBlogEditor() {
  const { slug } = useParams()
  const isEditing = Boolean(slug)
  const navigate = useNavigate()

  const [form, setForm] = useState({ ...EMPTY_POST })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugManual, setSlugManual] = useState(false)

  const adminClient = getAdminClient()

  useEffect(() => {
    if (!adminClient) {
      navigate('/admin')
      return
    }
    if (isEditing) {
      fetchPost()
    }
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchPost() {
    setLoading(true)
    const { data, error: err } = await adminClient
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (err) {
      setError('Post not found: ' + err.message)
    } else if (data) {
      setForm({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        category: data.category || '',
        cover_image: data.cover_image || '',
        content: data.content || '',
        content_format: data.content_format || 'markdown',
        read_minutes: data.read_minutes || 5,
        is_featured: data.is_featured || false,
        is_active: data.is_active || false,
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        author: data.author || 'EMO Team',
      })
      setSlugManual(true) // Don't auto-generate slug for existing posts
    }
    setLoading(false)
  }

  function updateField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      // Auto-generate slug from title unless manually edited
      if (field === 'title' && !slugManual) {
        next.slug = slugify(value)
      }
      return next
    })
  }

  async function handleSave(publish = false) {
    if (!form.title.trim() || !form.slug.trim()) {
      setError('Title and slug are required.')
      return
    }

    setSaving(true)
    setError('')

    const payload = {
      ...form,
      is_active: publish ? true : form.is_active,
      published_at: publish ? new Date().toISOString() : (form.is_active ? new Date().toISOString() : null),
      updated_at: new Date().toISOString(),
    }

    let result
    if (isEditing) {
      result = await adminClient
        .from('blog_posts')
        .update(payload)
        .eq('slug', slug)
    } else {
      payload.created_at = new Date().toISOString()
      result = await adminClient
        .from('blog_posts')
        .insert(payload)
    }

    if (result.error) {
      setError('Save failed: ' + result.error.message)
    } else {
      navigate('/admin/blog')
    }
    setSaving(false)
  }

  // Live preview of markdown content
  const previewBlocks = useMemo(() => {
    if (form.content_format === 'markdown') {
      return markdownToBlocks(form.content)
    }
    // If JSON format, try to parse
    try {
      return JSON.parse(form.content)
    } catch {
      return []
    }
  }, [form.content, form.content_format])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <span className="text-slate-500">Loading post...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/blog')}
              className="text-sm text-slate-500 transition hover:text-slate-700"
            >
              &larr; Back to Posts
            </button>
            <h1 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Edit Post' : 'New Post'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form + Preview Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Form */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Post title"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Slug
                {!slugManual && (
                  <span className="ml-2 text-xs text-slate-400">(auto-generated)</span>
                )}
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true)
                  updateField('slug', e.target.value)
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="post-url-slug"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => updateField('excerpt', e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Short description for listing pages"
              />
            </div>

            {/* Category + Read Minutes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Read Minutes
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={form.read_minutes}
                  onChange={(e) => updateField('read_minutes', parseInt(e.target.value) || 5)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Cover Image URL
              </label>
              <input
                type="url"
                value={form.cover_image}
                onChange={(e) => updateField('cover_image', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="https://images.unsplash.com/..."
              />
              {form.cover_image && (
                <img
                  src={form.cover_image}
                  alt="Cover preview"
                  className="mt-2 h-32 w-full rounded-lg object-cover"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
            </div>

            {/* Author */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => updateField('author', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Author name"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => updateField('is_featured', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => updateField('is_active', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Active (Published)
              </label>
            </div>

            {/* SEO Fields */}
            <details className="rounded-lg border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-medium text-slate-700">
                SEO Settings (optional)
              </summary>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={form.meta_title}
                    onChange={(e) => updateField('meta_title', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="SEO title (defaults to post title)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Meta Description
                  </label>
                  <textarea
                    value={form.meta_description}
                    onChange={(e) => updateField('meta_description', e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="SEO description (defaults to excerpt)"
                  />
                </div>
              </div>
            </details>

            {/* Content */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Content (Markdown)
              </label>
              <textarea
                value={form.content}
                onChange={(e) => updateField('content', e.target.value)}
                rows={20}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm leading-relaxed focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder={`# Section Heading\n\nWrite your content here using Markdown...\n\n* Bullet point 1\n* Bullet point 2\n\n> A quote block`}
              />
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 border-b border-slate-100 pb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Live Preview
              </h2>
              {form.cover_image && (
                <img
                  src={form.cover_image}
                  alt="Cover"
                  className="mb-4 h-40 w-full rounded-lg object-cover"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
              {form.title && (
                <h1 className="mb-2 text-2xl font-bold text-slate-900">{form.title}</h1>
              )}
              {form.excerpt && (
                <p className="mb-4 text-sm text-slate-500">{form.excerpt}</p>
              )}
              <div className="max-h-[60vh] overflow-y-auto">
                {previewBlocks.length > 0 ? (
                  <ArticleBlocks blocks={previewBlocks} lead />
                ) : (
                  <p className="text-sm italic text-slate-400">
                    Start typing content to see the preview...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
