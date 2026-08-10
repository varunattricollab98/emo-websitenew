// Shared FAQ generators, single source of truth used by BOTH the React
// components (runtime) and the prerender script (build-time SEO schema).
// Keep these as pure functions with no imports so they run in Node too.

const inr = (n) => Number(n || 0).toLocaleString('en-IN')

export function cityFaqs(cityName, region, basePrice = 899) {
  return [
    {
      q: `Is a virtual office in ${cityName} valid for GST registration?`,
      a: `Yes. Our ${cityName} virtual office plans include the complete GST documentation kit, a notarised rent agreement, NOC and a recent utility bill, accepted by the ${region} GST authorities.`,
    },
    {
      q: `Can I register my company at a ${cityName} address?`,
      a: `Absolutely. Our ${cityName} Company Registration plan provides a registered office address with the full MCA documentation kit for Private Limited, LLP or OPC incorporation.`,
    },
    {
      q: `Will my ${cityName} address clear GST physical verification?`,
      a: `Yes. Every ${cityName} address is a genuine, physically verified commercial premise supplied with the full paperwork set, built to clear GST department verification the first time.`,
    },
    {
      q: `How much does a virtual office in ${cityName} cost?`,
      a: `Plans in ${cityName} start from ₹${inr(basePrice - 200)}/year for a mailing address, with GST-ready and company registration plans available. Pricing is transparent, no deposits, no hidden charges.`,
    },
    {
      q: `How long does it take to set up my ${cityName} address?`,
      a: `Most ${cityName} addresses are activated within 2–3 business days of submitting your KYC. We pre-verify your documents so approvals go through smoothly the first time.`,
    },
    {
      q: `Which areas in ${cityName} are available?`,
      a: `We offer verified addresses across ${cityName}'s top commercial districts. Exact locality details are shared once you choose a plan, and you can register in multiple ${cityName} locations to expand your reach.`,
    },
    {
      q: `Can I receive mail and couriers at my ${cityName} office?`,
      a: `Yes. Letters, government notices and courier parcels are received and safely held at your ${cityName} address. We notify you on arrival and can forward everything to your preferred location.`,
    },
    {
      q: `Do I need to visit ${cityName} in person?`,
      a: `No, the entire process is 100% online. You submit your KYC digitally and we handle preparation, verification and activation, so no visit to ${cityName} is required.`,
    },
  ]
}

export function spaceFaqs(areaName, cityName, processingTime = '2–3 business days') {
  return [
    { q: `Is the ${areaName} address valid for GST registration?`, a: `Yes. The ${areaName}, ${cityName} address comes with the complete GST documentation kit (rent agreement, NOC, utility bill) accepted by the department.` },
    { q: `How soon can I activate this ${cityName} space?`, a: `Your ${areaName} address and documents are typically ready within ${processingTime} of submitting your KYC.` },
    { q: `Can I use this address for company registration?`, a: `Absolutely. This ${areaName} space works as a registered office for Private Limited, LLP and OPC, with full MCA documentation.` },
    { q: `Will I receive mail and couriers here?`, a: `Yes. All letters, notices and couriers are received at the ${areaName} address, and we notify and forward them to you.` },
    { q: `What documents do I need to get started?`, a: `Just basic KYC, your PAN, Aadhaar and a passport-size photo (for a company, add the incorporation certificate). We prepare the rest of the paperwork for you.` },
    { q: `Can multiple companies use the same ${areaName} address?`, a: `Yes. Each business gets its own registration-ready set of documents, so co-founders or a group of companies can all use the ${areaName} address independently.` },
    { q: `Is there any hidden or renewal cost?`, a: `No hidden charges. Pricing is transparent and billed annually, you only pay the plan you choose, with a simple yearly renewal to keep the address active.` },
    { q: `Do I get access to coworking desks or meeting rooms?`, a: `Yes. Along with the virtual office, you can book plug-and-play desks and meeting rooms at ${areaName}, ${cityName} whenever you need a physical spot to work or meet clients.` },
    { q: `Can I use this address on my website, invoices and visiting cards?`, a: `Absolutely. Once activated, the ${areaName} address is fully yours to use across your website, invoices, GST filings, visiting cards and all official communication.` },
    { q: `What if I want to switch to a physical office later?`, a: `Easy, since ${areaName} also offers coworking and office space, you can upgrade from a virtual office to a physical desk or cabin without changing your registered address.` },
  ]
}
