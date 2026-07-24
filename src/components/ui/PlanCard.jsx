import { Check, ArrowRight, Crown } from 'lucide-react'
import Button from './Button'

export default function PlanCard({ plan, onCta }) {
  const {
    name,
    price,
    period = '/mo',
    desc,
    features = [],
    popular,
    cta = 'Get Started',
    to = '/contact',
    icon: Icon,
    grad,
  } = plan
  const gradient = grad || 'linear-gradient(135deg, #3c82c2 0%, #11417c 100%)'

  return (
    <div
      className={`group relative flex h-full flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 ${
        popular
          ? 'bg-gradient-to-b from-primary-50 via-white to-white shadow-card-hover ring-2 ring-gold lg:-translate-y-4'
          : 'bg-white shadow-card ring-1 ring-primary-100/70 hover:ring-primary/40 hover:shadow-card-hover'
      }`}
    >
      {/* contained soft glow for popular */}
      {popular && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-gold/15 blur-3xl" />
        </div>
      )}

      {/* crown badge (not clipped) */}
      {popular && (
        <span className="absolute left-1/2 top-0 z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-gold-dark px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-gold-glow">
          <Crown className="h-3.5 w-3.5" />
          Most Popular
        </span>
      )}

      {/* header */}
      <div className="relative flex items-center gap-3">
        {Icon && (
          <span
            className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl text-white shadow-card ring-1 ring-white/40"
            style={{ background: gradient }}
          >
            <Icon className="h-6 w-6" />
          </span>
        )}
        <h3 className="text-xl font-bold text-navy-dark">{name}</h3>
      </div>

      <p className="relative mt-3 text-sm leading-relaxed text-slate-500">{desc}</p>

      {/* price */}
      <div className="relative mt-5 flex items-end gap-1">
        <span className="mb-1 text-2xl font-bold text-navy-dark">₹</span>
        <span className="text-5xl font-extrabold leading-none text-navy-dark">{price}</span>
        <span className="mb-1.5 text-sm font-medium text-slate-400">{period}</span>
      </div>
      <p className="relative mt-1.5 text-xs font-medium text-slate-400">
        Billed monthly · No hidden charges
      </p>

      {/* features */}
      <ul className="relative mt-6 flex-1 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
            <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Button
        {...(onCta ? { onClick: onCta, type: 'button' } : { to })}
        variant={popular ? 'gold' : 'primary'}
        className="relative mt-8 w-full"
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
