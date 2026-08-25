-- Add focus_keyphrase column to blog_posts for SEO optimization
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS focus_keyphrase text;
