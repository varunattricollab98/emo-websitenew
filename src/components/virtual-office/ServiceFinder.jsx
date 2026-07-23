import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileCheck2, Landmark, Mail, Armchair, ArrowRight, Check } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

const categories = [
  {
    key: 'gst',
    short: 'GST Registration',
    icon: FileCheck2,
    grad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    accent: '#059669',
    services: [
      'GST Registration',
      'Additional Place of Business (APOB)',
      'Multi-State GST Registration',
      'State-Wise GST Expansion',
      'Cross-State Business Expansion',
      'Business Expansion to Other States',
      'Amazon Seller Registration',
      'Flipkart Seller Registration',
      'ONDC Seller Registration',
      'GeM Registration',
      'GST Amendment',
      'E-commerce Business Registration',
      'Business Scaling Across India',
      'Enterprise Expansion',
    ],
  },
  {
    key: 'business',
    short: 'Business Registration',
    icon: Landmark,
    grad: 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)',
    accent: '#2c679e',
    services: [
      'Private Limited Company Registration',
      'LLP Registration',
      'One Person Company (OPC) Registration',
      'Partnership Firm Registration',
      'Sole Proprietorship Business Address',
      'New Business Incorporation',
      'Branch Office Registration',
      'Registered Office Address',
      'Registered Office Change',
      'Startup Registration',
      'Startup India Recognition',
      'DPIIT Startup Recognition',
      'MSME (Udyam) Registration',
      'Import Export Code (IEC) Registration',
      'Trademark Registration',
      'PAN & TAN Registration',
      'Shop & Establishment Registration',
      'Professional Tax Registration',
      'FSSAI Registration',
      'EPFO Registration',
      'ESIC Registration',
      'MCA Compliance',
      'Current Bank Account Opening',
      'Tender Participation',
      'ISO Certification',
      'Digital Signature Certificate (DSC)',
      'Franchise Expansion',
      'Software / IT Company Registration',
      'SaaS Company Registration',
      'AI Startup Registration',
      'Consulting Firm Registration',
      'Recruitment Agency Registration',
      'Marketing / Digital Agency Registration',
      'Advertising Agency Registration',
      'Architecture Firm Registration',
      'Interior Design Firm Registration',
      'Real Estate Consultancy',
      'Travel Agency Registration',
      'Event Management Company Registration',
      'Import / Export Business Setup',
      'Educational Consultancy Registration',
      'NGO / Section 8 Company Registration',
      'Foreign Company Indian Subsidiary',
      'Sales / Regional Office Registration',
      'Vendor Registration Address',
      'Government Registration Address',
      'Business License Address',
      'Compliance Documentation Address',
      'Office Address for Regulatory Filings',
      'Affordable Registered Office Solution',
    ],
  },
  {
    key: 'mailing',
    short: 'Mailing Address',
    icon: Mail,
    grad: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    accent: '#d97706',
    services: [
      'Professional Business Address',
      'Premium Business Address',
      'Professional Mailing Address',
      'Mail Handling & Business Correspondence',
      'Courier Receiving & Forwarding',
      'ROC Correspondence Address',
      'Income Tax Correspondence Address',
      'Official Company Correspondence Address',
      'Legal Notice Receiving Address',
      'Business Communication Address',
      'Investor & Client Communication Address',
      'Corporate Mail Management',
      'Business Verification Address',
      'Corporate Identity & Brand Presence',
      'Virtual Corporate Headquarters',
      'Business Presence in Metro Cities',
      'Multi-City Business Presence',
      'Nationwide Business Presence',
      'Work From Home Business Address',
      'Remote Business Setup',
      'Temporary Business Address',
      'Chartered Accountant (CA) Office',
      'Company Secretary (CS) Office',
      'Legal Consultancy Office',
      'Liaison / Representative Office Address',
      'Project Office Address',
    ],
  },
  {
    key: 'desk',
    short: 'Desk Plan',
    icon: Armchair,
    grad: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    accent: '#6d28d9',
    services: [
      'Dedicated Desk',
      'Coworking Access',
      'Meeting Room Access',
      'Client Meeting Address',
      'Remote Team Headquarters',
      'Satellite Office Setup',
      'Flexible Office Infrastructure',
      'Cost-Effective Office Solution',
    ],
  },
]

export default function ServiceFinder() {
  const [active, setActive] = useState('gst')
  const current = categories.find((c) => c.key === active)

  return (
    <section className="section-padding relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_25%,#000,transparent)]" />
      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Find Your Service"
          title="Choose Your Own Virtual Office Plan"
          accent="Virtual Office Plan"
          subtitle="Not sure which one you need? Pick your requirement below and find the exact service that fits — from GST to company registration, mailing or a desk plan."
        />

        {/* category filter */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const isActive = cat.key === active
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActive(cat.key)}
                className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ${
                  isActive
                    ? 'border-transparent text-white shadow-card-hover'
                    : 'border-primary-100/70 bg-white text-navy-dark shadow-soft hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card'
                }`}
                style={isActive ? { background: cat.grad } : undefined}
              >
                <span
                  className={`inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl ${
                    isActive ? 'bg-white/20 text-white ring-1 ring-white/30' : 'text-white'
                  }`}
                  style={!isActive ? { background: cat.grad } : undefined}
                >
                  <cat.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider opacity-70">
                    Virtual Office for
                  </span>
                  <span className="block text-sm font-bold">{cat.short}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* services list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-10 rounded-3xl border border-primary-100 bg-surface-light p-6 shadow-soft sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-navy-dark">
                Virtual Office for{' '}
                <span style={{ color: current.accent }}>{current.short}</span>
              </h3>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 shadow-soft">
                {current.services.length} services
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {current.services.map((svc) => (
                <a
                  key={svc}
                  href="#book-form"
                  className="group inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-medium text-navy-dark shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
                >
                  <span
                    className="inline-flex h-4 w-4 flex-none items-center justify-center rounded-full text-white"
                    style={{ background: current.grad }}
                  >
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  {svc}
                </a>
              ))}
            </div>

            <a
              href="#book-form"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary-gradient px-6 py-3 text-sm font-bold text-white shadow-card transition-all hover:shadow-glow hover:brightness-110"
            >
              Not listed? Tell us your requirement
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
