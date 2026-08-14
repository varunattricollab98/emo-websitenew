#!/usr/bin/env node
/**
 * Post-build prerender.
 *
 * Bakes per-page SEO + social metadata directly into STATIC HTML so it works
 * without JavaScript. This matters because social crawlers (Facebook, WhatsApp,
 * LinkedIn, Slack, X) do NOT execute JS, so anything React sets at runtime is
 * invisible to them.
 *
 * For every route it writes, this injects:
 *   - <title> and meta description
 *   - Open Graph tags (og:title, og:description, og:url, og:image)
 *   - Twitter card tags
 *   - <link rel="canonical">
 *   - FAQPage JSON-LD (where the page shows FAQs)
 *
 * Runs after `vite build`. Never fails the build: any error is caught and the
 * build still succeeds (pages fall back to the defaults in index.html).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE = 'https://v3.easemyoffice.in'

// Default social share card — use Supabase-hosted logo for reliable previews.
// WhatsApp, Facebook, LinkedIn all support webp from CDN URLs.
const IMAGE_CANDIDATES = ['/og-image.jpg', '/og-image.png', '/emo-logo-full.webp']
const SUPABASE_LOGO = 'https://oijtkvkyefqfwuycibcv.supabase.co/storage/v1/object/public/website-assets/EaseMyOffice-Logo-2.webp'

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

// ── HTML helpers ────────────────────────────────────────────────────────────

const escAttr = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const stripTags = (s) => String(s ?? '').replace(/<[^>]*>/g, '').trim()

/**
 * Social crawlers want a wide image (1200px+). Listing photos are requested at
 * 800px for the UI, so bump the width when the CDN supports a width param.
 */
function widenForSocial(url) {
  if (!url) return url
  if (/images\.unsplash\.com/.test(url)) {
    return url.includes('w=')
      ? url.replace(/([?&])w=\d+/, '$1w=1200')
      : url + (url.includes('?') ? '&' : '?') + 'w=1200'
  }
  return url
}

/** Trim to a length that reads well in search results and social previews. */
function clamp(text, max = 200) {
  const t = stripTags(text).replace(/\s+/g, ' ')
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:]$/, '') + '…'
}

/** Replace a meta tag's content, or append the tag if it isn't there yet. */
function setMeta(html, attr, key, value) {
  const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(
    `<meta\\s+${attr}=["']${safeKey}["'][^>]*?content=["'][^"']*["']\\s*/?>`,
    'i'
  )
  const tag = `<meta ${attr}="${key}" content="${escAttr(value)}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function removeMeta(html, attr, key) {
  const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(
    `\\s*<meta\\s+${attr}=["']${safeKey}["'][^>]*?content=["'][^"']*["']\\s*/?>`,
    'gi'
  )
  return html.replace(re, '')
}

function setTitle(html, title) {
  const t = `<title>${escAttr(title)}</title>`
  return /<title>[\s\S]*?<\/title>/i.test(html)
    ? html.replace(/<title>[\s\S]*?<\/title>/i, t)
    : html.replace('</head>', `    ${t}\n  </head>`)
}

function setCanonical(html, url) {
  const tag = `<link rel="canonical" href="${escAttr(url)}" />`
  return /<link\s+rel=["']canonical["'][^>]*>/i.test(html)
    ? html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, tag)
    : html.replace('</head>', `    ${tag}\n  </head>`)
}

