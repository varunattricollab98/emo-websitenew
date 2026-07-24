// City × Service SEO landing templates.
// 4 services per city, each rendered as a dedicated, blog-style landing page.
// Content is templated with the city name so every page reads uniquely for SEO.

export const serviceLandings = {
  'gst-registration': {
    slug: 'gst-registration',
    name: 'GST Registration',
    eyebrow: 'Virtual Office for GST',
    icon: 'FileCheck2',
    grad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    period: '/year',
    priceOffset: 0,
    chips: ['GST-ready documents', 'Clears verification', 'Ready in 2–3 days'],
    heading: (city) => `Virtual Office in ${city} for GST Registration`,
    lead: (city) =>
      `Get a verified, GST-compliant business address in ${city} — with the complete document kit accepted by the GST department, without renting physical office space.`,
    intro: (city, region) => [
      `A virtual office in ${city} is the fastest, most affordable way to register your business under GST. Instead of paying rent for a full office, you get a genuine commercial address in ${city}, ${region} along with the complete documentation set the GST department needs — a notarised rent agreement, a No Objection Certificate (NOC) from the property owner, and a recent utility bill.`,
      `Every ${city} address we provide is a real, physically verified commercial premise. That means when the GST officer conducts physical or document verification, your application clears smoothly the first time. Our team pre-checks your paperwork end-to-end so there are no back-and-forth rejections.`,
      `Whether you are a startup, freelancer, e-commerce seller or an existing business expanding into ${region}, a GST virtual office in ${city} gives you a professional presence and full compliance — activated in just 2–3 business days.`,
    ],
    why: [
      { title: 'GST-ready kit', desc: 'Rent agreement, NOC and utility bill — the exact set GST needs.' },
      { title: 'Verification-ready', desc: 'Genuine, physically verified premises that clear GST checks.' },
      { title: 'Fast activation', desc: 'Documents prepared and delivered in 2–3 business days.' },
      { title: 'Expert support', desc: 'A dedicated manager guides your GST application end-to-end.' },
    ],
    included: [
      'GST-ready commercial business address',
      'Notarised rent / lease agreement',
      'No Objection Certificate (NOC)',
      'Recent utility bill',
      'GST application assistance',
      'Dedicated relationship manager',
    ],
    faqs: (city) => [
      {
        q: `Is a virtual office valid for GST registration in ${city}?`,
        a: `Yes. A virtual office is fully accepted for GST registration in ${city}. We provide the complete documentation kit — rent agreement, NOC and utility bill — required by the GST department.`,
      },
      {
        q: `Will my ${city} address clear GST physical verification?`,
        a: `Yes. Every ${city} address is a genuine, physically verified commercial premise supplied with the full paperwork, purpose-built to clear GST verification the first time.`,
      },
      {
        q: `How long does GST registration take with a ${city} virtual office?`,
        a: `Your address and documents are ready within 2–3 business days. GST approval timelines then depend on the department, but pre-verified documents help it go through smoothly.`,
      },
      {
        q: `Can I register multiple GST states using ${city} and other cities?`,
        a: `Absolutely. Many businesses take virtual offices in multiple cities to expand their GST presence (APOB) across states — you can do the same with EaseMyOffice.`,
      },
    ],
  },

  'business-registration': {
    slug: 'business-registration',
    name: 'Business Registration',
    eyebrow: 'Registered Office Address',
    icon: 'Landmark',
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
    period: '/year',
    priceOffset: 300,
    chips: ['Pvt Ltd · LLP · OPC', 'Full MCA kit', 'Registered office'],
    heading: (city) => `Virtual Office in ${city} for Company Registration`,
    lead: (city) =>
      `Use a premium ${city} address as your registered office to incorporate your Private Limited, LLP or OPC — with the complete MCA documentation handled for you.`,
    intro: (city, region) => [
      `Every company incorporated in India needs a registered office address. A virtual office in ${city} lets you use a credible, well-located commercial address as your registered office for MCA — without the cost of leasing physical space in ${region}.`,
      `We provide the full documentation kit accepted by the Ministry of Corporate Affairs (MCA) and ROC — a notarised rent agreement, NOC from the owner, and a recent utility bill — along with board-resolution support. This makes your Private Limited Company, LLP or One Person Company (OPC) incorporation smooth and compliant.`,
      `A registered office in ${city} also boosts your brand credibility with clients, banks and investors, and you can receive all official government and legal correspondence at the address, forwarded to you wherever you are.`,
    ],
    why: [
      { title: 'Registered office', desc: 'A compliant MCA registered-office address in a prime location.' },
      { title: 'Full MCA kit', desc: 'Rent agreement, NOC, utility bill and board-resolution support.' },
      { title: 'For every entity', desc: 'Private Limited, LLP, OPC and more — all supported.' },
      { title: 'Credibility', desc: 'A prestigious address that impresses clients and investors.' },
    ],
    included: [
      'Registered office business address',
      'Complete MCA documentation kit',
      'Rent agreement + NOC + utility bill',
      'Board-resolution support',
      'Official mail & notice handling',
      'Dedicated relationship manager',
    ],
    faqs: (city) => [
      {
        q: `Can I register my company at a virtual office in ${city}?`,
        a: `Yes. Our ${city} virtual office provides a registered office address with the full MCA documentation kit for Private Limited, LLP or OPC incorporation.`,
      },
      {
        q: `Which company types can use a ${city} registered office?`,
        a: `Private Limited, LLP, OPC, and other entities can all use a ${city} virtual office as their registered office for MCA/ROC.`,
      },
      {
        q: `Will I receive government and legal mail at my ${city} address?`,
        a: `Yes. All official correspondence, notices and couriers are received at your ${city} address and forwarded to your preferred location.`,
      },
      {
        q: `How fast can I get the registered office documents?`,
        a: `Your ${city} registered-office documentation is prepared and delivered within 2–3 business days.`,
      },
    ],
  },

  'mailing-address': {
    slug: 'mailing-address',
    name: 'Mailing Address',
    eyebrow: 'Professional Mailing Address',
    icon: 'Mailbox',
    grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    period: '/year',
    priceOffset: -200,
    chips: ['Premium address', 'Mail & courier handling', 'Use on website & cards'],
    heading: (city) => `Virtual Mailing Address in ${city}`,
    lead: (city) =>
      `Give your business a prestigious ${city} mailing address for branding, mail and couriers — perfect for remote teams and growing businesses.`,
    intro: (city, region) => [
      `A professional mailing address in ${city} gives your business instant credibility. Display it on your website, visiting cards, invoices and Google Business listing to build trust with customers across ${region} — without paying for a physical office.`,
      `All your letters, government notices and courier parcels are received and safely held at the ${city} address. We notify you the moment mail arrives and can forward everything to your preferred location, so you never miss anything important.`,
      `It's the ideal solution for freelancers, consultants, D2C brands and remote-first teams who want a premium ${city} business presence and reliable mail handling, at a fraction of the cost of renting space.`,
    ],
    why: [
      { title: 'Premium presence', desc: `A credible ${'{city}'} address for your brand and marketing.` },
      { title: 'Mail handling', desc: 'Letters and couriers received, notified and forwarded.' },
      { title: 'Use everywhere', desc: 'Website, cards, invoices and Google Business listing.' },
      { title: 'Affordable', desc: 'A professional presence without physical-office costs.' },
    ],
    included: [
      'Premium business mailing address',
      'Mail & courier receiving',
      'Digital arrival notifications',
      'Mail forwarding on request',
      'Use on website, cards & listings',
      'Dedicated relationship manager',
    ],
    faqs: (city) => [
      {
        q: `Can I use a ${city} mailing address on my website and cards?`,
        a: `Yes. Your ${city} address is a genuine commercial address you can display on your website, visiting cards, invoices and Google Business listing.`,
      },
      {
        q: `Will I receive mail and couriers at my ${city} address?`,
        a: `Absolutely. Letters, government notices and parcels are received at your ${city} address. We notify you on arrival and forward them wherever you like.`,
      },
      {
        q: `Do I need GST to take a mailing address in ${city}?`,
        a: `No. A mailing address is purely for professional presence and mail handling. If you later need GST or company registration, you can upgrade anytime.`,
      },
      {
        q: `How soon is my ${city} mailing address active?`,
        a: `Your ${city} mailing address is typically activated within 2–3 business days of submitting your KYC.`,
      },
    ],
  },

  'desk-plan': {
    slug: 'desk-plan',
    name: 'Desk Plan',
    eyebrow: 'Coworking Desk Plans',
    icon: 'Armchair',
    grad: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    period: '/month',
    fixedPrice: 5999,
    chips: ['Dedicated & flexible desks', 'Premium amenities', 'Book by day or month'],
    heading: (city) => `Coworking Desk Plans in ${city}`,
    lead: (city) =>
      `Book a dedicated desk, hot desk or private cabin in ${city}'s top business districts — fully furnished, with premium amenities and flexible plans.`,
    intro: (city, region) => [
      `Need a place to actually sit and work in ${city}? Our coworking desk plans give you a fully-furnished, move-in-ready workspace in ${city}'s prime business districts across ${region} — with high-speed Wi-Fi, meeting rooms, reception and unlimited coffee.`,
      `Choose a dedicated desk that's reserved just for you, a flexible hot desk you can use any day, or a private cabin for your team. Pay by the day or the month, and scale up or down whenever your needs change — no long lock-ins.`,
      `It's the perfect fit for startups, freelancers, remote employees and growing teams who want a productive, professional environment in ${city} without the overheads of a traditional office lease.`,
    ],
    why: [
      { title: 'Move-in ready', desc: 'Furnished desks with power, Wi-Fi and everything set up.' },
      { title: 'Flexible plans', desc: 'Day passes, monthly desks and private cabins — no lock-in.' },
      { title: 'Premium amenities', desc: 'Meeting rooms, café, reception, printing and more.' },
      { title: 'Prime locations', desc: `Top business districts across ${'{city}'}.` },
    ],
    included: [
      'Dedicated or flexible desk',
      'High-speed Wi-Fi & power backup',
      'Meeting-room credits',
      'Reception & front-desk support',
      'Pantry, café & printing',
      'Community events & networking',
    ],
    faqs: (city) => [
      {
        q: `Can I book a desk in ${city} for just a day?`,
        a: `Yes. We offer day passes, monthly dedicated desks and private cabins in ${city} — pick what suits you and scale anytime.`,
      },
      {
        q: `What amenities are included with a ${city} desk plan?`,
        a: `Your ${city} desk includes high-speed Wi-Fi, meeting-room access, reception support, printing, pantry/café and community events.`,
      },
      {
        q: `Is there a lock-in for coworking desks in ${city}?`,
        a: `No long lock-in. You can start with a day pass or monthly plan and upgrade or pause as your team's needs change.`,
      },
      {
        q: `Can my whole team get desks in ${city}?`,
        a: `Yes. From a single dedicated desk to private cabins for your entire team, we have flexible ${city} coworking options.`,
      },
    ],
  },
}

export const serviceOrder = [
  'gst-registration',
  'business-registration',
  'mailing-address',
  'desk-plan',
]

export function getServiceLanding(slug) {
  return serviceLandings[String(slug || '').toLowerCase()] || null
}
