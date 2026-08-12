import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'
import { markdownToBlocks } from '../../utils/markdownToBlocks'
import ArticleBlocks from '../../components/ui/ArticleBlocks'
import RichMarkdownEditor from '../../components/admin/RichMarkdownEditor'

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract']

const EMPTY_JOB = {
  title: '',
  department: '',
  location: '',
  employment_type: 'Full-time',
  experience: '',
  description: '',
  responsibilities: '',
  requirements: '',
  apply_email: 'careers@easemyoffice.in',
  is_active: true,
  sort_order: 0,
}

export default function AdminJobEditor() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({ ...EMPTY_JOB })
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
      fetchJob()
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchJob() {
    setLoading(true)
    const { data, error: err } = await adminClient
      .from('job_openings')
      .select('*')
      .eq('id', id)
      .single()

    if (err) {
      setError('Job not found: ' + err.message)
    } else if (data) {
      setForm({
        title: data.title || '',
        department: data.department || '',
        location: data.location || '',
        employment_type: data.employment_type || 'Full-time',
        experience: data.experience || '',
        description: data.description || '',
        responsibilities: data.responsibilities || '',
        requirements: data.requirements || '',
        apply_email: data.apply_email || 'careers@easemyoffice.in',
        is_active: data.is_active ?? true,
        sort_order: data.sort_order ?? 0,
      })
    }
    setLoading(false)
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }

    setSaving(true)
    setError('')

    const payload = {
      ...form,
      updated_at: new Date().toISOString(),
    }

    let result
    if (isEditing) {
      result = await adminClient
        .from('job_openings')
        .update(payload)
        .eq('id', id)
    } else {
      payload.created_at = new Date().toISOString()
      result = await adminClient
        .from('job_openings')
        .insert(payload)
    }

    if (result.error) {
      setError('Save failed: ' + result.error.message)
    } else {
      navigate('/admin/jobs')
    }
    setSaving(false)
  }

  // Live preview combining all markdown fields
  const previewBlocks = useMemo(() => {
    const combined = [
      form.description ? `## About the Role\n\n${form.description}` : '',
      form.responsibilities ? `## Responsibilities\n\n${form.responsibilities}` : '',
      form.requirements ? `## Requirements\n\n${form.requirements}` : '',
    ]
      .filter(Boolean)
      .join('\n\n')
    return markdownToBlocks(combined)
  }, [form.description, form.responsibilities, form.requirements])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <span className="text-slate-500">Loading job...</span>
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
              onClick={() => navigate('/admin/jobs')}
              className="text-sm text-slate-500 transition hover:text-slate-700"
            >
              &larr; Back to Jobs
            </button>
            <h1 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Edit Job' : 'New Job'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEditing ? 'Update Job' : 'Create Job'}
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
                placeholder="Job title"
              />
            </div>

            {/* Department + Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Department</label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. Sales, Marketing"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. Gurugram, Haryana"
                />
              </div>
            </div>

            {/* Employment Type + Experience */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Employment Type</label>
                <select
                  value={form.employment_type}
                  onChange={(e) => updateField('employment_type', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Experience</label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => updateField('experience', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. 2-4 years, Fresher"
                />
              </div>
            </div>

            {/* Apply Email + Sort Order */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Apply Email</label>
                <input
                  type="email"
                  value={form.apply_email}
                  onChange={(e) => updateField('apply_email', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="careers@easemyoffice.in"
                />
              </div>
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
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => updateField('is_active', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Active (Visible on Careers page)
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <RichMarkdownEditor
                value={form.description}
                onChange={(md) => updateField('description', md)}
                placeholder="Brief role summary..."
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Responsibilities</label>
              <RichMarkdownEditor
                value={form.responsibilities}
                onChange={(md) => updateField('responsibilities', md)}
                placeholder="- What they will do..."
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Requirements</label>
              <RichMarkdownEditor
                value={form.requirements}
                onChange={(md) => updateField('requirements', md)}
                placeholder="- What you are looking for..."
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
                <h1 className="mb-1 text-2xl font-bold text-slate-900">{form.title}</h1>
              )}
              {(form.department || form.location || form.employment_type) && (
                <p className="mb-4 text-sm text-slate-500">
                  {[form.department, form.location, form.employment_type].filter(Boolean).join(' · ')}
                </p>
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
