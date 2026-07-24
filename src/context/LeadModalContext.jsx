import { createContext, useContext, useState, useCallback } from 'react'
import LeadModal from '../components/ui/LeadModal'

const LeadModalContext = createContext({ openLeadModal: () => {}, closeLeadModal: () => {} })

export function useLeadModal() {
  return useContext(LeadModalContext)
}

export function LeadModalProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState({})

  const openLeadModal = useCallback((cfg = {}) => {
    setConfig(cfg || {})
    setOpen(true)
  }, [])

  const closeLeadModal = useCallback(() => setOpen(false), [])

  return (
    <LeadModalContext.Provider value={{ openLeadModal, closeLeadModal }}>
      {children}
      <LeadModal open={open} config={config} onClose={closeLeadModal} />
    </LeadModalContext.Provider>
  )
}
