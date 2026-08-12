import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'
import { markdownToBlocks } from '../../utils/markdownToBlocks'
import ArticleBlocks from '../../components/ui/ArticleBlocks'
import RichMarkdownEditor from '../../components/admin/RichMarkdownEditor'

const PAGE_TYPES = ['city', 'coworking', 'service']

const EMPTY_ARTICLE = {
  page_type: 'city',
  city_slug: '',
  area_slug: '',
  service_slug: '',
  title: '',
  eyebrow: '',
  subtitle: '',
  content: '',
  content_format: 'markdown',
  meta_title: '',
  meta_description: '',
  is_active: false,
  sort_order: 0,
}

export default function AdminArticleEditor() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({ ...EMPTY_ARTICLE })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const adminClient = getAdminClient()

  useEffect(() => {
    if (!adminClient) {
      navigate('/admin')
      return
    }
    if (isEditing) {
      fetchArticle()
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchArticle() {
    setLoading(true)
    const { data, error: err } = await adminClient
      .from('blog_articles')
      .select('*')
      .eq('id', id)
      .single()

    if (err) {
      setError('Article not found: ' + err.message)
    } else if (data) {
      setForm({
        page_type: data.page_type || 'city',
        city_slug: data.city_slug || '',
        area_slug: data.area_slug || '',
        service_slug: data.service_slug || '',
        title: data.title || '',
        eyebrow: data.eyebrow || '',
        subtitle: data.subtitle || '',
        content: data.content || '',
        content_format: data.content_format || 'markdown',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        is_active: data.is_active || false,
        sort_order: data.sort_order || 0,
      })
    }
    setLoading(false)
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave(publish = false) {
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }

    // Validate slug fields based on page_type
    if ((form.page_type === 'city' || form.page_type === 'coworking') && !form.city_slug.trim()) {
      setError('City Slug is required for city/coworking page types.')
      return
    }
    if (form.page_type === 'service' && !form.service_slug.trim()) {
      setError('Service Slug is required for service page type.')
      return
    }

    setSaving(true)
    setError('')

    const payload = {
      ...form,
      is_active: publish ? true : form.is_active,
      content_format: 'markdown',
    }

    let result
    if (isEditing) {
      result = await adminClient
        .from('blog_articles')
        .update(payload)
        .eq('id', id)
    } else {
      result = await adminClient
        .from('blog_articles')
        .insert(payload)
    }

    if (result.error) {
      setError('Save failed: ' + result.error.message)
    } else {
      navigate('/admin/articles')
    }
    setSaving(false)
  }

  // Live preview of markdown content
  const previewBlocks = useMemo(() => {
    return markdownToBlocks(form.content)
  }, [form.content])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <span className="text-slate-500">Loading article...</span>
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
              onClick={() => navigate('/admin/articles')}
              className="text-sm text-slate-500 transition hover:text-slate-700"
            >
              &larr; Back to Articles
            </button>
            <h1 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Edit Article' : 'New Article'}
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
            {/* Page Type */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Page Type</label>
              <select
                value={form.page_type}
                onChange={(e) => updateField('page_type', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {PAGE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Slug Fields */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">City Slug</label>
                <input
                  type="text"
                  value={form.city_slug}
                  onChange={(e) => updateField('city_slug', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. mumbai"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Area Slug</label>
                <input
                  type="text"
                  value={form.area_slug}
                  onChange={(e) => updateField('area_slug', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. andheri"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Service Slug</label>
                <input
                  type="text"
                  value={form.service_slug}
                  onChange={(e) => updateField('service_slug', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. gst-registration"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Article title"
              />
            </div>

            {/* Eyebrow */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Eyebrow</label>
              <input
                type="text"
                value={form.eyebrow}
                onChange={(e) => updateField('eyebrow', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Small text above title (e.g. CITY GUIDE)"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Subtitle</label>
              <textarea
                value={form.subtitle}
                onChange={(e) => updateField('subtitle', e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Brief description or subtitle"
              />
            </div>

            {/* Sort Order + Active */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Sort Order</label>
                <input
                  type="number"
                  min={0}
                  value={form.sort_order}
                  onChange={(e) => updateField('sort_order', parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex items-end pb-2">
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
                    placeholder="SEO title (defaults to article title)"
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
                    placeholder="SEO description"
                  />
                </div>
              </div>
            </details>

            {/* Content */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Content (Rich Editor)
              </label>
              <RichMarkdownEditor
                value={form.content}
                onChange={(md) => updateField('content', md)}
                placeholder="Start writing your article content... Use the toolbar above for formatting."
              />
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 border-b border-slate-100 pb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Live Preview
              </h2>
              {form.eyebrow && (
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                  {form.eyebrow}
                </p>
              )}
              {form.title && (
                <h1 className="mb-2 text-2xl font-bold text-slate-900">{form.title}</h1>
              )}
              {form.subtitle && (
                <p className="mb-4 text-sm text-slate-500">{form.subtitle}</p>
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
