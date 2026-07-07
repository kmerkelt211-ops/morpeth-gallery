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
  const [activeKey, setActiveKey] = useState<SectionKey>('visiting')

  const activeItems = items.filter((ex) => (ex.guestArtistCategory || 'visiting') === activeKey)

  return (
    <div className="mb-16">
      <div className="grid gap-8 sm:grid-cols-3" role="tablist" aria-label="Guest artist categories">
        {GUEST_ARTIST_SECTIONS.map((section) => {
          const isActive = section.key === activeKey
          const card = categoryCards?.[section.key]
          const fallbackImage = items.find(
            (ex) => (ex.guestArtistCategory || 'visiting') === section.key && ex.heroImageUrl
          )?.heroImageUrl
          const imageUrl = card?.imageUrl || fallbackImage
          const description = card?.description?.trim() || section.fallbackDescription

          return (
            <button
              key={section.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveKey(section.key)}
              className="group relative text-left"
            >
              <div
                className={`relative aspect-[4/3] overflow-hidden bg-neutral-200 transition-all duration-500 ease-out ${
                  isActive ? '-translate-y-2 shadow-2xl' : 'group-hover:-translate-y-2 group-hover:shadow-2xl'
                }`}
                style={{
                  boxShadow: isActive ? `0 24px 48px -16px ${section.accent}99` : undefined,
                }}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={card?.alt || `${section.label} category image`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className={`object-cover transition-all duration-700 ease-out ${
                      isActive
                        ? 'scale-110 saturate-150 grayscale-0'
                        : 'grayscale group-hover:scale-110 group-hover:saturate-150 group-hover:grayscale-0'
                    }`}
                  />
                ) : null}

                {/* Diagonal shine sweep */}
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out ${
                    isActive ? 'translate-x-full' : 'group-hover:translate-x-full'
                  }`}
                />

                {/* Colour tint wash */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                  style={{ backgroundColor: section.accent, opacity: isActive ? 0.22 : 0 }}
                />
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                    isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-15'
                  }`}
                  style={{ backgroundColor: section.accent }}
                />

                {/* Legibility gradient */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent"
                />

                {/* "View" prompt on hover */}
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'scale-90 opacity-0'
                      : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                  }`}
                >
                  <span className="font-exhibitions rounded-full border border-white/80 bg-black/30 px-6 py-2 text-[10px] uppercase tracking-[0.32em] text-white backdrop-blur-sm">
                    View
                  </span>
                </div>

                {/* Active corner marker */}
                <div
                  aria-hidden
                  className={`absolute right-3 top-3 h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                  style={{ backgroundColor: section.accent, boxShadow: `0 0 0 3px rgba(255,255,255,0.85)` }}
                />
              </div>

              <div className="mt-4 flex items-center gap-2 overflow-hidden">
                <h3
                  className={`font-exhibitions text-lg uppercase transition-all duration-300 ${
                    isActive ? 'tracking-[0.24em]' : 'tracking-[0.14em] group-hover:tracking-[0.24em]'
                  }`}
                  style={{ color: isActive ? section.accent.replace('#', '#') : undefined }}
                >
                  {section.label}
                </h3>
                <span
                  aria-hidden
                  className={`font-exhibitions text-lg transition-all duration-300 ${
                    isActive
                      ? 'translate-x-0 opacity-100'
                      : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                  }`}
                  style={{ color: section.accent }}
                >
                  →
                </span>
              </div>

              <div
                aria-hidden
                className={`mt-1.5 h-[3px] rounded-full transition-all duration-500 ease-out ${
                  isActive ? 'w-full' : 'w-8 group-hover:w-full'
                }`}
                style={{ backgroundColor: section.accent }}
              />

              <p className="mt-3 text-sm italic leading-relaxed text-neutral-600">{description}</p>
            </button>
          )
        })}
      </div>

      <div className="mt-10" role="tabpanel">
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
    </div>
  )
}
