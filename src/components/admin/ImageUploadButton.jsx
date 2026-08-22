import { useState, useRef } from 'react'
import { getAdminClient } from '../../lib/supabaseAdmin'

/**
 * Image upload button that uploads to Supabase Storage (website-assets bucket)
 * and returns the public URL.
 *
 * @param {object} props
 * @param {(url: string) => void} props.onUpload - Called with the public URL after successful upload
 * @param {string} [props.folder='blog'] - Folder prefix inside the bucket (e.g. 'blog', 'coworking', 'spaces')
 */
export default function ImageUploadButton({ onUpload, folder = 'blog' }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError('')

    try {
      const client = getAdminClient()
      if (!client) {
        setUploadError('Not authenticated. Please sign in again.')
        setUploading(false)
        return
      }

      // Create unique filename: folder/timestamp-originalname
      const timestamp = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `${folder}/${timestamp}-${safeName}`

      const { data, error } = await client.storage
        .from('website-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        setUploadError('Upload failed: ' + error.message)
        setUploading(false)
        return
      }

      // Get the public URL
      const { data: urlData } = client.storage
        .from('website-assets')
        .getPublicUrl(filePath)

      if (urlData?.publicUrl) {
        onUpload(urlData.publicUrl)
      } else {
        setUploadError('Upload succeeded but could not get public URL.')
      }
    } catch (err) {
      setUploadError('Upload error: ' + (err.message || 'Unknown error'))
    } finally {
      setUploading(false)
      // Reset input so the same file can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="mt-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        {uploading ? (
          <>
            <svg className="h-4 w-4 animate-spin text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg className="h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Upload Image
          </>
        )}
      </button>
      {uploadError && (
        <p className="mt-1 text-xs text-red-600">{uploadError}</p>
      )}
    </div>
  )
}
