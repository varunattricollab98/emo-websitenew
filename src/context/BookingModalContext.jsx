import { createContext, useContext, useState, useCallback } from 'react'
import BookingModal from '../components/ui/BookingModal'

const BookingModalContext = createContext({ openBooking: () => {}, closeBooking: () => {} })

export function useBookingModal() {
  return useContext(BookingModalContext)
}

export function BookingModalProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [booking, setBooking] = useState({})

  const openBooking = useCallback((data = {}) => {
    setBooking(data || {})
    setOpen(true)
  }, [])

  const closeBooking = useCallback(() => setOpen(false), [])

  return (
    <BookingModalContext.Provider value={{ openBooking, closeBooking }}>
      {children}
      <BookingModal open={open} booking={booking} onClose={closeBooking} />
    </BookingModalContext.Provider>
  )
}
