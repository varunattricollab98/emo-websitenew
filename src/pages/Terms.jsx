import { useState, useEffect } from 'react'
import LegalLayout from '../components/legal/LegalLayout'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { markdownToBlocks } from '../utils/markdownToBlocks'
import ArticleBlocks from '../components/ui/ArticleBlocks'

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
  {
    h: 'GST Registration, Business Activities and Regulatory Compliance',
    body: [
      '**1. Customer Responsibility:** The Customer acknowledges and agrees that it is solely responsible for the legality, authenticity and accuracy of its business activities, registrations, filings, declarations and information submitted to any governmental, tax, regulatory or other authority, including the Goods and Services Tax (GST) authorities.',
      '**2. Use of Premises/Address:** Any office space, workspace, virtual office, registered office address, correspondence address or other address/service made available through the Platform shall be used only for lawful and genuine business purposes and in accordance with the terms of the applicable booking or service agreement.',
      '**3. GST Registration:** Where the Customer uses the premises or address for obtaining, maintaining or amending GST registration, the Customer shall be solely responsible for satisfying all eligibility requirements and for providing complete, accurate and truthful information to the GST authorities. The Platform and/or the Service Provider does not guarantee or represent that the Customer will be eligible for GST registration or that any GST registration application will be approved or remain valid.',
      '**4. No Representation by the Platform:** The Customer shall not represent to any government authority, tax authority, bank, financial institution or third party that the Platform or the Service Provider is the owner, operator, partner, agent or representative of the Customer\u2019s business, or that the Platform or Service Provider is responsible for the Customer\u2019s GST, tax or statutory compliance.',
      '**5. Prohibited Activities:** The Customer shall not use the Platform, premises, address, documents, agreements, consent letters or any other service provided through the Platform for any fraudulent, fictitious, unlawful, misleading or unauthorised purpose, including obtaining or maintaining GST registration for a business that does not genuinely operate from, or have a legitimate business connection with, the premises or address.',
      '**6. False Information and Documents:** The Customer shall not provide, upload, submit or cause to be submitted any false, forged, misleading or inaccurate information or documentation in connection with the booking, use of the premises, GST registration or any other governmental or regulatory registration.',
      '**7. Verification and Termination:** The Platform and/or Service Provider reserves the right, where permitted by applicable law, to request additional information or documents, conduct reasonable verification, suspend or terminate a booking or service, and refuse or restrict access where there is a reasonable suspicion of fraud, misuse, false representation, unlawful activity or violation of these Terms.',
      '**8. Disclosure to Authorities:** Where the Platform and/or Service Provider reasonably believes that the premises, address, documents or services are being misused for fraudulent, unlawful or regulatory purposes, it may disclose relevant information and records to the appropriate governmental, tax, regulatory or law-enforcement authority where required or permitted by applicable law.',
      '**9. Indemnification:** To the maximum extent permitted by applicable law, the Customer agrees to indemnify and hold harmless the Platform, the Service Provider and their respective owners, directors, officers, employees and representatives from and against any claims, demands, proceedings, losses, damages, penalties, liabilities, costs and expenses arising out of or relating to the Customer\u2019s fraudulent, unlawful, misleading or unauthorised use of the premises, address, documents or services, including any misuse relating to GST registration or other statutory registrations.',
      '**10. No Exclusion of Mandatory Legal Liability:** Nothing contained in these Terms shall be interpreted as excluding, restricting or transferring any liability or statutory obligation of the Platform or Service Provider that cannot legally be excluded, restricted or transferred under applicable law.',
      '**11. Independent Responsibility:** The Customer acknowledges that the Platform and/or Service Provider provides only the services expressly agreed under the applicable booking or service agreement. The Customer\u2019s GST registration, tax filings, invoices, business transactions, statutory registrations and compliance obligations remain the sole responsibility of the Customer.',
    ],
  },
]

export default function Terms() {
  const [dbContent, setDbContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false)
        return
      }
      try {
        const { data } = await supabase
          .from('site_pages')
          .select('content')
          .eq('slug', 'terms')
          .eq('is_active', true)
          .single()

        if (data && data.content && data.content.trim()) {
          setDbContent(data.content)
        }
      } catch {
        // Table may not exist yet or query failed - use fallback
      }
      setLoading(false)
    }
    fetchContent()
  }, [])

  if (loading) {
    return (
      <LegalLayout
        eyebrow="Terms of Service"
        title="Terms of Service"
        subtitle="Please read these terms carefully before using EaseMyOffice services."
        updated="July 19, 2024"
        sections={[]}
      />
    )
  }

  if (dbContent) {
    const blocks = markdownToBlocks(dbContent)
    return (
      <LegalLayout
        eyebrow="Terms of Service"
        title="Terms of Service"
        subtitle="Please read these terms carefully before using EaseMyOffice services."
        updated="July 19, 2024"
        sections={[]}
      >
        <ArticleBlocks blocks={blocks} lead />
      </LegalLayout>
    )
  }

  return (
    <LegalLayout
      eyebrow="Terms of Service"
      title="Terms of Service"
      subtitle="Please read these terms carefully before using EaseMyOffice services."
      updated="July 19, 2024"
      sections={sections}
    />
  )
}
