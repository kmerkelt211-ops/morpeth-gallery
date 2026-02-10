'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type Club = {
  id: string
  title: string
  strand: 'Photography' | 'Art' | 'Mixed media'
  format: 'Lunchtime' | 'After school'
  day: string
  time: string
  location: string
  poster: {
    kicker: string
    headline: string
    subline: string
  }
  summary: string
  whatYoullDo: string[]
  goodFor: string[]
  kit: string[]
  signup: 'Drop-in' | 'Sign-up'
  accent: string
}

export type ClubsPageData = {
  title?: string
  kicker?: string
  headline?: string
  intro?: string
  badges?: string[]
  note?: string
}

type FaqItem = {
  question: string
  answer: string
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
    accent: '#E7F0FF',
  },
  {
    id: 'portrait-studio-lunch',
    title: 'Portrait Studio',
    strand: 'Photography',
    format: 'Lunchtime',
    day: 'Thursdays',
    time: '12:45–1:25pm',
    location: 'Studio Space (Room A1)',
    poster: {
      kicker: 'LUNCHTIME • PHOTO STUDIO',
      headline: 'PORTRAITS',
      subline: 'Light • Pose • Story',
    },
    summary:
      'Fast, fun studio sessions: lighting basics, backgrounds, and portrait series that look properly professional.',
    whatYoullDo: [
      'Try softbox + reflector lighting (no scary jargon)',
      'Direct a subject and build confidence behind the camera',
      'Edit a mini series ready for Instagram + the gallery wall',
    ],
    goodFor: ['Anyone who wants to build confidence', 'Students who love people & storytelling', 'Year 7–13'],
    kit: ['We provide: lights, backdrops, cameras (limited)', 'Bring: a friend to model (optional)', 'Optional: your own camera/phone'],
    signup: 'Drop-in',
    accent: '#F3D7E6',
  },
  {
    id: 'street-photo-walks',
    title: 'Street Photography Walks',
    strand: 'Photography',
    format: 'After school',
    day: 'Fridays',
    time: '3:30–5:00pm',
    location: 'Meet: School Reception',
    poster: {
      kicker: 'AFTER SCHOOL • OUT & ABOUT',
      headline: 'STREET',
      subline: 'Observe • Capture • Curate',
    },
    summary:
      'Short guided walks around Bethnal Green to build an eye for light, moments, and composition.',
    whatYoullDo: [
      'Practice framing + composition with quick prompts',
      'Learn respectful street photography (confidence + care)',
      'Make a weekly “best 10” edit for the digital exhibition',
    ],
    goodFor: ['Students who like exploring', 'Anyone building a portfolio', 'People who want creative headspace'],
    kit: ['Bring: a phone or camera', 'Wear: comfy shoes', 'We provide: photo prompts + editing workflow'],
    signup: 'Drop-in',
    accent: '#E6F5ED',
  },
  {
    id: 'zine-lab',
    title: 'Zine & Print Lab',
    strand: 'Mixed media',
    format: 'Lunchtime',
    day: 'Tuesdays',
    time: '12:45–1:25pm',
    location: 'Art Room 2',
    poster: {
      kicker: 'LUNCHTIME • MAKE A ZINE',
      headline: 'ZINE LAB',
      subline: 'Cut • Paste • Print',
    },
    summary:
      'Make small publications: collage, drawing, photo, typography — then fold, staple, and swap.',
    whatYoullDo: [
      'Create a mini zine each half-term (themes + prompts)',
      'Try collage, photo transfers, and type layouts',
      'Print and trade — and submit to the gallery shop display',
    ],
    goodFor: ['Quiet makers', 'Big ideas people', 'Anyone who loves stickers and scissors'],
    kit: ['We provide: paper, glue, staples, scrap materials', 'Bring: images you want to use (optional)', 'Optional: a favourite pen'],
    signup: 'Drop-in',
    accent: '#FFF1D6',
  },
  {
    id: 'digital-collage',
    title: 'Digital Collage & Editing',
    strand: 'Art',
    format: 'After school',
    day: 'Wednesdays',
    time: '3:30–5:00pm',
    location: 'ICT Suite 3',
    poster: {
      kicker: 'AFTER SCHOOL • DIGITAL ART',
      headline: 'COLLAGE',
      subline: 'Layers • Texture • Mood',
    },
    summary:
      'A chill creative session using Photoshop / Photopea-style tools to build bold poster art and photo edits.',
    whatYoullDo: [
      'Learn layers, masks, and “how to make it look good”',
      'Build a poster for a real school event or exhibition',
      'Create a final export ready for printing or digital screens',
    ],
    goodFor: ['Students who like design', 'Photography editors', 'Anyone who likes experimenting'],
    kit: ['We provide: computers + files', 'Bring: your images (optional)', 'Optional: headphones for focus'],
    signup: 'Sign-up',
    accent: '#ECE6FF',
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

  const pageTitle = pageData?.title || 'Clubs • Art + Photography'
  const pageKicker = pageData?.kicker || 'CLUBS & STUDIOS'
  const pageHeadline =
    pageData?.headline || 'Lunchtime & After-School Art + Photography'
  const pageIntro =
    pageData?.intro ||
    'A practical, welcoming set of creative clubs — from darkroom printing to portrait studio sessions. Built to feed directly into exhibitions: print walls, digital displays, and the school gallery programme.'
  const heroImageSrc = '/gallery%20snapshots/T16313_10.jpg'

  return (
    <main className="relative min-h-screen bg-white text-neutral-900 px-6 py-16 md:px-10 lg:px-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 halftone-soft opacity-20"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-exhibitions inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-neutral-800"
          >
            ← Back to exhibitions
          </Link>
          <span className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
            {pageTitle}
          </span>
        </div>

        <header className="-mx-6 overflow-hidden border-y border-neutral-200 bg-white md:-mx-10 lg:-mx-20">
          <div className="grid md:min-h-[460px] md:grid-cols-2">
            <div className="relative min-h-[300px] bg-neutral-900 md:min-h-full">
              <Image
                src={heroImageSrc}
                alt="Exhibition image for clubs hero"
                fill
                priority
                sizes="(min-width: 1280px) 50vw, (min-width: 768px) 52vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center bg-[#f1df23] px-7 py-10 md:px-14 md:py-12 lg:px-16">
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
                  href="#whats-running"
                  className="font-exhibitions inline-flex items-center gap-3 bg-black px-7 py-3 text-xs uppercase tracking-[0.18em] text-white"
                >
                  View clubs <span aria-hidden className="text-xl leading-none">→</span>
                </Link>
                <Link
                  href="#faq"
                  className="font-exhibitions inline-flex items-center gap-3 border border-neutral-900 px-7 py-3 text-xs uppercase tracking-[0.18em] text-neutral-900"
                >
                  Club FAQ <span aria-hidden className="text-xl leading-none">→</span>
                </Link>
              </div>

            </div>
          </div>
        </header>

        <section id="whats-running" className="relative mt-16">
          <div className="relative">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-exhibitions text-xs tracking-[0.35em] text-neutral-700">
                WHAT&apos;S RUNNING
              </h2>
              <p className="text-xs text-neutral-600">
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {CLUBS.map((club) => (
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
                      More info
                      <span aria-hidden>→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {activeClub && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10"
                onClick={() => setActiveClub(null)}
              >
                <div
                  className="relative max-h-full w-full max-w-5xl overflow-y-auto border border-neutral-900 bg-white shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setActiveClub(null)}
                    className="absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-400 bg-white/95 text-sm leading-none text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                    aria-label="Close"
                  >
                    ×
                  </button>

                  <article className="mt-10 grid gap-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div className="border-b border-neutral-200 md:border-b-0 md:border-r">
                      <Poster club={activeClub} />
                    </div>
                    <div className="relative p-6">
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
                          <ul className="mt-2 list-disc pl-5 text-sm text-neutral-800">
                            {activeClub.whatYoullDo.map((x) => (
                              <li key={x}>{x}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-5 grid gap-5">
                          <div>
                            <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                              Good for
                            </div>
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
                          </div>

                          <div>
                            <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                              Kit
                            </div>
                            <ul className="mt-2 list-disc pl-5 text-sm text-neutral-800">
                              {activeClub.kit.map((x) => (
                                <li key={x}>{x}</li>
                              ))}
                            </ul>
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
            FAQ
          </h2>

          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {DEFAULT_FAQ.map((item, index) => {
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

        <div className="mt-16">
          <Link
            href="/"
            className="font-exhibitions inline-flex items-center gap-2 border border-neutral-900 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900"
          >
            ← Back to exhibitions
          </Link>
        </div>
      </div>
    </main>
  )
}
