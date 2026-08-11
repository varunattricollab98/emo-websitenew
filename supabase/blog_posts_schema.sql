-- ============================================================================
-- blog_posts — standalone blog posts for /blog and /blog/{slug}
-- ============================================================================
-- Run this whole file in: Supabase Dashboard -> SQL Editor -> New Query -> Run
--
-- NOTE: this is a DIFFERENT table from `blog_articles`.
--   blog_articles = long-form sections embedded INSIDE city/service pages
--                   (keyed by page_type/city_slug/service_slug, no URL of its own)
--   blog_posts    = real blog posts with their own URL at /blog/{slug}
--
-- HOW TO ADD A POST:
--   1. Supabase Dashboard -> Table Editor -> blog_posts -> Insert row
--   2. Fill in slug, title, excerpt, content (markdown), category, cover_image
--   3. Save. It appears on /blog immediately (no deploy needed).
--
-- CONTENT FORMAT (markdown, same as the other articles on this site):
--   # Heading            -> H2 section heading
--   ## / ### Subheading  -> H3
--   - item  /  * item    -> bullet list
--   > text               -> highlighted quote
--   | a | b |            -> table (add a |---|---| separator row)
--   **bold**             -> bold
--   Plain lines          -> paragraphs
--   Raw HTML is NOT supported, it renders as escaped text.
--
-- COLUMNS:
--   slug            URL segment, must be unique. e.g. 'gst-registration-guide'
--                   -> live at /blog/gst-registration-guide
--   title           Post headline
--   excerpt         1-2 line summary shown on the listing cards
--   cover_image     Image URL shown on the card + at the top of the post
--   category        Groups posts and drives the filter pills, e.g. 'GST'
--   author          Byline, defaults to 'EaseMyOffice'
--   content         The post body in markdown
--   read_minutes    Shown as "5 min read". Leave NULL to hide it.
--   is_featured     true = highlighted large at the top of /blog
--   is_active       false = hidden from the site without deleting
--   published_at    Shown as the post date, also controls ordering
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- URL segment: /blog/{slug}
  slug             TEXT NOT NULL UNIQUE,

  title            TEXT NOT NULL,
  excerpt          TEXT,
  cover_image      TEXT,
  category         TEXT,
  author           TEXT DEFAULT 'EaseMyOffice',

  -- Post body, markdown (see format notes above)
  content          TEXT NOT NULL,
  content_format   TEXT DEFAULT 'markdown',

  -- SEO overrides, fall back to title/excerpt when empty
  meta_title       TEXT,
  meta_description TEXT,

  read_minutes     INTEGER,
  is_featured      BOOLEAN DEFAULT false,
  is_active        BOOLEAN DEFAULT true,
  sort_order       INTEGER DEFAULT 0,

  published_at     TIMESTAMPTZ DEFAULT now(),
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- Listing query: active posts, newest first
CREATE INDEX IF NOT EXISTS idx_blog_posts_listing
  ON blog_posts (published_at DESC)
  WHERE is_active = true;

-- Detail query: lookup by slug
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug
  ON blog_posts (slug)
  WHERE is_active = true;

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public (anon key) can read published posts only
DROP POLICY IF EXISTS "Public can read active blog posts" ON blog_posts;
CREATE POLICY "Public can read active blog posts"
  ON blog_posts
  FOR SELECT
  USING (is_active = true);

-- ============================================================================
-- EXAMPLE POSTS, uncomment and edit to publish your first ones
-- ============================================================================
-- INSERT INTO blog_posts
--   (slug, title, excerpt, category, cover_image, read_minutes, is_featured, content)
-- VALUES
--   (
--     'virtual-office-gst-registration-guide',
--     'How to Use a Virtual Office for GST Registration in 2026',
--     'A step-by-step walkthrough of the documents, the process and the mistakes that get GST applications rejected.',
--     'GST',
--     'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
--     7,
--     true,
--     '# Why a virtual office works for GST
--
-- GST registration is state-specific, so businesses selling across India often
-- need a valid place of business in several states.
--
-- ## Documents you receive
--
-- - Notarised rent agreement
-- - No Objection Certificate (NOC)
-- - Recent utility bill
--
-- > Tip: keep every document in the same business name as your PAN.'
--   ),
--   (
--     'ppob-vs-apob-explained',
--     'PPOB vs APOB: What Every Multi-State Seller Should Know',
--     'The difference between a Principal and an Additional Place of Business, and when you need each.',
--     'Compliance',
--     'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
--     5,
--     false,
--     '# The short version
--
-- Your PPOB is your main registered location. An APOB is any additional
-- warehouse, branch or sales office you declare.'
--   );
--
-- Verify:
-- SELECT slug, title, category, is_featured, published_at FROM blog_posts ORDER BY published_at DESC;
-- ============================================================================
