-- ============================================================================
-- job_openings — open roles shown on /careers
-- ============================================================================
-- Run this whole file in: Supabase Dashboard -> SQL Editor -> New Query -> Run
--
-- HOW TO POST A ROLE:
--   1. Supabase Dashboard -> Table Editor -> job_openings -> Insert row
--   2. Fill in title, department, location, and the markdown fields
--   3. Save. It appears on /careers immediately (no deploy needed).
--
-- HOW TO CLOSE A ROLE:
--   Set is_active = false. The row is kept for your records but hidden
--   from the site. When no roles are active, /careers shows a friendly
--   "no open roles" message inviting speculative applications.
--
-- MARKDOWN FIELDS (description, responsibilities, requirements):
--   - item        -> bullet list
--   # Heading     -> section heading
--   **bold**      -> bold
--   Plain lines   -> paragraphs
--   Raw HTML is NOT supported, it renders as escaped text.
--
-- COLUMNS:
--   title            Role name, e.g. 'Senior Sales Manager'
--   department       e.g. 'Sales' | 'Operations' | 'Engineering' | 'Marketing'
--   location         e.g. 'Gurugram' | 'Remote' | 'Hybrid, Gurugram'
--   employment_type  e.g. 'Full-time' | 'Part-time' | 'Internship' | 'Contract'
--   experience       e.g. '3-5 years' | 'Fresher' | '0-2 years'
--   description      Short role summary (markdown)
--   responsibilities What they will do (markdown bullets)
--   requirements     What you are looking for (markdown bullets)
--   apply_email      Where applications go, drives the Apply button mailto
--   sort_order       Lower shows first
--   is_active        false = role closed / hidden
-- ============================================================================

CREATE TABLE IF NOT EXISTS job_openings (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  title            TEXT NOT NULL,
  department       TEXT,
  location         TEXT,
  employment_type  TEXT DEFAULT 'Full-time',
  experience       TEXT,

  -- Markdown bodies (see format notes above)
  description      TEXT,
  responsibilities TEXT,
  requirements     TEXT,

  apply_email      TEXT DEFAULT 'careers@easemyoffice.in',

  is_active        BOOLEAN DEFAULT true,
  sort_order       INTEGER DEFAULT 0,

  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_openings_listing
  ON job_openings (sort_order ASC, created_at DESC)
  WHERE is_active = true;

ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;

-- Public (anon key) can read open roles only
DROP POLICY IF EXISTS "Public can read active job openings" ON job_openings;
CREATE POLICY "Public can read active job openings"
  ON job_openings
  FOR SELECT
  USING (is_active = true);

-- ============================================================================
-- EXAMPLE ROLES, uncomment and edit to post your first ones
-- ============================================================================
-- INSERT INTO job_openings
--   (title, department, location, employment_type, experience, sort_order,
--    description, responsibilities, requirements)
-- VALUES
--   (
--     'Senior Sales Manager',
--     'Sales',
--     'Gurugram',
--     'Full-time',
--     '3-5 years',
--     1,
--     'Own the full sales cycle for virtual office and compliance products across North India.',
--     '- Manage and convert inbound leads from the website and marketplaces
-- - Build relationships with CA firms and channel partners
-- - Own monthly revenue targets and report on pipeline health
-- - Work with the compliance team to keep onboarding smooth',
--     '- 3+ years in B2B sales, ideally SaaS, real estate or professional services
-- - Comfortable owning a number and working with a CRM
-- - Excellent spoken and written English and Hindi
-- - Based in or willing to relocate to Gurugram'
--   ),
--   (
--     'Compliance Associate',
--     'Operations',
--     'Gurugram',
--     'Full-time',
--     '1-3 years',
--     2,
--     'Prepare and verify GST and MCA documentation so client registrations clear on the first attempt.',
--     '- Draft rent agreements, NOCs and address proofs
-- - Verify client KYC and flag gaps before filing
-- - Coordinate with property owners for verification visits
-- - Keep clients updated through the registration process',
--     '- Experience with GST or MCA filings, or a CA/CS inter qualification
-- - Sharp eye for detail in documentation
-- - Confident on calls with clients and authorities'
--   );
--
-- Verify:
-- SELECT title, department, location, is_active FROM job_openings ORDER BY sort_order;
-- ============================================================================
