import { useParams } from 'react-router-dom'
import { getServiceLanding } from '../data/serviceLandings'
import ServiceLanding from './ServiceLanding'
import SpaceDetail from './SpaceDetail'

// /space/:city/:space OR /space/:state/:city/:space
// If the last segment is a known service (gst-registration, etc.) render service landing;
// otherwise treat it as a locality/space and render the space detail page.
export default function SpaceOrService() {
  const { space, city, state } = useParams()
  // In the 4-segment route /space/:state/:city/:space, "space" is the actual space
  // In the 3-segment route /space/:city/:space, "space" is the space
  const spaceSlug = space || city
  return getServiceLanding(spaceSlug) ? <ServiceLanding /> : <SpaceDetail />
}
