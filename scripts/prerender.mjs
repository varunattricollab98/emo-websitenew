#!/usr/bin/env node
/**
 * Post-build prerender: bakes FAQPage JSON-LD structured data into the STATIC
 * HTML of each key page, so search engines (and the Rich Results Test) read the
 * schema directly from the served HTML — no JavaScript execution required.
 *
 * Runs after `vite build`. It never fails the build: any error is caught and
 * the build still succeeds (pages simply keep client-side schema as fallback).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

async function main() {
  const dist = fileURLToPath(new URL('../dist', import.meta.url))
  const indexPath = join(dist, 'index.html')
  if (!existsSync(indexPath)) {
    console.warn('[prerender] dist/index.html not found — skipping')
    return
  }
  const template = readFileSync(indexPath, 'utf8')

  const { serviceLandings, serviceOrder } = await import('../src/data/serviceLandings.js')
  const { cityFaqs, spaceFaqs } = await import('../src/data/pageFaqs.js')
  const { voCities } = await import('../src/data/spaces.js')
  const { createClient } = await import('@supabase/supabase-js')

  const SUPABASE_URL = 'https://oijtkvkyefqfwuycibcv.supabase.co'
  const SUPABASE_ANON =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9panRrdmt5ZWZxZnd1eWNpYmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjUwODksImV4cCI6MjEwMDU0MTA4OX0.wzNvJ2nRN4appxtLFhinIy4aEQ-qT9LpqngWhzfPgrw'

  const slugify = (s) =>
    String(s || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  const cityBySlug = Object.fromEntries(voCities.map((c) => [c.slug, c]))
  const strip = (s) => String(s).replace(/<[^>]*>/g, '').trim()

  const faqSchema = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (items || [])
      .filter((i) => i && i.q && i.a)
      .map((i) => ({
        '@type': 'Question',
        name: strip(i.q),
        acceptedAnswer: { '@type': 'Answer', text: strip(i.a) },
      })),
  })

  const inject = (schemaObj) => {
    const tag = `<script type="application/ld+json" data-faq-schema="ssg">${JSON.stringify(
      schemaObj
    )}</script>`
    return template.replace('</head>', `${tag}</head>`)
  }

  // Write as "<route>.html" (NOT "<route>/index.html") so Cloudflare's
  // auto-trailing-slash serves it at the extensionless, no-slash URL
  // (e.g. /virtual-office/delhi) — matching the app's internal links & how
  // Google tests URLs. Also write the directory index for the slash variant.
  const write = (routePath, schemaObj) => {
    const html = inject(schemaObj)
    const fileOut = join(dist, `${routePath}.html`)
    mkdirSync(dirname(fileOut), { recursive: true })
    writeFileSync(fileOut, html)
    // also cover the trailing-slash variant
    const dirOut = join(dist, routePath, 'index.html')
    mkdirSync(dirname(dirOut), { recursive: true })
    writeFileSync(dirOut, html)
  }

  // Pull live spaces from Supabase
  let spaces = []
  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: false } })
    const { data } = await sb
      .from('spaces')
      .select('address_area,address_city,address_state,pricing_monthly,processing_time')
      .eq('is_active', true)
      .limit(1000)
    spaces = data || []
  } catch (e) {
    console.warn('[prerender] Supabase fetch failed:', e.message)
  }

  let count = 0
  const cityAgg = {}

  for (const s of spaces) {
    const citySlug = slugify(s.address_city)
    const areaSlug = slugify(s.address_area)
    if (!citySlug || !areaSlug) continue
    const cityName = cityBySlug[citySlug]?.name || s.address_city
    const region = cityBySlug[citySlug]?.state || s.address_state || 'India'
    const processing = s.processing_time || '2\u20133 business days'

    write(`virtual-office/${citySlug}/${areaSlug}`, faqSchema(spaceFaqs(s.address_area, cityName, processing)))
    count++

    const price = Number(s.pricing_monthly) || 899
    if (!cityAgg[citySlug]) cityAgg[citySlug] = { name: cityName, region, min: price }
    else cityAgg[citySlug].min = Math.min(cityAgg[citySlug].min, price)
  }

  // City pages + their 4 service landing pages
  for (const [citySlug, info] of Object.entries(cityAgg)) {
    write(`virtual-office/${citySlug}`, faqSchema(cityFaqs(info.name, info.region, info.min)))
    count++
    for (const svc of serviceOrder) {
      const landing = serviceLandings[svc]
      if (landing?.faqs) {
        write(`virtual-office/${citySlug}/${svc}`, faqSchema(landing.faqs(info.name)))
        count++
      }
    }
  }

  console.log(`\u2713 [prerender] Baked FAQ schema into ${count} static pages`)
}

main().catch((e) => {
  console.warn('[prerender] skipped due to error:', e.message)
  process.exit(0) // never fail the build
})
