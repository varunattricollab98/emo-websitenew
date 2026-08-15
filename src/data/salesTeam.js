// ── Sales Team WhatsApp Numbers ──────────────────────────────
// Numbers are fetched LIVE from Supabase (table: sales_team).
// To add/remove numbers: Supabase Dashboard → Table Editor → sales_team
//   - Add row: name + phone (e.g. "918882735038") → is_active = true
//   - Remove: set is_active = false
// No code changes needed!

import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Fallback numbers if Supabase isn't ready yet
const FALLBACK_NUMBERS = ['918505806981', '919559556968', '919319035455', '918795603616']

let _numbers = [...FALLBACK_NUMBERS]
let _fetched = false

// Fetch sales numbers from Supabase on app load
if (isSupabaseConfigured && supabase) {
  supabase
    .from('sales_team')
    .select('phone')
    .eq('is_active', true)
    .then(({ data }) => {
      if (data && data.length > 0) {
        _numbers = data.map((r) => r.phone)
        _fetched = true
      }
    })
}

/**
 * Returns the next WhatsApp number from the sales team (sequential rotation).
 * Each click goes to the next number in order — ensures equal distribution.
 */
let _rotationIndex = 0
export function getRandomSalesWhatsApp() {
  const num = _numbers[_rotationIndex % _numbers.length]
  _rotationIndex++
  return num
}

/**
 * Returns the full wa.me link with a random sales number.
 */
export function getWhatsAppLink(message = '') {
  const num = getRandomSalesWhatsApp()
  const base = `https://wa.me/${num}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
