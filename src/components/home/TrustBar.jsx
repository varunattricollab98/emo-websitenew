import { useState } from 'react'

// Real client logos (served from /public/logos). src=null falls back to a wordmark chip.
const logos = [
  { name: 'Verizon', src: '/logos/verizon.png' },
  { name: 'IndiaMART', src: '/logos/indiamart.png' },
  { name: "Dr. Reddy's", src: '/logos/drreddys.png' },
  { name: 'Udaan', src: '/logos/udaan.png' },
  { name: 'Shiprocket', src: '/logos/shiprocket.svg' },
  { name: 'Omnicuris', src: '/logos/omnicuris.png' },
  { name: 'HomeLane', src: '/logos/homelane.svg' },
  { name: 'Fitelo', src: '/logos/fitelo.svg' },
  { name: 'EarthtronEV', src: '/logos/earthtronev.webp' },
  { name: 'Tuckit', src: '/logos/tuckit.png' },
  { name: 'Rudra Gas', src: '/logos/rudragas.jpg' },
  { name: 'Bizz Stay', src: '/logos/bizzstay.png' },
  { name: 'Kalki Fashion', src: null },
  { name: 'XpressBees', src: null },
]

// duplicated once for a seamless infinite loop
const marqueeLogos = [...logos, ...logos]

function LogoChip({ logo }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="flex h-16 w-40 flex-none items-center justify-center rounded-xl border border-primary-100/60 bg-white px-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card">
      {logo.src && !failed ? (
        <img
          src={logo.src}
          alt={`${logo.name} logo`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="max-h-8 w-auto max-w-full object-contain opacity-90 transition-opacity duration-300 hover:opacity-100"
        />
      ) : (
        <span className="whitespace-nowrap text-base font-extrabold tracking-tight text-slate-400">
          {logo.name}
        </span>
      )}
    </div>
  )
}

export default function TrustBar() {
  return (
    <section className="border-y border-primary-100 bg-white">
      <div className="py-10">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
          Trusted by 5,000+ businesses across India
        </p>

        {/* marquee track with soft edge fade */}
        <div className="group marquee-mask relative mt-7 overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-5 group-hover:[animation-play-state:paused]">
            {marqueeLogos.map((logo, i) => (
              <LogoChip key={`${logo.name}-${i}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
