export const cities = [
  { slug: 'delhi', name: 'Delhi', price: 899, addresses: 24, region: 'North India' },
  { slug: 'mumbai', name: 'Mumbai', price: 1199, addresses: 32, region: 'West India' },
  { slug: 'bangalore', name: 'Bangalore', price: 999, addresses: 28, region: 'South India' },
  { slug: 'gurgaon', name: 'Gurgaon', price: 999, addresses: 18, region: 'North India' },
  { slug: 'hyderabad', name: 'Hyderabad', price: 999, addresses: 16, region: 'South India' },
  { slug: 'chennai', name: 'Chennai', price: 999, addresses: 14, region: 'South India' },
  { slug: 'pune', name: 'Pune', price: 899, addresses: 15, region: 'West India' },
  { slug: 'noida', name: 'Noida', price: 899, addresses: 12, region: 'North India' },
]

export const footerCities = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Gurgaon',
  'Noida',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
]

export function getCityBySlug(slug) {
  if (!slug) return null
  return cities.find((c) => c.slug === slug.toLowerCase()) || null
}
