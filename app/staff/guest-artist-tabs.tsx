'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import RevealOnScroll from '../components/reveal-on-scroll'
import type { ExhibitionCard } from '../../sanity/lib/exhibition-card'

const GUEST_ARTIST_SECTIONS = [
  {
    key: 'visiting',
    label: 'Visiting',
    accent: '#9EDFE6',
    fallbackDescription: "Students visit an artist, view their work, or have their own work displayed alongside it.",
  },
  {
    key: 'welcoming',
    label: 'Welcoming',
    accent: '#d292b0',
    fallbackDescription: 'Artists who come to Portman Gallery to show their work and share their practice with students.',
  },
  {
    key: 'projects',
    label: 'Projects',
    accent: '#FFC16B',
    fallbackDescription: 'Collaborative projects developed with guest artists over an extended period.',
  },
] as const

type SectionKey = (typeof GUEST_ARTIST_SECTIONS)[number]['key']

type CategoryCard = {
  imageUrl?: string
  alt?: string
  description?: string
}

type GuestArtistTabsProps = {
  items: ExhibitionCard[]
  categoryCards?: Partial<Record<SectionKey, CategoryCard | undefined>>
}

export default function GuestArtistTabs({ items, categoryCards }: GuestArtistTabsProps) {
  const [activeKey, setActiveKey] = useState<SectionKey | null>(null)

  const activeItems = activeKey
    ? items.filter((ex) => (ex.guestArtistCategory || 'visiting') === activeKey)
    : []

  return (
    <div className="mb-16">
      <div className="grid gap-8 md:grid-cols-3">
        {GUEST_ARTIST_SECTIONS.map((section, index) => {
          const isActive = section.key === activeKey
          const card = categoryCards?.[section.key]
          const fallbackImage = items.find(
            (ex) => (ex.guestArtistCategory || 'visiting') === section.key && ex.heroImageUrl
          )?.heroImageUrl
          const imageUrl = card?.imageUrl || fallbackImage
          const description = card?.description?.trim() || section.fallbackDescription

          return (
            <RevealOnScroll key={section.key} delay={Math.min(index * 60, 240)}>
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveKey(section.key)}
                className={`lux-hover-rise group flex h-full w-full flex-col border bg-white text-left shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-colors duration-300 ${
                  isActive ? 'border-neutral-900' : 'border-neutral-200'
                }`}
              >
                <div className="border-b border-neutral-200 bg-white p-6">
                  <div className="relative mb-4 h-44 w-full overflow-hidden border border-neutral-200 bg-neutral-100">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={card?.alt || `${section.label} category image`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className={`object-cover transition-all duration-500 ${
                          isActive
                            ? 'scale-105 grayscale-0'
                            : 'grayscale group-hover:scale-105 group-hover:grayscale-0'
                        }`}
                      />
                    ) : null}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                      style={{ backgroundColor: section.accent, opacity: isActive ? 0.18 : 0 }}
                    />
                    <div
                      aria-hidden
                      className={`absolute right-2 top-2 h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                        isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`}
                      style={{ backgroundColor: section.accent, boxShadow: '0 0 0 3px rgba(255,255,255,0.9)' }}
                    />
                  </div>

                  <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-700">
                    PORTMAN GALLERY
                  </div>

                  <div className="mt-5">
                    <div
                      className="font-exhibitions text-2xl tracking-[0.14em] text-neutral-900 md:text-3xl"
                      style={{ color: isActive ? section.accent : undefined }}
                    >
                      {section.label}
                    </div>
                    <div className="mt-2 text-sm font-medium text-neutral-800">{description}</div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between px-5 py-4">
                  <h3 className="font-exhibitions text-sm tracking-[0.16em] text-neutral-900 md:text-base">
                    {section.label}
                  </h3>
                  <span
                    className={`font-exhibitions inline-flex items-center gap-2 border px-3 py-2 text-[10px] uppercase tracking-[0.26em] transition ${
                      isActive
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-900 text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white'
                    }`}
                  >
                    {isActive ? 'Viewing' : 'View'}
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </button>
            </RevealOnScroll>
          )
        })}
      </div>

      {activeKey ? (
        <div className="mt-10">
          {activeItems.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-3">
              {activeItems.map((ex, index) =>
                ex.slug?.current ? (
                  <RevealOnScroll key={ex._id} delay={Math.min(index * 45, 270)}>
                    <Link href={`/${ex.slug.current}`} className="block">
                      <div className="relative aspect-[4/5] bg-neutral-200">
                        {ex.heroImageUrl && (
                          <Image
                            src={ex.heroImageUrl}
                            alt={ex.title}
                            fill
                            sizes="(min-width: 768px) 33vw, 100vw"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <h3 className="font-exhibitions mt-4 text-lg tracking-[0.12em] text-neutral-900">
                        {ex.title}
                      </h3>
                      {ex.description ? (
                        <p className="mt-2 text-sm text-neutral-700">{ex.description}</p>
                      ) : null}
                    </Link>
                  </RevealOnScroll>
                ) : null
              )}
            </div>
          ) : (
            <p className="text-sm text-neutral-600">
              No {GUEST_ARTIST_SECTIONS.find((s) => s.key === activeKey)?.label.toLowerCase()} exhibitions are published yet.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
