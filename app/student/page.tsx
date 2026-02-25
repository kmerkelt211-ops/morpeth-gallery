import client from '../../sanity/lib/client'
import Image from 'next/image'
import Link from 'next/link'
import { groq } from 'next-sanity'
import { randomInt } from 'node:crypto'

export const dynamic = 'force-dynamic'

type StudentExhibition = {
  _id: string
  title: string
  subtitle?: string
  description?: string
  slug?: { current?: string }
  heroImageUrl?: string
  heroImageUrls?: string[]
  galleryImageUrls?: string[]
}

type StudentPageCopy = {
  title?: string
  kicker?: string
  headline?: string
  intro?: string
}

export default async function StudentWorkPage() {
  const query = groq`{
    "page": *[_id == "page_student"][0]{
      title,
      kicker,
      headline,
      intro
    },
    "items": *[
      _type == "galleryExhibition" &&
      exhibitorType in ["student", "studentWork", "student-work"] &&
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

  const fetched = await client.fetch<{
    page?: StudentPageCopy | null
    items?: StudentExhibition[]
  }>(query)

  const page = fetched?.page && !Array.isArray(fetched.page) ? fetched.page : null
  const data = Array.isArray(fetched?.items) ? fetched.items : []
  const randomStudentHeroPool = data
    .flatMap((item) => [...(item.heroImageUrls || []), ...(item.galleryImageUrls || [])])
    .filter((url): url is string => Boolean(url))
    .filter((url, index, all) => all.indexOf(url) === index)
  const randomStudentHeroImage =
    randomStudentHeroPool.length > 0 ? randomStudentHeroPool[randomInt(randomStudentHeroPool.length)] : ''
  const heroImageUrl =
    randomStudentHeroImage ||
    data.find((item) => Boolean(item.heroImageUrl))?.heroImageUrl

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
            Portman Gallery • Student
          </span>
        </div>

        <header className="mb-12 -mx-6 overflow-hidden border-y border-neutral-200 bg-white md:-mx-10 lg:-mx-20">
          <div className="grid md:min-h-[460px] md:grid-cols-2">
            <div className="relative min-h-[300px] bg-neutral-200 md:min-h-full">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt={page?.title || 'Student work hero image'}
                  fill
                  priority
                  sizes="(min-width: 1280px) 50vw, (min-width: 768px) 52vw, 100vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div
              className="flex flex-col justify-center px-7 py-10 md:px-14 md:py-12 lg:px-16"
              style={{ backgroundColor: '#8cc9d3' }}
            >
              <p className="font-exhibitions text-[11px] uppercase tracking-[0.22em] text-white/90">
                {page?.kicker || 'STUDENT WORK'}
              </p>
              <h1 className="font-exhibitions mt-5 text-4xl uppercase tracking-[0.07em] text-white md:text-6xl md:leading-[1.02]">
                {page?.title || 'Student Work'}
              </h1>
              <h2 className="font-exhibitions mt-6 text-2xl tracking-[0.05em] text-white md:text-[2.1rem]">
                {page?.headline || 'From first sketches to final shows'}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/95 md:text-lg">
                {page?.intro ||
                  'Work produced across KS3, GCSE and Sixth Form courses, including drawing, painting, lens-based media, print and installation. Selected pieces are shown here and in the gallery across the year.'}
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-10 md:grid-cols-3">
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
              No student exhibitions are published in Sanity yet.
            </p>
          ) : null}
        </div>
      </div>
    </main>
  )
}
