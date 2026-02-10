'use client'

import { useState } from 'react'

type QuickFact = { label?: string; value?: string }
type CommunityLink = { label?: string; url?: string }

type AboutInfoPanelsProps = {
  quickFacts: QuickFact[]
  pastExhibitions: string[]
  futurePlans: string[]
  communityLinks: CommunityLink[]
}

type PanelKey = 'quick-facts' | 'past-exhibitions' | 'future-plans' | 'community-links'

export default function AboutInfoPanels({
  quickFacts,
  pastExhibitions,
  futurePlans,
  communityLinks,
}: AboutInfoPanelsProps) {
  const [openPanel, setOpenPanel] = useState<PanelKey | null>(null)

  const isOpen = (key: PanelKey) => openPanel === key

  return (
    <aside className="space-y-8 lg:self-start lg:pt-1">
      <section className="border border-neutral-200 bg-white">
        <button
          type="button"
          onClick={() => setOpenPanel(isOpen('quick-facts') ? null : 'quick-facts')}
          aria-expanded={isOpen('quick-facts')}
          className="w-full p-6 text-left md:hidden"
        >
          <h2 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">QUICK FACTS</h2>
        </button>
        <div className="hidden p-6 md:block">
          <h2 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600 md:text-[11px] md:tracking-[0.22em]">QUICK FACTS</h2>
        </div>
        <div className={`px-6 pb-6 md:-mt-1 md:pb-4 ${isOpen('quick-facts') ? 'block md:block' : 'hidden md:block'}`}>
          {quickFacts.length ? (
            <dl className="space-y-3 text-sm text-neutral-800 md:space-y-2.5">
              {quickFacts.map((f, idx) => (
                <div key={idx} className="grid grid-cols-[auto_1fr] gap-x-3 md:grid-cols-[11.5rem_minmax(0,1fr)] md:items-center md:gap-x-5">
                  <dt className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600 md:text-[11px] md:tracking-[0.22em]">
                    {f.label}
                  </dt>
                  <dd className="min-w-0 leading-relaxed md:m-0">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>

      <section className="border border-neutral-200 bg-white">
        <button
          type="button"
          onClick={() => setOpenPanel(isOpen('past-exhibitions') ? null : 'past-exhibitions')}
          aria-expanded={isOpen('past-exhibitions')}
          className="w-full p-6 text-left md:hidden"
        >
          <h2 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">PAST EXHIBITIONS</h2>
        </button>
        <div className="hidden p-6 md:block">
          <h2 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600 md:text-[11px] md:tracking-[0.22em]">PAST EXHIBITIONS</h2>
        </div>
        <div className={`px-6 pb-6 md:-mt-1 md:pb-4 ${isOpen('past-exhibitions') ? 'block md:block' : 'hidden md:block'}`}>
          <ul className="space-y-2 text-sm text-neutral-800 md:space-y-1.5 md:text-[1.04rem] md:leading-relaxed">
            {pastExhibitions.length ? pastExhibitions.map((item, idx) => <li key={idx}>{item}</li>) : null}
          </ul>
        </div>
      </section>

      <section className="border border-neutral-200 bg-white">
        <button
          type="button"
          onClick={() => setOpenPanel(isOpen('future-plans') ? null : 'future-plans')}
          aria-expanded={isOpen('future-plans')}
          className="w-full p-6 text-left md:hidden"
        >
          <h2 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">FUTURE / IN DEVELOPMENT</h2>
        </button>
        <div className="hidden p-6 md:block">
          <h2 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600 md:text-[11px] md:tracking-[0.22em]">FUTURE / IN DEVELOPMENT</h2>
        </div>
        <div className={`px-6 pb-6 md:-mt-1 md:pb-4 ${isOpen('future-plans') ? 'block md:block' : 'hidden md:block'}`}>
          <ul className="space-y-2 text-sm text-neutral-800 md:space-y-1.5 md:text-[1.04rem] md:leading-relaxed">
            {futurePlans.length ? futurePlans.map((item, idx) => <li key={idx}>{item}</li>) : null}
          </ul>
        </div>
      </section>

      <section className="border border-neutral-200 bg-white">
        <button
          type="button"
          onClick={() => setOpenPanel(isOpen('community-links') ? null : 'community-links')}
          aria-expanded={isOpen('community-links')}
          className="w-full p-6 text-left md:hidden"
        >
          <h2 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">COMMUNITY LINKS</h2>
        </button>
        <div className="hidden p-6 md:block">
          <h2 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600 md:text-[11px] md:tracking-[0.22em]">COMMUNITY LINKS</h2>
        </div>
        <div className={`px-6 pb-6 md:-mt-1 md:pb-4 ${isOpen('community-links') ? 'block md:block' : 'hidden md:block'}`}>
          <ul className="space-y-2 text-sm text-neutral-800 md:space-y-1.5 md:text-[1.04rem] md:leading-relaxed">
            {communityLinks.length
              ? communityLinks.map((item, idx) => (
                  <li key={idx}>
                    <a className="underline" href={item.url} target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  </li>
                ))
              : null}
          </ul>
        </div>
      </section>
    </aside>
  )
}
