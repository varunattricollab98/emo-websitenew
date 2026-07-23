import { useState, useMemo, useEffect } from 'react'
import { MapPin, ChevronDown, Check, Hash, Plus, Loader2 } from 'lucide-react'
import { voCities } from '../../data/spaces'
import { resolvePincode, lookupPincode } from '../../data/pincodes'

/**
 * Editable location combobox used across the site.
 * - Search by city name, state, or PINCODE.
 * - Paste/type any custom location (free-text) — the "Use …" option.
 * - `onChange(value)` receives the chosen text (city name or custom string).
 */
export default function LocationSelect({
  value = '',
  onChange,
  id,
  name,
  placeholder = 'Type city, state or pincode…',
  required = false,
}) {
  const [input, setInput] = useState(value)
  const [open, setOpen] = useState(false)
  const [apiResult, setApiResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setInput(value)
  }, [value])

  const raw = input.trim()
  const q = raw.toLowerCase()
  const isNumeric = /^\d+$/.test(raw)

  const suggestions = useMemo(() => {
    if (!q) return voCities.slice(0, 30)
    if (isNumeric) return resolvePincode(raw)
    return voCities
      .filter((c) => c.name.toLowerCase().includes(q) || (c.state || '').toLowerCase().includes(q))
      .slice(0, 30)
  }, [q, isNumeric, raw])

  // API fallback for a full 6-digit pincode not covered by the offline map
  useEffect(() => {
    setApiResult(null)
    if (!/^\d{6}$/.test(raw) || resolvePincode(raw).length > 0) return
    let cancelled = false
    setLoading(true)
    const t = setTimeout(async () => {
      const r = await lookupPincode(raw)
      if (!cancelled) {
        setApiResult(r)
        setLoading(false)
      }
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [raw])

  const pick = (label) => {
    setInput(label)
    onChange?.(label)
    setOpen(false)
  }

  const exactMatch = voCities.some((c) => c.name.toLowerCase() === q)

  return (
    <div className="relative">
      <MapPin className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-primary" />
      <input
        id={id}
        name={name}
        value={input}
        required={required}
        autoComplete="off"
        onChange={(e) => {
          setInput(e.target.value)
          onChange?.(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        aria-label="Location"
        className="w-full rounded-xl border border-primary-200 bg-white py-3 pl-10 pr-9 text-sm text-navy-dark outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <ChevronDown
        className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform ${
          open ? 'rotate-180' : ''
        }`}
      />

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 z-40 mt-2 rounded-2xl border border-primary-100 bg-white p-2 shadow-card-hover">
            {isNumeric && (
              <p className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <Hash className="h-3 w-3" />
                Pincode search
              </p>
            )}
            <ul className="sky-scroll max-h-56 space-y-0.5 overflow-y-auto pr-1">
              {suggestions.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => pick(c.name)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-navy-dark transition-colors hover:bg-surface-light"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{c.name}</span>
                      <span className="block truncate text-[11px] text-slate-400">{c.state}</span>
                    </span>
                    <MapPin className="h-3.5 w-3.5 flex-none text-primary/50" />
                  </button>
                </li>
              ))}

              {/* API-resolved district for uncovered pincodes */}
              {apiResult && (
                <li>
                  <button
                    type="button"
                    onClick={() => pick(apiResult.name)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-navy-dark transition-colors hover:bg-surface-light"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{apiResult.name}</span>
                      <span className="block truncate text-[11px] text-slate-400">
                        {apiResult.state} · from pincode {raw}
                      </span>
                    </span>
                    <Check className="h-3.5 w-3.5 flex-none text-accent-emerald" />
                  </button>
                </li>
              )}

              {loading && (
                <li className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Looking up pincode…
                </li>
              )}

              {!loading && suggestions.length === 0 && !apiResult && (
                <li className="px-3 py-2.5 text-sm text-slate-400">
                  {isNumeric ? 'No city for this pincode yet — type your city below.' : 'No match found.'}
                </li>
              )}
            </ul>

            {/* free-text: use exactly what was typed (paste any location) */}
            {raw && !exactMatch && (
              <button
                type="button"
                onClick={() => pick(input)}
                className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-primary-100 px-3 py-2.5 text-left text-sm font-semibold text-primary transition-colors hover:bg-primary-50"
              >
                <Plus className="h-4 w-4" />
                Use “{input}”
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
