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
      className={`group relative block w-full bg-neutral-200 text-left ${aspectClassName}`}
      aria-label={`Open ${alt} fullscreen`}
    >
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
    </button>
  )
}
