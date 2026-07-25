import { createClient } from '@supabase/supabase-js'

// ── Supabase connection ──────────────────────────────────────
// Set these two values as environment variables:
//   VITE_SUPABASE_URL       e.g. https://xxxxxxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY  the public "anon" key from Project Settings → API
//
// The anon key is SAFE to expose in the browser — your data is protected by
// Row Level Security (RLS) policies (see supabase/schema.sql).
//
// Local dev: put them in a .env file (see .env.example).
// Cloudflare: add them as Build environment variables so they're baked in at build time.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    })
  : null
