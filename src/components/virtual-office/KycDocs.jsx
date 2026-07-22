import { useState } from 'react'
import { FileText, Check, Building2, Users, User } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

const entities = [
  {
    key: 'proprietorship',
    label: 'Proprietorship',
    icon: User,
    docs: [
      'PAN card of the proprietor',
      'Aadhaar card of the proprietor',
      'Recent passport-size photograph',
      'Bank statement / cancelled cheque',
      'Rent agreement + NOC (provided by us)',
      'Latest utility bill of the premises',
    ],
  },
  {
    key: 'pvtltd',
    label: 'Private Limited',
    icon: Building2,
    docs: [
      'Certificate of Incorporation',
      'Company PAN card',
      'MOA & AOA',
      'Board resolution / authorisation letter',
      'Directors’ PAN & Aadhaar',
      'Rent agreement + NOC (provided by us)',
      'Latest utility bill of the premises',
    ],
  },
  {
    key: 'llp',
    label: 'LLP',
    icon: Users,
    docs: [
      'LLP Incorporation Certificate',
      'LLP Agreement',
      'LLP PAN card',
      'Designated partners’ PAN & Aadhaar',
      'Partner authorisation letter',
      'Rent agreement + NOC (provided by us)',
      'Latest utility bill of the premises',
    ],
  },
]

export default function KycDocs() {
  const [active, setActive] = useState('proprietorship')
  const current = entities.find((e) => e.key === active)

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Documentation"
          title="KYC Documents Required"
          accent="Documents Required"
          subtitle="Pick your entity type to see exactly what's needed. We prepare the rent agreement, NOC and utility bill for you."
        />

        {/* entity tabs */}
        <div className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-3">
          {entities.map((e) => {
            const isActive = e.key === active
            return (
              <button
                key={e.key}
                type="button"
                onClick={() => setActive(e.key)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary-gradient text-white shadow-card'
                    : 'border border-primary-100 bg-white text-navy hover:border-primary/40'
                }`}
              >
                <e.icon className="h-4 w-4" />
                {e.label}
              </button>
            )
          })}
        </div>

        {/* doc list */}
        <Reveal className="mx-auto mt-10 max-w-3xl">
          <div className="rounded-3xl border border-primary-100 bg-surface-light p-7 shadow-soft sm:p-9">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-gradient text-white">
                <FileText className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-navy-dark">
                Documents for {current.label}
              </h3>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {current.docs.map((d) => (
                <div
                  key={d}
                  className="flex items-start gap-3 rounded-xl bg-white p-3.5 shadow-soft"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-slate-700">{d}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-slate-500">
              Documents may vary slightly by state and use-case — your relationship manager will
              confirm the exact list for your registration.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
