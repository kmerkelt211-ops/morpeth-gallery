import client from '../../sanity/lib/client'
import Image from 'next/image'
import Link from 'next/link'
import { groq } from 'next-sanity'
import { randomInt } from 'node:crypto'
import RevealOnScroll from '../components/reveal-on-scroll'
import { exhibitionCardProjection, type ExhibitionCard } from '../../sanity/lib/exhibition-card'
import { IMAGE_PARAMS } from '../../sanity/lib/image'

export const revalidate = 60

type AlumniSpotlight = {
  imageUrl?: string
  alt?: string
  name?: string
  graduationYear?: number
  currentPursuit?: string
  quote?: string
  portfolioUrl?: string
  instagramHandle?: string
}

type RelatedLinkCard = {
  title?: string
  body?: string
  linkLabel?: string
  linkHref?: string
}

type AlumniPageCopy = {
  title?: string
  kicker?: string
  headline?: string
  intro?: string
  heroBandColor?: string
  heroImageOverride?: {
    imageUrl?: string
    alt?: string
  }
  spotlights?: AlumniSpotlight[]
  aboutTitle?: string
  aboutBody?: string
  aboutCtaLabel?: string
  aboutCtaLink?: string
  programmeListTitle?: string
  programmeListItems?: string[]
  comingSoonTitle?: string
  comingSoonBody?: string
  comingSoonPrimaryCtaLabel?: string
  comingSoonPrimaryCtaLink?: string
  comingSoonSecondaryCtaLabel?: string
  comingSoonSecondaryCtaLink?: string
  relatedLinks?: RelatedLinkCard[]
}

const FALLBACK_PROGRAMME_ITEMS = [
  'BA Fine Art and Photography degrees',
  'Professional photography practices',
  'Graphic design and art direction',
  'Film, TV and media production',
  'Illustration and printmaking',
  'Arts education and community work',
]

const FALLBACK_RELATED_LINKS: RelatedLinkCard[] = [
  {
    title: 'Are you an alum?',
    body: "Share your practice, your path, and work made since Morpeth. We'd love to feature you.",
    linkLabel: 'Get in touch',
    linkHref: '/support#contact',
  },
  {
    title: 'Current students',
    body: 'See the work being made right now in the Portman Gallery by students across year groups.',
    linkLabel: 'Student work',
    linkHref: '/student',
  },
  {
    title: 'Guest artists',
    body: 'Visiting practitioners who have shown work and led sessions in the Portman Gallery.',
    linkLabel: 'Guest artists',
    linkHref: '/guest-artists',
  },
]

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

function normalizeInstagramHandle(raw: string): string {
  const trimmed = raw.trim()
  const withoutUrl = trimmed.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
  return withoutUrl.replace(/^@/, '').replace(/\/+$/, '')
}

