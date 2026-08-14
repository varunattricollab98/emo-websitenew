import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const WHATSAPP_URL = 'https://wa.me/918882735038?text=Hi%2C%20I%20need%20help%20with%20a%20virtual%20office'
const DISMISS_KEY = 'emo_msg_bar_dismissed'

export default function MessageBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem(DISMISS_KEY)) return
    // Show after 2 seconds
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem(DISMISS_KEY, '1')
  }

  if (!visible) return null

  return (
    <div className="relative z-[60] bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white">
      <div className="container-custom flex items-center justify-between py-2">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <img
            src="/favicon.png"
            alt="EaseMyOffice"
            className="h-7 w-7 rounded-md bg-white/10 p-0.5"
          />
          <span className="flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
              1
            </span>
            new message
          </span>
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