async function main() {
  const dist = fileURLToPath(new URL('../dist', import.meta.url))
  const indexPath = join(dist, 'index.html')
  if (!existsSync(indexPath)) {
    console.warn('[prerender] dist/index.html not found, skipping')
    return
  }

  // Use whichever social image actually shipped in the build.
  const DEFAULT_IMAGE =
    IMAGE_CANDIDATES.find((c) => existsSync(join(dist, c.replace(/^\//, '')))) ||
    IMAGE_CANDIDATES[IMAGE_CANDIDATES.length - 1]
  const ext = DEFAULT_IMAGE.slice(DEFAULT_IMAGE.lastIndexOf('.'))
  const DEFAULT_IMAGE_TYPE = MIME[ext] || 'image/png'
  const isLogoFallback = DEFAULT_IMAGE.includes('emo-logo')
  if (isLogoFallback) {
    console.warn(
      '[prerender] No og-image.jpg/.png found, falling back to the logo.\n' +
        '            Run: node scripts/make-og-image.mjs'
    )
  } else {
    console.log(`[prerender] Social share card: ${DEFAULT_IMAGE} (${DEFAULT_IMAGE_TYPE})`)
  }

  let template = readFileSync(indexPath, 'utf8')

  const {
    voCities,
    cityUrl,
    spaceUrl,
    slugifySpace,
    getStateSlugForCity,
    getStateNameFromSlug,
  } = await import('../src/data/spaces.js')
  const { serviceLandings, serviceOrder, getServiceNational, serviceAliases } = await import(
    '../src/data/serviceLandings.js'
  )
  const { cityFaqs, spaceFaqs } = await import('../src/data/pageFaqs.js')
  const { coworkingCities, getCoworkingSpaces, slugifyCoworking } = await import(
    '../src/data/coworkingSpaces.js'
  )

  const SUPABASE_URL = 'https://oijtkvkyefqfwuycibcv.supabase.co'
  const SUPABASE_ANON =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9panRrdmt5ZWZxZnd1eWNpYmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjUwODksImV4cCI6MjEwMDU0MTA4OX0.wzNvJ2nRN4appxtLFhinIy4aEQ-qT9LpqngWhzfPgrw'

  const cityBySlug = Object.fromEntries(voCities.map((c) => [c.slug, c]))

  // Keep the default index.html pointing at the Supabase-hosted logo for
  // reliable social previews (WhatsApp, Facebook, LinkedIn).
  const socialImage = isLogoFallback ? SUPABASE_LOGO : SITE + DEFAULT_IMAGE
  const socialImageType = isLogoFallback ? 'image/webp' : DEFAULT_IMAGE_TYPE
  template = setMeta(template, 'property', 'og:image', socialImage)
  template = setMeta(template, 'property', 'og:image:secure_url', socialImage)
  template = setMeta(template, 'name', 'twitter:image', socialImage)
  template = setMeta(template, 'property', 'og:image:type', socialImageType)
  if (isLogoFallback) {
    // The logo isn't 1200x630, so don't claim dimensions we don't have.
    template = removeMeta(template, 'property', 'og:image:width')
    template = removeMeta(template, 'property', 'og:image:height')
  }
  writeFileSync(indexPath, template)

  const faqSchema = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (items || [])
      .filter((i) => i && i.q && i.a)
      .map((i) => ({
        '@type': 'Question',
        name: stripTags(i.q),
        acceptedAnswer: { '@type': 'Answer', text: stripTags(i.a) },
      })),
  })

  /**
   * Build a full HTML document for one route.
   * `path` is the route without a leading slash, e.g. 'virtual-office/haryana/gurgaon'
   */
  function buildPage({ path, title, description, image, imageAlt, schema, canonicalPath }) {
    const url = `${SITE}/${path}`.replace(/\/+$/, '') || SITE
    // Alias routes (e.g. company-registration) point their canonical at the
    // real page so search engines consolidate on one URL.
    const canonical = canonicalPath
      ? `${SITE}/${canonicalPath}`.replace(/\/+$/, '') || SITE
      : url
    const desc = clamp(description)
    const img = widenForSocial(image) || SITE + DEFAULT_IMAGE
    const absImg = /^https?:\/\//.test(img) ? img : SITE + img

    let html = template
    html = setTitle(html, title)
    html = setMeta(html, 'name', 'description', desc)
    html = setCanonical(html, canonical)

    // Open Graph
    html = setMeta(html, 'property', 'og:title', title)
    html = setMeta(html, 'property', 'og:description', desc)
    html = setMeta(html, 'property', 'og:url', canonical)
    html = setMeta(html, 'property', 'og:image', absImg)
    html = setMeta(html, 'property', 'og:image:secure_url', absImg)
    if (imageAlt) html = setMeta(html, 'property', 'og:image:alt', imageAlt)

    // Twitter
    html = setMeta(html, 'name', 'twitter:title', title)
    html = setMeta(html, 'name', 'twitter:description', desc)
    html = setMeta(html, 'name', 'twitter:image', absImg)
    if (imageAlt) html = setMeta(html, 'name', 'twitter:image:alt', imageAlt)

    // A per-page photo has unknown dimensions, so drop the 1200x630 hints
    // that only apply to the default share image.
    const usingDefault = absImg === SITE + DEFAULT_IMAGE
    if (!usingDefault) {
      html = removeMeta(html, 'property', 'og:image:width')
      html = removeMeta(html, 'property', 'og:image:height')
      html = removeMeta(html, 'property', 'og:image:type')
    }

    if (schema) {
      const tag = `<script type="application/ld+json" data-faq-schema="ssg">${JSON.stringify(
        schema
      )}</script>`
      html = html.replace('</head>', `${tag}</head>`)
    }
    return html
  }

  /** Write both the extensionless and trailing-slash variants of a route. */
  function write(path, html) {
    const clean = path.replace(/^\/+|\/+$/g, '')
    const fileOut = join(dist, `${clean}.html`)
    mkdirSync(dirname(fileOut), { recursive: true })
    writeFileSync(fileOut, html)
    const dirOut = join(dist, clean, 'index.html')
    mkdirSync(dirname(dirOut), { recursive: true })
    writeFileSync(dirOut, html)
  }

  let count = 0
  const emit = (opts) => {
    write(opts.path, buildPage(opts))
    count++
  }

  // ── 1. Top-level static pages ─────────────────────────────────────────────
  const staticPages = [
    {
      path: 'virtual-office',
      title: 'Virtual Office in India for GST & Company Registration | EaseMyOffice',
      description:
        'Get a premium, compliant business address in 250+ locations across India. GST and company registration ready, with the full documentation kit in 2–3 days.',
    },
    {
      path: 'coworking',
      title: 'Coworking Spaces Across India, Desks & Private Cabins | EaseMyOffice',
      description:
        'Flexible desks, private cabins and hot seats in prime business districts across India. Transparent pricing, zero brokerage, book by the day or month.',
    },
    {
      path: 'meeting-rooms',
      title: 'Book Meeting Rooms by the Hour Across India | EaseMyOffice',
      description:
        'Fully-equipped meeting, conference and training rooms in prime locations. Pay only for the hours you need, no membership required, premium AV included.',
    },
    {
      path: 'ca-services',
      title: 'CA Services, GST, ITR, TDS & MCA Compliance Online | EaseMyOffice',
      description:
        'Company registration, GST filing, income tax, TDS, payroll and MCA compliance handled by qualified professionals. Fully online with a dedicated manager.',
    },
    {
      path: 'pricing',
      title: 'Pricing & Plans, Virtual Office and Compliance | EaseMyOffice',
      description:
        'Transparent, all-inclusive pricing with no hidden charges. Compare virtual office, GST registration and company registration plans.',
    },
    {
      path: 'about',
      title: 'About EaseMyOffice, Trusted by 5,000+ Indian Businesses',
      description:
        'EaseMyOffice helps businesses across India get compliant business addresses, coworking spaces and end-to-end compliance support.',
    },
    {
      path: 'contact',
      title: 'Contact EaseMyOffice, Talk to a Workspace Expert',
      description:
        'Get in touch for virtual offices, coworking spaces, meeting rooms or compliance support. Our team responds within one business day.',
    },
    {
      path: 'list-your-space',
      title: 'List Your Space on EaseMyOffice, Partner With Us',
      description:
        'Own a commercial space? List it on EaseMyOffice and reach thousands of businesses looking for verified addresses and workspaces across India.',
    },
    {
      path: 'faq',
      title: 'Frequently Asked Questions | EaseMyOffice',
      description:
        'Answers about virtual offices, GST registration, company incorporation, documentation, pricing and activation timelines.',
    },
    {
      path: 'blog',
      title: 'Blog, Virtual Office, GST & Compliance Insights | EaseMyOffice',
      description:
        'Practical guides on virtual offices, GST registration, company incorporation and business compliance in India, written by the EaseMyOffice team.',
    },
    {
      path: 'careers',
      title: 'Careers at EaseMyOffice, Join Our Team',
      description:
        'Build the future of flexible workspaces in India. See open roles in sales, operations, engineering and marketing at EaseMyOffice.',
    },
  ]
  staticPages.forEach(emit)

  // ── 1b. National service hub pages ────────────────────────────────────────
  // The city-agnostic version of each service, e.g. /virtual-office/gst-registration.
  // These target the national keyword and funnel down to the per-city pages
  // emitted in section 3.
  for (const svcSlug of serviceOrder) {
    const nat = getServiceNational(svcSlug)
    if (!nat) continue
    emit({
      path: `virtual-office/${svcSlug}`,
      title: nat.metaTitle,
      description: nat.metaDescription,
      imageAlt: `${serviceLandings[svcSlug]?.name || svcSlug} across India`,
      schema: nat.faqs?.length ? faqSchema(nat.faqs) : null,
    })
  }

  // ── 1c. Service alias hub pages ───────────────────────────────────────────
  // e.g. /virtual-office/company-registration is the same product as
  // business-registration. The app redirects to the canonical URL, and these
  // files exist so the alias URL still serves real metadata (with the canonical
  // pointing at the real page) instead of the generic SPA fallback.
  for (const [alias, canonicalSlug] of Object.entries(serviceAliases)) {
    const nat = getServiceNational(canonicalSlug)
    if (!nat) continue
    emit({
      path: `virtual-office/${alias}`,
      canonicalPath: `virtual-office/${canonicalSlug}`,
      title: nat.metaTitle,
      description: nat.metaDescription,
      imageAlt: `${serviceLandings[canonicalSlug]?.name || canonicalSlug} across India`,
      schema: nat.faqs?.length ? faqSchema(nat.faqs) : null,
    })
  }

  // ── 2. Live spaces from Supabase ──────────────────────────────────────────
  // Imported inside the try so a Supabase/SDK failure still lets every other
  // page (static routes, coworking) get its metadata.
  let spaces = []
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: false } })
    const { data, error } = await sb
      .from('spaces')
      .select(
        'address_area,address_city,address_state,pricing_monthly,processing_time,featured_image,description,overview'
      )
      .or('is_active.is.null,is_active.eq.true')
      .limit(1000)
    if (error) console.warn('[prerender] Supabase error:', error.message)
    spaces = data || []
  } catch (e) {
    console.warn('[prerender] Supabase fetch failed:', e.message)
  }

  const cityAgg = {}

  for (const s of spaces) {
    const rawCitySlug = slugifySpace(s.address_city)
    const areaSlug = slugifySpace(s.address_area)
    if (!rawCitySlug || !areaSlug) continue

    // cityUrl/spaceUrl resolve aliases (e.g. "gurugram" -> "haryana/gurgaon"),
    // so static files land exactly where the app's links point.
    const spacePath = spaceUrl(rawCitySlug, areaSlug).replace(/^\//, '')
    const cityPath = cityUrl(rawCitySlug).replace(/^\//, '')

    const stateSlug = getStateSlugForCity(rawCitySlug)
    const cityName = cityBySlug[rawCitySlug]?.name || s.address_city
    const region =
      (stateSlug && getStateNameFromSlug(stateSlug)) || s.address_state || 'India'
    const processing = s.processing_time || '2\u20133 business days'
    const price = Number(s.pricing_monthly) || 899

    emit({
      path: spacePath,
      title: `Virtual Office in ${s.address_area}, ${cityName} | EaseMyOffice`,
      description:
        clamp(s.description || s.overview) ||
        `A verified virtual office address in ${s.address_area}, ${cityName}. Accepted for GST and company registration, ready in ${processing}. From ₹${price}/mo.`,
      image: s.featured_image || undefined,
      imageAlt: `Virtual office space in ${s.address_area}, ${cityName}`,
      schema: faqSchema(spaceFaqs(s.address_area, cityName, processing)),
    })

    if (!cityAgg[rawCitySlug]) {
      cityAgg[rawCitySlug] = {
        cityPath,
        name: cityName,
        region,
        min: price,
        image: s.featured_image || undefined,
        count: 1,
      }
    } else {
      cityAgg[rawCitySlug].min = Math.min(cityAgg[rawCitySlug].min, price)
      cityAgg[rawCitySlug].count++
      if (!cityAgg[rawCitySlug].image && s.featured_image) {
        cityAgg[rawCitySlug].image = s.featured_image
      }
    }
  }

  // ── 3. City pages + their service landing pages ───────────────────────────
  for (const [citySlug, info] of Object.entries(cityAgg)) {
    emit({
      path: info.cityPath,
      title: `Virtual Office in ${info.name} for GST & Company Registration | EaseMyOffice`,
      description: `${info.count}+ verified virtual office addresses in ${info.name}, ${info.region}. GST and MCA ready documentation, activated in 2–3 days. Plans from ₹${info.min}/mo.`,
      image: info.image,
      imageAlt: `Virtual office spaces in ${info.name}`,
      schema: faqSchema(cityFaqs(info.name, info.region, info.min)),
    })

    for (const svc of serviceOrder) {
      const landing = serviceLandings[svc]
      if (!landing) continue
      emit({
        path: spaceUrl(citySlug, svc).replace(/^\//, ''),
        title: `${landing.name} in ${info.name} | EaseMyOffice`,
        description:
          (landing.lead && clamp(landing.lead(info.name))) ||
          `${landing.name} in ${info.name} with a verified commercial address and complete documentation support.`,
        image: info.image,
        imageAlt: `${landing.name} in ${info.name}`,
        schema: landing.faqs ? faqSchema(landing.faqs(info.name)) : null,
      })
    }

    // Per-city alias URLs, canonical points at the real city service page.
    for (const [alias, canonicalSlug] of Object.entries(serviceAliases)) {
      const landing = serviceLandings[canonicalSlug]
      if (!landing) continue
      emit({
        path: spaceUrl(citySlug, alias).replace(/^\//, ''),
        canonicalPath: spaceUrl(citySlug, canonicalSlug).replace(/^\//, ''),
        title: `${landing.name} in ${info.name} | EaseMyOffice`,
        description:
          (landing.lead && clamp(landing.lead(info.name))) ||
          `${landing.name} in ${info.name} with a verified commercial address and complete documentation support.`,
        image: info.image,
        imageAlt: `${landing.name} in ${info.name}`,
        schema: landing.faqs ? faqSchema(landing.faqs(info.name)) : null,
      })
    }
  }

  // ── 4. State pages ────────────────────────────────────────────────────────
  const stateAgg = {}
  for (const [citySlug, info] of Object.entries(cityAgg)) {
    const stateSlug = getStateSlugForCity(citySlug)
    if (!stateSlug) continue
    if (!stateAgg[stateSlug]) {
      stateAgg[stateSlug] = { name: info.region, cities: 1, min: info.min, image: info.image }
    } else {
      stateAgg[stateSlug].cities++
      stateAgg[stateSlug].min = Math.min(stateAgg[stateSlug].min, info.min)
      if (!stateAgg[stateSlug].image && info.image) stateAgg[stateSlug].image = info.image
    }
  }
  for (const [stateSlug, info] of Object.entries(stateAgg)) {
    emit({
      path: `virtual-office/${stateSlug}`,
      title: `Virtual Office in ${info.name}, All Cities | EaseMyOffice`,
      description: `Verified virtual office addresses across ${info.cities} cities in ${info.name}. GST and company registration ready, from ₹${info.min}/mo.`,
      image: info.image,
      imageAlt: `Virtual office locations across ${info.name}`,
      schema: faqSchema(cityFaqs(info.name, info.name, info.min)),
    })
  }

  // ── 5. Coworking detail pages (static data) ───────────────────────────────
  for (const city of coworkingCities) {
    const list = getCoworkingSpaces(city.slug) || []
    for (const sp of list) {
      emit({
        path: `coworking/${city.slug}/${slugifyCoworking(sp.name)}`,
        title: `${sp.name}, Coworking in ${sp.locality}, ${city.name} | EaseMyOffice`,
        description: `${sp.name} in ${sp.locality}, ${city.name}. ${sp.seats}, day passes from ₹${sp.dayPass} and dedicated desks from ₹${Number(
          sp.price
        ).toLocaleString('en-IN')}/mo.`,
        image: sp.image || undefined,
        imageAlt: `${sp.name} coworking space in ${sp.locality}, ${city.name}`,
      })
    }
  }

  console.log(`\u2713 [prerender] Baked SEO + Open Graph metadata into ${count} static pages`)
}

main().catch((e) => {
  console.warn('[prerender] skipped due to error:', e.message)
  process.exit(0) // never fail the build
})
