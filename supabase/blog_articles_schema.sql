-- ============================================================
-- Blog Articles Table — Editable content for all page types
-- ============================================================
-- This table stores blog/article content that appears on city,
-- space, coworking, and service pages (between Verified Addresses
-- and FAQ sections).
--
-- HOW TO USE:
-- 1. Go to Supabase Dashboard → Table Editor → blog_articles
-- 2. Add/edit rows to update content on any page
-- 3. Changes go live immediately (no code deploy needed!)
--
-- CONTENT FORMAT (JSON array — each item is a "block"):
--   "Just a string"              → renders as a paragraph
--   { "h": "Heading text" }      → renders as h2 heading
--   { "sub": "Subheading" }      → renders as h3 subheading
--   { "p": "Paragraph text" }    → same as a plain string
--   { "list": ["a", "b", "c"] }  → renders as checkmark list
--   { "bullets": ["a", "b"] }    → renders as bullet list
--   { "quote": "Quote text" }    → renders as highlighted quote
--
-- EXAMPLE content JSON:
-- [
--   "First paragraph of the article...",
--   { "h": "Why Choose Virtual Office?" },
--   "Another paragraph explaining benefits...",
--   { "list": ["Benefit 1", "Benefit 2", "Benefit 3"] },
--   { "quote": "Client testimonial here" }
-- ]
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- What page this article belongs to
  -- page_type: 'city' | 'space' | 'coworking' | 'service'
  page_type TEXT NOT NULL DEFAULT 'city',

  -- Identifiers to match the article to the correct page:
  -- For city pages:     city_slug = 'gurgaon' (or state slug like 'haryana')
  -- For space pages:    city_slug = 'gurgaon', area_slug = 'cyber-hub'
  -- For coworking:      city_slug = 'bangalore', area_slug = 'koramangala'
  -- For service pages:  city_slug = 'mumbai', service_slug = 'gst-registration'
  city_slug TEXT,
  area_slug TEXT,
  service_slug TEXT,

  -- Display fields
  title TEXT NOT NULL,
  eyebrow TEXT DEFAULT 'Guide',
  subtitle TEXT,

  -- The actual article content
  -- For JSON format: JSONB array of blocks (see format above)
  -- For Markdown format: plain text string with # headings, * bullets, > quotes
  content JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Content format: 'json' (default) or 'markdown'
  -- Use 'markdown' to write plain text instead of JSON arrays!
  content_format TEXT DEFAULT 'json',

  -- SEO / meta (optional, for future use)
  meta_title TEXT,
  meta_description TEXT,

  -- Status & ordering
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by page type + city
CREATE INDEX IF NOT EXISTS idx_blog_articles_lookup
  ON blog_articles (page_type, city_slug, area_slug, service_slug)
  WHERE is_active = true;

-- Enable Row Level Security (read-only for anon)
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anon key can read active articles)
CREATE POLICY "Public can read active articles"
  ON blog_articles
  FOR SELECT
  USING (is_active = true);

-- ============================================================
-- HOW TO ADD CONTENT:
-- ============================================================
-- Example 1: Article for Gurgaon city page
-- INSERT INTO blog_articles (page_type, city_slug, title, subtitle, content)
-- VALUES (
--   'city',
--   'gurgaon',
--   'Virtual Office in Gurugram — Complete Guide',
--   'Everything about virtual offices in Gurugram for GST and company registration.',
--   '[
--     "A virtual office in Gurugram provides...",
--     {"h": "Why Choose Gurugram?"},
--     "Gurugram is one of India''s top business hubs...",
--     {"list": ["Premium address", "GST ready", "Mail handling"]},
--     {"quote": "Best decision for our startup! — Client"}
--   ]'::jsonb
-- );
--
-- Example 2: Article for a specific space
-- INSERT INTO blog_articles (page_type, city_slug, area_slug, title, content)
-- VALUES (
--   'space',
--   'gurgaon',
--   'cyber-hub',
--   'Virtual Office in Cyber Hub, Gurugram',
--   '[...]'::jsonb
-- );
--
-- Example 3: Article for GST service page in Mumbai
-- INSERT INTO blog_articles (page_type, city_slug, service_slug, title, content)
-- VALUES (
--   'service',
--   'mumbai',
--   'gst-registration',
--   'GST Registration in Mumbai — Complete Guide',
--   '[...]'::jsonb
-- );
-- ============================================================
