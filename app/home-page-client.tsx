'use client'

import { useEffect, useMemo, useRef, useState, type TouchEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export type GalleryExhibition = {
  _id: string
  title: string
  subtitle?: string
  description?: string
  slug?: { current?: string }
  viewLayout?: 'digitalGallery' | 'whatsOn'
  locationType?: 'portman' | 'aroundSchool' | 'external' | 'digital'
  exhibitorType?: 'student' | 'staffVisiting' | 'other'
  isCurrent?: boolean
  startDate?: string
  endDate?: string
  bgColor?: string
  heroImageUrl?: string | null
  galleryImageUrls?: string[] | null
  guidePdfUrl?: string | null
}

export type HomePageCopy = {
  heroKicker?: string
  heroHeadline?: string
  heroSummary?: string
  currentStripLabel?: string
  currentStripHelp?: string
  whatsOnIntro?: string
}

type HomePageClientProps = {
  exhibitions: GalleryExhibition[]
  pageCopy?: HomePageCopy | null
  heroImageUrl?: string | null
}

const DEFAULT_HERO_SUMMARY =
  'A working gallery space showcasing art and photography from students, guest artists and collaborators across the school year.'

const DEFAULT_CURRENT_STRIP_LABEL = 'CURRENT Digital-only EXHIBITIONS'
const DEFAULT_CURRENT_STRIP_HELP =
  'Online only • Visit the exhibition details for links and media'
const DEFAULT_WHATS_ON_INTRO =
  "Exhibitions, projects and events taking place around the school and in local galleries, including student work shown off site and collaborations with partner organisations. Updated throughout the school year."

export default function HomePageClient({
  exhibitions,
  pageCopy,
  heroImageUrl,
}: HomePageClientProps) {
  const getExhibitionImageUrl = (exhibition?: GalleryExhibition) =>
    exhibition?.heroImageUrl ||
    exhibition?.galleryImageUrls?.find((url): url is string => Boolean(url)) ||
    null

  const [activeExhibitionIndex, setActiveExhibitionIndex] = useState(0)
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)
  const autoAdvanceRef = useRef<number | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const touchDeltaXRef = useRef(0)

  const currentDigitalExhibitions = useMemo(
    () =>
      exhibitions.filter((ex) => {
        if (!ex.isCurrent) return false
        if (ex.viewLayout) return ex.viewLayout === 'digitalGallery'
        return ex.locationType === 'digital'
      }),
    [exhibitions]
  )

  const currentExhibitions = useMemo(
    () => currentDigitalExhibitions.slice(0, 3),
    [currentDigitalExhibitions]
  )

  const activeExhibition =
    currentExhibitions.length > 0
      ? currentExhibitions[Math.min(activeExhibitionIndex, currentExhibitions.length - 1)]
      : undefined
  const activeExhibitionImageUrl = getExhibitionImageUrl(activeExhibition)

  const stripLabel = pageCopy?.currentStripLabel || DEFAULT_CURRENT_STRIP_LABEL
  const stripHelp = pageCopy?.currentStripHelp || DEFAULT_CURRENT_STRIP_HELP

  useEffect(() => {
    // Auto-advance the "current exhibitions" strip
    if (isCarouselPaused) return
    if (currentExhibitions.length <= 1) return

    // Clear any existing timer
    if (autoAdvanceRef.current) {
      window.clearInterval(autoAdvanceRef.current)
      autoAdvanceRef.current = null
    }

    autoAdvanceRef.current = window.setInterval(() => {
      setActiveExhibitionIndex((prev) =>
        prev === currentExhibitions.length - 1 ? 0 : prev + 1
      )
    }, 7000)

    return () => {
      if (autoAdvanceRef.current) {
        window.clearInterval(autoAdvanceRef.current)
        autoAdvanceRef.current = null
      }
    }
  }, [isCarouselPaused, currentExhibitions.length])

  const whatsOnExhibitions = useMemo(
    () =>
      exhibitions
        .filter((ex) => {
          if (ex.viewLayout) return ex.viewLayout === 'whatsOn'
          return ex.locationType !== 'digital'
        })
        .sort((a, b) => {
          const aDate = a.startDate ? new Date(a.startDate).getTime() : 0
          const bDate = b.startDate ? new Date(b.startDate).getTime() : 0
          return bDate - aDate
        }),
    [exhibitions]
  )

  const goToPrevious = () => {
    if (currentExhibitions.length < 2) return
    setActiveExhibitionIndex((prev) =>
      prev === 0 ? currentExhibitions.length - 1 : prev - 1
    )
    setIsCarouselPaused(true)
    window.setTimeout(() => setIsCarouselPaused(false), 9000)
  }

  const goToNext = () => {
    if (currentExhibitions.length < 2) return
    setActiveExhibitionIndex((prev) =>
      prev === currentExhibitions.length - 1 ? 0 : prev + 1
    )
    setIsCarouselPaused(true)
    window.setTimeout(() => setIsCarouselPaused(false), 9000)
  }

  const handleStripTouchStart = (event: TouchEvent<HTMLElement>) => {
    if (currentExhibitions.length < 2) return
    touchStartXRef.current = event.touches[0].clientX
    touchDeltaXRef.current = 0
  }

  const handleStripTouchMove = (event: TouchEvent<HTMLElement>) => {
    if (touchStartXRef.current === null) return
    touchDeltaXRef.current = event.touches[0].clientX - touchStartXRef.current
  }

  const handleStripTouchEnd = () => {
    if (touchStartXRef.current === null) return
    const deltaX = touchDeltaXRef.current
    touchStartXRef.current = null
    touchDeltaXRef.current = 0

    if (Math.abs(deltaX) < 44) return
    if (deltaX < 0) goToNext()
    else goToPrevious()
  }
  return (
    <main className="bg-white text-neutral-900">
      {/* HERO (Tate-style split) */}
      <section className="px-6 pt-10 md:px-12 lg:px-20">
        <div className="grid overflow-hidden border border-neutral-200 md:grid-cols-2">
          {/* Image (left) */}
          <div className="relative min-h-[320px] bg-neutral-100 md:min-h-[560px]">
            {heroImageUrl ? (
              <Image
                src={heroImageUrl}
                alt="Installation view of work in the Portman Gallery"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-200" />
            )}
          </div>

          {/* Text panel (right) */}
          <div className="flex flex-col justify-between bg-black px-8 py-10 text-white md:px-12 md:py-14">
            <div>
              <p className="font-exhibitions text-xs tracking-[0.4em] text-white/70">
                {pageCopy?.heroKicker || 'PORTMAN GALLERY'}
              </p>

              <h1 className="font-exhibitions mt-6 text-4xl font-normal leading-tight tracking-[0.12em] md:text-6xl">
                {pageCopy?.heroHeadline || 'EXHIBITIONS'}
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
                {pageCopy?.heroSummary || DEFAULT_HERO_SUMMARY}
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.26em] text-white/80">
                <span className="font-exhibitions inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2">
                  KS3 &ndash; KS5
                </span>
                <span className="font-exhibitions inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2">
                  Art &amp; Photography
                </span>
                <span className="font-exhibitions inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2">
                  Portman Gallery
                </span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/student"
                className="font-exhibitions inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-xs uppercase tracking-[0.26em] text-black"
              >
                Explore student work <span aria-hidden>→</span>
              </Link>
              <Link
                href="/guest-artists"
                className="font-exhibitions inline-flex items-center justify-center gap-2 border border-white/30 bg-transparent px-5 py-3 text-xs uppercase tracking-[0.26em] text-white"
              >
                Guest artists <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CURRENT EXHIBITIONS STRIP (CAROUSEL) */}
      {currentExhibitions.length ? (
        <section
          style={{ backgroundColor: activeExhibition?.bgColor || '#9EDFE6' }}
          className="relative mt-16 touch-pan-y overflow-hidden border-y border-neutral-200 px-6 py-8 transition-colors duration-500 md:px-12 md:py-10 lg:px-20"
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
          onFocusCapture={() => setIsCarouselPaused(true)}
          onBlurCapture={() => setIsCarouselPaused(false)}
          onTouchStart={handleStripTouchStart}
          onTouchMove={handleStripTouchMove}
          onTouchEnd={handleStripTouchEnd}
        >
          <div
            className={`grid gap-6 md:items-center md:gap-8 ${
              activeExhibitionImageUrl ? 'md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]' : ''
            }`}
          >
            {activeExhibitionImageUrl ? (
              <div className="order-1 md:order-2 relative">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-8 -bottom-20 right-[-38%] hidden w-[180%] rotate-6 halftone-current-exhibitions opacity-95 md:-top-28 md:-bottom-56 md:right-[-52%] md:block md:w-[230%]"
                />
                <div className="relative z-10 grid gap-4 md:grid-cols-2">
                  <div className="relative aspect-[4/3] bg-neutral-200 md:col-span-2">
                    <Image
                      src={activeExhibitionImageUrl}
                      alt={activeExhibition?.title || 'Current exhibition image'}
                      fill
                      sizes="(min-width: 768px) 48vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className={activeExhibitionImageUrl ? 'order-2 md:order-1' : ''}>
              <p className="font-exhibitions text-[10px] tracking-[0.32em] text-neutral-800 sm:text-xs sm:tracking-[0.35em]">
                {stripLabel}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-700 sm:text-[11px] sm:tracking-[0.24em]">
                {stripHelp}
              </p>
              <h2
                aria-live="polite"
                className="font-exhibitions mt-3 text-3xl font-normal leading-tight tracking-[0.12em] text-neutral-900 sm:text-4xl md:mt-4 md:text-5xl"
              >
                {activeExhibition ? activeExhibition.title : 'No current exhibitions'}
              </h2>
            {activeExhibition && (
              <>
                {activeExhibition.subtitle && (
                  <p className="mt-2 text-sm text-neutral-900 md:text-[1.05rem]">
                    {activeExhibition.subtitle}
                  </p>
                )}
                {activeExhibition.description && (
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-900 md:text-base">
                    {activeExhibition.description}
                  </p>
                )}
              </>
            )}

            <div className="mt-6 grid gap-2.5 text-xs sm:grid-cols-2 md:flex md:flex-wrap md:gap-3">
              {activeExhibition?.slug?.current ? (
                <Link
                  href={`/${activeExhibition.slug.current}`}
                  className="font-exhibitions inline-flex min-h-11 w-full items-center justify-center gap-2 bg-black px-5 py-3 text-center text-[11px] uppercase tracking-[0.22em] text-white md:w-auto md:text-xs"
                >
                  View exhibition details
                  <span aria-hidden>→</span>
                </Link>
              ) : (
                <button
                  disabled
                  className="font-exhibitions inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 bg-black/40 px-5 py-3 text-center text-[11px] uppercase tracking-[0.22em] text-white md:w-auto md:text-xs"
                >
                  View exhibition details
                  <span aria-hidden>→</span>
                </button>
              )}

              {activeExhibition?.guidePdfUrl ? (
                <a
                  href={activeExhibition.guidePdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-exhibitions inline-flex min-h-11 w-full items-center justify-center gap-2 border border-neutral-900/30 bg-white/20 px-5 py-3 text-center text-[11px] uppercase tracking-[0.22em] text-neutral-900 md:w-auto md:text-xs"
                >
                  Download exhibition guide
                </a>
              ) : (
                <button
                  disabled
                  className="font-exhibitions inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 border border-neutral-900/20 bg-white/10 px-5 py-3 text-center text-[11px] uppercase tracking-[0.22em] text-neutral-900/50 md:w-auto md:text-xs"
                >
                  Download exhibition guide
                </button>
              )}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.24em] text-neutral-800 md:justify-start">
              <div className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevious}
                  disabled={currentExhibitions.length < 2}
                  className="font-exhibitions inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-900/40 bg-white/35 text-neutral-900 transition hover:bg-neutral-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous exhibition"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  disabled={currentExhibitions.length < 2}
                  className="font-exhibitions inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-900/40 bg-white/35 text-neutral-900 transition hover:bg-neutral-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next exhibition"
                >
                  →
                </button>
              </div>

              <div className="flex items-center gap-2 md:ml-1">
                {currentExhibitions.map((exhibition, index) => (
                  <button
                    key={exhibition._id}
                    type="button"
                    onClick={() => setActiveExhibitionIndex(index)}
                    className={`h-1.5 rounded-full transition ${
                      index === activeExhibitionIndex
                        ? 'w-8 bg-neutral-900'
                        : 'w-5 bg-neutral-300 hover:bg-neutral-500'
                    }`}
                    aria-label={`Go to exhibition ${index + 1}`}
                  />
                ))}
              </div>

              <span className="font-exhibitions inline-flex items-center rounded-full bg-white/55 px-2.5 py-1 text-[10px] tracking-[0.16em] text-neutral-800">
                {currentExhibitions.length
                  ? `${activeExhibitionIndex + 1} / ${currentExhibitions.length}`
                  : '0 / 0'}
              </span>
            </div>

            {currentExhibitions.length > 1 ? (
              <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-neutral-700 md:hidden">
                Swipe left or right to flick through
              </p>
            ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* WHAT'S ON GRID (TATE-STYLE CARDS) */}
      <section className="relative px-6 py-20 md:px-12 lg:px-20">
        {/* Soft halftone texture behind the section */}
        <div className="pointer-events-none absolute inset-0 halftone-soft opacity-35" />

        <div className="relative">
          <header className="mb-12 text-center md:text-left">
            <p className="font-exhibitions text-xs tracking-[0.35em] text-neutral-500">
              WHAT&apos;S ON
            </p>
            <p className="mt-3 max-w-xl text-sm text-neutral-700 md:text-base">
              {pageCopy?.whatsOnIntro || DEFAULT_WHATS_ON_INTRO}
            </p>
          </header>

          <div className="grid gap-10 md:grid-cols-3 items-stretch">
            {whatsOnExhibitions.map((item) => {
              const itemImageUrl = getExhibitionImageUrl(item)
              return (
              <article key={item._id} className="flex flex-col h-full">
                <div className="relative aspect-[4/5] bg-neutral-100">
                  {itemImageUrl ? (
                    <Image
                      src={itemImageUrl}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="mt-4 flex flex-1 flex-col">
                  <p className="font-exhibitions text-[11px] tracking-[0.3em] text-neutral-500">
                    EXHIBITION
                  </p>
                  <h3 className="font-exhibitions mt-2 text-lg font-normal tracking-[0.12em]">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-4 flex flex-col gap-1 text-xs text-neutral-600">
                    {item.locationType && (
                      <p>
                        📍{' '}
                        {item.locationType === 'portman'
                          ? 'Portman Gallery'
                          : item.locationType === 'aroundSchool'
                          ? 'Around the school'
                          : item.locationType === 'external'
                          ? 'External gallery'
                          : 'Digital-only'}
                      </p>
                    )}
                    {item.endDate && (
                      <p>📅 Until {new Date(item.endDate).toLocaleDateString('en-GB')}</p>
                    )}
                  </div>
                  <div className="mt-auto pt-4">
                    {item.slug?.current ? (
                      <Link
                        href={`/${item.slug.current}`}
                        className="font-exhibitions inline-flex w-full items-center justify-center gap-2 border border-neutral-900 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900"
                      >
                        View details
                        <span aria-hidden>→</span>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="font-exhibitions inline-flex w-full cursor-not-allowed items-center justify-center gap-2 border border-neutral-900/40 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900/50"
                      >
                        View details
                        <span aria-hidden>→</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
              )
            })}
            {!whatsOnExhibitions.length ? (
              <p className="md:col-span-3 text-sm text-neutral-600">
                No What&apos;s On exhibitions are published in Sanity yet.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* COLOUR BLOCKS / MEMBERSHIP-STYLE PROMOS */}
      <section className="bg-neutral-50 px-6 py-20 md:px-12 lg:px-20">
        <div className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="flex flex-col justify-between bg-[#8CC1B2] px-8 py-10 text-white">
            <div>
              <p className="font-exhibitions text-xs tracking-[0.36em]">
                PORTMAN GALLERY
              </p>
              <h2 className="font-exhibitions mt-4 text-2xl font-normal tracking-[0.16em]">
                A WORLD OF STUDENT ART
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed">
                Regular shows of work from across Morpeth School. Bring families, friends or
                collaborators to see what students are making.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              <Link
                href="/about"
                className="font-exhibitions inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-xs uppercase tracking-[0.26em] text-neutral-900"
              >
                About the gallery
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-rows-2">
            <div className="flex flex-col justify-between bg-[#E89AB5] px-8 py-8 text-white">
              <div>
                <p className="font-exhibitions text-xs tracking-[0.36em]">
                  AFTER-SCHOOL
                </p>
                <h3 className="font-exhibitions mt-3 text-lg font-normal tracking-[0.14em]">
                  Clubs &amp; studios
                </h3>
                <p className="mt-3 text-sm leading-relaxed">
                  Life drawing, darkroom sessions and portfolio support run throughout the week.
                </p>
              </div>
              <Link
                href="/clubs"
                className="font-exhibitions mt-4 inline-flex w-fit items-center justify-center gap-2 bg-black px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-white"
              >
                Explore clubs
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="flex flex-col justify-between bg-neutral-900 px-8 py-8 text-white">
              <div>
                <p className="font-exhibitions text-xs tracking-[0.36em] text-neutral-300">
                  SIXTH FORM
                </p>
                <h3 className="font-exhibitions mt-3 text-lg font-normal tracking-[0.14em]">
                  Art &amp; Photography
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-200">
                  A level students exhibit every year in the Portman Gallery, building portfolios
                  for art school, apprenticeships and creative careers.
                </p>
              </div>
              <button
                type="button"
                disabled
                className="font-exhibitions mt-4 inline-flex w-fit cursor-not-allowed items-center justify-center gap-2 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900/70"
                aria-disabled="true"
              >
                Sixth Form information
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER INFO / SUPPORT */}
      <section className="relative border-t border-neutral-200 bg-[#9EDFE6] px-6 py-20 md:px-12 lg:px-20">
        {/* Soft halftone band behind heading */}
        <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-32 max-w-3xl halftone-soft opacity-35" />
        <div className="mx-auto max-w-5xl">
          <h2 className="font-exhibitions text-center text-4xl font-normal leading-tight tracking-[0.12em] text-neutral-900 md:text-6xl">
            SUPPORT THE GALLERY
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-neutral-700">
            The Portman Gallery is Morpeth School&apos;s dedicated exhibition space. Shows change
            throughout the year and are open to students, families and visitors by arrangement.
            For visit enquiries, or to find out how you can support our programme, please contact
            the school office or the Art &amp; Photography department.
          </p>

          <div className="mt-12 grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {/* Text band (left) */}
            <div className="flex flex-col justify-between px-8 py-10 text-neutral-900 md:px-10 md:py-12">
              <div>
                <p className="font-exhibitions text-xs tracking-[0.36em] text-neutral-800">
                  SUPPORT
                </p>
                <h3 className="font-exhibitions mt-4 text-2xl font-normal tracking-[0.16em]">
                  Help the Portman Gallery grow
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-800">
                  Sales of books and prints, donations and partnerships help us fund new shows,
                  commission projects and provide opportunities for young people at Morpeth.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-xs">
                <Link
                  href="/support"
                  className="font-exhibitions inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-xs uppercase tracking-[0.26em] text-white"
                >
                  Get in touch
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            {/* Image band (right) */}
            <div className="relative min-h-[260px] md:min-h-[320px]">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt="Installation view in the Portman Gallery"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-200" />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
