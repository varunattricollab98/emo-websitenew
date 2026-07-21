const brands = [
  'Verizon',
  'IndiaMART',
  'Shiprocket',
  'Udaan',
  'Omnicuris',
  'Xpressbees',
  'Kalki Fashion',
  "Dr. Reddy's",
]

// duplicated once for a seamless infinite loop
const marqueeBrands = [...brands, ...brands]

export default function TrustBar() {
  return (
    <section className="border-y border-primary-100 bg-white">
      <div className="py-10">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
          Trusted by 5,000+ businesses across India
        </p>

        {/* marquee track with soft edge fade */}
        <div className="group marquee-mask relative mt-7 overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-4 group-hover:[animation-play-state:paused]">
            {marqueeBrands.map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="inline-flex items-center whitespace-nowrap rounded-full border border-primary-100/70 bg-white px-6 py-2.5 text-lg font-bold text-slate-400 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-card sm:text-xl"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
