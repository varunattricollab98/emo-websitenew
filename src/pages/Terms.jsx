import LegalLayout from '../components/legal/LegalLayout'

const sections = [
  {
    h: 'Acknowledgment',
    body: [
      'These Terms and Conditions govern your use of this service and form the agreement between you and EaseMyOffice ("Company", "we", "us" or "our"). They set out the rights and obligations of all users regarding the use of the service.',
      'By accessing or using the service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the service. Your use of the service is also conditioned on your acceptance of our Privacy Policy.',
    ],
  },
  {
    h: 'Eligibility',
    body: [
      'You represent that you are over the age of 18. The Company does not permit those under 18 to use the service.',
    ],
  },
  {
    h: 'Links to other websites',
    body: [
      'Our service may contain links to third-party websites or services that are not owned or controlled by the Company. We have no control over, and assume no responsibility for, the content, privacy policies or practices of any third-party sites. We strongly advise you to read the terms and privacy policies of any third-party sites you visit.',
    ],
  },
  {
    h: 'Termination',
    body: [
      'We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including if you breach these Terms. Upon termination, your right to use the service will cease immediately.',
    ],
  },
  {
    h: 'Limitation of liability',
    body: [
      'To the maximum extent permitted by applicable law, the entire liability of the Company and its suppliers is limited to the amount actually paid by you through the service. In no event shall the Company or its suppliers be liable for any special, incidental, indirect or consequential damages arising out of or related to your use of, or inability to use, the service.',
    ],
  },
  {
    h: '"AS IS" and "AS AVAILABLE" disclaimer',
    body: [
      'The service is provided to you "AS IS" and "AS AVAILABLE" with all faults and defects, without warranty of any kind. To the maximum extent permitted under applicable law, the Company disclaims all warranties, whether express, implied or statutory, including implied warranties of merchantability, fitness for a particular purpose and non-infringement.',
      'The Company makes no representation that the service will be uninterrupted, error-free, secure, or that it will meet your requirements or achieve any intended results.',
    ],
  },
  {
    h: 'Governing law',
    body: [
      'The laws of India, excluding its conflict of law rules, shall govern these Terms and your use of the service. Your use may also be subject to other local, state, national or international laws.',
    ],
  },
  {
    h: 'Disputes resolution',
    body: [
      'If you have any concern or dispute about the service, you agree to first try to resolve it informally by contacting the Company.',
    ],
  },
  {
    h: 'Severability & waiver',
    body: [
      'If any provision of these Terms is held to be unenforceable or invalid, it will be changed and interpreted to accomplish its objectives to the greatest extent possible, and the remaining provisions will continue in full force. The failure to exercise a right or require performance of an obligation shall not affect our ability to do so at any time thereafter.',
    ],
  },
  {
    h: 'Changes to these Terms',
    body: [
      'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will make reasonable efforts to provide at least 30 days\u2019 notice prior to any new terms taking effect. By continuing to use our service after revisions become effective, you agree to be bound by the revised terms.',
    ],
  },
]

export default function Terms() {
  return (
    <LegalLayout
      eyebrow="Terms & Conditions"
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using EaseMyOffice services."
      updated="July 19, 2024"
      sections={sections}
    />
  )
}
