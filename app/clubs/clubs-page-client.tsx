'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Club = {
  id: string
  title: string
  strand: string
  format: string
  day: string
  time: string
  location: string
  poster: {
    kicker: string
    headline: string
    subline: string
  }
  posterImageUrl?: string
  posterImageAlt?: string
  summary: string
  whatYoullDo: string[]
  goodFor: string[]
  kit: string[]
  signup: string
  ctaLabel: string
  accent?: string
}

type SanityClub = {
  _key?: string
  title?: string
  strand?: string
  format?: string
  day?: string
  time?: string
  location?: string
  poster?: {
    kicker?: string
    headline?: string
    subline?: string
  }
  posterImageUrl?: string
  posterImageAlt?: string
  summary?: string
  whatYoullDo?: string[]
  goodFor?: string[]
  kit?: string[]
  signup?: string
  ctaLabel?: string
  accent?: string
}

export type ClubsPageData = {
  title?: string
  kicker?: string
  headline?: string
  intro?: string
  heroImageUrl?: string
  heroImageAlt?: string
  heroPanelColor?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaHref?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaHref?: string
  badges?: string[]
  note?: string
  clubsSectionTitle?: string
  clubs?: SanityClub[]
  faqTitle?: string
  faqItems?: FaqItem[]
}

type FaqItem = {
  question: string
  answer: string
}

function normalizeText(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed || fallback
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
}

const CLUBS: Club[] = [
  {
    id: 'darkroom-film-lab',
    title: 'Darkroom & Film Lab',
    strand: 'Photography',
    format: 'After school',
    day: 'Tuesdays',
    time: '3:30–5:00pm',
    location: 'Portman Gallery (Darkroom)',
    poster: {
      kicker: 'AFTER SCHOOL • PHOTOGRAPHY',
      headline: 'DARKROOM',
      subline: 'Shoot • Develop • Print',
    },
    summary:
      'Hands-on analogue photography: load film, develop negatives, and make your first silver-gelatin prints.',
    whatYoullDo: [
      'Learn how to use 35mm cameras safely and confidently',
      'Develop black & white film (with supervision)',
      'Create contact sheets + final prints you can exhibit',
      'Experiment with photograms + chemigrams',
    ],
    goodFor: ['Beginners welcome', 'GCSE / A level support', 'Anyone who likes making things'],
    kit: ['We provide: film (limited), paper, chemicals', 'Bring: enthusiasm + a steady hand', 'Optional: your own 35mm camera'],
    signup: 'Sign-up',
    ctaLabel: 'More info',
    accent: '#E7F0FF',
  },
]

const DEFAULT_FAQ: FaqItem[] = [
  {
    question: 'Do I need experience?',
    answer:
      "Nope. These are designed for complete beginners and confident makers. You'll get prompts, quick demos, and help as you go.",
  },
  {
    question: "What if I don't have a camera?",
    answer:
      'A phone is perfect. We also have limited kit available for certain sessions. We can rotate equipment fairly so everyone gets a go.',
  },
  {
    question: 'Can my work go in an exhibition?',
    answer:
      "Yes — that's the point. We'll do regular selections for the digital gallery and occasional print walls in school.",
  },
]

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

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-4 text-sm">
      <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
        {label}
      </div>
      <div className="text-neutral-900">{value}</div>
    </div>
  )
}


