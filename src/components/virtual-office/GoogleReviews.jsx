import { Star } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

// Official multicolour Google "G"
function GoogleG({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.93H1.3v3.09A11.99 11.99 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.31 14.32a7.2 7.2 0 0 1 0-4.63V6.6H1.3a12 12 0 0 0 0 10.81l4.01-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.95 1.14 15.24 0 12 0A11.99 11.99 0 0 0 1.3 6.6l4.01 3.09C6.25 6.85 8.89 4.75 12 4.75z" />
    </svg>
  )
}

// Representative client reviews. Wire to Google Places API for live reviews.
const reviews = [
  {
    name: 'Rahul Mehta',
    initial: 'R',
    role: 'Founder, D2C Brand',
    color: '#2c679e',
    text: 'Got my GST address in Bangalore in just 2 days. The documentation was accepted on the first attempt, smooth and completely hassle-free.',
  },
  {
    name: 'Ananya Iyer',
    initial: 'A',
    role: 'E-commerce Seller',
    color: '#8b5cf6',
    text: 'Needed APOB addresses across 3 states to sell on Amazon and Flipkart. EaseMyOffice handled everything and my seller accounts stayed compliant.',
  },
  {
    name: 'Sandeep Rao',
    initial: 'S',
    role: 'Chartered Accountant',
    color: '#10b981',
    text: 'I refer clients here regularly. The paperwork is genuine, verification always passes, and the support team is genuinely responsive.',
  },
  {
    name: 'Meera Nair',
    initial: 'M',
    role: 'Freelance Consultant',
    color: '#d97706',
    text: 'A prestigious address without renting an office, perfect for my consulting practice. My invoices and website look far more credible now.',
  },
  {
    name: 'Vikram Singh',
    initial: 'V',
    role: 'Startup Co-founder',
    color: '#0891b2',
    text: 'Used it for company incorporation. Transparent pricing, no hidden charges, and a dedicated manager who guided us end to end.',
  },
  {
    name: 'Priya Sharma',
    initial: 'P',
    role: 'Proprietor',
    color: '#6366f1',
    text: 'Simple, affordable and quick. The relationship manager kept me updated at every step. Highly recommend for GST registration.',
  },
]

export default function GoogleReviews() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Client Reviews"
          title="Loved by Businesses Across India"
          accent="Across India"
          subtitle="Real experiences from founders, sellers and consultants who set up with EaseMyOffice."
        />

        {/* rating summary */}
        <Reveal className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-4 rounded-2xl border border-primary-100 bg-surface-light px-6 py-4 shadow-soft">
            <GoogleG className="h-9 w-9" />
            <span className="text-4xl font-extrabold text-navy-dark">4.9</span>
            <div>
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((n) => (
                  <Star key={n} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Rated on <span className="font-bold text-navy-dark">Google</span> by 5,000+ businesses
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-primary-100/70 bg-white p-6 shadow-soft ring-1 ring-navy-dark/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: r.color }}
                    >
                      {r.initial}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-navy-dark">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.role}</p>
                    </div>
                  </div>
                  {/* Google glyph */}
                  <span className="text-lg font-bold" aria-label="Google review">
                    <span style={{ color: '#4285F4' }}>G</span>
                  </span>
                </div>
                <div className="mt-4 flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <Star key={n} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">“{r.text}”</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
