import { createContext, lazy, Suspense, useCallback, useContext, useState } from 'react'

// The subscribe window pulls in Modal, which uses framer-motion. RootLayout is part of
// the eager bundle, so the window is loaded only the first time someone opens it.
const NewsletterModal = lazy(() => import('./NewsletterModal'))

const OpenNewsletterContext = createContext<() => void>(() => {})

/**
 * One subscribe window for the whole site (hero, footer, WeekPaper page, end of each
 * Research Summary). Mounted in RootLayout; open it with `useOpenNewsletter()`.
 * Renders nothing until first opened, so prerendered HTML and hydration are unaffected.
 */
export function NewsletterProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [requested, setRequested] = useState(false)
  const open = useCallback(() => { setRequested(true); setIsOpen(true) }, [])
  // Stable identity: Modal's focus-trap effect depends on onClose
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <OpenNewsletterContext.Provider value={open}>
      {children}
      {requested && (
        <Suspense fallback={null}>
          <NewsletterModal isOpen={isOpen} onClose={close} />
        </Suspense>
      )}
    </OpenNewsletterContext.Provider>
  )
}

export function useOpenNewsletter() {
  return useContext(OpenNewsletterContext)
}
