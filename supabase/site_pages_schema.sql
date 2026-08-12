-- ============================================================================
-- site_pages — editable legal/policy pages managed from /admin/pages
-- ============================================================================
-- Run this whole file in: Supabase Dashboard -> SQL Editor -> New Query -> Run
--
-- HOW TO EDIT A PAGE:
--   1. Go to /admin/pages in the admin panel
--   2. Click Edit on the page you want to update
--   3. Write your content in Markdown
--   4. Save. Changes appear on the public site immediately (no deploy needed).
--
-- FALLBACK BEHAVIOR:
--   If content is empty/null for a page, the public site shows the original
--   hardcoded legal content. This ensures pages always have content even before
--   any edits are made through the admin panel.
--
-- MARKDOWN FORMAT:
--   ## Heading     -> section heading
--   **bold**       -> bold
--   - item         -> bullet list
--   Plain lines    -> paragraphs
--   Raw HTML is NOT supported, it renders as escaped text.
--
-- COLUMNS:
--   slug             URL-safe identifier, e.g. 'privacy-policy'
--   title            Display title, e.g. 'Privacy Policy'
--   content          Page content in Markdown (null = use hardcoded fallback)
--   meta_title       SEO title override (optional)
--   meta_description SEO description override (optional)
--   is_active        false = page hidden from public site
-- ============================================================================

CREATE TABLE IF NOT EXISTS site_pages (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  slug             TEXT UNIQUE NOT NULL,
  title            TEXT NOT NULL,
  content          TEXT,

  meta_title       TEXT,
  meta_description TEXT,

  is_active        BOOLEAN DEFAULT true,

  updated_at       TIMESTAMPTZ DEFAULT now(),
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_pages_slug
  ON site_pages (slug)
  WHERE is_active = true;

ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

-- Public (anon key) can read active pages only
DROP POLICY IF EXISTS "Public can read active site pages" ON site_pages;
CREATE POLICY "Public can read active site pages"
  ON site_pages
  FOR SELECT
  USING (is_active = true);

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================
INSERT INTO site_pages (slug, title, content, is_active) VALUES
  ('privacy-policy', 'Privacy Policy', NULL, true),
  ('terms', 'Terms & Conditions', NULL, true),
  ('refund-policy', 'Refund Policy', NULL, true),
  ('disclaimer', 'Disclaimer', NULL, true),
  ('cookie-policy', 'Cookie Policy', NULL, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Verify:
-- SELECT slug, title, is_active, updated_at FROM site_pages ORDER BY slug;
-- ============================================================================
