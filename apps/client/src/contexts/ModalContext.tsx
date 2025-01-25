import type { ModalType } from '@/types'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useState } from 'react'

interface ModalContextType {
  activeModal: ModalType
  modalData: Record<string, any>
  openModal: (modalType: ModalType, data?: Record<string, any>) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [modalData, setModalData] = useState<Record<string, any>>({})

  const openModal = useCallback((modalType: ModalType, data?: Record<string, any>) => {
    setActiveModal(modalType)
    data ? setModalData(data) : setModalData({})
  }, [])

  return (
    <ModalContext.Provider value={{ activeModal, modalData, openModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
