// Central place to add descriptions at every level:
//   State  -> stateDescriptions[ 'Haryana' ]
//   City   -> cityDescriptions[ 'gurgaon' ]        (key = city slug)
//   Locality -> localityDescriptions[ 'gurgaon/sohna-road' ]  (key = `${citySlug}/${areaSlug}`)
//   Space  -> lives in spaceDetails.js (description / article)
//
// Each value can be EITHER:
//   • a plain string (blank lines "\n\n" split into paragraphs), OR
//   • a blocks array for rich blogs — e.g.
//       [ 'intro para', { h: 'Heading' }, { list: ['a','b'] }, { quote: 'tip' } ]
// (see components/ui/ArticleBlocks.jsx for all block types)

export const stateDescriptions = {
  Haryana: [
    'Haryana is one of India\u2019s most business-friendly states, home to Gurugram \u2014 a leading corporate and startup hub \u2014 along with Faridabad, Panipat and other fast-growing industrial cities.',
    'A virtual office in Haryana gives your business a prestigious NCR address for GST and company registration, with full documentation and quick activation across the state.',
  ],
}

export const cityDescriptions = {
  gurgaon: [
    'Gurugram (Gurgaon) is the corporate capital of North India \u2014 home to Fortune 500 offices, unicorn startups and premium business districts like Cyber City, Golf Course Road and Sohna Road.',
    'A virtual office in Gurugram gives your company a credible, GST-ready address in a top commercial location, without the cost of a physical lease \u2014 activated in just 2\u20133 business days.',
  ],
}

export const localityDescriptions = {
  'gurgaon/sohna-road': [
    'Sohna Road is one of Gurugram\u2019s fastest-growing commercial corridors, lined with Grade-A office towers, retail hubs and premium residences, with seamless connectivity to Golf Course Extension Road and NH-48.',
  ],
}

const norm = (v) => (Array.isArray(v) ? v : v ? String(v).split('\n\n').filter(Boolean) : [])

export function getStateDescription(state) {
  return stateDescriptions[state] || null
}
export function getCityDescription(citySlug) {
  return cityDescriptions[citySlug] || null
}
export function getLocalityDescription(citySlug, areaSlug) {
  return localityDescriptions[`${citySlug}/${areaSlug}`] || null
}

// Convert any description value (string OR blocks array) into blocks for ArticleBlocks.
export function toBlocks(value) {
  return norm(value)
}
