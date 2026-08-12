#!/usr/bin/env node
/**
 * Migrate blog posts from the WordPress site (easemyoffice.in) into the
 * Supabase `blog_posts` table on the new site.
 *
 * WHAT IT DOES:
 *   1. Fetches all published posts from the WordPress REST API (public, no auth)
 *   2. Extracts title, slug, excerpt, featured image, category, date
 *   3. Converts the HTML body to Markdown (what ArticleBlocks renders)
 *   4. Upserts into `blog_posts` (slug is UNIQUE, so re-running is safe)
 *
 * USAGE:
 *   # Dry run — see what would be inserted, writes nothing
 *   node scripts/migrate-blog.mjs --dry-run
 *
 *   # Actually migrate
 *   SUPABASE_SERVICE_KEY=xxx node scripts/migrate-blog.mjs
 *
 *   # Migrate only posts newer than a date
 *   SUPABASE_SERVICE_KEY=xxx node scripts/migrate-blog.mjs --after 2026-06-01
 *
 * REQUIREMENTS:
 *   - Node 18+
 *   - SUPABASE_SERVICE_KEY env var (the service_role key, bypasses RLS)
 *   - The `blog_posts` table must already exist (run blog_posts_schema.sql first)
 *
 * NOTES:
 *   - WordPress trailing slashes: the slug stored is WITHOUT trailing slash,
 *     matching how React Router resolves /blog/{slug}.
 *   - HTML → Markdown: a lightweight conversion (headings, lists, paragraphs,
 *     bold, links-as-text, tables, blockquotes). Images and complex HTML are
 *     stripped rather than producing broken markdown.
 *   - Re-running is safe: uses Supabase's UPSERT (on conflict slug, update).
 *   - Posts with status != 'publish' in WP are skipped.
 */

const WP_BASE = 'https://easemyoffice.in/wp-json/wp/v2'
const SUPABASE_URL = 'https://oijtkvkyefqfwuycibcv.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

const args = process.argv.slice(2)
const DRY = args.includes('--dry-run')
const afterIdx = args.indexOf('--after')
const AFTER = afterIdx >= 0 ? args[afterIdx + 1] : null

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
}

// ── HTML → Markdown conversion ──────────────────────────────────────────────

/** Strip all HTML tags, decode common entities. */
function stripTags(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#?[a-z0-9]+;/gi, '')
}

/**
 * Convert WordPress HTML to simple Markdown suitable for markdownToBlocks.
 * Deliberately lossy: we care about headings, paragraphs, lists and bold.
 * Images, embeds, shortcodes and complex nesting are dropped.
 */
