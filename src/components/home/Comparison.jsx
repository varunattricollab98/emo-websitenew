import { Check, X } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import Badge from '../ui/Badge'

const rows = [
  { label: 'Monthly cost', emo: 'From ₹799', cowork: '₹8,000 – ₹15,000', trad: '₹40,000+' },
  { label: 'Setup time', emo: '2-3 days', cowork: '1-2 weeks', trad: '1-2 months' },
  { label: 'GST documents included', emo: true, cowork: 'partial', trad: false },
  { label: 'Company registration', emo: true, cowork: false, trad: true },
  { label: 'Pan-India coverage', emo: true, cowork: 'partial', trad: false },
  { label: 'No lock-in', emo: true, cowork: false, trad: false },
]

function Cell({ value, highlight }) {
  if (value === true)
    return (
      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${highlight ? 'bg-accent-green text-white' : 'bg-accent-green/10 text-accent-emerald'}`}>
        <Check className="h-4 w-4" />
      </span>
    )
  if (value === false)
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <X className="h-4 w-4" />
      </span>
    )
  if (value === 'partial')
    return <span className="text-xs font-semibold text-gold-dark">Partial</span>
  return (
    <span className={`text-sm font-semibold ${highlight ? 'text-primary-800' : 'text-slate-600'}`}>
      {value}
    </span>
  )
}

export default function Comparison() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Compare"
          title="Why smart businesses choose EaseMyOffice"
          subtitle="A virtual office gives you all the credibility of a premium address at a fraction of the cost."
        />

        <Reveal className="mt-14">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-card">
            <div className="grid grid-cols-4 gap-0">
              {/* Header */}
              <div className="bg-surface-light p-5" />
              <div className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100/60 p-5 text-center">
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  <Badge variant="gold">BEST VALUE</Badge>
                </span>
                <p className="mt-2 text-sm font-extrabold text-primary-800">EaseMyOffice</p>
              </div>
              <div className="bg-surface-light p-5 text-center">
                <p className="text-sm font-bold text-slate-500">Coworking</p>
              </div>
              <div className="bg-surface-light p-5 text-center">
                <p className="text-sm font-bold text-slate-500">Traditional</p>
              </div>

              {/* Rows */}
              {rows.map((row, i) => (
                <div key={row.label} className="contents">
                  <div
                    className={`flex items-center p-5 text-sm font-semibold text-navy-dark ${i % 2 ? 'bg-surface-light/60' : ''}`}
                  >
                    {row.label}
                  </div>
                  <div
                    className={`flex items-center justify-center border-x border-primary-100 bg-gradient-to-b from-primary-50/70 to-primary-100/40 p-5 text-center`}
                  >
                    <Cell value={row.emo} highlight />
                  </div>
                  <div className={`flex items-center justify-center p-5 text-center ${i % 2 ? 'bg-surface-light/60' : ''}`}>
                    <Cell value={row.cowork} />
                  </div>
                  <div className={`flex items-center justify-center p-5 text-center ${i % 2 ? 'bg-surface-light/60' : ''}`}>
                    <Cell value={row.trad} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
