#!/usr/bin/env node
/**
 * CSV → spaceDetails bulk importer.
 *
 * Usage:
 *   npm run import:spaces -- path/to/your-spaces.csv
 *   (defaults to ./spaces.csv if no path is given)
 *
 * Reads your CSV (any column order — matched by header name) and writes
 *   src/data/spaceDetails.generated.js
 * which the site merges automatically. No page/route changes needed —
 * each row becomes a live space detail page at /space/<city>/<area>.
 *
 * Recognised CSV headers (extra columns are ignored):
 *   id, states, unique_id, title, title_with_spacename, description,
 *   space_images_url, featured_image, space_images, address_area,
 *   address_city, address_state, pricing_monthly_starting_price,
 *   pricing_BR_Plan_Price, pricing_GST_Plan_Price, pricing_MA_Plan_Price,
 *   space_name, listing_address, full_address, processing_time,
 *   property_type, property_feature
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { voCities, cityAliases, slugifySpace } from '../src/data/spaces.js'

// ── tiny CSV parser (handles quotes, commas-in-quotes, "" escapes, CRLF) ──
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else inQuotes = false
      } else field += ch
    } else if (ch === '"') inQuotes = true
    else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (ch === '\r') {
      // ignore — handled with \n
    } else field += ch
  }
  if (field.length || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

function splitList(v) {
  if (!v) return []
  let parts
  if (v.includes('|')) parts = v.split('|')
  else if (v.includes(';')) parts = v.split(';')
  else if (/\r?\n/.test(v)) parts = v.split(/\r?\n/)
  else parts = v.split(',')
  return parts.map((s) => s.trim()).filter(Boolean)
}

const num = (v) => {
  const n = parseInt(String(v || '').replace(/[^0-9.]/g, ''), 10)
  return Number.isFinite(n) ? n : undefined
}

// Resolve a city name to a canonical voCities slug (handles old names/aliases).
function resolveCitySlug(name) {
  const q = String(name || '').trim().toLowerCase()
  if (!q) return ''
  const exact = voCities.find((c) => c.name.toLowerCase() === q)
  if (exact) return exact.slug
  const byAlias = voCities.find((c) => (cityAliases[c.slug] || []).some((a) => a === q))
  if (byAlias) return byAlias.slug
  const sl = slugifySpace(name)
  const bySlug = voCities.find((c) => c.slug === sl)
  return bySlug ? bySlug.slug : sl
}

// ── main ──────────────────────────────────────────────────────
const csvPath = process.argv[2] || 'spaces.csv'
let raw
try {
  raw = readFileSync(csvPath, 'utf8')
} catch {
  console.error(`\n✗ Could not read CSV at "${csvPath}".`)
  console.error('  Usage: npm run import:spaces -- path/to/your-spaces.csv\n')
  process.exit(1)
}

const rows = parseCsv(raw)
if (rows.length < 2) {
  console.error('✗ CSV has no data rows.')
  process.exit(1)
}

const header = rows[0].map((h) => h.trim())
const idx = Object.fromEntries(header.map((h, i) => [h, i]))
const get = (row, col) => (idx[col] != null ? (row[idx[col]] || '').trim() : '')

const out = {}
let count = 0
const warnings = []

for (let r = 1; r < rows.length; r++) {
  const row = rows[r]
  const city = get(row, 'address_city') || get(row, 'address_state')
  const area = get(row, 'address_area') || get(row, 'space_name') || get(row, 'title')
  if (!city || !area) {
    warnings.push(`Row ${r + 1}: missing city or area — skipped.`)
    continue
  }
  const citySlug = resolveCitySlug(city)
  const areaSlug = slugifySpace(area)
  const key = `${citySlug}/${areaSlug}`

  const images = [
    ...splitList(get(row, 'space_images')),
    ...splitList(get(row, 'space_images_url')),
  ].filter((u) => /^https?:\/\//i.test(u))
  const featured = get(row, 'featured_image') || images[0] || ''

  const pricing = {}
  const monthly = num(get(row, 'pricing_monthly_starting_price'))
  const gst = num(get(row, 'pricing_GST_Plan_Price'))
  const br = num(get(row, 'pricing_BR_Plan_Price'))
  const ma = num(get(row, 'pricing_MA_Plan_Price'))
  if (monthly != null) pricing.monthly = monthly
  if (gst != null) pricing.gst = gst
  if (br != null) pricing.br = br
  if (ma != null) pricing.ma = ma

  const entry = {
    spaceName: get(row, 'space_name') || get(row, 'title_with_spacename') || get(row, 'title') || area,
    area,
    city,
    state: get(row, 'address_state') || get(row, 'states') || 'India',
    description: get(row, 'description'),
    featuredImage: featured || undefined,
    gallery: images.filter((u) => u !== featured),
    pricing: Object.keys(pricing).length ? pricing : undefined,
    fullAddress: get(row, 'full_address') || undefined,
    listingAddress: get(row, 'listing_address') || undefined,
    processingTime: get(row, 'processing_time') || undefined,
    propertyType: get(row, 'property_type') || undefined,
    amenities: splitList(get(row, 'property_feature')),
  }

  // drop empty fields to keep the generated file tidy
  Object.keys(entry).forEach((k) => {
    const v = entry[k]
    if (v == null || (Array.isArray(v) && v.length === 0) || v === '') delete entry[k]
  })

  if (out[key]) warnings.push(`Row ${r + 1}: duplicate key "${key}" — overwriting previous.`)
  out[key] = entry
  count++
}

const banner =
  '// AUTO-GENERATED by `npm run import:spaces` — do not edit by hand.\n' +
  '// Run the importer with your CSV to (re)generate this file:\n' +
  '//   npm run import:spaces -- path/to/your-spaces.csv\n' +
  '//\n' +
  '// It is merged with the hand-written entries in spaceDetails.js\n' +
  '// (hand-written entries win on key conflicts).\n\n'

const body = `export const generatedSpaceDetails = ${JSON.stringify(out, null, 2)}\n`

const target = fileURLToPath(new URL('../src/data/spaceDetails.generated.js', import.meta.url))
writeFileSync(target, banner + body, 'utf8')

console.log(`\n✓ Imported ${count} space(s) → src/data/spaceDetails.generated.js`)
const cities = [...new Set(Object.keys(out).map((k) => k.split('/')[0]))]
console.log(`  Cities: ${cities.join(', ')}`)
if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} warning(s):`)
  warnings.slice(0, 20).forEach((w) => console.log('  - ' + w))
}
console.log('\nNext: run `npm run build` (or your dev server) to see the new pages.\n')