function htmlToMarkdown(html) {
  if (!html) return ''

  let md = html
    // Remove the Table of Contents plugin block
    .replace(/<div[^>]*class="ez-toc[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, '')
    // Remove script/style
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Headings
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n# ${stripTags(t).trim()}\n`)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n# ${stripTags(t).trim()}\n`)
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n## ${stripTags(t).trim()}\n`)
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n### ${stripTags(t).trim()}\n`)
    .replace(/<h[56][^>]*>([\s\S]*?)<\/h[56]>/gi, (_, t) => `\n### ${stripTags(t).trim()}\n`)
    // Blockquotes
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) => {
      const text = stripTags(t).trim().replace(/\n+/g, ' ')
      return `\n> ${text}\n`
    })
    // Lists: convert <li> to bullets, strip <ul>/<ol> wrappers
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${stripTags(t).trim()}\n`)
    .replace(/<\/?[ou]l[^>]*>/gi, '\n')
    // Bold / strong
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `**${stripTags(t).trim()}**`)
    // Paragraphs / divs → double newline
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<div[^>]*>/gi, '')
    // Tables
    .replace(/<table[\s\S]*?<\/table>/gi, (table) => {
      const rows = []
      const rowMatches = table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)
      for (const rm of rowMatches) {
        const cells = [...rm[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((m) =>
          stripTags(m[1]).trim()
        )
        rows.push(cells)
      }
      if (rows.length === 0) return ''
      const colCount = Math.max(...rows.map((r) => r.length))
      const lines = rows.map((r) => '| ' + r.concat(Array(colCount - r.length).fill('')).join(' | ') + ' |')
      if (lines.length > 1) {
        lines.splice(1, 0, '| ' + Array(colCount).fill('---').join(' | ') + ' |')
      }
      return '\n' + lines.join('\n') + '\n'
    })
    // Remove remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Decode remaining entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#?[a-z0-9]+;/gi, '')
    // Clean up excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return md
}

/** Rough reading time estimate. */
function readMinutes(text) {
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

// ── WordPress fetching ──────────────────────────────────────────────────────

async function fetchCategories() {
  const res = await fetch(`${WP_BASE}/categories?per_page=100&_fields=id,name`)
  if (!res.ok) throw new Error(`categories: HTTP ${res.status}`)
  const data = await res.json()
  return Object.fromEntries(data.map((c) => [c.id, c.name]))
}

async function fetchAllPosts(categoryMap) {
  const posts = []
  let page = 1
  const PER_PAGE = 50

  while (true) {
    const url = `${WP_BASE}/posts?per_page=${PER_PAGE}&page=${page}&_embed&status=publish&orderby=date&order=desc`
    const res = await fetch(url)
    if (!res.ok) {
      if (res.status === 400) break // past the last page
      throw new Error(`posts page ${page}: HTTP ${res.status}`)
    }
    const data = await res.json()
    if (!data.length) break

    for (const p of data) {
      const slug = p.slug.replace(/\/$/, '') // no trailing slash
      const title = stripTags(p.title.rendered || '').trim()
      const excerpt = stripTags(p.excerpt?.rendered || '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 500)
      const contentHtml = p.content?.rendered || ''
      const content = htmlToMarkdown(contentHtml)
      const published_at = p.date_gmt ? p.date_gmt + 'Z' : p.date
      const modified_at = p.modified_gmt ? p.modified_gmt + 'Z' : p.modified

      // Featured image
      const media = p._embedded?.['wp:featuredmedia']?.[0]
      const cover_image = media?.source_url || null

      // Category (take the first non-Uncategorized)
      const catIds = p.categories || []
      const category =
        catIds
          .map((id) => categoryMap[id])
          .filter((name) => name && name !== 'Uncategorized')[0] || null

      // Skip if before --after date
      if (AFTER && published_at < AFTER) continue

      posts.push({
        slug,
        title,
        excerpt: excerpt || title,
        cover_image,
        category,
        author: 'EaseMyOffice',
        content,
        content_format: 'markdown',
        read_minutes: readMinutes(content),
        is_featured: false,
        is_active: true,
        published_at,
        updated_at: modified_at,
      })
    }

    const total = parseInt(res.headers.get('x-wp-totalpages') || '1', 10)
    if (page >= total) break
    page++
  }

  return posts
}

// ── Supabase upsert ─────────────────────────────────────────────────────────

async function upsertPosts(posts) {
  // Supabase REST does not support bulk upsert with ON CONFLICT in the way
  // PostgreSQL does natively, so we use the POST with Prefer: resolution=merge-duplicates
  // which requires a UNIQUE constraint on slug (which the schema has).
  const BATCH = 20
  let inserted = 0
  let updated = 0
  let failed = 0

  for (let i = 0; i < posts.length; i += BATCH) {
    const batch = posts.slice(i, i + BATCH)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify(batch),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error(c.red(`  batch ${i / BATCH + 1} failed: HTTP ${res.status}`))
      console.error(c.dim(`  ${body.slice(0, 200)}`))
      failed += batch.length
      continue
    }

    const result = await res.json()
    inserted += result.length
    process.stdout.write(`  batch ${Math.floor(i / BATCH) + 1}: ${result.length} rows\r`)
  }

  return { inserted, updated, failed }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(c.bold(`\n${DRY ? 'DRY RUN — ' : ''}WordPress → Supabase blog migration\n`))

  if (AFTER) console.log(c.dim(`  filtering: posts after ${AFTER}\n`))

  console.log('  Fetching categories...')
  const categoryMap = await fetchCategories()
  console.log(`  ${Object.keys(categoryMap).length} categories found`)

  console.log('  Fetching posts from WordPress...')
  const posts = await fetchAllPosts(categoryMap)
  console.log(`  ${c.bold(String(posts.length))} posts fetched\n`)

  if (!posts.length) {
    console.log(c.yellow('  Nothing to migrate.\n'))
    return
  }

  // Summary
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))].sort()
  console.log(`  Categories: ${categories.join(', ')}`)
  console.log(`  Date range: ${posts[posts.length - 1].published_at.slice(0, 10)} → ${posts[0].published_at.slice(0, 10)}`)
  console.log(`  With cover image: ${posts.filter((p) => p.cover_image).length}/${posts.length}`)
  console.log(`  Avg read time: ${Math.round(posts.reduce((s, p) => s + p.read_minutes, 0) / posts.length)} min`)
  console.log('')

  // Show a sample
  console.log(c.dim('  Sample (first 5):'))
  for (const p of posts.slice(0, 5)) {
    console.log(
      c.dim(
        `    ${p.slug.slice(0, 45).padEnd(45)} ${String(p.read_minutes).padStart(2)} min  ${p.category || '-'}`
      )
    )
  }
  console.log('')

  if (DRY) {
    console.log(c.yellow('  Dry run complete. No data was written.\n'))
    console.log(
      c.dim(
        `  To migrate for real:\n  SUPABASE_SERVICE_KEY=xxx node scripts/migrate-blog.mjs\n`
      )
    )
    return
  }

  if (!SERVICE_KEY) {
    console.error(
      c.red('\n  SUPABASE_SERVICE_KEY is not set.\n\n') +
        `  The anon key is read-only. Writing needs the service_role key.\n` +
        `  Get it from: Supabase Dashboard → Project Settings → API\n\n` +
        `  ${c.bold('SUPABASE_SERVICE_KEY=xxx node scripts/migrate-blog.mjs')}\n`
    )
    process.exit(1)
  }

  console.log(`  Upserting ${posts.length} posts into blog_posts...`)
  const { inserted, failed } = await upsertPosts(posts)
  console.log('')

  if (failed) {
    console.log(c.red(`  ${failed} posts failed to insert.`))
  }
  console.log(
    c.green(`  ${inserted} posts migrated successfully.\n`) +
      c.dim('  Content is live immediately at /blog on the new site.\n')
  )
}

main().catch((e) => {
  console.error(c.red(`\n  ${e.stack || e.message}\n`))
  process.exit(1)
})
