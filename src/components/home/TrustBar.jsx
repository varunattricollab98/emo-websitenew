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

export default function TrustBar() {
  return (
    <section className="border-y border-primary-100 bg-white">
      <div className="container-custom py-10">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
          Trusted by 5,000+ businesses across India
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {brands.map((b) => (
            <span
              key={b}
              className="text-lg font-bold text-slate-400 transition-colors hover:text-primary sm:text-xl"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
