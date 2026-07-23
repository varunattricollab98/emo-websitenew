// CA & Compliance service catalog for the CA Services page.
// EaseMyOffice is a business-compliance facilitation platform — every filing is
// prepared and reviewed by qualified partner professionals (CA / CS / experts).
// Names are client-facing and framed to be honest & compliant (no guarantees,
// no exaggerated claims, no disparaging comparisons).

// ---- categories (drive the tabbed finder + hero search filter) ----
export const caCategories = [
  {
    key: 'gst',
    short: 'GST & Tax Filing',
    tagline: 'Registration & timely return filing',
    grad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    accent: '#059669',
  },
  {
    key: 'registration',
    short: 'Business Registration',
    tagline: 'Incorporate & register your entity',
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
    accent: '#2c679e',
  },
  {
    key: 'licenses',
    short: 'Licenses & Certifications',
    tagline: 'Stay licensed & inspection-ready',
    grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    accent: '#d97706',
  },
]

// ---- services (client-facing, expert-assisted) ----
// entity = who it typically suits (used for quick filtering)
export const caServices = [
  // ---------- GST & TAX ----------
  {
    name: 'GST Registration',
    cat: 'gst',
    desc: 'Get your GSTIN with expert-prepared, verification-ready documents.',
    turn: '3–7 days',
  },
  {
    name: 'GST Return Filing',
    cat: 'gst',
    desc: 'Accurate monthly & quarterly GSTR filing handled by professionals.',
    turn: 'Monthly',
  },
  {
    name: 'GST Filing — Composition Scheme',
    cat: 'gst',
    desc: 'Simplified returns for eligible small businesses under the composition scheme.',
    turn: 'Quarterly',
  },
  {
    name: 'GST Nil Return Filing',
    cat: 'gst',
    desc: 'Timely nil returns so you never miss a due date or attract a late fee.',
    turn: 'Monthly',
  },
  {
    name: 'Professional Tax Registration',
    cat: 'gst',
    desc: 'State professional-tax enrolment and periodic filing for employers.',
    turn: '5–10 days',
  },
  {
    name: 'Income Tax Return — Individual (ITR)',
    cat: 'gst',
    desc: 'ITR filing for salaried individuals and professionals, reviewed by experts.',
    turn: '1–3 days',
  },
  {
    name: 'Income Tax Return — Business (ITR)',
    cat: 'gst',
    desc: 'ITR for proprietors, firms and companies with balance-sheet support.',
    turn: '3–7 days',
  },
  {
    name: 'TDS Return Filing',
    cat: 'gst',
    desc: 'Quarterly TDS return preparation, challan support and Form 16/16A.',
    turn: 'Quarterly',
  },

  // ---------- BUSINESS REGISTRATION ----------
  {
    name: 'Private Limited Company Registration',
    cat: 'registration',
    desc: 'End-to-end incorporation — DSC, DIN, name approval, MOA/AOA, PAN & TAN.',
    turn: '7–14 days',
    popular: true,
  },
  {
    name: 'Limited Liability Partnership (LLP)',
    cat: 'registration',
    desc: 'LLP incorporation with agreement drafting, DSC/DIN and certificate.',
    turn: '10–15 days',
  },
  {
    name: 'Partnership Firm Registration',
    cat: 'registration',
    desc: 'Partnership deed drafting and firm registration with the registrar.',
    turn: '5–10 days',
  },
  {
    name: 'Partnership Firm — PAN & TAN',
    cat: 'registration',
    desc: 'Quick-start partnership with deed plus PAN & TAN application only.',
    turn: '3–7 days',
  },
  {
    name: 'MSME / Udyam Registration',
    cat: 'registration',
    desc: 'Register as a micro, small or medium enterprise to unlock benefits.',
    turn: '1–3 days',
  },
  {
    name: 'Startup India Registration Assistance',
    cat: 'registration',
    desc: 'Guided assistance to apply for Startup India / DPIIT recognition.',
    turn: '7–15 days',
  },
  {
    name: 'Import Export Code (IEC)',
    cat: 'registration',
    desc: 'Get your IEC to start importing or exporting goods and services.',
    turn: '2–5 days',
  },
  {
    name: 'Trademark Registration',
    cat: 'registration',
    desc: 'Class search, application filing and objection support for your brand.',
    turn: 'Application in 2–4 days',
  },
  {
    name: 'ROC / MCA Annual Filing',
    cat: 'registration',
    desc: 'Annual returns and statutory filings for companies & LLPs with the MCA.',
    turn: 'Annual',
  },

  // ---------- LICENSES & CERTIFICATIONS ----------
  {
    name: 'Trade License',
    cat: 'licenses',
    desc: 'Apply for the municipal trade license required to operate locally.',
    turn: '7–20 days',
  },
  {
    name: 'Shop & Establishment Registration',
    cat: 'licenses',
    desc: 'Mandatory state registration for shops and commercial establishments.',
    turn: '5–15 days',
  },
  {
    name: 'FSSAI Registration — Basic',
    cat: 'licenses',
    desc: 'Food license for small food businesses with limited turnover.',
    turn: '7–15 days',
  },
  {
    name: 'FSSAI Registration — State',
    cat: 'licenses',
    desc: 'State FSSAI license for mid-sized food businesses and manufacturers.',
    turn: '15–30 days',
  },
  {
    name: 'FSSAI Registration — Central',
    cat: 'licenses',
    desc: 'Central FSSAI license for large or multi-state food operations.',
    turn: '30–60 days',
  },
  {
    name: 'LWF (Labour Welfare Fund) Registration',
    cat: 'licenses',
    desc: 'Employer registration and contributions under the Labour Welfare Fund.',
    turn: '7–15 days',
  },
  {
    name: 'Geo-Tagged Signage (GST Premises)',
    cat: 'licenses',
    desc: 'Business signage board with geo-tagged photographs for GST verification.',
    turn: '2–5 days',
  },
]

