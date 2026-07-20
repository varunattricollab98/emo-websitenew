import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'

export default function FaqAccordion({ items = [] }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="mx-auto max-w-3xl divide-y divide-primary-100 rounded-2xl border border-primary-100 bg-white shadow-card">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-base font-semibold text-navy-dark">{item.q}</span>
              <span
                className={`inline-flex h-8 w-8 flex-none items-center justify-center rounded-full transition-all ${
                  isOpen ? 'rotate-45 bg-primary text-white' : 'bg-primary-50 text-primary'
                }`}
              >
                <Plus className="h-4 w-4" />
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
                  <p className="px-6 pb-6 text-slate-600 leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
