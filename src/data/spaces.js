// Virtual office / workspace listings per city (drives the Explore section + counts).
import { generatedSpaceDetails } from './spaceDetails.generated.js'

// getSupabaseSpacesForCity is no longer used here — React components
// use the SpacesContext directly for live Supabase data.

const img = [
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1462826303086-329426d1aef5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
]

const T = { gst: 'GST', co: 'Company Reg', mail: 'Mailing', apob: 'APOB' }

const s = (name, price, rating, tags, i, badge = null) => ({
  name,
  price,
  rating,
  tags,
  image: img[i % img.length],
  badge,
})

const c = (slug, name, state) => ({ slug, name, state })

// Top 100 major cities of India (slugs of the 8 with live listings match spacesByCity keys)
export const voCities = [
  c('mumbai', 'Mumbai', 'Maharashtra'),
  c('delhi', 'Delhi', 'Delhi (NCT)'),
  c('bangalore', 'Bengaluru', 'Karnataka'),
  c('hyderabad', 'Hyderabad', 'Telangana'),
  c('chennai', 'Chennai', 'Tamil Nadu'),
  c('kolkata', 'Kolkata', 'West Bengal'),
  c('pune', 'Pune', 'Maharashtra'),
  c('ahmedabad', 'Ahmedabad', 'Gujarat'),
  c('surat', 'Surat', 'Gujarat'),
  c('jaipur', 'Jaipur', 'Rajasthan'),
  c('lucknow', 'Lucknow', 'Uttar Pradesh'),
  c('kanpur', 'Kanpur', 'Uttar Pradesh'),
  c('nagpur', 'Nagpur', 'Maharashtra'),
  c('indore', 'Indore', 'Madhya Pradesh'),
  c('bhopal', 'Bhopal', 'Madhya Pradesh'),
  c('patna', 'Patna', 'Bihar'),
  c('visakhapatnam', 'Visakhapatnam', 'Andhra Pradesh'),
  c('vadodara', 'Vadodara', 'Gujarat'),
  c('ludhiana', 'Ludhiana', 'Punjab'),
  c('agra', 'Agra', 'Uttar Pradesh'),
  c('nashik', 'Nashik', 'Maharashtra'),
  c('faridabad', 'Faridabad', 'Haryana'),
  c('ghaziabad', 'Ghaziabad', 'Uttar Pradesh'),
  c('noida', 'Noida', 'Uttar Pradesh'),
  c('gurgaon', 'Gurugram', 'Haryana'),
  c('meerut', 'Meerut', 'Uttar Pradesh'),
  c('rajkot', 'Rajkot', 'Gujarat'),
  c('varanasi', 'Varanasi', 'Uttar Pradesh'),
  c('srinagar', 'Srinagar', 'Jammu & Kashmir'),
  c('aurangabad', 'Chhatrapati Sambhajinagar', 'Maharashtra'),
  c('dhanbad', 'Dhanbad', 'Jharkhand'),
  c('amritsar', 'Amritsar', 'Punjab'),
  c('navi-mumbai', 'Navi Mumbai', 'Maharashtra'),
  c('prayagraj', 'Prayagraj', 'Uttar Pradesh'),
  c('ranchi', 'Ranchi', 'Jharkhand'),
  c('howrah', 'Howrah', 'West Bengal'),
  c('coimbatore', 'Coimbatore', 'Tamil Nadu'),
  c('jabalpur', 'Jabalpur', 'Madhya Pradesh'),
  c('gwalior', 'Gwalior', 'Madhya Pradesh'),
  c('vijayawada', 'Vijayawada', 'Andhra Pradesh'),
  c('jodhpur', 'Jodhpur', 'Rajasthan'),
  c('madurai', 'Madurai', 'Tamil Nadu'),
  c('raipur', 'Raipur', 'Chhattisgarh'),
  c('kota', 'Kota', 'Rajasthan'),
  c('guwahati', 'Guwahati', 'Assam'),
  c('chandigarh', 'Chandigarh', 'Chandigarh'),
  c('solapur', 'Solapur', 'Maharashtra'),
  c('hubballi', 'Hubballi', 'Karnataka'),
  c('tiruchirappalli', 'Tiruchirappalli', 'Tamil Nadu'),
  c('bareilly', 'Bareilly', 'Uttar Pradesh'),
  c('mysuru', 'Mysuru', 'Karnataka'),
  c('tiruppur', 'Tiruppur', 'Tamil Nadu'),
  c('moradabad', 'Moradabad', 'Uttar Pradesh'),
  c('aligarh', 'Aligarh', 'Uttar Pradesh'),
  c('jalandhar', 'Jalandhar', 'Punjab'),
  c('bhubaneswar', 'Bhubaneswar', 'Odisha'),
  c('salem', 'Salem', 'Tamil Nadu'),
  c('warangal', 'Warangal', 'Telangana'),
  c('guntur', 'Guntur', 'Andhra Pradesh'),
  c('bhiwandi', 'Bhiwandi', 'Maharashtra'),
  c('gorakhpur', 'Gorakhpur', 'Uttar Pradesh'),
  c('bikaner', 'Bikaner', 'Rajasthan'),
  c('amravati', 'Amravati', 'Maharashtra'),
  c('jamshedpur', 'Jamshedpur', 'Jharkhand'),
  c('bhilai', 'Bhilai', 'Chhattisgarh'),
  c('cuttack', 'Cuttack', 'Odisha'),
  c('kochi', 'Kochi', 'Kerala'),
  c('nellore', 'Nellore', 'Andhra Pradesh'),
  c('bhavnagar', 'Bhavnagar', 'Gujarat'),
  c('dehradun', 'Dehradun', 'Uttarakhand'),
  c('durgapur', 'Durgapur', 'West Bengal'),
  c('asansol', 'Asansol', 'West Bengal'),
  c('rourkela', 'Rourkela', 'Odisha'),
  c('nanded', 'Nanded', 'Maharashtra'),
  c('kolhapur', 'Kolhapur', 'Maharashtra'),
  c('ajmer', 'Ajmer', 'Rajasthan'),
  c('akola', 'Akola', 'Maharashtra'),
  c('kalaburagi', 'Kalaburagi', 'Karnataka'),
  c('jamnagar', 'Jamnagar', 'Gujarat'),
  c('ujjain', 'Ujjain', 'Madhya Pradesh'),
  c('siliguri', 'Siliguri', 'West Bengal'),
  c('jhansi', 'Jhansi', 'Uttar Pradesh'),
  c('jammu', 'Jammu', 'Jammu & Kashmir'),
  c('sangli', 'Sangli', 'Maharashtra'),
  c('mangaluru', 'Mangaluru', 'Karnataka'),
  c('erode', 'Erode', 'Tamil Nadu'),
  c('belagavi', 'Belagavi', 'Karnataka'),
  c('tirunelveli', 'Tirunelveli', 'Tamil Nadu'),
  c('gaya', 'Gaya', 'Bihar'),
  c('udaipur', 'Udaipur', 'Rajasthan'),
  c('kozhikode', 'Kozhikode', 'Kerala'),
  c('kurnool', 'Kurnool', 'Andhra Pradesh'),
  c('rajahmundry', 'Rajahmundry', 'Andhra Pradesh'),
  c('bokaro', 'Bokaro', 'Jharkhand'),
  c('patiala', 'Patiala', 'Punjab'),
  c('panipat', 'Panipat', 'Haryana'),
  c('rohtak', 'Rohtak', 'Haryana'),
  c('karnal', 'Karnal', 'Haryana'),
  c('thiruvananthapuram', 'Thiruvananthapuram', 'Kerala'),
  c('thane', 'Thane', 'Maharashtra'),
  c('mohali', 'Mohali', 'Punjab'),
  c('zirakpur', 'Zirakpur', 'Punjab'),
  c('panchkula', 'Panchkula', 'Haryana'),
]

