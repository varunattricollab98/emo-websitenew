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
    // All-India hub page content (/virtual-office/gst-registration).
    // Deliberately written at a national level so it does not duplicate the
    // city-templated copy above.
    national: {
      metaTitle: 'Virtual Office for GST Registration in India | EaseMyOffice',
      metaDescription:
        'Get a GST-compliant virtual office address in any Indian city. Notarised rent agreement, NOC and utility bill included, verification-ready and activated in 2–3 days.',
      heading: 'Virtual Office for GST Registration in India',
      headingAccent: 'India',
      lead:
        'Register for GST in any state without renting an office. Pick a verified commercial address in the city you need and get the complete document kit the GST department accepts, activated in 2–3 business days.',
      chips: ['Every state covered', 'APOB & multi-state GST', 'Ready in 2–3 days'],
      intro: [
        'GST registration is state-specific. If you want to bill customers from Maharashtra, warehouse stock in Karnataka and sell on marketplaces out of Haryana, you need a valid principal or additional place of business in each of those states. Renting physical premises in every state is expensive and, for most businesses, completely unnecessary.',
        'A virtual office solves this. You get a genuine, physically verified commercial address in the city you choose, together with the exact documentation set a GST officer expects: a notarised rent agreement, a No Objection Certificate from the property owner, and a recent utility bill for the premises. The address is real, the paperwork is real, and it stands up to verification.',
        { h: 'What you can use a virtual office GST address for' },
        {
          list: [
            'Fresh GST registration (GSTIN) as your Principal Place of Business',
            'Additional Place of Business (APOB) for a new state',
            'Amendment of an existing GSTIN to a new address',
            'Marketplace seller registrations, Amazon, Flipkart, Meesho, Myntra, Nykaa, JioMart and more',
            'Expanding into a state where you have no physical operations yet',
          ],
        },
        { h: 'The documents you receive' },
        'Every plan ships with the full, GST-ready kit. Nothing is billed separately and nothing is missing when you file:',
        {
          bullets: [
            'Notarised rent / lease agreement in your business name',
            'No Objection Certificate (NOC) signed by the property owner',
            'A recent electricity or utility bill for the premises',
            'Address proof and a signage / name-board photo where the state requires it',
          ],
        },
        { h: 'Choosing the right city' },
        'The right city depends on where your customers, suppliers and warehouses are, and on which state you need a GSTIN in. Delhi, Gurugram and Noida dominate NCR trade and services. Mumbai and Pune anchor western India. Bengaluru, Hyderabad and Chennai cover the southern tech and manufacturing belts. If you are registering purely for a marketplace APOB, the cheapest compliant address in that state is usually the right call.',
        {
          quote:
            'Tip: businesses selling across India commonly hold 4–8 GST registrations, one per state they store or ship from. You can add states one at a time as you grow, and manage every address through a single EaseMyOffice account.',
        },
        { h: 'How the process runs' },
        'Pick your city and plan, submit your KYC online, and our compliance team drafts and notarises the paperwork. Documents are with you in 2–3 business days. If the officer raises a query or schedules a physical verification, your relationship manager coordinates directly with the property so it closes without you chasing anyone.',
      ],
      faqs: [
        {
          q: 'Is a virtual office legally valid for GST registration in India?',
          a: 'Yes. GST law requires a valid place of business supported by proof of address, it does not require you to own or physically occupy the premises. A virtual office backed by a notarised rent agreement, owner NOC and utility bill satisfies that requirement, which is why lakhs of Indian businesses register this way.',
        },
        {
          q: 'Can I take virtual offices in multiple states for GST?',
          a: 'Yes, and this is the most common reason businesses come to us. You can hold a separate address in every state you need a GSTIN in, whether as a Principal Place of Business or as an Additional Place of Business (APOB), and manage all of them from one account.',
        },
        {
          q: 'Which cities can I get a GST virtual office in?',
          a: 'We cover the major commercial cities in every region, including Delhi, Gurugram, Noida, Mumbai, Pune, Bengaluru, Hyderabad, Chennai, Kolkata and Ahmedabad, with more locations added regularly. Pick your city from the list below to see local pricing and addresses.',
        },
        {
          q: 'What happens during GST physical verification?',
          a: 'An officer may visit the address to confirm the business exists there and that the paperwork matches. Because every address we provide is a real, verified commercial premise with signage support and a cooperating owner, these visits clear normally. Your manager is on call throughout.',
        },
        {
          q: 'How much does a GST virtual office cost?',
          a: 'Pricing depends on the city, plans start from around ₹899/month billed annually and include the complete document kit. There are no hidden charges for the agreement, NOC or utility bill. Choose a city below for its exact price.',
        },
        {
          q: 'How long until I can file my GST application?',
          a: 'Your address and full document set are ready in 2–3 business days from KYC submission. GST approval itself then depends on the department, typically a few working days when the documents are in order.',
        },
      ],
    },
    heading: (city) => `Virtual Office in ${city} for GST Registration`,
    lead: (city) =>
      `Get a verified, GST-compliant business address in ${city}, with the complete document kit accepted by the GST department, without renting physical office space.`,
    intro: (city, region) => [
      `A virtual office in ${city} is the fastest, most affordable way to register your business under GST. Instead of paying rent for a full office, you get a genuine commercial address in ${city}, ${region} along with the complete documentation set the GST department needs, a notarised rent agreement, a No Objection Certificate (NOC) from the property owner, and a recent utility bill.`,
      `Every ${city} address we provide is a real, physically verified commercial premise. That means when the GST officer conducts physical or document verification, your application clears smoothly the first time. Our team pre-checks your paperwork end-to-end so there are no back-and-forth rejections.`,
      `Whether you are a startup, freelancer, e-commerce seller or an existing business expanding into ${region}, a GST virtual office in ${city} gives you a professional presence and full compliance, activated in just 2–3 business days.`,
    ],
    why: [
      { title: 'GST-ready kit', desc: 'Rent agreement, NOC and utility bill, the exact set GST needs.' },
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
        a: `Yes. A virtual office is fully accepted for GST registration in ${city}. We provide the complete documentation kit, rent agreement, NOC and utility bill, required by the GST department.`,
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
        a: `Absolutely. Many businesses take virtual offices in multiple cities to expand their GST presence (APOB) across states, you can do the same with EaseMyOffice.`,
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
    // All-India hub page content (/virtual-office/business-registration).
    national: {
      metaTitle: 'Virtual Office for Company Registration in India | EaseMyOffice',
      nationalPrice: 999,
      metaDescription:
        'Use a verified commercial address as your registered office for Pvt Ltd, LLP or OPC incorporation anywhere in India. Full MCA document kit, ready in 2–3 days.',
      heading: 'Virtual Office for Company Registration in India',
      headingAccent: 'India',
      lead:
        'Every company incorporated in India needs a registered office address. Use a credible commercial address in the city of your choice, with the complete MCA and ROC documentation handled for you.',
      chips: ['Pvt Ltd · LLP · OPC', 'MCA & ROC accepted', 'Registered office proof'],
      intro: [
        'Under the Companies Act, every incorporated entity must maintain a registered office capable of receiving official communication, and must file proof of that address with the Registrar of Companies. Nothing in the law says you have to lease and sit in that space. What matters is that the address is genuine, that you have the owner\'s permission to use it, and that post sent there reaches you.',
        'That is exactly what a virtual office registered office gives you. You get a real commercial address in a recognised business district, the documentation MCA and the ROC ask for, and reliable handling of every notice, summons and courier that arrives, without paying city-centre rent before you have revenue.',
        { h: 'Entities you can incorporate this way' },
        {
          list: [
            'Private Limited Company',
            'Limited Liability Partnership (LLP)',
            'One Person Company (OPC)',
            'Section 8 / not-for-profit company',
            'Partnership firm and sole proprietorship',
            'Indian subsidiary of a foreign parent',
          ],
        },
        { h: 'What goes into your MCA filing' },
        'Your registered-office package covers the address-proof requirements for SPICe+ / AGILE-PRO and the INC-22 filing where applicable:',
        {
          bullets: [
            'Notarised rent / lease agreement naming the company',
            'No Objection Certificate (NOC) from the property owner',
            'A recent electricity or utility bill for the premises',
            'Board-resolution drafting support for the registered-office entry',
          ],
        },
        { h: 'Where you register still matters' },
        'The state of your registered office decides which ROC handles your filings, which state authorities you deal with, and how your business reads to customers and investors. A Bengaluru or Gurugram address signals a technology or corporate footprint. Mumbai carries weight with banks, funds and BFSI clients. Delhi works well for anything with a government or policy interface. If you plan to raise capital, pick a city your prospective investors already operate in.',
        {
          quote:
            'Most founders pair a registered office with GST registration on the same address, one set of documents, one owner relationship, one renewal date to track.',
        },
        { h: 'After incorporation' },
        'All statutory post, ROC notices, income-tax communication and bank correspondence is received at the address and forwarded to you wherever you actually work. If you later move states or upgrade to a physical office, we help with the INC-22 address change so the transition stays compliant.',
      ],
      faqs: [
        {
          q: 'Can I use a virtual office as my registered office in India?',
          a: 'Yes. The Companies Act requires a registered office that can receive and acknowledge official communication, supported by valid address proof and the owner\'s NOC. A virtual office meets that standard, and it is routinely accepted by the ROC for Pvt Ltd, LLP and OPC incorporations.',
        },
        {
          q: 'Which documents does MCA need for the registered office?',
          a: 'A notarised rent or lease agreement, a No Objection Certificate from the property owner, and a recent utility bill for the premises. All three are included in every plan, along with board-resolution support.',
        },
        {
          q: 'Can a foreign company use this to set up an Indian subsidiary?',
          a: 'Yes. A virtual office registered office is a common route for foreign parents incorporating an Indian subsidiary, since it establishes a compliant local address before you commit to premises or staff.',
        },
        {
          q: 'Which city should I register my company in?',
          a: 'Choose the state whose ROC and market you want to be in. Gurugram and Bengaluru suit technology and corporate businesses, Mumbai suits finance and BFSI, Delhi suits anything policy-facing. Any city in the list below works for a compliant incorporation.',
        },
        {
          q: 'Will I receive government and legal notices at the address?',
          a: 'Yes. Statutory post, ROC and tax notices and couriers are received at the address, you are notified on arrival, and everything is forwarded to your preferred location.',
        },
        {
          q: 'Can I change my registered office later?',
          a: 'Yes. You can shift to another city or to your own premises at any time, we provide the fresh documentation and support the INC-22 filing so the change is recorded correctly with the ROC.',
        },
      ],
    },
    heading: (city) => `Virtual Office in ${city} for Company Registration`,
    lead: (city) =>
      `Use a premium ${city} address as your registered office to incorporate your Private Limited, LLP or OPC, with the complete MCA documentation handled for you.`,
    intro: (city, region) => [
      `Every company incorporated in India needs a registered office address. A virtual office in ${city} lets you use a credible, well-located commercial address as your registered office for MCA, without the cost of leasing physical space in ${region}.`,
      `We provide the full documentation kit accepted by the Ministry of Corporate Affairs (MCA) and ROC, a notarised rent agreement, NOC from the owner, and a recent utility bill, along with board-resolution support. This makes your Private Limited Company, LLP or One Person Company (OPC) incorporation smooth and compliant.`,
      `A registered office in ${city} also boosts your brand credibility with clients, banks and investors, and you can receive all official government and legal correspondence at the address, forwarded to you wherever you are.`,
    ],
    // Rich long-form blog (headings + lists + paragraphs). When `article` is present
    // it is used instead of `intro`, so you can add as much content as you like here.
    article: (city, region) => [
      `Every company incorporated in India needs a registered office address. A virtual office in ${city} lets you use a credible, well-located commercial address as your registered office for the Ministry of Corporate Affairs (MCA), without the heavy cost of leasing physical space in ${region}.`,
      { h: 'Documents you receive' },
      `Your ${city} registered-office package includes the complete documentation set accepted by the MCA and ROC:`,
      {
        list: [
          'Notarised rent / lease agreement',
          'No Objection Certificate (NOC) from the property owner',
          'A recent electricity / utility bill',
          'Board-resolution drafting support',
        ],
      },
      { h: `Which entities can register in ${city}?` },
      `Almost any business structure can use a ${city} virtual office as its registered office:`,
      {
        list: [
          'Private Limited Company',
          'Limited Liability Partnership (LLP)',
          'One Person Company (OPC)',
          'Sole Proprietorship & Partnership Firm',
        ],
      },
      { h: `Why choose ${city} for your registered office` },
      `A registered office in ${city} instantly boosts your brand credibility with clients, banks and investors. It signals that your business has a genuine, professional presence in ${region}, which helps with everything from opening a current account to winning enterprise deals.`,
      `You also receive all official government and legal correspondence at the address, and our team forwards it to you wherever you are. Once you choose a plan, exact address details are shared and your documentation is ready in just 2–3 business days.`,
      {
        quote: `Tip: many founders pair a ${city} registered office with GST registration on the same address to keep all compliance under one roof.`,
      },
    ],
    why: [
      { title: 'Registered office', desc: 'A compliant MCA registered-office address in a prime location.' },
      { title: 'Full MCA kit', desc: 'Rent agreement, NOC, utility bill and board-resolution support.' },
      { title: 'For every entity', desc: 'Private Limited, LLP, OPC and more, all supported.' },
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
    // All-India hub page content (/virtual-office/mailing-address).
    national: {
      metaTitle: 'Virtual Mailing Address in India for Business | EaseMyOffice',
      metaDescription:
        'A premium business mailing address in any Indian city. Mail and courier receiving, arrival alerts and forwarding, use it on your website, invoices and Google listing.',
      heading: 'Virtual Mailing Address in India',
      headingAccent: 'India',
      lead:
        'Give your business a professional address in the city that matters to your customers. Letters and couriers are received, logged and forwarded, and you can use the address across your website, invoices and listings.',
      chips: ['Any major city', 'Mail alerts & forwarding', 'Use on website & invoices'],
      intro: [
        'Where your business appears to be based changes how people treat it. A recognisable commercial address on your website, quotations and invoices reads as an established company. A home address or a PO box does not, and for many B2B buyers, marketplaces and payment gateways it is a reason to hesitate.',
        'A virtual mailing address gives you that professional presence in whichever Indian city suits your market, without leasing space. It is a real commercial address where a real person receives your post, tells you it arrived, and sends it on to you wherever you happen to be working.',
        { h: 'What the service covers' },
        {
          list: [
            'A premium commercial address you can publish and print',
            'Receiving of letters, government notices and courier parcels',
            'Same-day digital notification when something arrives',
            'Scan-on-request so you can read post without waiting for it',
            'Forwarding to any address in India on your schedule',
            'Secure holding of items until you are ready for them',
          ],
        },
        { h: 'Where you can use the address' },
        {
          bullets: [
            'Website contact page, footer and email signatures',
            'Visiting cards, letterheads, quotations and invoices',
            'Google Business Profile and directory listings',
            'Marketplace and payment-gateway seller onboarding',
            'Client contracts and vendor registration forms',
          ],
        },
        { h: 'Who it works best for' },
        'Remote-first teams that have no central office. Freelancers and consultants who would rather not put their home address on a public invoice. D2C brands that need a returns and correspondence address in a specific city. Businesses testing a new market before committing to premises there. Founders who travel and simply need one stable place their post lands.',
        {
          quote:
            'A mailing address is the lightest way to start. If you later need GST or company registration on the same address, you can upgrade without changing your published details.',
        },
        { h: 'Choosing your city' },
        'Pick the city your customers associate with your business, or the one closest to where you actually operate so forwarding is quick and cheap. Mumbai, Delhi and Bengaluru carry the most brand weight nationally, while a Pune, Noida or Ahmedabad address is more economical and works just as well for correspondence.',
      ],
      faqs: [
        {
          q: 'How is this different from a PO box?',
          a: 'A PO box is a mail slot with an address that is obviously not a place of business, and it is generally rejected for registrations, listings and many onboarding forms. This is a genuine commercial premise with staff who receive and handle your post, so it is usable as a real business address.',
        },
        {
          q: 'Can I use the address on my website and Google listing?',
          a: 'Yes. It is a real commercial address, so you can display it on your website, visiting cards, invoices and directory listings, and use it on your Google Business Profile.',
        },
        {
          q: 'How do I know when mail arrives?',
          a: 'You get a notification the same day something is received. You can ask for a scan of the envelope or contents, have it held for collection, or have it forwarded to any address in India.',
        },
        {
          q: 'Do I need GST or a registered company to take a mailing address?',
          a: 'No. A mailing address is purely for professional presence and post handling, so freelancers and unregistered businesses can use it. If you need GST or company registration later, you can upgrade the same address.',
        },
        {
          q: 'Can I take mailing addresses in more than one city?',
          a: 'Yes. Businesses selling nationally often keep addresses in two or three cities for regional credibility and to shorten courier and returns routes.',
        },
        {
          q: 'How quickly is the address active?',
          a: 'Typically 2–3 business days after your KYC is submitted, at which point you can start publishing and using the address.',
        },
      ],
    },
    heading: (city) => `Virtual Mailing Address in ${city}`,
    lead: (city) =>
      `Give your business a prestigious ${city} mailing address for branding, mail and couriers, perfect for remote teams and growing businesses.`,
    intro: (city, region) => [
      `A professional mailing address in ${city} gives your business instant credibility. Display it on your website, visiting cards, invoices and Google Business listing to build trust with customers across ${region}, without paying for a physical office.`,
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
    // All-India hub page content (/virtual-office/desk-plan).
    national: {
      metaTitle: 'Coworking Desk Plans Across India, Day & Monthly | EaseMyOffice',
      metaDescription:
        'Dedicated desks, hot desks and private cabins in prime business districts across India. Transparent pricing, premium amenities, no long lock-in.',
      heading: 'Coworking Desk Plans Across India',
      headingAccent: 'India',
      lead:
        'Book a dedicated desk, hot desk or private cabin in prime business districts across India. Fully furnished, premium amenities, and plans by the day or the month with no long lock-in.',
      chips: ['Day, month & annual plans', 'Cabins for teams', 'No long lock-in'],
      intro: [
        'Coworking stopped being a startup novelty a long time ago. Enterprise teams use it to open a city without a lease, distributed companies use it to give remote staff somewhere professional to work, and founders use it because a furnished desk with fast internet on day one beats three months of fit-out.',
        'We work with vetted operators in the main business districts of every major Indian city, so you can compare real options in one place, see transparent pricing, and book without brokerage.',
        { h: 'Plan types' },
        {
          list: [
            'Hot desk, any free desk on the floor, best for a few days a week',
            'Dedicated desk, the same desk reserved for you with storage',
            'Private cabin, a lockable room for 2–20 people',
            'Day pass, a single day when you need it',
            'Managed floor, a customised space for larger teams',
          ],
        },
        { h: 'What is included' },
        {
          bullets: [
            'Furnished desk, ergonomic seating and power backup',
            'High-speed business internet with backup lines',
            'Meeting-room credits and phone booths',
            'Reception, front-desk and mail handling',
            'Pantry, café, printing and housekeeping',
            'Community events and networking access',
          ],
        },
        { h: 'How to pick a city and location' },
        'Optimise for commute above everything else, an excellent space your team dreads reaching goes unused. Beyond that, cluster near your customers or talent pool: Bengaluru\'s Koramangala, Indiranagar and Outer Ring Road for product and engineering, Gurugram\'s Cyber City and Golf Course Road for corporate and consulting, Mumbai\'s BKC, Lower Parel and Andheri for finance and media, Hyderabad\'s HITEC City and Pune\'s Kharadi and Baner for IT and GCC teams.',
        {
          quote:
            'Many teams pair a desk plan with a virtual office at the same location, the desks for the people who come in, the address for GST and company registration.',
        },
        { h: 'Pricing and commitment' },
        'Day passes typically start around ₹499, hot desks from roughly ₹4,999 a month and dedicated desks from about ₹5,999, varying by city and micro-market. Private cabins are priced per seat. Monthly plans have no long lock-in, and annual commitments unlock the best rates. Tell us your team size, preferred locality and budget and we will shortlist options and arrange visits.',
      ],
      faqs: [
        {
          q: 'Can I book a coworking desk for a single day?',
          a: 'Yes. Day passes are available at most locations, along with weekly, monthly and annual plans. You can start with a day pass to try a space before committing.',
        },
        {
          q: 'What does a coworking desk cost in India?',
          a: 'Day passes typically start around ₹499. Hot desks generally run from about ₹4,999 a month and dedicated desks from around ₹5,999, depending on the city and micro-market. Private cabins are priced per seat.',
        },
        {
          q: 'Is there a lock-in period?',
          a: 'Monthly plans carry no long lock-in, you can scale up, scale down or pause as your team changes. Annual commitments get better pricing if you want to trade flexibility for rate.',
        },
        {
          q: 'Can you accommodate a whole team or a private floor?',
          a: 'Yes. Options run from a single dedicated desk to private cabins and fully managed floors with your own branding, meeting rooms and access control.',
        },
        {
          q: 'Do I pay any brokerage?',
          a: 'No. There is no brokerage or platform fee, you pay the operator\'s rate and we help you compare, negotiate and book.',
        },
        {
          q: 'Can I use my coworking address for GST or company registration?',
          a: 'Often yes, subject to the operator issuing the documentation. If registration is your main goal, a virtual office plan is usually cheaper and purpose-built for it, and can be combined with a desk plan at the same location.',
        },
      ],
    },
    heading: (city) => `Coworking Desk Plans in ${city}`,
    lead: (city) =>
      `Book a dedicated desk, hot desk or private cabin in ${city}'s top business districts, fully furnished, with premium amenities and flexible plans.`,
    intro: (city, region) => [
      `Need a place to actually sit and work in ${city}? Our coworking desk plans give you a fully-furnished, move-in-ready workspace in ${city}'s prime business districts across ${region}, with high-speed Wi-Fi, meeting rooms, reception and unlimited coffee.`,
      `Choose a dedicated desk that's reserved just for you, a flexible hot desk you can use any day, or a private cabin for your team. Pay by the day or the month, and scale up or down whenever your needs change, no long lock-ins.`,
      `It's the perfect fit for startups, freelancers, remote employees and growing teams who want a productive, professional environment in ${city} without the overheads of a traditional office lease.`,
    ],
    why: [
      { title: 'Move-in ready', desc: 'Furnished desks with power, Wi-Fi and everything set up.' },
      { title: 'Flexible plans', desc: 'Day passes, monthly desks and private cabins, no lock-in.' },
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
        a: `Yes. We offer day passes, monthly dedicated desks and private cabins in ${city}. Pick what suits you and scale anytime.`,
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

/**
 * Alternate slugs that mean the same service.
 *
 * "Company registration" and "business registration" are the same product, so
 * both URLs must land on one page rather than splitting traffic and ranking
 * across two near-identical pages. Alias slugs resolve to the canonical
 * service, and the pages redirect to the canonical URL:
 *
 *   /virtual-office/company-registration
 *     -> /virtual-office/business-registration
 *   /virtual-office/haryana/gurgaon/company-registration
 *     -> /virtual-office/haryana/gurgaon/business-registration
 */
export const serviceAliases = {
  'company-registration': 'business-registration',
  'company-incorporation': 'business-registration',
}

/** Map an alias slug to its canonical service slug (pass-through if not an alias). */
export function resolveServiceSlug(slug) {
  const s = String(slug || '').toLowerCase()
  return serviceAliases[s] || s
}

/** True when the slug is an alias, i.e. it should redirect to a different URL. */
export function isServiceAlias(slug) {
  const s = String(slug || '').toLowerCase()
  return Boolean(serviceAliases[s]) && serviceAliases[s] !== s
}

export function getServiceLanding(slug) {
  return serviceLandings[resolveServiceSlug(slug)] || null
}

/**
 * All-India (non-city) content for a service, used by the hub pages at
 * /virtual-office/{service}. Falls back to deriving copy from the city
 * template with "India" as the location, so a newly added service still
 * renders a usable hub page before its `national` block is written.
 */
export function getServiceNational(slug) {
  const svc = getServiceLanding(slug)
  if (!svc) return null
  const n = svc.national || {}
  return {
    metaTitle: n.metaTitle || `${svc.name} in India | EaseMyOffice`,
    metaDescription: n.metaDescription || (svc.lead ? svc.lead('India') : ''),
    heading: n.heading || `${svc.name} in India`,
    headingAccent: n.headingAccent || 'India',
    lead: n.lead || (svc.lead ? svc.lead('India') : ''),
    chips: n.chips || svc.chips || [],
    intro: n.intro || (svc.intro ? svc.intro('India', 'India') : []),
    faqs: n.faqs || (svc.faqs ? svc.faqs('India') : []),
    nationalPrice: n.nationalPrice || null,
  }
}

/** Canonical URL of a service hub page. */
export function serviceHubUrl(slug) {
  return `/virtual-office/${slug}`
}
