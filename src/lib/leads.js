import { supabase, isSupabaseConfigured } from './supabase'

// ── Web3Forms Access Key ──────────────────────────────────────
// Get yours from: https://web3forms.com (free, up to 250 emails/month)
const WEB3FORMS_KEY = '24c2a048-dac6-4a5a-8956-2b36139f22fc'

/**
 * Send form data to Web3Forms → email notification to your inbox.
 * Runs in parallel with Supabase insert (doesn't block the user).
 */
async function sendEmailNotification(payload) {
  if (!WEB3FORMS_KEY) {
    console.warn('[leads] Web3Forms key not set, email notification skipped')
    return
  }

  try {
    console.log('[leads] Sending email notification via Web3Forms...')
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `New Lead, ${payload.interest || 'General Enquiry'} | ${payload.city || 'India'}`,
        from_name: 'EaseMyOffice Website',
        name: payload.name,
        phone: payload.phone,
        email: payload.email || 'not-provided@example.com',
        interest: payload.interest || 'General Enquiry',
        city: payload.city || 'Not specified',
        message: payload.message || '-',
        source: payload.source,
        page: payload.page || '/',
      }),
    })
    const data = await res.json()
    console.log('[leads] Web3Forms response:', data)
    if (!data.success) {
      console.warn('[leads] Web3Forms error:', data.message)
    }
  } catch (err) {
    console.error('[leads] Email notification failed:', err.message)
  }
}

/**
 * Save a lead / enquiry to Supabase (table: public.leads)
 * AND send an email notification via Web3Forms.
 *
 * Degrades gracefully: if either service fails, the UI still shows success.
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

  // Send email notification (fire & forget, don't block the UI)
  sendEmailNotification(payload)

  if (!isSupabaseConfigured || !supabase) {
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
