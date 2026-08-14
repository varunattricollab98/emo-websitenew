/**
 * JSON-LD Structured Data Schema Builders
 *
 * Generates schema.org structured data for SEO.
 * Used with <SchemaScript schemas={[...]} /> component.
 */

const SITE_URL = 'https://v3.easemyoffice.in'
const LOGO_URL = 'https://oijtkvkyefqfwuycibcv.supabase.co/storage/v1/object/public/website-assets/EaseMyOffice-Logo-2.webp'
const PHONE = '+91-8882735038'
const EMAIL = 'contact@easemyoffice.in'

// ─── Organization (global) ───────────────────────────────────────
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EaseMyOffice',
    alternateName: 'EMO',
    url: SITE_URL,
    logo: LOGO_URL,
    description: 'India\'s most trusted platform for virtual offices, coworking spaces, meeting rooms and business compliance.',
    telephone: PHONE,
    email: EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.linkedin.com/company/easemyoffice',
      'https://www.instagram.com/easemyoffice',
      'https://www.facebook.com/easemyoffice',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: PHONE,
      contactType: 'sales',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  }
}

// ─── WebSite (global) ────────────────────────────────────────────
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EaseMyOffice',
    url: SITE_URL,
    description: 'Virtual Offices & Business Compliance in India',
    publisher: {
      '@type': 'Organization',
      name: 'EaseMyOffice',
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/virtual-office?city={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

// ─── LocalBusiness ───────────────────────────────────────────────
export function localBusinessSchema(cityName, stateName, priceRange = '₹799 - ₹1,999') {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: `EaseMyOffice, ${cityName}`,
    image: LOGO_URL,
    telephone: PHONE,
    email: EMAIL,
    url: SITE_URL,
    priceRange,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressRegion: stateName,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '5000',
      bestRating: '5',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  }
}

// ─── WebPage ─────────────────────────────────────────────────────
export function webPageSchema({ title, description, url, breadcrumbs }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${url}`,
    isPartOf: { '@type': 'WebSite', name: 'EaseMyOffice', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'EaseMyOffice',
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
  }
  if (breadcrumbs) {
    schema.breadcrumb = breadcrumbSchema(breadcrumbs)
  }
  return schema
}

// ─── BreadcrumbList ──────────────────────────────────────────────
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url ? `${SITE_URL}${item.url}` : undefined,
    })),
  }
}

// ─── FAQPage ─────────────────────────────────────────────────────
export function faqSchema(faqs) {
  if (!faqs || !faqs.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs
      .filter((f) => f && f.q && f.a)
      .map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
  }
}

// ─── Service ─────────────────────────────────────────────────────
export function serviceSchema({ name, description, cityName, url, price }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: 'EaseMyOffice',
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'City',
      name: cityName,
    },
    url: `${SITE_URL}${url}`,
    offers: price
      ? {
          '@type': 'Offer',
          price: String(price),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        }
      : undefined,
  }
}

// ─── Article ─────────────────────────────────────────────────────
export function articleSchema({ title, description, url, datePublished, dateModified }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${SITE_URL}${url}`,
    datePublished: datePublished || '2025-01-01',
    dateModified: dateModified || new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Organization',
      name: 'EaseMyOffice',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'EaseMyOffice',
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${url}`,
    },
  }
}

// ─── Review ──────────────────────────────────────────────────────
export function reviewSchema(reviews, itemName, itemUrl) {
  if (!reviews || !reviews.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: itemName,
    url: `${SITE_URL}${itemUrl}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1),
      reviewCount: String(reviews.length),
      bestRating: '5',
    },
    review: reviews.slice(0, 5).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(r.rating || 5),
        bestRating: '5',
      },
      reviewBody: r.text,
    })),
  }
}
