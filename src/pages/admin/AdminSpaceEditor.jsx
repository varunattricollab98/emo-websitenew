import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'
import ImageUploadButton from '../../components/admin/ImageUploadButton'

const EMPTY_SPACE = {
  space_name: '',
  address_area: '',
  address_city: '',
  address_state: '',
  full_address: '',
  listing_address: '',
  pricing_monthly: '',
  pricing_gst: '',
  pricing_br: '',
  pricing_ma: '',
  featured_image: '',
  space_images: '',
  property_feature: '',
  description: '',
  overview: '',
  highlights: '',
  rating: '',
  badge: '',
  processing_time: '',
  property_type: '',
  map_query: '',
  map_location: '',
  is_active: true,
}

export default function AdminSpaceEditor() {
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
      .from('spaces')
      .select('*')
      .eq('id', id)
      .single()

    if (err) {
      setError('Space not found: ' + err.message)
    } else if (data) {
      setForm({
        space_name: data.space_name || '',
        address_area: data.address_area || '',
        address_city: data.address_city || '',
        address_state: data.address_state || '',
        full_address: data.full_address || '',
        listing_address: data.listing_address || '',
        pricing_monthly: data.pricing_monthly ?? '',
        pricing_gst: data.pricing_gst ?? '',
        pricing_br: data.pricing_br ?? '',
        pricing_ma: data.pricing_ma ?? '',
        featured_image: data.featured_image || '',
        space_images: data.space_images || '',
        property_feature: data.property_feature || '',
        description: data.description || '',
        overview: data.overview || '',
        highlights: data.highlights || '',
        rating: data.rating ?? '',
        badge: data.badge || '',
        processing_time: data.processing_time || '',
        property_type: data.property_type || '',
        map_query: data.map_query || '',
        map_location: data.map_location || '',
        is_active: data.is_active ?? true,
      })
    }
    setLoading(false)
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!form.space_name.trim()) {
      setError('Space name is required.')
      return
    }

    setSaving(true)
    setError('')

    const payload = {
      space_name: form.space_name,
      address_area: form.address_area,
      address_city: form.address_city,
      address_state: form.address_state,
      full_address: form.full_address,
      listing_address: form.listing_address,
      pricing_monthly: form.pricing_monthly === '' ? null : Number(form.pricing_monthly),
      pricing_gst: form.pricing_gst === '' ? null : Number(form.pricing_gst),
      pricing_br: form.pricing_br === '' ? null : Number(form.pricing_br),
      pricing_ma: form.pricing_ma === '' ? null : Number(form.pricing_ma),
      featured_image: form.featured_image,
      space_images: form.space_images,
      property_feature: form.property_feature,
      description: form.description,
      overview: form.overview,
      highlights: form.highlights,
      rating: form.rating === '' ? null : Number(form.rating),
      badge: form.badge,
      processing_time: form.processing_time,
      property_type: form.property_type,
      map_query: form.map_query,
      map_location: form.map_location,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    }

    let result
    if (isEditing) {
      result = await adminClient
        .from('spaces')
        .update(payload)
        .eq('id', id)
    } else {
      payload.created_at = new Date().toISOString()
      result = await adminClient
        .from('spaces')
        .insert(payload)
    }

    if (result.error) {
      setError('Save failed: ' + result.error.message)
    } else {
      navigate('/admin/spaces')
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
              onClick={() => navigate('/admin/spaces')}
              className="text-sm text-slate-500 transition hover:text-slate-700"
            >
              &larr; Back to Virtual Offices
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
        <div className="space-y-6">
          {/* Basic Info Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">Basic Info</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Space Name *</label>
                <input
                  type="text"
                  value={form.space_name}
                  onChange={(e) => updateField('space_name', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Space name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Property Type</label>
                  <input
                    type="text"
                    value={form.property_type}
                    onChange={(e) => updateField('property_type', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g. Virtual Office, Business Centre"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Badge</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => updateField('badge', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g. Popular, Premium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">Address</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Area</label>
                  <input
                    type="text"
                    value={form.address_area}
                    onChange={(e) => updateField('address_area', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g. Connaught Place"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
                  <input
                    type="text"
                    value={form.address_city}
                    onChange={(e) => updateField('address_city', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g. Delhi"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">State</label>
                  <input
                    type="text"
                    value={form.address_state}
                    onChange={(e) => updateField('address_state', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g. Delhi, Maharashtra"
                  />
                </div>
              </div>
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
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Listing Address</label>
                <input
                  type="text"
                  value={form.listing_address}
                  onChange={(e) => updateField('listing_address', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Address shown on listing cards"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Map Query</label>
                  <input
                    type="text"
                    value={form.map_query}
                    onChange={(e) => updateField('map_query', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Google Maps search query"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Map Location</label>
                  <input
                    type="text"
                    value={form.map_location}
                    onChange={(e) => updateField('map_location', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Lat,Lng or embed URL"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">Pricing</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Monthly</label>
                <input
                  type="number"
                  value={form.pricing_monthly}
                  onChange={(e) => updateField('pricing_monthly', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="₹/mo"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">GST</label>
                <input
                  type="number"
                  value={form.pricing_gst}
                  onChange={(e) => updateField('pricing_gst', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="₹"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Business Registration</label>
                <input
                  type="number"
                  value={form.pricing_br}
                  onChange={(e) => updateField('pricing_br', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="₹"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Mailing Address</label>
                <input
                  type="number"
                  value={form.pricing_ma}
                  onChange={(e) => updateField('pricing_ma', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="₹"
                />
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">Media</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Featured Image (URL)</label>
                <input
                  type="text"
                  value={form.featured_image}
                  onChange={(e) => updateField('featured_image', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="https://..."
                />
                <ImageUploadButton
                  folder="spaces"
                  onUpload={(url) => updateField('featured_image', url)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Space Images (pipe-separated URLs)</label>
                <textarea
                  value={form.space_images}
                  onChange={(e) => updateField('space_images', e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="https://img1.jpg|https://img2.jpg"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">Content</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Short description..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Overview</label>
                <textarea
                  value={form.overview}
                  onChange={(e) => updateField('overview', e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Detailed overview..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Highlights</label>
                <textarea
                  value={form.highlights}
                  onChange={(e) => updateField('highlights', e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Key highlights..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Property Features</label>
                <textarea
                  value={form.property_feature}
                  onChange={(e) => updateField('property_feature', e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Features list..."
                />
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">Settings</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Rating (0-5)</label>
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
                  <label className="mb-1 block text-sm font-medium text-slate-700">Processing Time</label>
                  <input
                    type="text"
                    value={form.processing_time}
                    onChange={(e) => updateField('processing_time', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g. 2-3 days"
                  />
                </div>
                <div className="flex items-end">
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
        </div>
      </div>
    </div>
  )
}
