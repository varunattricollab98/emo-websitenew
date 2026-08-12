import { useState, useEffect } from 'react'
import LegalLayout from '../components/legal/LegalLayout'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { markdownToBlocks } from '../utils/markdownToBlocks'
import ArticleBlocks from '../components/ui/ArticleBlocks'

const sections = [
  {
    h: 'What are cookies?',
    body: [
      'Cookies are small files that are placed on your computer, mobile device or any other device by a website, containing details of your browsing history and preferences among their many uses. They help websites function properly and provide a more personal experience.',
      'We also use similar tracking technologies such as web beacons, tags and scripts to collect and track information and to improve and analyse our service.',
    ],
  },
  {
    h: 'Types of cookies we use',
    body: [
      'Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device when you go offline, while session cookies are deleted as soon as you close your web browser. We use both types for the purposes described below.',
    ],
  },
  {
    h: 'Necessary / essential cookies',
    body: [
      'Type: Session cookies \u00B7 Administered by: Us. These cookies are essential to provide you with services available through the website and to enable you to use some of its features. They help authenticate users and prevent fraudulent use. Without them, the services you have asked for cannot be provided.',
    ],
  },
  {
    h: 'Acceptance cookies',
    body: [
      'Type: Persistent cookies \u00B7 Administered by: Us. These cookies identify whether users have accepted the use of cookies on the website.',
    ],
  },
  {
    h: 'Functionality cookies',
    body: [
      'Type: Persistent cookies \u00B7 Administered by: Us. These cookies allow us to remember choices you make when you use the website, such as your login details or language preference, so you have a more personal experience and do not have to re-enter your preferences each time.',
    ],
  },
  {
    h: 'Managing your cookies',
    body: [
      'You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some parts of our service. Most browsers let you view, manage and delete cookies through their settings.',
    ],
  },
  {
    h: 'Changes to this Cookie Policy',
    body: [
      'We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date. For more information about how we handle your data, please see our Privacy Policy.',
    ],
  },
]

export default function CookiePolicy() {
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
          .eq('slug', 'cookie-policy')
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
        eyebrow="Cookie Policy"
        title="Cookie Policy"
        subtitle="How and why EaseMyOffice uses cookies and similar technologies on this website."
        updated="July 19, 2024"
        sections={[]}
      />
    )
  }

  if (dbContent) {
    const blocks = markdownToBlocks(dbContent)
    return (
      <LegalLayout
        eyebrow="Cookie Policy"
        title="Cookie Policy"
        subtitle="How and why EaseMyOffice uses cookies and similar technologies on this website."
        updated="July 19, 2024"
        sections={[]}
      >
        <ArticleBlocks blocks={blocks} lead />
      </LegalLayout>
    )
  }

  return (
    <LegalLayout
      eyebrow="Cookie Policy"
      title="Cookie Policy"
      subtitle="How and why EaseMyOffice uses cookies and similar technologies on this website."
      updated="July 19, 2024"
      sections={sections}
    />
  )
}
