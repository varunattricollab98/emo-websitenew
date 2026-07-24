import LegalLayout from '../components/legal/LegalLayout'

const sections = [
  {
    h: 'Overview',
    body: [
      'This Privacy Policy describes our policies and procedures on the collection, use and disclosure of your information when you use our service, and tells you about your privacy rights and how the law protects you.',
      'We use your personal data to provide and improve the service. By using the service, you agree to the collection and use of information in accordance with this Privacy Policy. In this policy, "Company", "we", "us" or "our" refers to EaseMyOffice.',
    ],
  },
  {
    h: 'Information we collect',
    body: [
      'While using our service, we may ask you to provide certain personally identifiable information that can be used to contact or identify you, including:',
    ],
    list: ['Email address', 'First name and last name', 'Phone number'],
  },
  {
    h: 'Usage data',
    body: [
      'Usage data is collected automatically when you use the service. It may include your device\u2019s IP address, browser type and version, the pages you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.',
      'When you access the service through a mobile device, we may automatically collect information such as the type of device, its unique ID, IP address, operating system and browser type.',
    ],
  },
  {
    h: 'Cookies & tracking technologies',
    body: [
      'We use cookies and similar tracking technologies (such as beacons, tags and scripts) to track activity on our service and improve it. You can instruct your browser to refuse cookies, but some parts of the service may not function properly without them.',
      'We use essential cookies to operate the site and authenticate users, acceptance cookies to remember your cookie choices, and functionality cookies to remember your preferences for a more personal experience.',
    ],
  },
  {
    h: 'How we use your data',
    body: ['The Company may use your personal data to:'],
    list: [
      'Provide and maintain our service, and monitor its usage',
      'Manage your account and registration as a user',
      'Perform a contract for the products or services you have purchased',
      'Contact you with updates, security notices and service-related communications',
      'Send you news, offers and information about similar services (unless you opt out)',
      'Manage your requests, and for analytics to improve our service and your experience',
    ],
  },
  {
    h: 'Sharing your information',
    body: ['We may share your personal information with:'],
    list: [
      'Service providers who help us operate, analyse and support the service',
      'Affiliates and business partners, who are required to honour this policy',
      'Other parties in connection with a merger, acquisition or asset transfer',
      'Public authorities where required by law, and anyone else with your consent',
    ],
  },
  {
    h: 'Data retention & transfer',
    body: [
      'We retain your personal data only as long as necessary for the purposes set out in this policy and to comply with our legal obligations, resolve disputes and enforce our agreements. Usage data is generally retained for a shorter period.',
      'Your information may be processed at our operating offices and other locations where the parties involved in processing are located. By submitting your information, you consent to such transfers, and we take all steps reasonably necessary to keep your data secure.',
    ],
  },
  {
    h: 'Your rights',
    body: [
      'You have the right to access, update or delete the personal data we hold about you. You may do this from your account settings where available, or by contacting us. Please note we may need to retain certain information where we have a legal obligation or lawful basis to do so.',
    ],
  },
  {
    h: 'Security',
    body: [
      'The security of your personal data is important to us. However, no method of transmission over the internet or electronic storage is 100% secure. While we use commercially acceptable means to protect your data, we cannot guarantee its absolute security.',
    ],
  },
  {
    h: 'Children\u2019s privacy',
    body: [
      'Our service does not address anyone under the age of 13, and we do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal data, please contact us and we will take steps to remove it.',
    ],
  },
  {
    h: 'Changes to this policy',
    body: [
      'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date above. You are advised to review this policy periodically for any changes.',
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      subtitle="How EaseMyOffice collects, uses and protects your information when you use our services."
      updated="July 19, 2024"
      sections={sections}
    />
  )
}
