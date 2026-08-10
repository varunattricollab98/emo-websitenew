import { MapPinned, FileText, KeyRound } from 'lucide-react'
import StepsFlow from '../ui/StepsFlow'

// Design lives in components/ui/StepsFlow so the service pages can reuse the
// exact same treatment. This file is now just the homepage's copy.
const steps = [
  {
    icon: MapPinned,
    title: 'Choose Location & Plan',
    desc: 'Pick your city and the plan that matches your requirement.',
    chip: '250+ locations',
  },
  {
    icon: FileText,
    title: 'Submit KYC Documents',
    desc: 'Upload your KYC online and our team verifies everything for you.',
    chip: '100% online',
  },
  {
    icon: KeyRound,
    title: 'Get Your Ready-to-Use Address',
    desc: 'Receive your compliant address & documents in just 2–3 days.',
    chip: 'Ready in 2–3 days',
  },
]

export default function ThreeStepSetup() {
  return (
    <StepsFlow
      title="Get Set Up in 3 Simple Steps"
      accent="3 Simple Steps"
      subtitle="From choosing a location to a ready-to-use business address, fully online."
      steps={steps}
      cta={{ label: 'Start Your Setup Today', to: '/virtual-office' }}
    />
  )
}
