import LegalLayout from '../components/legal/LegalLayout'

const sections = [
  {
    h: 'Our commitment to you',
    body: [
      'At EaseMyOffice, your trust matters. We are committed to transparency, fairness and dependable service at every step of your virtual office and compliance journey. This refund policy is written in plain language so you always know exactly where you stand — with no hidden charges and no surprise deductions.',
    ],
  },
  {
    h: 'What makes our refund policy customer-first',
    list: [
      'Full-refund protection when a registration is rejected due to documents or premises provided by us — after a fair set of guided attempts.',
      'Transparent processing — most eligible refunds are completed within 7–10 business days of approval, with clear updates along the way.',
      'Expert document cross-verification upfront to minimise the chance of rejection in the first place.',
      'A fair administrative approach — reasonable fees only where genuinely justified.',
    ],
  },
  {
    h: '24-hour satisfaction window',
    body: [
      'When you book directly through the official EaseMyOffice website, you may request a full refund within 24 hours of your booking confirmation if you are not satisfied with our initial service response. Please note that full service delivery typically takes 48–72 hours; the 24-hour window lets you evaluate our early response.',
      'A refund under this window is issued as 100% of the amount paid, minus applicable payment-gateway charges. To be eligible, your booking must be made directly on our website (not via a third party), your KYC must be complete and accurate, and the request must be raised within 24 hours of confirmation.',
    ],
  },
  {
    h: 'Full refund — when the shortfall is ours',
    body: [
      'If your GST or business registration is rejected three (3) times or more solely because of documentation or premises issues attributable to the virtual office address provided by EaseMyOffice, you are entitled to a 100% refund.',
      'We deliberately provide up to three guided attempts — correcting and re-submitting documentation each time — to give your application a fair chance of success before any refund is considered. Full-refund claims should be accompanied by the official rejection letter or communication from the concerned government portal.',
    ],
  },
  {
    h: 'Partial refunds',
    body: ['Partial refunds apply in the following situations:'],
    list: [
      'Cancellation before we begin document processing: refund of the amount paid, minus a 20% administrative fee and any payment-gateway charges.',
      'KYC declined at our internal review: refund minus a documentation and evaluation fee of ₹2,500 + GST, covering processing and assessment costs.',
      'KYC approved by us but declined by the space partner: refund minus ₹1,500 + GST.',
    ],
  },
  {
    h: 'Additional services & modifications',
    list: [
      'Business name change due to an MCA rejection — a fresh NOC and agreement are issued at ₹1,500 + GST.',
      'Post-approval changes to client name, address or typographical corrections — ₹1,500 + GST, after evaluation.',
    ],
  },
  {
    h: 'Coworking & meeting room bookings',
    list: [
      'Meeting rooms can be cancelled up to 24 hours before the scheduled time for a full refund; cancellations within 24 hours incur a 50% fee.',
      'No-shows for meeting room bookings are non-refundable.',
      'Coworking day passes are non-refundable once the session has started.',
      'Monthly coworking memberships can be cancelled with 15 days\u2019 notice before the next billing cycle; no refund is provided for the current billing period.',
    ],
  },
  {
    h: 'When refunds do not apply',
    body: ['To keep things fair and transparent, refunds are not processed in the following cases:'],
    list: [
      'Once the address documents (NOC, Leave & License agreement, utility bill) have been generated and shared, or once you have given final approval — the service is considered delivered.',
      'Applicant-side issues: incomplete or incorrect KYC, wrong business details, or APOB documentation issues from your end.',
      'Failure of biometric or physical verification, or non-compliance with GST/MCA requirements.',
      'Independent government or regulatory decisions, department backlogs, downtime, changes in law, or new regulatory norms (e.g. biometric requirements).',
      'Restricted categories: online gaming or betting platforms; entities restricted under MHA directives; and the use of dummy directors or shell companies (fully forfeited).',
      'Time-bound conditions: if KYC is not provided within 90 days of payment, the booking is forfeited. Virtual office solutions are non-cancellable and non-refundable once service delivery has begun.',
      'Setup fees, document-processing charges and government filing fees, as these represent costs already incurred.',
    ],
  },
  {
    h: 'Aadhaar-linked mobile (OTP) for GST',
    body: [
      'GST registration requires OTP verification through the applicant\u2019s Aadhaar-linked mobile number. EaseMyOffice is not liable for rejections that arise from non-compliance with this requirement.',
    ],
  },
  {
    h: 'How to request a refund',
    body: [
      'Email us at contact@easemyoffice.in with the subject line: "Refund Request – [Your Business Name]", and include the following:',
    ],
    list: [
      'Your booking / application ID',
      'Date of payment and date of service commencement',
      'A detailed reason for the refund request',
      'Supporting documentation (rejection letters, portal communication, etc.)',
      'Contact details for follow-up',
    ],
  },
  {
    h: 'Refund processing & timelines',
    body: [
      'We acknowledge every refund request within 24 hours and complete our evaluation within 7–10 business days, keeping you updated throughout. Once approved, refunds are issued to the original payment method used for the transaction.',
      'Depending on your bank or payment provider, it may take an additional 5–10 business days for the funds to reflect in your account. Where a payment-gateway fee applies, it is deducted from the refundable amount.',
    ],
  },
  {
    h: 'Our service philosophy',
    body: [
      'EaseMyOffice is an office-space aggregator and business-services facilitation platform. We provide expert documentation assistance, mailbox/postbox services and carefully vetted space partners, and we adhere to applicable government guidelines and MHA directives.',
      'Final registration approval rests with the government authorities, and establishing your business\u2019s credibility with those authorities remains your responsibility. We assist with query resolution and provide any missing documents whenever the authorities request them.',
    ],
  },
  {
    h: 'Force majeure',
    body: [
      'EaseMyOffice shall not be held responsible for service delays or failures caused by circumstances beyond our reasonable control — including natural disasters, pandemics, government restrictions or policy changes, internet or telecommunication failures, cyber-attacks, labour disputes or system failures. In such cases, refunds are evaluated based on the specific impact on service delivery.',
    ],
  },
  {
    h: 'Updates to this policy',
    body: [
      'We may update this refund policy from time to time to reflect changes in regulations, business practices or service offerings. Any amendments are published on our website and are effective from the date of publication; existing clients are notified via email where applicable.',
    ],
  },
]

export default function RefundPolicy() {
  return (
    <LegalLayout
      eyebrow="Refund Policy"
      title="Refund Policy"
      subtitle="Clear, customer-first refund terms for your EaseMyOffice virtual office, compliance and workspace services."
      updated="July 2026"
      sections={sections}
    />
  )
}