// ---- compliance packages (recurring, subscription-style) ----
export const caPackages = [
  {
    name: 'Startup Compliance',
    price: '1,499',
    period: '/mo',
    desc: 'For new & small businesses that want to stay effortlessly compliant.',
    key: 'startup',
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
    features: [
      'Bookkeeping & accounting',
      'Monthly / quarterly GST return filing',
      'Annual income-tax return filing',
      'TDS return support',
      'Deadline reminders & alerts',
      'Dedicated compliance manager',
    ],
    cta: 'Start with this plan',
    to: '#ca-form',
  },
  {
    name: 'Growing Business',
    price: '3,999',
    period: '/mo',
    desc: 'For scaling teams that need payroll and MCA compliance covered.',
    key: 'growing',
    popular: true,
    grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    features: [
      'Everything in Startup Compliance',
      'Higher transaction volume',
      'Payroll processing & compliance',
      'ROC / MCA annual filings',
      'Professional Tax, PF & ESI support',
      'Quarterly financial reporting',
    ],
    cta: 'Choose Growing',
    to: '#ca-form',
  },
  {
    name: 'Enterprise',
    price: '9,999',
    period: '/mo',
    desc: 'For established companies with multi-entity, multi-state needs.',
    key: 'enterprise',
    grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    features: [
      'Everything in Growing Business',
      'Dedicated CA & accounts team',
      'Multi-entity / multi-state compliance',
      'Statutory & internal audit support',
      'MIS reporting & advisory',
      'Priority turnaround',
    ],
    cta: 'Talk to us',
    to: '#ca-form',
  },
]

// ---- CA-specific FAQs ----
export const caFaqs = [
  {
    q: 'What CA and compliance services does EaseMyOffice offer?',
    a: 'We cover the full compliance lifecycle — GST registration and return filing, income-tax filing, company, LLP and partnership registration, MSME/Udyam, Import Export Code, trademark, FSSAI, trade license, Shop & Establishment, professional tax and more. Every service is prepared and reviewed by qualified partner professionals.',
  },
  {
    q: 'Are the filings handled by qualified professionals?',
    a: 'Yes. EaseMyOffice is a compliance-facilitation platform. Your registrations and returns are prepared and reviewed by our network of qualified chartered accountants, company secretaries and tax experts, so your paperwork is accurate and filed on time.',
  },
  {
    q: 'How does the process work?',
    a: 'It is simple and fully online: share your requirement, upload your documents, and your dedicated manager coordinates preparation, review and filing with the concerned department — keeping you updated at every step.',
  },
  {
    q: 'Do I need to visit an office in person?',
    a: 'No. The entire process is handled online. You submit documents digitally and our team manages preparation and filing end to end. In the rare cases where a physical step is required, we guide you through it.',
  },
  {
    q: 'How is pricing decided?',
    a: 'Pricing depends on the service, your entity type and transaction volume. Our per-service and package pricing is transparent, with the exact quote confirmed after a quick review of your requirement — no hidden charges.',
  },
  {
    q: 'Can you manage ongoing monthly compliance for my business?',
    a: 'Yes. Our compliance packages bundle bookkeeping, GST returns, income-tax filing, TDS, payroll and MCA/ROC filings into a single monthly plan, so your due dates are tracked and met throughout the year.',
  },
  {
    q: 'How many clients do you handle compliance for?',
    a: 'Our teams manage 1,200+ business accounts, ensuring timely tax filings and department requirements are met across GST, income tax and MCA compliance.',
  },
  {
    q: 'Which cities do you serve?',
    a: 'We serve businesses across India. Most registrations and filings are handled online, so you can work with us regardless of your city or state.',
  },
]
