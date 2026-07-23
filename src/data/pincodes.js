// Pincode -> city resolver.
// `prefixMap` maps a leading pincode fragment (2–4 digits) to a city slug from
// voCities. Longer prefixes win (e.g. 4006 -> Thane beats 400 -> Mumbai).
// `resolvePincode` works fully offline for the cities we cover; `lookupPincode`
// is an async fallback that hits the free India Post API for any other pincode.

import { voCities } from './spaces'

// slug -> array of leading-digit prefixes
const prefixesBySlug = {
  // North
  delhi: ['110'],
  gurgaon: ['122'],
  faridabad: ['121'],
  noida: ['2013'],
  ghaziabad: ['2010', '2011', '2012'],
  meerut: ['250'],
  chandigarh: ['160'],
  ludhiana: ['141'],
  amritsar: ['143'],
  jalandhar: ['144'],
  patiala: ['147'],
  panipat: ['1321'],
  karnal: ['1320'],
  rohtak: ['124'],
  dehradun: ['248'],
  srinagar: ['190'],
  jammu: ['180'],
  // UP
  lucknow: ['226'],
  kanpur: ['208'],
  agra: ['282'],
  varanasi: ['221'],
  prayagraj: ['211'],
  bareilly: ['243'],
  moradabad: ['244'],
  aligarh: ['202'],
  gorakhpur: ['273'],
  jhansi: ['284'],
  // Rajasthan
  jaipur: ['302'],
  jodhpur: ['342'],
  kota: ['324'],
  bikaner: ['334'],
  ajmer: ['305'],
  udaipur: ['313'],
  // West
  mumbai: ['400'],
  thane: ['4006', '4007'],
  'navi-mumbai': ['4002', '4007'],
  pune: ['411'],
  nashik: ['422'],
  nagpur: ['440'],
  aurangabad: ['4310', '4311'],
  nanded: ['4316'],
  solapur: ['413'],
  kolhapur: ['4160'],
  sangli: ['4164'],
  amravati: ['4446'],
  akola: ['4440'],
  bhiwandi: ['4213'],
  ahmedabad: ['380'],
  surat: ['395'],
  vadodara: ['390'],
  rajkot: ['360'],
  bhavnagar: ['364'],
  jamnagar: ['361'],
  // South
  bangalore: ['560'],
  mysuru: ['570'],
  mangaluru: ['575'],
  hubballi: ['580'],
  belagavi: ['590'],
  kalaburagi: ['585'],
  chennai: ['600'],
  coimbatore: ['641'],
  tiruppur: ['6416'],
  madurai: ['625'],
  tiruchirappalli: ['620'],
  salem: ['636'],
  erode: ['638'],
  tirunelveli: ['627'],
  hyderabad: ['500'],
  warangal: ['506'],
  vijayawada: ['520'],
  visakhapatnam: ['530'],
  guntur: ['522'],
  nellore: ['524'],
  kurnool: ['518'],
  rajahmundry: ['533'],
  kochi: ['682'],
  kozhikode: ['673'],
  thiruvananthapuram: ['695'],
  // East
  kolkata: ['700'],
  howrah: ['711'],
  durgapur: ['7132'],
  asansol: ['7133'],
  siliguri: ['734'],
  patna: ['800'],
  gaya: ['823'],
  ranchi: ['834'],
  dhanbad: ['826'],
  jamshedpur: ['831'],
  bokaro: ['827'],
  bhubaneswar: ['751'],
  cuttack: ['753'],
  rourkela: ['769'],
  guwahati: ['781'],
  // Central
  bhopal: ['462'],
  indore: ['452'],
  jabalpur: ['482'],
  gwalior: ['474'],
  ujjain: ['456'],
  raipur: ['492'],
  bhilai: ['490'],
}

// flatten into [{ prefix, slug }] sorted by longest prefix first
const flatPrefixes = Object.entries(prefixesBySlug)
  .flatMap(([slug, prefixes]) => prefixes.map((prefix) => ({ prefix, slug })))
  .sort((a, b) => b.prefix.length - a.prefix.length)

const citiesBySlug = Object.fromEntries(voCities.map((c) => [c.slug, c]))

/**
 * Offline pincode -> matching cities.
 * - Full/partial numeric input allowed.
 * - Returns an array of voCity objects (deduped), best (longest-prefix) first.
 */
export function resolvePincode(digits) {
  const d = String(digits || '').replace(/\D/g, '')
  if (!d) return []
  const seen = new Set()
  const out = []
  for (const { prefix, slug } of flatPrefixes) {
    // once the user has typed enough, the pincode should start with the prefix;
    // while still typing, also surface prefixes that start with the input
    const match = d.length >= prefix.length ? d.startsWith(prefix) : prefix.startsWith(d)
    if (match && !seen.has(slug) && citiesBySlug[slug]) {
      seen.add(slug)
      out.push(citiesBySlug[slug])
    }
  }
  return out
}

/**
 * Async fallback for any valid 6-digit Indian pincode not in our map.
 * Uses the free, key-less India Post API. Returns { name, state } or null.
 */
export async function lookupPincode(pin) {
  const d = String(pin || '').replace(/\D/g, '')
  if (!/^\d{6}$/.test(d)) return null
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${d}`)
    const data = await res.json()
    const po = data?.[0]?.PostOffice?.[0]
    if (po) return { name: po.District, state: po.State }
  } catch {
    /* network/API unavailable — caller falls back to manual entry */
  }
  return null
}
