import type { ReactNode } from 'react'
import { useModal } from '@/contexts/ModalContext'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

import { useLocation } from 'wouter'

import Footer from '../Footer'
import { Sidebar } from './Sidebar'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const [location] = useLocation()
  const { activeModal, openModal } = useModal()

  useScrollToTop()

  useEffect(() => {
    openModal(null)
  }, [location])

  return (
    <div className="flex h-screen">
      <div className="relative isolate flex size-full">
        <div className="fixed left-0 top-0 z-40 h-full">
          <Sidebar
            location={location}
            activeModal={activeModal}
            onOpenSheet={(modalType, isOpen) =>
              openModal(isOpen ? modalType : null)}
          />
        </div>

        <div className="relative z-30 flex flex-1 flex-col max-sm:pb-20 sm:ml-[var(--sidebar-width)]">
          <main>{children}</main>
          <Footer />
        </div>

        <AnimatePresence>
          {activeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black sm:left-[var(--sidebar-width)]"
              onClick={() => openModal(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
