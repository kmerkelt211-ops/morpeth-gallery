'use client'

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from 'react'
import { usePathname } from 'next/navigation'

// Tracks the last scroll position seen on each pathname, keyed in memory so
// it survives Next.js's client-side back/forward navigation (no full page
// reload). Presence of an entry means the page was visited earlier in this
// session. We compare element position against this *saved* scroll value
// rather than the live one, because on back navigation the browser hasn't
// necessarily restored window.scrollY yet by the time this component's
// layout effect runs — comparing against a stale "0" scroll would make
// already-visible elements look off-screen and replay their animation.
const lastScrollByPath = new Map<string, number>()

function trackScrollPosition(): void {
  if (typeof window === 'undefined') return
  lastScrollByPath.set(window.location.pathname, window.scrollY)
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', trackScrollPosition, { passive: true })
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
  const pathname = usePathname()

  // If this page was already visited earlier in the session (e.g. the user
  // clicked a link then hit back), anything already on screen should just be
  // there, not replay its entrance animation. Anything still off-screen should
  // still reveal normally as the user scrolls to it. This runs before paint so
  // there's no flash of the hidden state for the on-screen case.
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return

    const savedScrollY = lastScrollByPath.get(pathname)
    if (savedScrollY === undefined) return

    // Use document-relative position (independent of the *current* live
    // scroll, which may not be restored yet) and compare it against the
    // scroll position that was last recorded for this page.
    const rect = elementRef.current.getBoundingClientRect()
    const elementTop = rect.top + window.scrollY
    const elementBottom = elementTop + rect.height
    const alreadyInViewport =
      elementBottom > savedScrollY && elementTop < savedScrollY + window.innerHeight
    if (alreadyInViewport) {
      alreadyHandledRef.current = true
      // Synchronous so React flushes before the browser paints, otherwise
      // the hidden state would flash for a frame.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true)
    }
  }, [pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return
    trackScrollPosition()
    if (alreadyHandledRef.current) return

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
  }, [once, pathname])

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
