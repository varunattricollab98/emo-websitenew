import { useState } from 'react'

/**
 * Renders an image with a graceful fallback. If the image fails to load,
 * the <img> is hidden so the parent's gradient background shows through,
 * ensuring nothing ever looks broken.
 */
export default function SmartImage({ src, alt = '', className = '', ...props }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  )
}