// ── Tier-1 / primary city ordering per state ─────────────────
// For a state view, the commercial-hub (tier-1) cities should surface first,
// then the rest. Cities listed here float to the top in this exact order;
// any other city of that state follows in its existing voCities order.
// Keys are lowercased state names.
export const statePriority = {
  'uttar pradesh': ['noida', 'ghaziabad', 'lucknow', 'kanpur', 'agra', 'varanasi', 'prayagraj', 'meerut'],
  haryana: ['gurgaon', 'faridabad', 'panchkula', 'panipat', 'karnal', 'rohtak'],
  punjab: ['mohali', 'zirakpur', 'ludhiana', 'amritsar', 'jalandhar', 'patiala'],
  'madhya pradesh': ['indore', 'bhopal', 'jabalpur', 'gwalior', 'ujjain'],
  karnataka: ['bangalore', 'mysuru', 'mangaluru', 'hubballi', 'belagavi', 'kalaburagi'],
  maharashtra: ['mumbai', 'pune', 'navi-mumbai', 'thane', 'nagpur', 'nashik', 'aurangabad', 'solapur', 'kolhapur', 'sangli', 'nanded', 'akola', 'amravati', 'bhiwandi'],
  telangana: ['hyderabad', 'warangal'],
  'tamil nadu': ['chennai', 'coimbatore', 'madurai', 'tiruchirappalli', 'salem', 'tiruppur', 'erode', 'tirunelveli'],
  gujarat: ['ahmedabad', 'surat', 'vadodara', 'rajkot', 'bhavnagar', 'jamnagar'],
  rajasthan: ['jaipur', 'jodhpur', 'udaipur', 'kota', 'ajmer', 'bikaner'],
  'west bengal': ['kolkata', 'howrah', 'siliguri', 'durgapur', 'asansol'],
  'andhra pradesh': ['visakhapatnam', 'vijayawada', 'guntur', 'nellore', 'kurnool', 'rajahmundry'],
  kerala: ['kochi', 'thiruvananthapuram', 'kozhikode'],
  bihar: ['patna', 'gaya'],
  jharkhand: ['ranchi', 'jamshedpur', 'dhanbad', 'bokaro'],
  odisha: ['bhubaneswar', 'cuttack', 'rourkela'],
  chhattisgarh: ['raipur', 'bhilai'],
  'jammu & kashmir': ['jammu', 'srinagar'],
}

