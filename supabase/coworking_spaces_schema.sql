-- ============================================================================
-- coworking_spaces — dedicated coworking listings for /coworking pages
-- ============================================================================
-- Run this whole file in: Supabase Dashboard -> SQL Editor -> New Query -> Run
--
-- Or use the seed script (scripts/seed-coworking.mjs) which will attempt to
-- create this table automatically before seeding data.
--
-- HOW TO ADD A SPACE:
--   1. Supabase Dashboard -> Table Editor -> coworking_spaces -> Insert row
--   2. Fill in name, city_slug, city_name, locality, and pricing fields
--   3. Save. It appears on /coworking immediately (no deploy needed).
--
-- HOW TO HIDE A SPACE:
--   Set is_active = false. The row is kept but hidden from the site.
--
-- COLUMNS:
--   name                 Space name, e.g. 'Signature Coworking'
--   city_slug            URL slug for the city, e.g. 'bangalore'
--   city_name            Display name for city, e.g. 'Bengaluru'
--   locality             Area/locality within city, e.g. 'Koramangala'
--   state                State name, e.g. 'Karnataka'
--   full_address         Complete address string
--   pricing_hot_desk     Monthly hot desk price in INR
--   pricing_dedicated_desk Monthly dedicated desk price in INR
--   pricing_private_cabin Monthly private cabin price in INR
--   pricing_day_pass     Day pass price in INR
--   seats                Capacity description, e.g. '4-100 seats'
--   rating               Rating out of 5
--   tags                 Pipe-separated tags, e.g. 'Metro nearby|24x7 access'
--   amenities            Pipe-separated amenities list
--   featured_image       Primary image URL
--   gallery              Pipe-separated gallery image URLs
--   description          About text for the space
--   is_popular           Whether to show POPULAR badge
--   is_active            false = hidden from site
--   sort_order           Lower shows first
-- ============================================================================

CREATE TABLE IF NOT EXISTS coworking_spaces (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  name                  TEXT NOT NULL,
  city_slug             TEXT NOT NULL,
  city_name             TEXT,
  locality              TEXT,
  state                 TEXT,
  full_address          TEXT,

  -- Pricing (all in INR)
  pricing_hot_desk      INTEGER,
  pricing_dedicated_desk INTEGER,
  pricing_private_cabin INTEGER,
  pricing_day_pass      INTEGER,

  seats                 TEXT,
  rating                NUMERIC,
  tags                  TEXT,          -- pipe-separated
  amenities             TEXT,          -- pipe-separated
  featured_image        TEXT,
  gallery               TEXT,          -- pipe-separated URLs
  description           TEXT,

  is_popular            BOOLEAN DEFAULT false,
  is_active             BOOLEAN DEFAULT true,
  sort_order            INTEGER DEFAULT 0,

  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coworking_spaces_city_active
  ON coworking_spaces (city_slug, is_active);

-- Unique constraint for upsert operations (used by seed script)
ALTER TABLE coworking_spaces
  ADD CONSTRAINT coworking_spaces_name_city_slug_unique UNIQUE (name, city_slug);

ALTER TABLE coworking_spaces ENABLE ROW LEVEL SECURITY;

-- Public (anon key) can read active spaces only
DROP POLICY IF EXISTS "Public can read active coworking spaces" ON coworking_spaces;
CREATE POLICY "Public can read active coworking spaces"
  ON coworking_spaces
  FOR SELECT
  USING (is_active = true);

-- Service role (admin) can do everything — implicit via service_role bypass
