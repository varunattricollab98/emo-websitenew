import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'

// Strip any HTML tags from answers so the schema stays clean plain text.
const stripHtml = (s = '') => String(s).replace(/<[^>]*>/g, '').trim()

/**
 * Injects Google FAQPage structured data (JSON-LD) into <head> as a real DOM
 * <script> node. This is more reliable than rendering <script> in JSX, search
 * engines read it from the rendered <head>, and it updates/cleans up per page.
 */
function useFaqSchema(items) {
  useEffect(() => {
    const valid = (items || []).filter((it) => it && it.q && it.a)
    if (valid.length === 0) return

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: valid.map((it) => ({
        '@type': 'Question',
        name: stripHtml(it.q),
        acceptedAnswer: { '@type': 'Answer', text: stripHtml(it.a) },
      })),
    }

    // Remove any existing FAQ schema (prerendered static one, or a previous
    // page's during client-side navigation) so there's never a duplicate.
    document.querySelectorAll('script[data-faq-schema]').forEach((n) => n.remove())

    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.setAttribute('data-faq-schema', 'true')
    el.text = JSON.stringify(schema)
    document.head.appendChild(el)

    return () => {
      if (el.parentNode) el.parentNode.removeChild(el)
    }
  }, [items])
}

export default function FaqAccordion({ items = [] }) {
  const [open, setOpen] = useState(0)
  // SEO: emit FAQ rich-result structured data into <head>
  useFaqSchema(items)
  return (
    <div className="space-y-4">

      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
              isOpen
                ? 'border-primary/30 bg-gradient-to-br from-primary-50/70 via-white to-white shadow-card'
                : 'border-primary-100 bg-white shadow-soft hover:border-primary/25 hover:shadow-card'
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span
                className={`text-base font-bold transition-colors ${
                  isOpen ? 'text-primary-800' : 'text-navy-dark'
                }`}
              >
                {item.q}
              </span>
              <span
                className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-full transition-all duration-300 ${
                  isOpen
                    ? 'rotate-45 bg-primary-gradient text-white shadow-card'
                    : 'bg-primary-50 text-primary'
                }`}
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-[15px] leading-relaxed text-slate-600">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