// Cities of a state, tier-1 first (see statePriority). Falls back to the
// natural voCities order for states without an explicit priority list.
export function citiesForState(state) {
  const key = String(state || '').toLowerCase()
  const order = statePriority[key] || []
  const rank = (slug) => {
    const i = order.indexOf(slug)
    return i === -1 ? order.length + 1000 : i
  }
  return voCities
    .filter((c) => (c.state || '').toLowerCase() === key)
    .sort((a, b) => rank(a.slug) - rank(b.slug))
}

export const spacesByCity = {
  // All listing data now lives in Supabase (public.spaces table).
  // This object is kept empty so existing code that references it doesn't break.
  // The getSpaces() function fetches live data from Supabase automatically.
}

// Generic areas for cities without an explicit listing yet.
const GENERIC = [
  'Central Business District',
  'Prime Commercial Hub',
  'IT & Tech Park',
  'Main Market Area',
  'City Centre',
  'Business Bay',
]

// Basic listing cards derived from CSV-imported rich details for a city.
function importedCards(slug) {
  const prefix = `${slug}/`
  return Object.entries(generatedSpaceDetails)
    .filter(([k]) => k.startsWith(prefix))
    .map(([, d], i) => ({
      name: d.area || d.spaceName || 'Business Hub',
      price: Number(d.pricing?.monthly) || 799,
      rating: Number(d.rating) || 4.7,
      tags: d.tags?.length ? d.tags : [T.gst, T.co, T.mail],
      image: d.featuredImage || img[i % img.length],
      badge: d.badge || null,
    }))
}

export function getSpaces(slug) {
  const imported = importedCards(slug)
  if (imported.length) {
    const seen = new Set()
    const merged = []
    for (const sp of imported) {
      const key = slugifySpace(sp.name)
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(sp)
    }
    return merged
  }
  // No generic/fake listings — only show real data from Supabase
  return []
}


// Old / alternate / colloquial names so search finds a city even when the user
// types the former name (data stores the current official name). All lowercase.
export const cityAliases = {
  bangalore: ['bangalore', 'bengaluru'],
  gurgaon: ['gurgaon', 'gurugram', 'guru gram'],
  mumbai: ['bombay'],
  delhi: ['new delhi', 'ncr'],
  chennai: ['madras'],
  kolkata: ['calcutta'],
  pune: ['poona'],
  ahmedabad: ['amdavad'],
  vadodara: ['baroda'],
  visakhapatnam: ['vizag', 'vizagapatnam', 'waltair'],
  aurangabad: ['aurangabad', 'sambhajinagar', 'chhatrapati sambhajinagar'],
  prayagraj: ['allahabad', 'prayag'],
  mysuru: ['mysore'],
  hubballi: ['hubli', 'hubli-dharwad', 'dharwad'],
  tiruchirappalli: ['trichy', 'tiruchi', 'trichinopoly'],
  mangaluru: ['mangalore'],
  belagavi: ['belgaum'],
  kalaburagi: ['gulbarga'],
  tiruppur: ['tirupur'],
  thiruvananthapuram: ['trivandrum'],
  kozhikode: ['calicut'],
  kochi: ['cochin', 'ernakulam'],
  rajahmundry: ['rajamahendravaram'],
  varanasi: ['banaras', 'benares', 'kashi'],
  kanpur: ['cawnpore'],
  vijayawada: ['bezawada'],
  solapur: ['sholapur'],
  'navi-mumbai': ['navi mumbai', 'navimumbai'],
  gwalior: ['gwaliyar'],
  bhopal: ['bhopaal'],
  guwahati: ['gauhati'],
  jodhpur: ['jodhpur', 'blue city'],
  udaipur: ['udaipur', 'lake city'],
  // more former / alternate / colloquial names
  amritsar: ['ambarsar'],
  jalandhar: ['jullundur'],
  jamshedpur: ['tatanagar', 'tata nagar'],
  cuttack: ['kataka'],
  coimbatore: ['kovai'],
  nashik: ['nasik'],
  mohali: ['sas nagar', 'sahibzada ajit singh nagar', 'ajit singh nagar'],
  patna: ['pataliputra'],
  ujjain: ['avantika', 'ujjayini'],
  tirunelveli: ['nellai'],
  jaipur: ['pink city'],
  nagpur: ['orange city'],
  panipat: ['paanipat'],
  faridabad: ['ballabgarh'],
  ludhiana: ['ludhiyana'],
  bareilly: ['bans bareilly'],
}

