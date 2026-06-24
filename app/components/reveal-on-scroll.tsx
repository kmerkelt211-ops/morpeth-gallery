'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from 'react'
// `popstate` is the one signal the browser reliably fires for an actual
// back/forward button press, even for Next.js App Router's client-side
// navigation (unlike Performance Navigation Timing, which never reports
// back_forward for SPA route changes). When it fires, anything already on
// screen should appear instantly with no animation; anything still
// off-screen should still reveal normally as the user scrolls to it.
let justNavigatedBackForward = false
let resetTimer: number | undefined
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    justNavigatedBackForward = true
    if (resetTimer) window.clearTimeout(resetTimer)
    resetTimer = window.setTimeout(() => {
      justNavigatedBackForward = false
    }, 1000)
  })
}

type RevealEffect = 'fade-up' | 'fade-in' | 'wipe-right' | 'fade-left' | 'fade-right' | 'scale-in'

type RevealOnScrollProps = HTMLAttributes<HTMLDivElement> & {
  delay?: number
  effect?: RevealEffect
  once?: boolean
}

export default function RevealOnScroll({
  children,
  className,
  style,
  delay = 0,
  effect = 'fade-up',
  once = true,
  ...props
}: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return

    const isRevisit = justNavigatedBackForward

    let frameId = 0
    let settleFrameId = 0
    let observer: IntersectionObserver | null = null

    const setupObserver = () => {
      if (!elementRef.current) return
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true)
              if (once) observer?.unobserve(entry.target)
            } else if (!once) {
              setIsVisible(false)
            }
          })
        },
        { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
      )
      observer.observe(elementRef.current)
    }

    const showImmediately = () => {
      frameId = window.requestAnimationFrame(() => setIsVisible(true))
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotionQuery.matches) {
      showImmediately()
      return () => window.cancelAnimationFrame(frameId)
    }

    if (!('IntersectionObserver' in window)) {
      showImmediately()
      return () => window.cancelAnimationFrame(frameId)
    }

    if (isRevisit) {
      // Give the browser a couple of frames to restore the previous scroll
      // position before checking whether this element is already on screen.
      settleFrameId = window.requestAnimationFrame(() => {
        settleFrameId = window.requestAnimationFrame(() => {
          const el = elementRef.current
          if (!el) return

          const rect = el.getBoundingClientRect()
          const alreadyInViewport = rect.top < window.innerHeight && rect.bottom > 0
          if (alreadyInViewport) {
            const previousTransition = el.style.transition
            el.style.transition = 'none'
            setIsVisible(true)
            window.requestAnimationFrame(() => {
              el.style.transition = previousTransition
            })
          } else {
            setupObserver()
          }
        })
      })
    } else {
      setupObserver()
    }

    return () => {
      window.cancelAnimationFrame(frameId)
      window.cancelAnimationFrame(settleFrameId)
      observer?.disconnect()
    }
  }, [once])

  const mergedStyle: CSSProperties = {
    ...style,
    ['--reveal-delay' as string]: `${Math.max(0, delay)}ms`,
  }

  return (
    <div
      ref={elementRef}
      className={`reveal-observe ${className || ''}`}
      style={mergedStyle}
      data-effect={effect}
      data-revealed={isVisible ? 'true' : 'false'}
      {...props}
    >
      {children}
    </div>
  )
}
