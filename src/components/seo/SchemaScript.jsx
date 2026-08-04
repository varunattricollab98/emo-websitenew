import { useEffect } from 'react'

/**
 * Injects JSON-LD structured data script(s) into <head>.
 * Cleans up on unmount (SPA page transitions).
 *
 * Props:
 *   schemas — a single schema object OR an array of schema objects
 *
 * Usage:
 *   <SchemaScript schemas={[orgSchema, webPageSchema]} />
 *   <SchemaScript schemas={faqSchema} />
 */
export default function SchemaScript({ schemas }) {
  useEffect(() => {
    if (!schemas) return
    const list = Array.isArray(schemas) ? schemas : [schemas]
    if (!list.length) return

    const scripts = list.map((schema) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-schema', 'dynamic')
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
      return script
    })

    return () => {
      scripts.forEach((s) => {
        if (s.parentNode) s.parentNode.removeChild(s)
      })
    }
  }, [schemas])

  return null
}
