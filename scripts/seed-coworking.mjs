#!/usr/bin/env node
/**
 * Seed coworking_spaces table from the existing `spaces` table.
 *
 * Usage:
 *   node scripts/seed-coworking.mjs
 *
 * This script:
 *   1. Checks if the coworking_spaces table exists
 *   2. If not, prints instructions to create it (DDL cannot be run via the REST API)
 *   3. If it exists, reads all spaces from the `spaces` table
 *   4. Transforms each into a coworking_spaces row with varied pricing
 *   5. Upserts into coworking_spaces
 *
 * Table creation:
 *   Run the SQL in supabase/coworking_spaces_schema.sql via the Supabase Dashboard
 *   SQL Editor before running this seed script.
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://oijtkvkyefqfwuycibcv.supabase.co'
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9panRrdmt5ZWZxZnd1eWNpYmN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDk2NTA4OSwiZXhwIjoyMTAwNTQxMDg5fQ.amcfRunjXq4PfGJJOCFS1FUEFaw3T7nZDK3yGYeZTJ4'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
})

// ── Helpers ────────────────────────────────────────────────────

function slugifySpace(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Deterministic hash-based pricing multiplier per area name.
 * Matches the coworkingPriceMultiplier() logic in CoworkingSpaces.jsx.
 */
function coworkingPriceMultiplier(areaName) {
  let h = 5381
  for (let i = 0; i < (areaName || '').length; i++) {
    h = ((h << 5) + h + areaName.charCodeAt(i)) >>> 0
  }
  const deskMult = 4.0 + (h % 25) / 10
  const dayMult = 0.55 + ((h >> 8) % 25) / 100
  return { deskMult, dayMult }
}

const round100 = (n) => Math.round(n / 100) * 100
const round50 = (n) => Math.round(n / 50) * 50

// ── Step 1: Check if table exists ──────────────────────────────

async function checkTable() {
  const { error } = await supabase.from('coworking_spaces').select('id').limit(1)

  if (error && (error.message.includes('does not exist') || error.message.includes('schema cache'))) {
    return false
  }
  // Any other error (or success) means table exists
  return true
}

// ── Step 2: Create table via REST API ──────────────────────────
// PostgREST cannot execute DDL, so we attempt to create the table
// via alternative methods. If they all fail, we print instructions.

async function createTableIfNeeded() {
  const exists = await checkTable()
  if (exists) {
    console.log('Table coworking_spaces already exists.')
    return true
  }

  console.log('Table coworking_spaces does not exist.')
  console.log('Attempting to create it...\n')

  // The Supabase REST API cannot execute DDL (CREATE TABLE).
  // Print instructions for manual creation.
  console.log(`
===========================================================
  TABLE CREATION REQUIRED
===========================================================

The coworking_spaces table needs to be created manually.

Please run the following SQL in your Supabase Dashboard:
  1. Go to: https://supabase.com/dashboard/project/oijtkvkyefqfwuycibcv/sql
  2. Open: supabase/coworking_spaces_schema.sql
  3. Paste and click "Run"

After creating the table, re-run this script:
  node scripts/seed-coworking.mjs
===========================================================
`)

  return false
}

// ── Step 3: Read from spaces table ─────────────────────────────

async function readSpaces() {
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .or('is_active.is.null,is_active.eq.true')
    .order('rating', { ascending: false })
    .limit(500)

  if (error) {
    console.error('Error reading spaces table:', error.message)
    process.exit(1)
  }

  console.log(`Read ${data.length} space(s) from spaces table.`)
  return data
}

// ── Step 4: Transform to coworking_spaces rows ─────────────────

function transformRow(row) {
  const area = row.address_area || row.space_name || ''
  const { deskMult, dayMult } = coworkingPriceMultiplier(area)
  const monthly = row.pricing_monthly || 799

  const dedicatedDesk = round100(monthly * deskMult)
  const hotDesk = Math.max(4499, round100(dedicatedDesk * 0.55))
  const privateCabin = round100(dedicatedDesk * 1.7)
  const dayPass = round50(monthly * dayMult)

  const tags = (row.property_feature || '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6)

  const gallery = (row.space_images || '')
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s.startsWith('http'))

  const citySlug = slugifySpace(row.address_city)
  const name = row.space_name || `${area || 'Business'} Hub`

  return {
    name,
    city_slug: citySlug,
    city_name: row.address_city || '',
    locality: area,
    state: row.address_state || '',
    full_address: row.full_address || `${area}, ${row.address_city || ''}`,
    pricing_hot_desk: hotDesk,
    pricing_dedicated_desk: dedicatedDesk,
    pricing_private_cabin: privateCabin,
    pricing_day_pass: dayPass,
    seats: '4-100 seats',
    rating: Number(row.rating) || 4.7,
    tags: tags.length ? tags.join('|') : '24x7 access|WiFi|Meeting rooms',
    amenities: tags.join('|') || 'High-speed Wi-Fi|Meeting rooms|Power backup',
    featured_image: row.featured_image || '',
    gallery: gallery.join('|'),
    description: row.description || '',
    is_popular: row.is_trending || false,
    is_active: true,
    sort_order: 0,
  }
}

// ── Step 5: Upsert into coworking_spaces ───────────────────────

async function seedCoworkingSpaces(rows) {
  // First, delete all existing rows (clean slate approach)
  const { error: deleteError } = await supabase
    .from('coworking_spaces')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (deleteError) {
    console.log('Note: Could not clear existing rows:', deleteError.message)
  }

  // Insert in batches of 50
  const BATCH_SIZE = 50
  let inserted = 0

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const { error } = await supabase.from('coworking_spaces').insert(batch)

    if (error) {
      console.error(`Error inserting batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message)
      // Try one by one to identify problematic rows
      for (const row of batch) {
        const { error: rowError } = await supabase.from('coworking_spaces').insert(row)
        if (rowError) {
          console.error(`  Failed: ${row.name} (${row.city_slug}):`, rowError.message)
        } else {
          inserted++
        }
      }
    } else {
      inserted += batch.length
    }
  }

  console.log(`Inserted ${inserted} coworking space(s) into coworking_spaces table.`)
  return inserted
}

// ── Main ───────────────────────────────────────────────────────

async function main() {
  console.log('=== Seeding coworking_spaces table ===\n')

  const tableReady = await createTableIfNeeded()
  if (!tableReady) {
    console.log('\nScript completed. Table needs to be created first.')
    console.log('After running the schema SQL, re-run this script to seed data.')
    process.exit(0)
  }

  const spaces = await readSpaces()
  if (spaces.length === 0) {
    console.log('No spaces found in spaces table. Nothing to seed.')
    process.exit(0)
  }

  const coworkingRows = spaces.map(transformRow)
  const count = await seedCoworkingSpaces(coworkingRows)

  if (count > 0) {
    console.log(`\nDone! ${count} coworking spaces are now available at /coworking.`)
  } else {
    console.log('\nNo rows were inserted. Check errors above.')
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
