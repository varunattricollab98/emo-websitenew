import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useLeadModal } from '../../context/LeadModalContext'

/**
 * Opens the "Talk to an Expert" lead modal automatically, on two triggers:
 *
 *   1. Scroll depth, once the visitor has read 25% of the page.
 *   2. Exit intent, when the cursor leaves through the top of the viewport
 *      (heading for the back button, address bar or tab strip).
 *
 * It fires at most once per browsing session. Re-opening it on every page
 * would make the site unusable, and a visitor who has already seen and
 * dismissed the form has effectively answered it.
 *
 * The modal itself already has a close (X) button, an Escape handler and a
 * click-outside backdrop, so no extra dismissal wiring is needed here.
 */

// Marker so the popup does not reappear on later navigations. sessionStorage
// (not localStorage) so it comes back on the visitor's next visit.
const SESSION_KEY = 'emo:auto-lead-shown'

// Fraction of the scrollable height that counts as "read enough to ask".
const SCROLL_FRACTION = 0.25

// A visitor who lands and immediately flicks the wheel has not read anything,
// and browsers can restore a scroll position on reload. Wait this long before
// either trigger is allowed to fire.
const MIN_TIME_ON_PAGE_MS = 3000

// Pages built around their own form. Interrupting someone mid-form with the
// same request is counterproductive, so the popup stays out of the way.
const SUPPRESSED_PATHS = ['/contact', '/list-your-space', '/careers']

/** sessionStorage throws in some privacy modes, so every access is guarded. */
function alreadyShown() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function markShown() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* ignore, the in-memory ref still prevents a repeat this page view */
  }
}

export default function AutoLeadPopup() {
  const { openLeadModal } = useLeadModal()
  const { pathname } = useLocation()

  // Guards a double-fire when scroll and exit intent land in the same tick.
  const firedRef = useRef(false)

  useEffect(() => {
    if (SUPPRESSED_PATHS.some((p) => pathname.startsWith(p))) return
    if (alreadyShown()) return

    const mountedAt = Date.now()
    let rafId = 0
    let settleTimer = 0

    const tooEarly = () => Date.now() - mountedAt < MIN_TIME_ON_PAGE_MS

    // Another dialog (booking, gallery) locks body scroll while it is open.
    // Stacking a second modal on top of it would trap the visitor.
    const anotherModalOpen = () => document.body.style.overflow === 'hidden'

    // Returns true only when the modal was actually opened. The caller uses
    // that to decide whether to detach, a blocked attempt (too early, or a
    // dialog already open) must leave the listeners in place so a later
    // scroll or exit still counts.
    const trigger = (source) => {
      if (firedRef.current || tooEarly() || anotherModalOpen()) return false
      firedRef.current = true
      markShown()
      openLeadModal({
        title: 'Talk to an Expert',
        subtitle:
          'Share a few details and our team will call you back within one business day.',
        source,
      })
      return true
    }

    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        // Pages shorter than the viewport can never reach 25%, skip them.
        if (scrollable < 200) return
        if (window.scrollY / scrollable >= SCROLL_FRACTION && trigger('scroll-25')) {
          cleanup()
        }
      })
    }

    // relatedTarget is null only when the pointer leaves the document itself,
    // and clientY <= 0 narrows that to the top edge, where the browser chrome
    // is. Leaving sideways or downward is not treated as exit intent.
    const onMouseOut = (e) => {
      if (e.relatedTarget || e.clientY > 0) return
      if (trigger('exit-intent')) cleanup()
    }

    function cleanup() {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      clearTimeout(settleTimer)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mouseout', onMouseOut)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    // Exit intent needs a real cursor. Touch devices have no mouseout, and
    // matching on pointer:fine keeps the listener off phones entirely.
    const hasCursor =
      typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches
    if (hasCursor) document.addEventListener('mouseout', onMouseOut)

    // Run once on mount so a page already scrolled past 25% still qualifies.
    onScroll()

    // A visitor already past the threshold when the page mounts is blocked by
    // the min-time guard and would otherwise have to scroll again to qualify.
    // Re-check once that window closes.
    settleTimer = setTimeout(onScroll, MIN_TIME_ON_PAGE_MS + 50)

    return cleanup
  }, [pathname, openLeadModal])

  return null
}
