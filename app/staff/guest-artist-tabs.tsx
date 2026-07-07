'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import RevealOnScroll from '../components/reveal-on-scroll'
import type { ExhibitionCard } from '../../sanity/lib/exhibition-card'

const GUEST_ARTIST_SECTIONS = [
  { key: 'visiting', label: 'Visiting' },
  { key: 'welcoming', label: 'Welcoming' },
  { key: 'projects', label: 'Projects' },
] as const

type SectionKey = (typeof GUEST_ARTIST_SECTIONS)[number]['key']

export default function GuestArtistTabs({ items }: { items: ExhibitionCard[] }) {
  const [activeKey, setActiveKey] = useState<SectionKey>('visiting')

  const activeItems = items.filter((ex) => (ex.guestArtistCategory || 'visiting') === activeKey)

  return (
    <div className="mb-16">
      <div className="flex flex-wrap gap-3" role="tablist" aria-label="Guest artist categories">
        {GUEST_ARTIST_SECTIONS.map((section) => {
          const isActive = section.key === activeKey
          return (
            <button
              key={section.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveKey(section.key)}
              className={`font-exhibitions inline-flex items-center gap-2 border px-5 py-3 text-[11px] uppercase tracking-[0.24em] transition ${
                isActive
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500'
              }`}
            >
              {section.label}
            </button>
          )
        })}
      </div>

      <div className="mt-8" role="tabpanel">
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
