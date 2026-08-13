import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'

const EMPTY_SPACE = {
  name: '',
  city_slug: '',
  city_name: '',
  locality: '',
  state: '',
  full_address: '',
  pricing_hot_desk: '',
  pricing_dedicated_desk: '',
  pricing_private_cabin: '',
  pricing_day_pass: '',
  seats: '',
  rating: '',
  tags: '',
  amenities: '',
  featured_image: '',
  gallery: '',
  description: '',
  is_popular: false,
  is_active: true,
  sort_order: 0,
}

export default function AdminCoworkingEditor() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({ ...EMPTY_SPACE })
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
      fetchSpace()
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchSpace() {
    setLoading(true)
    const { data, error: err } = await adminClient
      .from('coworking_spaces')
      .select('*')
      .eq('id', id)
      .single()

    if (err) {
      setError('Space not found: ' + err.message)
    } else if (data) {
      setForm({
        name: data.name || '',
        city_slug: data.city_slug || '',
        city_name: data.city_name || '',
        locality: data.locality || '',
        state: data.state || '',
        full_address: data.full_address || '',
        pricing_hot_desk: data.pricing_hot_desk ?? '',
        pricing_dedicated_desk: data.pricing_dedicated_desk ?? '',
        pricing_private_cabin: data.pricing_private_cabin ?? '',
        pricing_day_pass: data.pricing_day_pass ?? '',
        seats: data.seats || '',
        rating: data.rating ?? '',
        tags: data.tags || '',
        amenities: data.amenities || '',
        featured_image: data.featured_image || '',
        gallery: data.gallery || '',
        description: data.description || '',
        is_popular: data.is_popular ?? false,
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
    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }
    if (!form.city_slug.trim()) {
      setError('City slug is required.')
      return
    }

    setSaving(true)
    setError('')

    const payload = {
      name: form.name,
      city_slug: form.city_slug,
      city_name: form.city_name,
      locality: form.locality,
      state: form.state,
      full_address: form.full_address,
      pricing_hot_desk: form.pricing_hot_desk === '' ? null : Number(form.pricing_hot_desk),
      pricing_dedicated_desk: form.pricing_dedicated_desk === '' ? null : Number(form.pricing_dedicated_desk),
      pricing_private_cabin: form.pricing_private_cabin === '' ? null : Number(form.pricing_private_cabin),
      pricing_day_pass: form.pricing_day_pass === '' ? null : Number(form.pricing_day_pass),
      seats: form.seats,
      rating: form.rating === '' ? null : Number(form.rating),
      tags: form.tags,
      amenities: form.amenities,
      featured_image: form.featured_image,
      gallery: form.gallery,
      description: form.description,
      is_popular: form.is_popular,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
      updated_at: new Date().toISOString(),
    }

    let result
    if (isEditing) {
      result = await adminClient
        .from('coworking_spaces')
        .update(payload)
        .eq('id', id)
    } else {
      payload.created_at = new Date().toISOString()
      result = await adminClient
        .from('coworking_spaces')
        .insert(payload)
    }

    if (result.error) {
      setError('Save failed: ' + result.error.message)
    } else {
      navigate('/admin/coworking')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <span className="text-slate-500">Loading space...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/coworking')}
              className="text-sm text-slate-500 transition hover:text-slate-700"
            >
              &larr; Back to Coworking
            </button>
            <h1 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Edit Space' : 'New Space'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEditing ? 'Update Space' : 'Create Space'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Space name"
            />
          </div>

          {/* City Slug + City Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">City Slug *</label>
              <input
                type="text"
                value={form.city_slug}
                onChange={(e) => updateField('city_slug', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. delhi, mumbai"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">City Name</label>
              <input
                type="text"
                value={form.city_name}
                onChange={(e) => updateField('city_name', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Delhi, Mumbai"
              />
            </div>
          </div>

          {/* Locality + State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Locality</label>
              <input
                type="text"
                value={form.locality}
                onChange={(e) => updateField('locality', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Connaught Place"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => updateField('state', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Delhi, Maharashtra"
              />
            </div>
          </div>

          {/* Full Address */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full Address</label>
            <input
              type="text"
              value={form.full_address}
              onChange={(e) => updateField('full_address', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Complete address"
            />
          </div>

          {/* Pricing Section */}
          <div className="border-t border-slate-100 pt-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Pricing</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Hot Desk</label>
                <input
                  type="number"
                  value={form.pricing_hot_desk}
                  onChange={(e) => updateField('pricing_hot_desk', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="₹/mo"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Dedicated Desk</label>
                <input
                  type="number"
                  value={form.pricing_dedicated_desk}
                  onChange={(e) => updateField('pricing_dedicated_desk', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="₹/mo"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Private Cabin</label>
                <input
                  type="number"
                  value={form.pricing_private_cabin}
                  onChange={(e) => updateField('pricing_private_cabin', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="₹/mo"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Day Pass</label>
                <input
                  type="number"
                  value={form.pricing_day_pass}
                  onChange={(e) => updateField('pricing_day_pass', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="₹/day"
                />
              </div>
            </div>
          </div>

          {/* Seats + Rating + Sort Order */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Seats</label>
              <input
                type="text"
                value={form.seats}
                onChange={(e) => updateField('seats', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. 50, 100+"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => updateField('rating', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. 4.5"
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

          {/* Tags + Amenities */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tags (pipe-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="tag1|tag2|tag3"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Amenities (pipe-separated)</label>
              <input
                type="text"
                value={form.amenities}
                onChange={(e) => updateField('amenities', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="WiFi|AC|Parking"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Featured Image (URL)</label>
            <input
              type="text"
              value={form.featured_image}
              onChange={(e) => updateField('featured_image', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="https://..."
            />
          </div>

          {/* Gallery */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Gallery (pipe-separated URLs)</label>
            <textarea
              value={form.gallery}
              onChange={(e) => updateField('gallery', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="https://img1.jpg|https://img2.jpg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Describe the coworking space..."
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6 border-t border-slate-100 pt-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_popular}
                onChange={(e) => updateField('is_popular', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Popular
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateField('is_active', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Active (Visible on site)
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