export default function ClubsPageClient({
  initialPageData,
}: {
  initialPageData: ClubsPageData | null
}) {
  const [activeClub, setActiveClub] = useState<Club | null>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const pageData = initialPageData

  useEffect(() => {
    if (!activeClub) return

    const previousOverflow = document.body.style.overflow
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveClub(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [activeClub])

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
  const faqItems = (pageData?.faqItems || []).filter(
    (item): item is FaqItem => Boolean(item?.question?.trim()) && Boolean(item?.answer?.trim())
  )
  const clubsFromSanity: Club[] = (pageData?.clubs || [])
    .filter((club) => club?.title?.trim())
    .map((club, index) => {
      const fallbackId = `club-${index + 1}`
      const title = normalizeText(club.title, `Club ${index + 1}`)
      const posterKicker = normalizeText(club.poster?.kicker, 'PORTMAN GALLERY')
      const posterHeadline = normalizeText(club.poster?.headline, title.toUpperCase())
      const posterSubline = normalizeText(club.poster?.subline, 'Create • Learn • Share')
      const whatYoullDo = normalizeStringArray(club.whatYoullDo)
      const goodFor = normalizeStringArray(club.goodFor)
      const kit = normalizeStringArray(club.kit)
      const summary = normalizeText(club.summary, 'Details coming soon.')

      return {
        id: normalizeText(club._key, fallbackId),
        title,
        strand: normalizeText(club.strand, 'Mixed media'),
        format: normalizeText(club.format, 'Lunchtime'),
        day: normalizeText(club.day, 'TBC'),
        time: normalizeText(club.time, 'TBC'),
        location: normalizeText(club.location, 'TBC'),
        poster: {
          kicker: posterKicker,
          headline: posterHeadline,
          subline: posterSubline,
        },
        posterImageUrl: normalizeText(club.posterImageUrl) || undefined,
        posterImageAlt: normalizeText(club.posterImageAlt) || undefined,
        summary,
        whatYoullDo,
        goodFor,
        kit,
        signup: normalizeText(club.signup, 'Drop-in'),
        ctaLabel: normalizeText(club.ctaLabel, 'More info'),
        accent: normalizeText(club.accent) || undefined,
      }
    })
  const clubsToShow = clubsFromSanity.length ? clubsFromSanity : CLUBS
  const faqToShow = faqItems.length ? faqItems : DEFAULT_FAQ

  return (
    <main className="relative min-h-screen bg-white text-neutral-900 px-6 py-16 md:px-10 lg:px-20">
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
                  {heroPrimaryCtaLabel} <span aria-hidden className="text-xl leading-none">→</span>
                </Link>
                <Link
                  href={heroSecondaryCtaHref}
                  className="font-exhibitions inline-flex items-center gap-3 border border-neutral-900 px-7 py-3 text-xs uppercase tracking-[0.18em] text-neutral-900"
                >
                  {heroSecondaryCtaLabel} <span aria-hidden className="text-xl leading-none">→</span>
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
              <p className="text-xs text-neutral-600">
              </p>
            </div>
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
                    <button
                      type="button"
                      onClick={() => setActiveClub(club)}
                      className="font-exhibitions inline-flex items-center gap-2 border border-neutral-900 px-3 py-2 text-[10px] uppercase tracking-[0.26em] text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white"
                    >
                      {club.ctaLabel}
                      <span aria-hidden>→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {activeClub && (
              <div
                className="fixed inset-0 z-[120] bg-black/60"
                onClick={() => setActiveClub(null)}
              >
                <div
                  className="absolute inset-0 bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setActiveClub(null)}
                    className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-400 bg-white text-sm leading-none text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveClub(null)}
                    className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-2 text-xs uppercase tracking-[0.2em] text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                  >
                    ← Back
                  </button>

                  <article className="grid h-full overflow-y-auto pt-20 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:pt-0">
                    <div className="border-b border-neutral-200 md:border-b-0 md:border-r md:min-h-full">
                      <Poster club={activeClub} />
                    </div>
                    <div className="relative p-6 pb-12 md:p-10 md:pb-16">
                      <div className="relative">
                        <h3 className="font-exhibitions text-lg tracking-[0.12em] text-neutral-900">
                          {activeClub.title}
                        </h3>

                        <div className="mt-4 grid gap-3">
                          <MetaRow label="When" value={`${activeClub.day} • ${activeClub.time}`} />
                          <MetaRow label="Where" value={activeClub.location} />
                          <MetaRow
                            label="Type"
                            value={`${activeClub.format} • ${activeClub.strand}`}
                          />
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-neutral-800">
                          {activeClub.summary}
                        </p>

                        <div className="mt-5">
                          <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                            You&apos;ll do
                          </div>
                          {activeClub.whatYoullDo.length ? (
                            <ul className="mt-2 list-disc pl-5 text-sm text-neutral-800">
                              {activeClub.whatYoullDo.map((x) => (
                                <li key={x}>{x}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-sm text-neutral-700">Details coming soon.</p>
                          )}
                        </div>

                        <div className="mt-5 grid gap-5">
                          <div>
                            <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                              Good for
                            </div>
                            {activeClub.goodFor.length ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {activeClub.goodFor.map((x) => (
                                  <span
                                    key={x}
                                    className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-800"
                                  >
                                    {x}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="mt-2 text-sm text-neutral-700">Details coming soon.</p>
                            )}
                          </div>

                          <div>
                            <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                              Kit
                            </div>
                            {activeClub.kit.length ? (
                              <ul className="mt-2 list-disc pl-5 text-sm text-neutral-800">
                                {activeClub.kit.map((x) => (
                                  <li key={x}>{x}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-2 text-sm text-neutral-700">Details coming soon.</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                          <Badge>{activeClub.signup}</Badge>
                          <Badge>{activeClub.day}</Badge>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            )}
          </div>
        </section>

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

      </div>
    </main>
  )
}
