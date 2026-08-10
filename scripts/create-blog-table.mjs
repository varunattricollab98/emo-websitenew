/**
 * Creates the blog_articles table in Supabase.
 *
 * Run: node scripts/create-blog-table.mjs
 *
 * NOTE: This uses the Supabase anon key which does NOT have permission
 * to create tables (DDL operations). You need to run the SQL manually
 * in Supabase Dashboard → SQL Editor.
 *
 * Alternatively, if you have the service_role key, set it as:
 *   SUPABASE_SERVICE_KEY=your_service_role_key node scripts/create-blog-table.mjs
 *
 * The SQL to run is in: supabase/blog_articles_schema.sql
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://oijtkvkyefqfwuycibcv.supabase.co'

// The anon key can't create tables — you need the service_role key for DDL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_KEY) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  blog_articles table — Setup Instructions                    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  The anon key cannot create tables.                          ║
║  Please run the SQL manually:                                ║
║                                                              ║
║  1. Go to: Supabase Dashboard → SQL Editor                   ║
║  2. Copy the SQL from: supabase/blog_articles_schema.sql     ║
║  3. Click "Run"                                              ║
║                                                              ║
║  OR if you have the service_role key:                         ║
║  SUPABASE_SERVICE_KEY=xxx node scripts/create-blog-table.mjs ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`)
  process.exit(0)
}

import { readFileSync } from 'fs'
import { resolve } from 'path'

const sql = readFileSync(resolve('supabase/blog_articles_schema.sql'), 'utf8')

// Strip comments from SQL
const cleanSql = sql.replace(/--.*$/gm, '').trim()

const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  },
  body: JSON.stringify({ query: cleanSql }),
})

if (res.ok) {
  console.log('✅ blog_articles table created successfully!')
} else {
  const err = await res.text()
  console.error('❌ Failed:', err)
  console.log('\nPlease run the SQL manually in Supabase Dashboard → SQL Editor')
  console.log('File: supabase/blog_articles_schema.sql')
}
