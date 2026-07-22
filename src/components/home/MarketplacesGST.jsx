import { useState } from 'react'

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
    <section className="section-padding relative overflow-hidden bg-white">
      {/* subtle tech dot backdrop */}
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000,transparent)]" />

      <div className="container-custom relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-3 rounded-full border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-primary-50 px-9 py-2.5 text-base font-bold uppercase tracking-[0.18em] text-primary shadow-soft ring-1 ring-primary-100/60">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </span>
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
