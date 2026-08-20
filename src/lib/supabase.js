import { createClient } from '@supabase/supabase-js'

// ── Supabase connection (public / browser-safe) ──────────────────────────────
// Supabase is migrating away from the legacy `anon` JWT to a new
// "publishable" key (sb_publishable_…). Both are browser-safe — your data is
// protected by Row Level Security (see supabase/schema.sql).
//
// Resolution order:
//   1. VITE_SUPABASE_PUBLISHABLE_KEY  (new format, preferred)
//   2. VITE_SUPABASE_ANON_KEY         (legacy JWT)
//   3. hardcoded legacy anon fallback — kept only so the site keeps working
//      until the new key is configured. Once you disable legacy JWT keys in
//      the Supabase dashboard, set one of the env vars above.

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://oijtkvkyefqfwuycibcv.supabase.co'

const LEGACY_ANON_FALLBACK =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9panRrdmt5ZWZxZnd1eWNpYmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjUwODksImV4cCI6MjEwMDU0MTA4OX0.wzNvJ2nRN4appxtLFhinIy4aEQ-qT9LpqngWhzfPgrw'

const SUPABASE_PUBLIC_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  LEGACY_ANON_FALLBACK

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLIC_KEY)

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
      auth: { persistSession: false },
    })
  : null
