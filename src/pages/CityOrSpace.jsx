import { useParams } from 'react-router-dom'
import { voCities } from '../data/spaces'
import { useSupabaseSpaces } from '../context/SpacesContext'
import CityTemplate from './CityTemplate'
import SpaceOrService from './SpaceOrService'

/**
 * Dispatcher for /virtual-office/:first/:second
 *
 * Decides whether the URL is:
 *   /virtual-office/:state/:city   (e.g. /virtual-office/haryana/gurgaon)
 *   OR
 *   /virtual-office/:city/:space   (e.g. /virtual-office/gurgaon/golf-course-road)
 *
 * Logic: if "second" param is a known city slug → it's state/city → show CityTemplate
 *        otherwise → it's city/space → show SpaceDetail
 */
export default function CityOrSpace() {
  const { first, second } = useParams()
  const { loaded } = useSupabaseSpaces()

  // Check if "second" is a known city slug → state/city URL
  const secondIsCity = voCities.some((c) => c.slug === second)

  if (secondIsCity) {
    return <CityTemplate />
  }

  // Show loading while Supabase data loads (prevents empty flash)
  if (!loaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary" />
      </div>
    )
  }

  return <SpaceOrService />
}
