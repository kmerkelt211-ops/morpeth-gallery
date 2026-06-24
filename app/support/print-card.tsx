'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'

type PrintCardData = {
  imageUrl: string
  alt: string
  title: string
  artist: string
  year?: number
  priceLabel: string
  availability: string
  ctaLabel: string
  href: string
  soldOut: boolean
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

export default function PrintCard({ card }: { card: PrintCardData }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const lineTwo = [card.artist, card.year].filter(Boolean).join(', ')
  const external = isExternalHref(card.href)

  return (
    <div className="lux-hover-rise flex h-full flex-col">
      <button
        type="button"
        onClick={() => setIsLightboxOpen(true)}
        className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-neutral-200"
        aria-label={`View ${card.title} full size`}
      >
        <Image
          src={card.imageUrl}
          alt={card.alt}
          fill
          sizes="(min-width: 1280px) 23vw, (min-width: 640px) 48vw, 100vw"
          className={`object-cover transition duration-300 group-hover:scale-105 ${card.soldOut ? 'opacity-60 grayscale' : ''}`}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/0 opacity-0 transition duration-200 group-hover:bg-neutral-900/30 group-hover:opacity-100">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg">
            <ZoomIn className="h-5 w-5" />
          </span>
        </div>
        {card.soldOut ? (
          <span className="font-heading absolute left-3 top-3 inline-flex items-center bg-neutral-900 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
            Sold out
          </span>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col justify-between space-y-2 border-t border-slate-200 bg-white px-4 py-4">
        <div className="space-y-2">
          <h4 className="text-2xl leading-tight text-neutral-900">{card.title}</h4>
          {lineTwo ? <p className="text-sm text-slate-600">{lineTwo}</p> : null}
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <p className="text-sm font-semibold text-neutral-900">{card.priceLabel}</p>
            <p className="text-xs text-slate-600">{card.availability}</p>
          </div>
          {card.soldOut ? (
            <span
              aria-disabled="true"
              className="font-heading inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-400"
            >
              Sold out
            </span>
          ) : (
            <a
              href={card.href}
              className="font-heading lux-underline inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-900"
              aria-label={`${card.ctaLabel} for ${card.title}`}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
            >
              {card.ctaLabel} <span aria-hidden>→</span>
            </a>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isLightboxOpen ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${card.title} full size view`}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-2 sm:p-6"
            onClick={() => setIsLightboxOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close full size view"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg transition hover:bg-neutral-200"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              className="relative h-full max-h-[96vh] w-full max-w-[96vw]"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Image
                src={card.imageUrl}
                alt={card.alt}
                fill
                sizes="96vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
