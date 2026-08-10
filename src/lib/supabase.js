import { createClient } from '@supabase/supabase-js'

// ── Supabase connection ──────────────────────────────────────
// The anon key is SAFE to expose in the browser, your data is protected by
// Row Level Security (RLS) policies (see supabase/schema.sql).
// These values are your Supabase project credentials (anon = public-safe).

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://oijtkvkyefqfwuycibcv.supabase.co'
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9panRrdmt5ZWZxZnd1eWNpYmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjUwODksImV4cCI6MjEwMDU0MTA4OX0.wzNvJ2nRN4appxtLFhinIy4aEQ-qT9LpqngWhzfPgrw'

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    })
  : null
