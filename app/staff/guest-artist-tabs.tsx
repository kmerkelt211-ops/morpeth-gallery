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
    fallbackDescription: 'Artists who come to Portman Gallery to show their work and share their practice with students.',
  },
  {
    key: 'welcoming',
    label: 'Welcoming',
    fallbackDescription: "Students visit an artist, view their work, or have their own work displayed alongside it.",
  },
  {
    key: 'projects',
    label: 'Projects',
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
      <div className="grid gap-6 sm:grid-cols-3" role="tablist" aria-label="Guest artist categories">
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
              className="group text-left"
            >
              <div
                className={`relative aspect-[4/3] overflow-hidden bg-neutral-200 transition-all duration-300 ${
                  isActive
                    ? 'ring-2 ring-neutral-900 ring-offset-2'
                    : 'opacity-70 group-hover:opacity-100'
                }`}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={card?.alt || `${section.label} category image`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className={`object-cover transition-transform duration-500 ${
                      isActive ? 'scale-105' : 'group-hover:scale-105'
                    }`}
                  />
                ) : null}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'
                  }`}
                />
              </div>
              <h3 className="font-exhibitions mt-4 text-lg uppercase tracking-[0.14em] text-neutral-900">
                {section.label}
              </h3>
              <p className="mt-2 text-sm italic leading-relaxed text-neutral-600">{description}</p>
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
