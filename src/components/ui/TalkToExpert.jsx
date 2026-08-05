import { Headset } from 'lucide-react'
import { useLeadModal } from '../../context/LeadModalContext'

/**
 * Sticky "Talk to an Expert" bar that appears at the bottom of space/city pages.
 * Opens the lead popup form when clicked.
 */
export default function TalkToExpert({ city = '', space = '' }) {
  const { openLeadModal } = useLeadModal()

  const handleClick = () =>
    openLeadModal({
      title: 'Talk to Our Expert Team',
      subtitle:
        'Get personalized guidance on choosing the right virtual office, pricing, and compliance, free, no obligations.',
      service: space ? `Expert consultation, ${space}, ${city}` : `Expert consultation, ${city}`,
      city,
    })

  return (
    <div className="sticky bottom-0 z-30 border-t border-primary-100 bg-white/95 backdrop-blur-md">
      <div className="container-custom flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-dark text-white shadow-card">
            <Headset className="h-5 w-5" />
          </span>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-navy-dark">Need help choosing?</p>
            <p className="text-xs text-slate-500">Our experts will guide you, free consultation</p>
          </div>
          <p className="text-sm font-bold text-navy-dark sm:hidden">Need help?</p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          className="btn-base bg-gradient-to-r from-gold to-gold-dark px-5 py-2.5 text-sm text-white shadow-card transition-all hover:shadow-gold-glow hover:brightness-105"
        >
          <Headset className="h-4 w-4" />
          Talk to an Expert
        </button>
      </div>
    </div>
  )
}
