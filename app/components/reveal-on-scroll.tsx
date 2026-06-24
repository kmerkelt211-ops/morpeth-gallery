'use client'

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from 'react'

function isBackForwardNavigation(): boolean {
  const navigationEntry = window.performance?.getEntriesByType?.('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined
  return navigationEntry?.type === 'back_forward'
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
  const alreadyHandledRef = useRef(false)

  // On a back/forward navigation, anything already on screen should just be
  // there, not replay its entrance animation. Anything still off-screen should
  // still reveal normally as the user scrolls to it. This runs before paint so
  // there's no flash of the hidden state for the on-screen case.
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return
    if (!isBackForwardNavigation()) return

    const rect = elementRef.current.getBoundingClientRect()
    const alreadyInViewport = rect.top < window.innerHeight && rect.bottom > 0
    if (alreadyInViewport) {
      alreadyHandledRef.current = true
      // Synchronous so React flushes before the browser paints, otherwise
      // the hidden state would flash for a frame.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || alreadyHandledRef.current) return

    let frameId = 0
    const showImmediately = () => {
      frameId = window.requestAnimationFrame(() => {
        setIsVisible(true)
      })
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotionQuery.matches) {
      showImmediately()
      return () => window.cancelAnimationFrame(frameId)
    }

    if (!('IntersectionObserver' in window) || !elementRef.current) {
      showImmediately()
      return () => window.cancelAnimationFrame(frameId)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setIsVisible(false)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(elementRef.current)

    return () => {
      window.cancelAnimationFrame(frameId)
      observer.disconnect()
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