// True if the query matches a city's current name, state, or any alias.
export function cityMatches(city, query) {
  const q = String(query || '').trim().toLowerCase()
  if (!q) return true
  if (city.name.toLowerCase().includes(q)) return true
  if ((city.state || '').toLowerCase().includes(q)) return true
  const aliases = cityAliases[city.slug]
  return aliases ? aliases.some((a) => a.includes(q) || q.includes(a)) : false
}


// ── Space detail helpers ─────────────────────────────────────
export function slugifySpace(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Slugify a state name for URLs (e.g. "Uttar Pradesh" → "uttar-pradesh")
export function slugifyState(state) {
  return String(state || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Get the state slug for a given city slug (e.g. "gurgaon" → "haryana")
// Also handles name-based slugs (e.g. "gurugram" → "haryana")
export function getStateSlugForCity(citySlug) {
  // Direct match
  const city = voCities.find((c) => c.slug === citySlug)
  if (city) return slugifyState(city.state)
  // Match by display name slug (e.g. "gurugram" → Gurugram → Haryana)
  const byName = voCities.find((c) => slugifySpace(c.name) === citySlug)
  if (byName) return slugifyState(byName.state)
  // Match by alias
  const byAlias = voCities.find((c) =>
    (cityAliases[c.slug] || []).includes(citySlug)
  )
  if (byAlias) return slugifyState(byAlias.state)
  return ''
}

// Get the state name from a state slug (e.g. "haryana" → "Haryana")
export function getStateNameFromSlug(stateSlug) {
  const slug = (stateSlug || '').toLowerCase()
  const city = voCities.find((c) => slugifyState(c.state) === slug)
  return city ? city.state : ''
}

// Get all unique states as { slug, name } pairs
export function getAllStates() {
  const seen = new Set()
  return voCities
    .filter((c) => {
      const key = (c.state || '').toLowerCase()
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((c) => ({ slug: slugifyState(c.state), name: c.state }))
}

// Build the canonical URL for a city page: /virtual-office/{stateSlug}/{citySlug}
export function cityUrl(citySlug) {
  // Resolve to canonical slug (e.g. "gurugram" → "gurgaon")
  const canonical = voCities.find((c) => c.slug === citySlug)?.slug
    || voCities.find((c) => slugifySpace(c.name) === citySlug)?.slug
    || voCities.find((c) => (cityAliases[c.slug] || []).includes(citySlug))?.slug
    || citySlug
  const stateSlug = getStateSlugForCity(canonical)
  return stateSlug ? `/virtual-office/${stateSlug}/${canonical}` : `/virtual-office/${canonical}`
}

// Build the canonical URL for a space page: /virtual-office/{stateSlug}/{citySlug}/{spaceSlug}
export function spaceUrl(citySlug, spaceSlug) {
  // Resolve to canonical slug
  const canonical = voCities.find((c) => c.slug === citySlug)?.slug
    || voCities.find((c) => slugifySpace(c.name) === citySlug)?.slug
    || voCities.find((c) => (cityAliases[c.slug] || []).includes(citySlug))?.slug
    || citySlug
  const stateSlug = getStateSlugForCity(canonical)
  return stateSlug
    ? `/virtual-office/${stateSlug}/${canonical}/${spaceSlug}`
    : `/virtual-office/${canonical}/${spaceSlug}`
}

// Find a single space (locality) within a city by its slug.
export function getSpaceBySlug(citySlug, spaceSlug) {
  const list = getSpaces(citySlug) || []
  return list.find((s) => slugifySpace(s.name) === spaceSlug) || null
}

// Deterministic placeholder stats derived from a key, so numbers stay stable
// per space until the real backend is wired in (then replace this).
// Uses an unsigned FNV-1a hash + unsigned shifts so values are always positive.
// Ranges: weekly 5–10, monthly 12–32, occupancy 62–94, seatsAvail 8–40.
export function spaceStats(key = '') {
  let h = 2166136261 >>> 0
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return {
    weekly: 5 + (h % 6), // 5–10 bookings this week
    monthly: 12 + ((h >>> 5) % 21), // 12–32 bookings this month
    occupancy: 62 + ((h >>> 11) % 33), // 62–94 % occupancy
    seatsAvail: 8 + ((h >>> 17) % 33), // 8–40 seats available now
  }
}
