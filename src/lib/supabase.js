import { createClient } from '@supabase/supabase-js'

// ── Supabase connection (public / browser-safe) ──────────────────────────────
// This is the "publishable" key — it is DESIGNED to be exposed in the browser.
// Your data is protected by Row Level Security (see supabase/schema.sql).
// It replaces the old `anon` JWT, which has been disabled on this project.
//
// An env var still takes priority so the key can be swapped without a code
// change (e.g. when pointing a preview build at a different project).

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://oijtkvkyefqfwuycibcv.supabase.co'

const PUBLISHABLE_KEY = 'sb_publishable_w7-240CdmLJ_xZy5Fg11Fg__ZI-wPO1'

const SUPABASE_PUBLIC_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLIC_KEY)

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
      auth: { persistSession: false },
    })
  : null
