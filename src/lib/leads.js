import { supabase, isSupabaseConfigured } from './supabase'

/**
 * Save a lead / enquiry to Supabase (table: public.leads).
 * Degrades gracefully: if Supabase isn't configured yet, it logs and
 * returns { skipped: true } so the UI still shows a success state.
 */
export async function saveLead(lead = {}) {
  const payload = {
    name: (lead.name || '').trim(),
    phone: (lead.phone || '').trim(),
    email: (lead.email || '').trim() || null,
    interest: (lead.interest || '').trim() || null,
    city: (lead.city || '').trim() || null,
    message: (lead.message || '').trim() || null,
    source: lead.source || 'website',
    page: typeof window !== 'undefined' ? window.location.pathname : null,
  }

  if (!isSupabaseConfigured || !supabase) {
    // Not connected yet — don't block the user.
    console.warn('[leads] Supabase not configured; lead captured locally only:', payload)
    return { ok: false, skipped: true }
  }

  const { error } = await supabase.from('leads').insert(payload)
  if (error) {
    console.error('[leads] insert failed:', error.message)
    return { ok: false, error }
  }
  return { ok: true }
}
