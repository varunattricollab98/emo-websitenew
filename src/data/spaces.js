// Virtual office / workspace listings per city (drives the Explore section + counts).
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
  bangalore: [
    s('Koramangala', 999, 4.9, [T.gst, T.co, T.mail], 0, 'Most Sold'),
    s('Indiranagar', 1099, 4.8, [T.gst, T.co], 1, 'Trending'),
    s('MG Road', 1199, 4.8, [T.gst, T.co, T.apob], 2),
    s('HSR Layout', 949, 4.7, [T.gst, T.mail], 3),
    s('Whitefield', 899, 4.7, [T.gst, T.apob], 4),
    s('Electronic City', 899, 4.6, [T.gst, T.co], 5),
    s('JP Nagar', 949, 4.7, [T.gst, T.mail], 6),
    s('Jayanagar', 999, 4.8, [T.gst, T.co], 7),
    s('Marathahalli', 899, 4.6, [T.gst, T.apob], 8),
    s('Hebbal', 949, 4.7, [T.gst, T.co, T.mail], 9),
  ],
  delhi: [
    s('Connaught Place', 999, 4.9, [T.gst, T.co, T.mail], 7, 'Most Sold'),
    s('Nehru Place', 949, 4.8, [T.gst, T.co], 2),
    s('Saket', 999, 4.7, [T.gst, T.apob], 1),
    s('Okhla', 899, 4.6, [T.gst, T.co], 5),
    s('Rajouri Garden', 899, 4.6, [T.gst, T.mail], 3),
    s('Janakpuri', 949, 4.7, [T.gst, T.co], 0),
  ],
  mumbai: [
    s('Andheri East', 1199, 4.9, [T.gst, T.co, T.apob], 2, 'Most Sold'),
    s('BKC', 1499, 4.9, [T.gst, T.co], 4, 'Premium'),
    s('Lower Parel', 1299, 4.8, [T.gst, T.co], 1),
    s('Powai', 1199, 4.7, [T.gst, T.mail], 8),
    s('Malad', 1099, 4.6, [T.gst, T.apob], 5),
    s('Thane', 999, 4.6, [T.gst, T.co], 6),
  ],
  gurgaon: [
    s('Cyber City', 1099, 4.9, [T.gst, T.co, T.apob], 1, 'Trending'),
    s('Sohna Road', 999, 4.7, [T.gst, T.co], 3),
    s('Golf Course Road', 1199, 4.8, [T.gst, T.co], 4),
    s('Udyog Vihar', 949, 4.6, [T.gst, T.apob], 5),
    s('MG Road', 999, 4.7, [T.gst, T.mail], 0),
  ],
  hyderabad: [
    s('HITEC City', 999, 4.8, [T.gst, T.co, T.apob], 3, 'Most Sold'),
    s('Gachibowli', 999, 4.7, [T.gst, T.co], 9),
    s('Banjara Hills', 1099, 4.8, [T.gst, T.co], 2),
    s('Madhapur', 949, 4.6, [T.gst, T.mail], 5),
    s('Kondapur', 899, 4.6, [T.gst, T.apob], 6),
  ],
  pune: [
    s('Baner', 899, 4.7, [T.gst, T.co], 4, 'Trending'),
    s('Hinjewadi', 899, 4.7, [T.gst, T.apob], 6),
    s('Kharadi', 949, 4.6, [T.gst, T.co], 8),
    s('Viman Nagar', 899, 4.6, [T.gst, T.mail], 0),
  ],
  chennai: [
    s('OMR', 999, 4.7, [T.gst, T.co, T.apob], 5, 'Trending'),
    s('Guindy', 949, 4.6, [T.gst, T.co], 2),
    s('T. Nagar', 999, 4.7, [T.gst, T.mail], 1),
    s('Anna Nagar', 899, 4.6, [T.gst, T.co], 3),
  ],
  noida: [
    s('Sector 62', 899, 4.8, [T.gst, T.co, T.apob], 6, 'Most Sold'),
    s('Sector 63', 899, 4.7, [T.gst, T.co], 7),
    s('Sector 132', 949, 4.6, [T.gst, T.mail], 8),
    s('Sector 16', 899, 4.6, [T.gst, T.co], 0),
  ],
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

export function getSpaces(slug) {
  if (spacesByCity[slug]) return spacesByCity[slug]
  return GENERIC.map((area, i) => s(area, 799, 4.7, [T.gst, T.co, T.mail], i))
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
