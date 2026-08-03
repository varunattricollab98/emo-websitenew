import { useState } from 'react'

/**
 * Renders an image with a graceful fallback and subtle visual enhancement.
 * If the image fails to load, the <img> is hidden so the parent's gradient
 * background shows through, ensuring nothing ever looks broken.
 *
 * Enhancement: applies a subtle CSS filter to boost brightness, contrast,
 * and saturation — making space photos look more vivid and professional
 * without altering the source files.
 *
 * Pass `enhance={false}` to disable the filter for decorative/bg images.
 */
export default function SmartImage({ src, alt = '', className = '', enhance = true, style, ...props }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null

  // Subtle enhancement: slightly brighter, punchier contrast, warmer saturation
  const enhanceFilter = enhance
    ? { filter: 'brightness(1.05) contrast(1.08) saturate(1.12)', ...style }
    : style

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      style={enhanceFilter}
      {...props}
    />
  )
}
