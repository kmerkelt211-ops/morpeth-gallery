'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from 'react'

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
    if (typeof window === 'undefined') return

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
