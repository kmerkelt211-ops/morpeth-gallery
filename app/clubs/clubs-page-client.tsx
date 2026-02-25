'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Club, ClubsPageData } from '../../lib/clubs'
import { mapFaqItems, mapSanityClubs } from '../../lib/clubs'

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-exhibitions inline-flex items-center rounded-full border border-neutral-900 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-neutral-900">
      {children}
    </span>
  )
}

function Poster({ club }: { club: Club }) {
  return (
    <div className="flex h-full flex-col bg-white p-6">
      {club.posterImageUrl ? (
        <div className="relative mb-4 h-44 w-full overflow-hidden border border-neutral-200 bg-neutral-100">
          <Image
            src={club.posterImageUrl}
            alt={club.posterImageAlt || `${club.title} poster`}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-700">
        {club.poster.kicker}
      </div>

      <div className="mt-5">
        <div className="font-exhibitions text-2xl tracking-[0.14em] text-neutral-900 md:text-3xl">
          {club.poster.headline}
        </div>
        <div className="mt-2 text-sm font-medium text-neutral-800">{club.poster.subline}</div>
      </div>
    </div>
  )
}

export default function ClubsPageClient({
  initialPageData,
}: {
  initialPageData: ClubsPageData | null
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const pageData = initialPageData

  const pageTitle = pageData?.title || 'Clubs • Art + Photography'
  const pageKicker = pageData?.kicker || 'CLUBS & STUDIOS'
  const pageHeadline =
    pageData?.headline || 'Lunchtime & After-School Art + Photography'
  const pageIntro =
    pageData?.intro ||
    'A practical, welcoming set of creative clubs — from darkroom printing to portrait studio sessions. Built to feed directly into exhibitions: print walls, digital displays, and the school gallery programme.'
  const heroImageSrc = pageData?.heroImageUrl || '/gallery%20snapshots/T16313_10.jpg'
  const heroImageAlt = pageData?.heroImageAlt || 'Exhibition image for clubs hero'
  const heroPanelColor = pageData?.heroPanelColor || '#f1df23'
  const heroPrimaryCtaLabel = pageData?.heroPrimaryCtaLabel || 'View clubs'
  const heroPrimaryCtaHref = pageData?.heroPrimaryCtaHref || '#whats-running'
  const heroSecondaryCtaLabel = pageData?.heroSecondaryCtaLabel || 'Club FAQ'
  const heroSecondaryCtaHref = pageData?.heroSecondaryCtaHref || '#faq'
  const badges = (pageData?.badges || []).filter((item) => item?.trim())
  const note = pageData?.note?.trim()
  const clubsSectionTitle = pageData?.clubsSectionTitle || "WHAT'S RUNNING"
  const faqTitle = pageData?.faqTitle || 'FAQ'
  const clubsToShow = mapSanityClubs(pageData)
  const faqToShow = mapFaqItems(pageData)

  return (
    <main className="relative min-h-screen bg-white px-6 py-16 text-neutral-900 md:px-10 lg:px-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 halftone-soft opacity-20"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-end gap-4">
          <span className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
            {pageTitle}
          </span>
        </div>

        <header className="-mx-6 overflow-hidden border-y border-neutral-200 bg-white md:-mx-10 lg:-mx-20">
          <div className="grid md:min-h-[460px] md:grid-cols-2">
            <div className="relative min-h-[300px] bg-neutral-900 md:min-h-full">
              <Image
                src={heroImageSrc}
                alt={heroImageAlt}
                fill
                priority
                sizes="(min-width: 1280px) 50vw, (min-width: 768px) 52vw, 100vw"
                className="object-cover"
              />
            </div>

            <div
              className="flex flex-col justify-center px-7 py-10 md:px-14 md:py-12 lg:px-16"
              style={{ backgroundColor: heroPanelColor }}
            >
              <p className="font-exhibitions text-[11px] uppercase tracking-[0.22em] text-neutral-900">
                {pageKicker}
              </p>

              <h1 className="font-exhibitions mt-5 text-4xl uppercase tracking-[0.07em] text-neutral-900 md:text-6xl md:leading-[1.02]">
                {pageHeadline}
              </h1>

              <p className="mt-7 max-w-xl text-base leading-relaxed text-neutral-900 md:text-lg">
                {pageIntro}
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href={heroPrimaryCtaHref}
                  className="font-exhibitions inline-flex items-center gap-3 bg-black px-7 py-3 text-xs uppercase tracking-[0.18em] text-white"
                >
                  {heroPrimaryCtaLabel}{' '}
                  <span aria-hidden className="text-xl leading-none">
                    →
                  </span>
                </Link>
                <Link
                  href={heroSecondaryCtaHref}
                  className="font-exhibitions inline-flex items-center gap-3 border border-neutral-900 px-7 py-3 text-xs uppercase tracking-[0.18em] text-neutral-900"
                >
                  {heroSecondaryCtaLabel}{' '}
                  <span aria-hidden className="text-xl leading-none">
                    →
                  </span>
                </Link>
              </div>

              {badges.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <Badge key={badge}>{badge}</Badge>
                  ))}
                </div>
              ) : null}
              {note ? <p className="mt-4 text-xs leading-relaxed text-neutral-800">{note}</p> : null}
            </div>
          </div>
        </header>

        <section id="whats-running" className="relative mt-16">
          <div className="relative">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-exhibitions text-xs tracking-[0.35em] text-neutral-700">
                {clubsSectionTitle}
              </h2>
            </div>

            {clubsToShow.length ? (
              <div className="grid gap-8 md:grid-cols-3">
                {clubsToShow.map((club) => (
                  <article
                    key={club.id}
                    className="group flex flex-col border border-neutral-200 bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)]"
                  >
                    <div className="border-b border-neutral-200 bg-white">
                      <Poster club={club} />
                    </div>

                    <div className="flex items-center justify-between px-5 py-4">
                      <h3 className="font-exhibitions text-sm tracking-[0.16em] text-neutral-900 md:text-base">
                        {club.title}
                      </h3>
                      <Link
                        href={`/clubs/${club.slug}`}
                        className="font-exhibitions inline-flex items-center gap-2 border border-neutral-900 px-3 py-2 text-[10px] uppercase tracking-[0.26em] text-neutral-900 transition group-hover:bg-neutral-900 group-hover:text-white"
                      >
                        {club.ctaLabel}
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-neutral-300 bg-white p-8 text-sm text-neutral-700">
                No clubs are published yet.
              </div>
            )}
          </div>
        </section>

        {faqToShow.length ? (
          <section id="faq" className="mt-16 border-t border-neutral-200 pt-12">
            <h2 className="font-exhibitions text-xs tracking-[0.35em] text-neutral-700">
              {faqTitle}
            </h2>

            <div className="mt-6 grid gap-8 md:grid-cols-3">
              {faqToShow.map((item, index) => {
                const panelId = `faq-answer-${index}`
                const isOpen = openFaqIndex === index

                return (
                  <div key={item.question} className="border border-neutral-200 bg-white p-6">
                    <div className="md:hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="w-full text-left"
                      >
                        <span className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                          {item.question}
                        </span>
                      </button>

                      <p
                        id={panelId}
                        className={`pt-3 text-sm leading-relaxed text-neutral-800 ${isOpen ? 'block' : 'hidden'}`}
                      >
                        {item.answer}
                      </p>
                    </div>

                    <div className="hidden md:block">
                      <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                        {item.question}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-neutral-800">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
