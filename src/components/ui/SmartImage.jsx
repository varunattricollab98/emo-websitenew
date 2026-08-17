import { useState, useRef, useEffect } from 'react'

/**
 * Renders an image with:
 * - Graceful fallback (hides on error)
 * - Blur-up loading animation (fades in from blurred placeholder)
 * - Subtle visual enhancement (brightness/contrast/saturation)
 * - Native lazy loading + async decoding
 *
 * Pass `enhance={false}` to disable the CSS filter for decorative/bg images.
 */
export default function SmartImage({ src, alt = '', className = '', enhance = true, style, ...props }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  // Check if image was already cached (loaded before React hydrated)
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [])

  if (failed) return null

  // Subtle enhancement filter
  const enhanceStyle = enhance
    ? { filter: 'brightness(1.05) contrast(1.08) saturate(1.12)', ...style }
    : style

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`${className} transition-all duration-500 ${loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-[1.02]'}`}
      style={enhanceStyle}
      {...props}
    />
  )
}
