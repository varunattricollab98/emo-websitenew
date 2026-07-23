// City-wise coworking listings for the Coworking page.
// Localities are real business districts (public info); hub names are our own
// curated style (not competitor brands); pricing is indicative, based on
// prevailing market ranges (day pass ~₹500–1,000, dedicated desk ~₹5k–15k/mo).

const img = [
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1462826303086-329426d1aef5?auto=format&fit=crop&w=800&q=80',
]

// sp(name, locality, seatPrice/mo, dayPass, seats, rating, tags, imgIndex, popular)
const sp = (name, locality, price, dayPass, seats, rating, tags, i, popular = false) => ({
  name,
  locality,
  price,
  dayPass,
  seats,
  rating,
  tags,
  image: img[i % img.length],
  popular,
})

export const coworkingCities = [
  { slug: 'bangalore', name: 'Bengaluru' },
  { slug: 'gurgaon', name: 'Gurugram' },
  { slug: 'mumbai', name: 'Mumbai' },
  { slug: 'delhi', name: 'Delhi' },
  { slug: 'hyderabad', name: 'Hyderabad' },
  { slug: 'pune', name: 'Pune' },
  { slug: 'chennai', name: 'Chennai' },
  { slug: 'noida', name: 'Noida' },
]

export const spacesByCity = {
  bangalore: [
    sp('Signature Coworking', 'Koramangala', 8500, 649, '2–120 seats', 4.9, ['Metro nearby', '24x7 access', 'Cafeteria'], 0, true),
    sp('Executive Hub', 'HSR Layout', 7200, 599, '4–80 seats', 4.8, ['Startup hub', 'Parking', 'Event space'], 1),
    sp('Skyline Workspaces', 'Indiranagar', 9500, 699, '2–60 seats', 4.8, ['Metro nearby', 'Rooftop', 'Cafe'], 2),
    sp('TechPark Coworking', 'Whitefield', 6500, 549, '10–200 seats', 4.7, ['IT corridor', 'Parking', 'Gym'], 3),
    sp('Central Business Hub', 'MG Road', 9900, 749, '2–50 seats', 4.8, ['Prime CBD', 'Metro nearby', 'Lounge'], 4),
    sp('Innov8 Corner', 'Electronic City', 6200, 499, '10–150 seats', 4.6, ['IT hub', 'Shuttle', 'Cafeteria'], 5),
  ],
  gurgaon: [
    sp('Cyber Business Hub', 'Cyber City', 9800, 749, '4–150 seats', 4.9, ['Metro nearby', 'Fine dining', '24x7'], 6, true),
    sp('Golf View Workspaces', 'Golf Course Road', 9200, 699, '2–80 seats', 4.8, ['Premium', 'Metro', 'Lounge'], 7),
    sp('Enterprise Hub', 'Udyog Vihar', 6800, 549, '10–200 seats', 4.7, ['Industrial hub', 'Parking', 'Cafe'], 0),
    sp('Southern Peak Coworking', 'Sohna Road', 6200, 499, '4–120 seats', 4.6, ['Value pick', 'Parking', 'Cafeteria'], 1),
  ],
  mumbai: [
    sp('Bandra Business Hub', 'BKC', 11500, 899, '2–100 seats', 4.9, ['Prime CBD', 'Metro nearby', 'Fine dining'], 2, true),
    sp('Harbour Workspaces', 'Lower Parel', 10500, 799, '4–120 seats', 4.8, ['Corporate hub', 'Cafe', 'Lounge'], 3),
    sp('Skyport Coworking', 'Andheri East', 8500, 649, '10–180 seats', 4.7, ['Metro & airport', 'Parking', 'Cafeteria'], 4),
    sp('Eastern Edge Hub', 'Vikhroli', 6900, 549, '10–160 seats', 4.6, ['Power backup', 'Parking', 'Value pick'], 5),
  ],
  delhi: [
    sp('Capital Central Hub', 'Connaught Place', 10500, 799, '2–90 seats', 4.9, ['Prime CBD', 'Metro nearby', 'Lounge'], 6, true),
    sp('Trade Tower Coworking', 'Nehru Place', 7800, 599, '4–120 seats', 4.7, ['Business district', 'Metro', 'Cafeteria'], 7),
    sp('South Delhi Workspaces', 'Saket', 8200, 649, '2–70 seats', 4.8, ['Malls nearby', 'Metro', 'Cafe'], 0),
    sp('Enterprise Corner', 'Okhla', 6200, 499, '10–150 seats', 4.6, ['Industrial hub', 'Parking', 'Value pick'], 1),
  ],
  hyderabad: [
    sp('HITEC Business Hub', 'HITEC City', 8200, 599, '4–160 seats', 4.9, ['IT corridor', 'Metro nearby', 'Cafeteria'], 2, true),
    sp('Cyber Gateway Coworking', 'Gachibowli', 7500, 549, '10–200 seats', 4.8, ['IT hub', 'Parking', 'Gym'], 3),
    sp('Skyline Workspaces', 'Madhapur', 7200, 549, '2–90 seats', 4.7, ['Startup hub', 'Cafe', 'Lounge'], 4),
    sp('Heritage Hub', 'Banjara Hills', 8600, 649, '2–60 seats', 4.7, ['Premium', 'Fine dining', 'Parking'], 5),
  ],
  pune: [
    sp('Corporate Ridge Hub', 'Baner', 7200, 549, '4–140 seats', 4.8, ['IT belt', 'Parking', 'Cafeteria'], 6, true),
    sp('Eastgate Coworking', 'Kharadi', 6800, 499, '10–180 seats', 4.7, ['IT hub', 'Shuttle', 'Cafe'], 7),
    sp('Tech Valley Workspaces', 'Hinjewadi', 6200, 449, '10–220 seats', 4.6, ['IT park', 'Parking', 'Gym'], 0),
    sp('Airport Edge Hub', 'Viman Nagar', 7000, 549, '2–80 seats', 4.7, ['Airport nearby', 'Mall', 'Lounge'], 1),
  ],
  chennai: [
    sp('OMR Business Hub', 'OMR', 6800, 549, '10–200 seats', 4.8, ['IT expressway', 'Parking', 'Cafeteria'], 2, true),
    sp('Gateway Coworking', 'Guindy', 7500, 599, '4–120 seats', 4.7, ['Metro nearby', 'CBD', 'Cafe'], 3),
    sp('Central Workspaces', 'Nungambakkam', 8200, 649, '2–70 seats', 4.7, ['Prime CBD', 'Lounge', 'Parking'], 4),
    sp('Marina Edge Hub', 'Anna Salai', 6900, 549, '4–110 seats', 4.6, ['Central', 'Metro', 'Value pick'], 5),
  ],
  noida: [
    sp('Sector 62 Business Hub', 'Sector 62', 6500, 499, '10–180 seats', 4.8, ['IT hub', 'Metro nearby', 'Cafeteria'], 6, true),
    sp('Metro Central Coworking', 'Sector 16', 6800, 499, '4–120 seats', 4.7, ['Metro nearby', 'Parking', 'Cafe'], 7),
    sp('Expressway Workspaces', 'Sector 125', 6200, 449, '10–200 seats', 4.6, ['Expressway', 'Parking', 'Value pick'], 0),
    sp('Corporate Park Hub', 'Sector 132', 6000, 449, '10–220 seats', 4.6, ['Corporate park', 'Shuttle', 'Gym'], 1),
  ],
}

export function getCoworkingSpaces(slug) {
  return spacesByCity[slug] || []
}
