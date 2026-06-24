'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useRef, useState } from 'react'

type LightboxModalProps = {
  images: string[]
  title: string
  isOpen: boolean
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  onSelect: (index: number) => void
}

export default function LightboxModal({
  images,
  title,
  isOpen,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
  onSelect,
}: LightboxModalProps) {
  const [direction, setDirection] = useState<'left' | 'right'>('left')

  const handleNext = () => {
    setDirection('left')
    onNext()
  }

  const handlePrevious = () => {
    setDirection('right')
    onPrevious()
  }

  const touchStartX = useRef(0)
  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX
  }
  const handleTouchEnd = (event: React.TouchEvent) => {
    const diff = event.changedTouches[0].clientX - touchStartX.current
    if (diff > 50) handlePrevious()
    if (diff < -50) handleNext()
  }

  if (!isOpen) return null

  const src = images[currentIndex]
  const hasMultiple = images.length > 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/55 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} image viewer`}
      onClick={onClose}
    >
      <motion.div
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.18 }}
        className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: '92vh' }}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
          <p className="font-exhibitions text-[11px] uppercase tracking-[0.2em] text-neutral-700">
            {currentIndex + 1} / {images.length}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white transition hover:bg-neutral-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative flex w-full items-center justify-center overflow-hidden bg-neutral-950"
          style={{ height: 'min(60vh, 640px)' }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={src}
              src={src}
              alt={`${title} image ${currentIndex + 1}`}
              initial={{ x: direction === 'left' ? 80 : -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === 'left' ? -80 : 80, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="max-h-full max-w-full object-contain"
            />
          </AnimatePresence>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  handlePrevious()
                }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg transition hover:scale-105"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  handleNext()
                }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg transition hover:scale-105"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <div className="border-b border-neutral-200 px-5 py-3">
          <p className="font-exhibitions text-xs uppercase tracking-[0.14em] text-neutral-900">
            {title}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Image {currentIndex + 1} from this exhibition
          </p>
        </div>

        {hasMultiple && (
          <div className="flex items-center gap-2 overflow-x-auto p-4" aria-label="Image navigation">
            {images.map((thumbSrc, i) => (
              <button
                type="button"
                key={`${thumbSrc}-${i}`}
                onClick={() => onSelect(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  i === currentIndex
                    ? 'border-neutral-900 opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={`${thumbSrc}?w=112&h=112&fit=crop&auto=format`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
