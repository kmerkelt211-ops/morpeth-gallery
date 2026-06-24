'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import LightboxModal from './lightbox-modal'

type LightboxContextValue = {
  open: (index: number) => void
}

const LightboxContext = createContext<LightboxContextValue | null>(null)

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  if (!ctx) {
    throw new Error('useLightbox must be used within a LightboxProvider')
  }
  return ctx
}

type LightboxProviderProps = {
  images: string[]
  title: string
  children: ReactNode
}

export default function LightboxProvider({ images, title, children }: LightboxProviderProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const isOpen = currentIndex !== null
  const total = images.length

  const open = useCallback((index: number) => setCurrentIndex(index), [])
  const close = useCallback(() => setCurrentIndex(null), [])
  const next = useCallback(
    () => setCurrentIndex((prev) => (prev === null ? null : (prev + 1) % total)),
    [total]
  )
  const previous = useCallback(
    () => setCurrentIndex((prev) => (prev === null ? null : (prev - 1 + total) % total)),
    [total]
  )

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') next()
      if (event.key === 'ArrowLeft') previous()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, close, next, previous])

  const value = useMemo(() => ({ open }), [open])

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <LightboxModal
        images={images}
        title={title}
        isOpen={isOpen}
        currentIndex={currentIndex ?? 0}
        onClose={close}
        onNext={next}
        onPrevious={previous}
        onSelect={open}
      />
    </LightboxContext.Provider>
  )
}
