'use client'

import Image from 'next/image'
import { useLightbox } from './lightbox-context'

type LightboxTriggerProps = {
  index: number
  src: string
  alt: string
  sizes: string
  aspectClassName: string
  priority?: boolean
}

export default function LightboxTrigger({
  index,
  src,
  alt,
  sizes,
  aspectClassName,
  priority,
}: LightboxTriggerProps) {
  const { open } = useLightbox()

  return (
    <button
      type="button"
      onClick={() => open(index)}
      className={`group relative block w-full cursor-zoom-in bg-neutral-200 text-left ${aspectClassName}`}
      aria-label={`Open ${alt} fullscreen`}
    >
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/30"
      >
        <svg
          className="h-7 w-7 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </span>
    </button>
  )
}
