import { useParams } from 'react-router-dom'
import { getServiceLanding } from '../data/serviceLandings'
import ServiceLanding from './ServiceLanding'
import SpaceDetail from './SpaceDetail'

// /space/:city/:space — if the second segment is a known service (gst-registration,
// business-registration, mailing-address, desk-plan) render the service landing;
// otherwise treat it as a locality/space and render the space detail page.
export default function SpaceOrService() {
  const { space } = useParams()
  return getServiceLanding(space) ? <ServiceLanding /> : <SpaceDetail />
}
