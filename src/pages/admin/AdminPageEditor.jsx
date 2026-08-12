import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'
import { markdownToBlocks } from '../../utils/markdownToBlocks'
import ArticleBlocks from '../../components/ui/ArticleBlocks'
import RichMarkdownEditor from '../../components/admin/RichMarkdownEditor'

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const EMPTY_PAGE = {
  title: '',
  slug: '',
  content: '',
  meta_title: '',
  meta_description: '',
  is_active: true,
}

export default function AdminPageEditor() {
  const { slug } = useParams()
  const isEditing = Boolean(slug)
  const navigate = useNavigate()

  const [form, setForm] = useState({ ...EMPTY_PAGE })
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
      fetchPage()
    }
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchPage() {
    setLoading(true)
    const { data, error: err } = await adminClient
      .from('site_pages')
      .select('*')
      .eq('slug', slug)
      .single()

    if (err) {
      setError('Page not found: ' + err.message)
    } else if (data) {
      setForm({
        title: data.title || '',
        slug: data.slug || '',
        content: data.content || '',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        is_active: data.is_active ?? true,
      })
      setSlugManual(true)
    }
    setLoading(false)
  }

  function updateField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
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
      title: form.title,
      slug: form.slug,
      content: form.content || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      is_active: publish ? true : form.is_active,
      updated_at: new Date().toISOString(),
    }

    let result
    if (isEditing) {
      result = await adminClient
        .from('site_pages')
        .update(payload)
        .eq('slug', slug)
    } else {
      payload.created_at = new Date().toISOString()
      result = await adminClient
        .from('site_pages')
        .insert(payload)
    }

    if (result.error) {
      setError('Save failed: ' + result.error.message)
    } else {
      navigate('/admin/pages')
    }
    setSaving(false)
  }

  // Live preview of markdown content
  const previewBlocks = useMemo(() => {
    return markdownToBlocks(form.content || '')
  }, [form.content])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <span className="text-slate-500">Loading page...</span>
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
              onClick={() => navigate('/admin/pages')}
              className="text-sm text-slate-500 transition hover:text-slate-700"
            >
              &larr; Back to Pages
            </button>
            <h1 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Edit Page' : 'New Page'}
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
                placeholder="Page title"
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
                placeholder="page-url-slug"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
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
                    placeholder="SEO title (defaults to page title)"
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
                Content (Markdown)
              </label>
              <RichMarkdownEditor
                value={form.content}
                onChange={(md) => updateField('content', md)}
                placeholder="Write your page content in Markdown. Leave empty to use the hardcoded fallback content."
              />
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 border-b border-slate-100 pb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Live Preview
              </h2>
              {form.title && (
                <h1 className="mb-4 text-2xl font-bold text-slate-900">{form.title}</h1>
              )}
              <div className="max-h-[60vh] overflow-y-auto">
                {previewBlocks.length > 0 ? (
                  <ArticleBlocks blocks={previewBlocks} lead />
                ) : (
                  <p className="text-sm italic text-slate-400">
                    Start typing content to see the preview. If left empty, the page will display its hardcoded fallback content.
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