export default async function AlumniPage() {
  const query = groq`{
    "page": *[_id == "page_alumni"][0]{
      title,
      kicker,
      headline,
      intro,
      heroBandColor,
      "heroImageOverride": heroImageOverride{
        "imageUrl": image.asset->url + "${IMAGE_PARAMS}",
        "alt": image.alt
      },
      spotlights[]{
        "imageUrl": image.asset->url + "${IMAGE_PARAMS}",
        "alt": image.alt,
        name,
        graduationYear,
        currentPursuit,
        quote,
        portfolioUrl,
        instagramHandle
      },
      aboutTitle,
      aboutBody,
      aboutCtaLabel,
      aboutCtaLink,
      programmeListTitle,
      programmeListItems,
      comingSoonTitle,
      comingSoonBody,
      comingSoonPrimaryCtaLabel,
      comingSoonPrimaryCtaLink,
      comingSoonSecondaryCtaLabel,
      comingSoonSecondaryCtaLink,
      relatedLinks[]{
        title,
        body,
        linkLabel,
        linkHref
      }
    },
    "items": *[
      _type == "galleryExhibition" &&
      exhibitorType == "alumni" &&
      defined(slug.current)
    ] | order(startDate desc) {
        ${exhibitionCardProjection}
      }
  }`

  const fetched = await client
    .fetch<{
      page?: AlumniPageCopy | null
      items?: ExhibitionCard[]
    }>(query)
    .catch((err) => {
      console.error('Failed to fetch alumni page', err)
      return null
    })

  const page = fetched?.page && !Array.isArray(fetched.page) ? fetched.page : null
  const data = Array.isArray(fetched?.items) ? fetched.items : []
  const spotlights = (page?.spotlights || []).filter((item) => Boolean(item.imageUrl && item.name))

  const aboutTitle = page?.aboutTitle?.trim() || 'About the alumni programme'
  const aboutBody =
    page?.aboutBody?.trim() ||
    "Morpeth School has a long tradition of students going on to art school, photography degrees, and creative careers. The alumni section of the Portman Gallery is a space to celebrate that work - showing where the practice went after school.\n\nIf you studied Art or Photography at Morpeth and would like your work featured here, please get in touch via the Support page."
  const aboutParagraphs = aboutBody.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)
  const aboutCtaLabel = page?.aboutCtaLabel?.trim() || 'Get in touch'
  const aboutCtaLink = page?.aboutCtaLink?.trim() || '/support#contact'

  const programmeListTitle = page?.programmeListTitle?.trim() || 'Alumni featured here have gone on to:'
  const programmeListItems =
    page?.programmeListItems && page.programmeListItems.length > 0
      ? page.programmeListItems
      : FALLBACK_PROGRAMME_ITEMS

  const comingSoonTitle = page?.comingSoonTitle?.trim() || 'Coming soon'
  const comingSoonBody =
    page?.comingSoonBody?.trim() ||
    "Alumni exhibitions will appear here once published. If you're a former student who wants to share your work, please get in touch."
  const comingSoonPrimaryCtaLabel = page?.comingSoonPrimaryCtaLabel?.trim() || 'Submit your work'
  const comingSoonPrimaryCtaLink = page?.comingSoonPrimaryCtaLink?.trim() || '/support#contact'
  const comingSoonSecondaryCtaLabel = page?.comingSoonSecondaryCtaLabel?.trim() || 'Student work'
  const comingSoonSecondaryCtaLink = page?.comingSoonSecondaryCtaLink?.trim() || '/student'

  const relatedLinks =
    page?.relatedLinks && page.relatedLinks.length > 0 ? page.relatedLinks : FALLBACK_RELATED_LINKS

  const randomHeroPool = data
    .flatMap((item) => [...(item.heroImageUrls || []), ...(item.galleryImageUrls || [])])
    .filter((url): url is string => Boolean(url))
    .filter((url, index, all) => all.indexOf(url) === index)
  const randomHeroImage = randomHeroPool.length > 0 ? randomHeroPool[randomInt(randomHeroPool.length)] : ''
  const heroImageUrl =
    page?.heroImageOverride?.imageUrl ||
    randomHeroImage ||
    data.find((item) => Boolean(item.heroImageUrl))?.heroImageUrl ||
    spotlights.find((item) => Boolean(item.imageUrl))?.imageUrl

  return (
    <main className="relative min-h-screen bg-white px-6 py-16 text-neutral-900 md:px-10 lg:px-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 halftone-soft opacity-20" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/exhibitions"
            className="font-exhibitions inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-neutral-800"
          >
            ← Back to exhibitions
          </Link>
          <span className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
            Portman Gallery • Alumni
          </span>
        </div>

        <header className="mb-12 -mx-6 overflow-hidden border-y border-neutral-200 bg-white md:-mx-10 lg:-mx-20">
          <div className="grid md:min-h-[460px] md:grid-cols-2">
            <RevealOnScroll effect="fade-left" className="relative min-h-[300px] bg-neutral-200 md:min-h-full">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt={page?.title || 'Alumni hero image'}
                  fill
                  priority
                  sizes="(min-width: 1280px) 50vw, (min-width: 768px) 52vw, 100vw"
                  className="object-cover"
                />
              ) : null}
            </RevealOnScroll>
            <RevealOnScroll
              effect="fade-right"
              className="flex flex-col justify-center px-7 py-10 md:px-14 md:py-12 lg:px-16"
              style={{ backgroundColor: page?.heroBandColor || '#F2A65A' }}
            >
              <p className="font-exhibitions text-[11px] uppercase tracking-[0.22em] text-neutral-900/80">
                {page?.kicker || 'ALUMNI'}
              </p>
              <h1 className="font-exhibitions mt-5 text-4xl uppercase tracking-[0.07em] text-neutral-900 md:text-6xl md:leading-[1.02]">
                {page?.title || 'Alumni'}
              </h1>
              <h2 className="font-exhibitions mt-6 text-2xl tracking-[0.05em] text-neutral-900 md:text-[2.1rem]">
                {page?.headline || 'Where Morpeth artists go next'}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-900/90 md:text-lg">
                {page?.intro ||
                  'Former students of the Portman Gallery programme continue to make, exhibit and work in art and photography. This page celebrates their journeys and current practice.'}
              </p>
            </RevealOnScroll>
          </div>
        </header>

        {spotlights.length > 0 ? (
          <section className="mb-16" aria-labelledby="alumni-spotlights-heading">
            <h3
              id="alumni-spotlights-heading"
              className="font-exhibitions text-[11px] uppercase tracking-[0.26em] text-neutral-600"
            >
              Alumni spotlights
            </h3>
            <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {spotlights.map((person, index) => (
                <RevealOnScroll
                  key={`${person.name}-${index}`}
                  delay={Math.min(index * 60, 300)}
                  className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white"
                >
                  <div className="relative aspect-[4/5] bg-neutral-200">
                    {person.imageUrl ? (
                      <Image
                        src={person.imageUrl}
                        alt={person.alt || `${person.name} portrait`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h4 className="font-exhibitions text-lg tracking-[0.08em] text-neutral-900">
                      {person.name}
                      {person.graduationYear ? (
                        <span className="ml-2 text-sm font-normal text-neutral-500">
                          (left {person.graduationYear})
                        </span>
                      ) : null}
                    </h4>
                    {person.currentPursuit ? (
                      <p className="text-sm font-medium text-neutral-700">{person.currentPursuit}</p>
                    ) : null}
                    {person.quote ? (
                      <p className="mt-1 text-sm leading-relaxed text-neutral-600">&ldquo;{person.quote}&rdquo;</p>
                    ) : null}
                    <div className="mt-auto flex flex-col gap-2 pt-3 text-[11px] uppercase tracking-[0.18em]">
                      {person.portfolioUrl ? (
                        <a
                          href={person.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lux-underline text-neutral-900"
                        >
                          Website: {person.portfolioUrl.replace(/^https?:\/\//i, '').replace(/\/+$/, '')}
                        </a>
                      ) : null}
                      {person.instagramHandle ? (
                        (() => {
                          const handle = normalizeInstagramHandle(person.instagramHandle)
                          return handle ? (
                            <a
                              href={`https://instagram.com/${handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="lux-underline text-neutral-900"
                            >
                              Instagram: @{handle}
                            </a>
                          ) : null
                        })()
                      ) : null}
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </section>
        ) : null}

        <RevealOnScroll className="mb-16" aria-labelledby="alumni-about-heading">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3
                id="alumni-about-heading"
                className="font-exhibitions text-[11px] uppercase tracking-[0.26em] text-neutral-600"
              >
                {aboutTitle}
              </h3>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-neutral-800">
                {aboutParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              {aboutCtaLabel && aboutCtaLink ? (
                isExternalHref(aboutCtaLink) ? (
                  <a
                    href={aboutCtaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lux-hover-rise font-exhibitions mt-6 inline-flex items-center gap-2 border border-neutral-900 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
                  >
                    {aboutCtaLabel} <span aria-hidden>→</span>
                  </a>
                ) : (
                  <Link
                    href={aboutCtaLink}
                    className="lux-hover-rise font-exhibitions mt-6 inline-flex items-center gap-2 border border-neutral-900 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
                  >
                    {aboutCtaLabel} <span aria-hidden>→</span>
                  </Link>
                )
              ) : null}
            </div>

            {programmeListItems.length > 0 ? (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 md:p-8">
                <p className="font-exhibitions text-[11px] uppercase tracking-[0.2em] text-neutral-600">
                  {programmeListTitle}
                </p>
                <ul className="mt-4 space-y-3 text-base text-neutral-800">
                  {programmeListItems.map((item, index) => (
                    <li key={index} className="flex gap-2">
                      <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-neutral-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </RevealOnScroll>

        <section className="mb-16" aria-labelledby="alumni-exhibitions-heading">
          <h3
            id="alumni-exhibitions-heading"
            className="font-exhibitions text-[11px] uppercase tracking-[0.26em] text-neutral-600"
          >
            Alumni exhibitions
          </h3>
          {data.length > 0 ? (
            <div className="mt-6 grid gap-10 md:grid-cols-3">
              {data.map((ex, index) =>
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
          ) : null}

          <RevealOnScroll effect="wipe-right" className="mt-6 border border-dashed border-neutral-300 px-6 py-12 text-center md:px-12">
            <p className="font-exhibitions text-[11px] uppercase tracking-[0.22em] text-neutral-500">
              {comingSoonTitle}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-700">{comingSoonBody}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {comingSoonPrimaryCtaLabel && comingSoonPrimaryCtaLink ? (
                isExternalHref(comingSoonPrimaryCtaLink) ? (
                  <a
                    href={comingSoonPrimaryCtaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-exhibitions inline-flex items-center gap-2 bg-neutral-900 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-white"
                  >
                    {comingSoonPrimaryCtaLabel} <span aria-hidden>→</span>
                  </a>
                ) : (
                  <Link
                    href={comingSoonPrimaryCtaLink}
                    className="font-exhibitions inline-flex items-center gap-2 bg-neutral-900 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-white"
                  >
                    {comingSoonPrimaryCtaLabel} <span aria-hidden>→</span>
                  </Link>
                )
              ) : null}
              {comingSoonSecondaryCtaLabel && comingSoonSecondaryCtaLink ? (
                <Link
                  href={comingSoonSecondaryCtaLink}
                  className="font-exhibitions inline-flex items-center gap-2 border border-neutral-300 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-neutral-800"
                >
                  {comingSoonSecondaryCtaLabel}
                </Link>
              ) : null}
            </div>
          </RevealOnScroll>
        </section>

        {relatedLinks.length > 0 ? (
          <section aria-label="Related pages" className="border-t border-neutral-200 pt-10">
            <div className="grid gap-6 md:grid-cols-3">
              {relatedLinks.map((card, index) => (
                <RevealOnScroll key={index} delay={Math.min(index * 60, 240)} className="border border-neutral-200 bg-neutral-50 p-6">
                  <p className="font-exhibitions text-[11px] uppercase tracking-[0.2em] text-neutral-600">
                    {card.title}
                  </p>
                  {card.body ? <p className="mt-3 text-sm leading-relaxed text-neutral-700">{card.body}</p> : null}
                  {card.linkLabel && card.linkHref ? (
                    isExternalHref(card.linkHref) ? (
                      <a
                        href={card.linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lux-underline mt-4 inline-block text-[11px] uppercase tracking-[0.18em] text-neutral-900"
                      >
                        {card.linkLabel}
                      </a>
                    ) : (
                      <Link
                        href={card.linkHref}
                        className="lux-underline mt-4 inline-block text-[11px] uppercase tracking-[0.18em] text-neutral-900"
                      >
                        {card.linkLabel}
                      </Link>
                    )
                  ) : null}
                </RevealOnScroll>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
