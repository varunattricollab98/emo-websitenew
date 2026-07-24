import LegalLayout from '../components/legal/LegalLayout'

const sections = [
  {
    h: '1. Refund before document process initiation',
    body: [
      'If you request a refund before we initiate the document processing, we will provide a refund after deducting an administrative fee of 20%. Such refunds are processed within 1–7 business days.',
    ],
  },
  {
    h: '2. Refund after document submission',
    body: [
      'Once the agreement documents have been submitted, no refund will be processed.',
    ],
  },
  {
    h: '3. Refund for rejection by MCA / GST Department',
    body: [
      'In the event of a rejection from the MCA or GST Department, we offer a partial refund only in special cases where the rejection is due to issues with the documents provided by us. The specifics of any partial refund are determined on a case-by-case basis.',
    ],
  },
  {
    h: 'Please note',
    body: [
      'Refunds are processed strictly in accordance with the conditions outlined above. Please review these terms carefully before proceeding with your request or submitting any documents.',
      'For any queries or concerns regarding this refund policy, please contact our support team.',
    ],
  },
]

export default function RefundPolicy() {
  return (
    <LegalLayout
      eyebrow="Refund Policy"
      title="Refund Policy"
      subtitle="Our refund guidelines for EaseMyOffice services — please read them before proceeding with your order."
      updated="July 19, 2024"
      sections={sections}
    />
  )
}
