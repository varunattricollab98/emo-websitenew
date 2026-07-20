import { Check, ArrowRight } from 'lucide-react'
import Button from './Button'
import Badge from './Badge'

export default function PlanCard({ plan }) {
  const { name, price, period = '/yr', desc, features = [], popular, cta = 'Get Started', to = '/contact' } = plan
  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl p-8 transition-all duration-300 ${
        popular
          ? 'border-2 border-gold bg-gradient-to-br from-primary-50 via-white to-primary-100/50 shadow-card-hover lg:-translate-y-3'
          : 'premium-card'
      }`}
    >
      {popular && (
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <Badge variant="gold">MOST POPULAR</Badge>
        </span>
      )}
      <h3 className="text-xl font-bold text-navy-dark">{name}</h3>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
      <div className="mt-5 flex items-end gap-1">
        <span className="text-4xl font-extrabold text-navy-dark">₹{price}</span>
        <span className="mb-1 text-sm text-slate-500">{period}</span>
      </div>
      <ul className="mt-6 flex-1 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
            <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
              <Check className="h-3.5 w-3.5" />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <Button to={to} variant={popular ? 'gold' : 'primary'} className="mt-8 w-full">
        {cta}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
