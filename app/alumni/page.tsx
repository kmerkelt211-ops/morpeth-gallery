import client from '../../sanity/lib/client'
import Image from 'next/image'
import Link from 'next/link'
import { groq } from 'next-sanity'
import { randomInt } from 'node:crypto'

export const dynamic = 'force-dynamic'

type AlumniExhibition = {
  _id: string
  title: string
  subtitle?: string
  description?: string
  slug?: { current?: string }
  heroImageUrl?: string
  heroImageUrls?: string[]
  galleryImageUrls?: string[]
}

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

type AlumniPageCopy = {
  title?: string
  kicker?: string
  headline?: string
  intro?: string
  spotlights?: AlumniSpotlight[]
}

export default async function AlumniPage() {
  const query = groq`{
    "page": *[_id == "page_alumni"][0]{
      title,
      kicker,
      headline,
      intro,
      spotlights[]{
        "imageUrl": image.asset->url,
        "alt": image.alt,
        name,
        graduationYear,
        currentPursuit,
        quote,
        portfolioUrl,
        instagramHandle
      }
    },
    "items": *[
      _type == "galleryExhibition" &&
      exhibitorType == "alumni" &&
      defined(slug.current)
    ] | order(startDate desc) {
        _id,
        title,
        subtitle,
        description,
        slug,
        "heroImageUrl": heroImages[0].asset->url,
        "heroImageUrls": heroImages[].asset->url,
        "galleryImageUrls": galleryImages[].asset->url
      }
  }`

  const fetched = await client
    .fetch<{
      page?: AlumniPageCopy | null
      items?: AlumniExhibition[]
    }>(query)
    .catch(() => null)

  const page = fetched?.page && !Array.isArray(fetched.page) ? fetched.page : null
  const data = Array.isArray(fetched?.items) ? fetched.items : []
  const spotlights = (page?.spotlights || []).filter((item) => Boolean(item.imageUrl && item.name))

  const randomHeroPool = data
    .flatMap((item) => [...(item.heroImageUrls || []), ...(item.galleryImageUrls || [])])
    .filter((url): url is string => Boolean(url))
    .filter((url, index, all) => all.indexOf(url) === index)
  const randomHeroImage = randomHeroPool.length > 0 ? randomHeroPool[randomInt(randomHeroPool.length)] : ''
  const heroImageUrl =
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
            <div className="relative min-h-[300px] bg-neutral-200 md:min-h-full">
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
            </div>
            <div
              className="flex flex-col justify-center px-7 py-10 md:px-14 md:py-12 lg:px-16"
              style={{ backgroundColor: '#9EDFE6' }}
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
            </div>
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
                <article
                  key={`${person.name}-${index}`}
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
                    <div className="mt-auto flex flex-wrap gap-3 pt-3 text-[11px] uppercase tracking-[0.18em]">
                      {person.portfolioUrl ? (
                        <a
                          href={person.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lux-underline text-neutral-900"
                        >
                          Portfolio
                        </a>
                      ) : null}
                      {person.instagramHandle ? (
                        <a
                          href={`https://instagram.com/${person.instagramHandle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lux-underline text-neutral-900"
                        >
                          @{person.instagramHandle}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section aria-labelledby="alumni-exhibitions-heading">
          <h3
            id="alumni-exhibitions-heading"
            className="font-exhibitions text-[11px] uppercase tracking-[0.26em] text-neutral-600"
          >
            Alumni exhibitions
          </h3>
          <div className="mt-6 grid gap-10 md:grid-cols-3">
            {data.map((ex) =>
              ex.slug?.current ? (
                <Link key={ex._id} href={`/${ex.slug.current}`} className="block">
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
              ) : null
            )}
            {!data.length ? (
              <p className="md:col-span-3 text-sm text-neutral-600">
                No alumni exhibitions are published in Sanity yet.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}
