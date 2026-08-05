import { useParams } from 'react-router-dom'
import { getServiceLanding } from '../data/serviceLandings'
import ServiceLanding from './ServiceLanding'
import SpaceDetail from './SpaceDetail'

/**
 * Dispatcher, checks if the last URL segment is a service (gst-registration, etc.)
 * or a space/locality. Renders the appropriate page.
 *
 * Handles: /space/:city/:space, /space/:state/:city/:space,
 *          /virtual-office/:city/:space (via CityOrSpace which renders this)
 */
export default function SpaceOrService() {
  const params = useParams()
  // The "space" slug is the last meaningful param
  const spaceSlug = (params.space || params.second || params.city || '').toLowerCase()

  // Normalize common service slug variants
  const normalized = spaceSlug
    .replace(/gstregistration/i, 'gst-registration')
    .replace(/businessregistration/i, 'business-registration')
    .replace(/mailingaddress/i, 'mailing-address')
    .replace(/deskplan/i, 'desk-plan')

  return getServiceLanding(normalized) ? <ServiceLanding /> : <SpaceDetail />
}
