import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ANIM } from '@/constants'

function CloseIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  closeLabel: string
  title?: string
  /** `dark` is the compact newsletter card; `light` is a wider surface card for longer forms. */
  tone?: 'dark' | 'light'
  children: React.ReactNode
}

const TONE = {
  dark: {
    panel: 'max-w-[440px] bg-[var(--card-dark)] text-white',
    close: 'text-white/70 hover:text-white hover:bg-white/10',
    title: 'text-white',
  },
  light: {
    panel: 'max-w-[640px] bg-surface text-ink',
    close: 'text-ink-muted hover:text-ink hover:bg-bg-alt',
    title: 'text-ink',
  },
} as const

export function Modal({ isOpen, onClose, closeLabel, title, tone = 'dark', children }: ModalProps) {
  const toneCls = TONE[tone]
  const shouldReduce = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!isOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    document.body.style.overflow = 'hidden'

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  }, [isOpen, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduce ? 0 : ANIM.MODAL_DURATION }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            tabIndex={-1}
            className={`relative w-full max-h-[calc(100dvh-32px)] overflow-y-auto overscroll-contain rounded-lg p-[clamp(24px,4vw,36px)] shadow-2xl focus:outline-none ${toneCls.panel}`}
            initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.96, y: shouldReduce ? 0 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: shouldReduce ? 1 : 0.96, y: shouldReduce ? 0 : 8 }}
            transition={{ duration: shouldReduce ? 0 : ANIM.MODAL_DURATION }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className={`absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${toneCls.close}`}
            >
              <CloseIcon />
            </button>
            {title && (
              <h2 id={titleId} className={`font-display font-semibold text-[1.3rem] mb-4 pr-8 ${toneCls.title}`}>
                {title}
              </h2>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
