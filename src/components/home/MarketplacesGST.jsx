import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'

// 7 real logos (served from /public/logos/marketplaces) + Instamart as a styled wordmark
const marketplaces = [
  { name: 'Amazon', src: '/logos/marketplaces/amazon.png' },
  { name: 'Flipkart', src: '/logos/marketplaces/flipkart.png' },
  { name: 'Myntra', src: '/logos/marketplaces/myntra.png' },
  { name: 'Meesho', src: '/logos/marketplaces/meesho.png' },
  { name: 'Ajio', src: '/logos/marketplaces/ajio.png' },
  { name: 'Nykaa', src: '/logos/marketplaces/nykaa.png' },
  { name: 'JioMart', src: '/logos/marketplaces/jiomart.png' },
  { name: 'Instamart', src: null, text: 'Instamart', color: '#F97316' },
]

function MarketChip({ m }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="flex h-[76px] min-w-[150px] items-center justify-center rounded-2xl border border-primary-100/70 bg-white px-7 shadow-soft ring-1 ring-navy-dark/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card">
      {m.src && !failed ? (
        <img
          src={m.src}
          alt={`${m.name} logo`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="max-h-9 w-auto max-w-[150px] object-contain"
        />
      ) : (
        <span className="text-2xl font-extrabold tracking-tight" style={{ color: m.color || '#0f1a2e' }}>
          {m.text || m.name}
        </span>
      )}
    </div>
  )
}

export default function MarketplacesGST() {
  return (
    <section className="section-padding relative overflow-hidden bg-surface-light">
      {/* subtle tech dot backdrop */}
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000,transparent)]" />

      <div className="container-custom relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-soft">
            <ShoppingBag className="h-3.5 w-3.5" />
            Marketplace Ready
          </span>
          <h2 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight text-navy-dark sm:text-3xl">
            Get GST Registration to Sell on{' '}
            <span className="gradient-text">All Major Marketplaces</span>
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-500">
            Use your EaseMyOffice address &amp; GST registration to start selling on India&apos;s
            biggest online platforms.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {marketplaces.map((m) => (
            <MarketChip key={m.name} m={m} />
          ))}
        </div>
      </div>
    </section>
  )
}
