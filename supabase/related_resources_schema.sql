-- ============================================================
-- Related Resources Table — Editable internal links for pages
-- ============================================================
-- This table stores the "Related Resources" links that appear at
-- the bottom of service hub, city, and other pages. Instead of
-- hardcoding these links, they can be edited directly from the
-- Supabase Dashboard.
--
-- HOW TO USE:
-- 1. Go to Supabase Dashboard -> Table Editor -> related_resources
-- 2. Add/edit rows to update the related-resource links on any page
-- 3. Changes go live immediately (no code deploy needed!)
--
-- COLUMNS:
--   label       - The clickable text shown to the user
--   url         - Internal path (e.g. '/virtual-office' or '/city/gurgaon')
--   page_type   - Scopes links to a specific page type:
--                  'service-hub' | 'city' | 'space' | 'coworking'
--   service_slug - (nullable) Further scope to a specific service
--                  e.g. 'gst-registration', 'virtual-office'
--                  NULL means the links appear for all services of that page_type
--   sort_order  - Integer controlling display order (ascending)
--   is_active   - Toggle links on/off without deleting them
-- ============================================================

CREATE TABLE IF NOT EXISTS related_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- The visible link text
  label TEXT NOT NULL,

  -- Internal URL path (React Router will navigate to this)
  url TEXT NOT NULL,

  -- What page type these links belong to
  -- page_type: 'service-hub' | 'city' | 'space' | 'coworking'
  page_type TEXT NOT NULL DEFAULT 'service-hub',

  -- Optional: scope to a specific service (NULL = all services of that page_type)
  service_slug TEXT,

  -- Display order (lower = first)
  sort_order INTEGER DEFAULT 0,

  -- Toggle visibility without deleting
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by page type + service slug
CREATE INDEX IF NOT EXISTS idx_related_resources_lookup
  ON related_resources (page_type, service_slug)
  WHERE is_active = true;

-- Enable Row Level Security (read-only for anon)
ALTER TABLE related_resources ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anon key can read active resources)
CREATE POLICY "Public can read active related resources"
  ON related_resources
  FOR SELECT
  USING (is_active = true);

-- ============================================================
-- EXAMPLE DATA:
-- ============================================================
-- INSERT INTO related_resources (label, url, page_type, service_slug, sort_order)
-- VALUES
--   ('All Virtual Office Locations', '/virtual-office', 'service-hub', NULL, 1),
--   ('Virtual Office in Gurgaon', '/city/gurgaon', 'service-hub', NULL, 2),
--   ('Virtual Office in Bangalore', '/city/bangalore', 'service-hub', NULL, 3),
--   ('Virtual Office in Mumbai', '/city/mumbai', 'service-hub', NULL, 4),
--   ('Virtual Office in Delhi', '/city/delhi', 'service-hub', NULL, 5),
--   ('Pricing & Plans', '/pricing', 'service-hub', NULL, 6),
--   ('CA & Compliance Services', '/ca-services', 'service-hub', NULL, 7);
--
-- To add links only for the GST Registration service page:
-- INSERT INTO related_resources (label, url, page_type, service_slug, sort_order)
-- VALUES
--   ('GST Filing Guide', '/blog/gst-filing', 'service-hub', 'gst-registration', 1),
--   ('GST Compliance', '/ca-services', 'service-hub', 'gst-registration', 2);
-- ============================================================
