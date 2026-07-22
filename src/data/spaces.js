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

// helper to keep entries compact
const s = (name, price, rating, tags, i, badge = null) => ({
  name,
  price,
  rating,
  tags,
  image: img[i % img.length],
  badge,
})

export const voCities = [
  { slug: 'bangalore', name: 'Bangalore' },
  { slug: 'delhi', name: 'Delhi' },
  { slug: 'mumbai', name: 'Mumbai' },
  { slug: 'gurgaon', name: 'Gurgaon' },
  { slug: 'hyderabad', name: 'Hyderabad' },
  { slug: 'pune', name: 'Pune' },
  { slug: 'chennai', name: 'Chennai' },
  { slug: 'noida', name: 'Noida' },
]

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
