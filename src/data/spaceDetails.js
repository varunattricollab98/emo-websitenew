// Rich per-space content. Populate this from your CSV import.
// Key = `${citySlug}/${areaSlug}`  (areaSlug = slugified address_area).
//
// CSV column  ->  field
//   description                     -> description
//   featured_image                  -> featuredImage
//   space_images / space_images_url -> gallery: []   (split the CSV string into an array)
//   address_area                    -> area
//   address_city                    -> city
//   address_state                   -> state
//   space_name                      -> spaceName
//   full_address                    -> fullAddress
//   listing_address                 -> listingAddress
//   processing_time                 -> processingTime
//   property_type                   -> propertyType
//   property_feature                -> amenities: []  (split the CSV string into an array)
//   pricing_monthly_starting_price  -> pricing.monthly
//   pricing_BR_Plan_Price           -> pricing.br
//   pricing_GST_Plan_Price          -> pricing.gst
//   pricing_MA_Plan_Price           -> pricing.ma
//
// Anything omitted falls back to sensible defaults in the SpaceDetail page.

export const spaceDetails = {
  'gurgaon/sohna-road': {
    spaceName: 'Sohna Road Business Hub',
    area: 'Sohna Road',
    city: 'Gurugram',
    state: 'Haryana',
    rating: 4.8,
    description:
      'Sohna Road is one of Gurugram\u2019s fastest-growing commercial corridors, lined with Grade-A office towers, retail hubs and premium residences. Its seamless connectivity to Golf Course Extension Road, NH-48 and the upcoming metro makes it a magnet for startups, IT firms and consulting businesses. A virtual office on Sohna Road gives your company a prestigious Gurugram address for GST and company registration, plug-and-play coworking desks, and mail handling \u2014 all without the cost of a full lease.',
    featuredImage:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
    ],
    pricing: { monthly: 999, br: 1199, gst: 899, ma: 699 },
    fullAddress: 'Tower B, Sohna Road, Sector 48, Gurugram, Haryana 122018',
    listingAddress: 'Sohna Road, Sector 48, Gurugram',
    propertyType: 'Grade-A Commercial \u00b7 Coworking + Virtual Office',
    processingTime: '2\u20133 business days',
    amenities: [
      'High-speed Wi-Fi',
      'Meeting & conference rooms',
      'Reception & front desk',
      'Mail & courier handling',
      'Café & pantry',
      'Ample parking',
      '24x7 power backup',
      'CCTV security',
      'Housekeeping',
    ],
    reviews: [
      {
        name: 'Rahul Sharma',
        role: 'Founder, D2C Brand',
        rating: 5,
        text: 'Got our GST registered on the Sohna Road address in 3 days. Documents were spot-on and the team handled everything.',
      },
      {
        name: 'Ananya Kapoor',
        role: 'Chartered Accountant',
        rating: 5,
        text: 'I refer clients here regularly — verification-ready paperwork and a genuinely helpful manager. Never had a rejection.',
      },
      {
        name: 'Mohit Verma',
        role: 'Startup Co-founder',
        rating: 4,
        text: 'Premium address in a prime Gurugram location at a fair price. The coworking desks are a great bonus.',
      },
    ],
  },
}

export function getSpaceDetail(citySlug, areaSlug) {
  return spaceDetails[`${citySlug}/${areaSlug}`] || null
}
