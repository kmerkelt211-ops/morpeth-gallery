'use client'

import { useEffect } from 'react'

type LightboxKeyboardControlsProps = {
  imageCount: number
  closeHash?: string
}

function getLightboxIndex(hash: string, imageCount: number): number | null {
  const match = hash.match(/^#lb-(\d+)$/)
  if (!match) return null

  const index = Number.parseInt(match[1], 10)
  if (Number.isNaN(index) || index < 0 || index >= imageCount) return null
  return index
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false

  const tag = target.tagName.toLowerCase()
  return (
    target.isContentEditable ||
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select'
  )
}

export default function LightboxKeyboardControls({
  imageCount,
  closeHash = '#exhibition-top',
}: LightboxKeyboardControlsProps) {
  useEffect(() => {
    if (imageCount < 1) return

    const goToPrevious = (currentIndex: number) => {
      const prev = currentIndex === 0 ? imageCount - 1 : currentIndex - 1
      window.location.hash = `#lb-${prev}`
    }

    const goToNext = (currentIndex: number) => {
      const next = currentIndex === imageCount - 1 ? 0 : currentIndex + 1
      window.location.hash = `#lb-${next}`
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return

      const currentIndex = getLightboxIndex(window.location.hash, imageCount)
      if (currentIndex === null) return

      if (event.key === 'Escape') {
        event.preventDefault()
        window.location.hash = closeHash
        return
      }

      if (imageCount < 2) return

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToNext(currentIndex)
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goToPrevious(currentIndex)
      }
    }

    let touchStartX: number | null = null
    let touchStartY: number | null = null

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return
      if (getLightboxIndex(window.location.hash, imageCount) === null) return

      touchStartX = event.touches[0].clientX
      touchStartY = event.touches[0].clientY
    }

    const onTouchEnd = (event: TouchEvent) => {
      if (touchStartX === null || touchStartY === null) return

      const currentIndex = getLightboxIndex(window.location.hash, imageCount)
      const endTouch = event.changedTouches[0]
      const deltaX = endTouch.clientX - touchStartX
      const deltaY = endTouch.clientY - touchStartY

      touchStartX = null
      touchStartY = null

      if (currentIndex === null || imageCount < 2) return

      const minSwipeDistance = 56
      const horizontalBias = 1.2
      if (Math.abs(deltaX) < minSwipeDistance) return
      if (Math.abs(deltaX) < Math.abs(deltaY) * horizontalBias) return

      if (deltaX < 0) {
        goToNext(currentIndex)
        return
      }

      goToPrevious(currentIndex)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [closeHash, imageCount])

  return null
}
