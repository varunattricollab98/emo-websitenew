import LegalLayout from '../components/legal/LegalLayout'

const sections = [
  {
    h: 'General information',
    body: [
      'The information provided by EaseMyOffice ("we", "us" or "our") on this website is for general informational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability or completeness of any information on the site.',
    ],
  },
  {
    h: 'Not professional advice',
    body: [
      'EaseMyOffice is a business-services facilitation platform. The content on this website does not constitute legal, tax, financial or other professional advice, and should not be relied upon as a substitute for advice from a qualified professional.',
      'Our registrations and filings are prepared and reviewed by qualified partner professionals (Chartered Accountants, Company Secretaries and tax experts). However, final approval of any registration, GST or MCA filing rests with the concerned government authority.',
    ],
  },
  {
    h: 'No guarantee of outcomes',
    body: [
      'While we work diligently to prepare accurate, verification-ready documentation, we do not and cannot guarantee any specific government outcome, approval timeline or result, as these are subject to the respective departments and applicable law.',
    ],
  },
  {
    h: 'Pricing & availability',
    body: [
      'Prices, plans and space availability shown on this website are indicative and may change without notice. The exact quote and address details applicable to your requirement are confirmed at the time of engagement.',
    ],
  },
  {
    h: 'External links',
    body: [
      'This website may contain links to external websites that are not provided or maintained by us. We do not guarantee the accuracy, relevance, timeliness or completeness of any information on these external websites and are not responsible for their content.',
    ],
  },
  {
    h: 'Limitation of liability',
    body: [
      'Under no circumstance shall we be liable for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided. Your use of the site and your reliance on any information is solely at your own risk.',
    ],
  },
]

export default function Disclaimer() {
  return (
    <LegalLayout
      eyebrow="Disclaimer"
      title="Disclaimer"
      subtitle="Important information about the use of the EaseMyOffice website and services."
      updated="July 19, 2024"
      sections={sections}
    />
  )
}
