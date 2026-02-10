import client from '../../sanity/lib/client'
import Image from 'next/image'
import Link from 'next/link'
import { groq } from 'next-sanity'
import { randomInt } from 'node:crypto'

export const dynamic = 'force-dynamic'

type StaffExhibition = {
  _id: string
  title: string
  subtitle?: string
  description?: string
  slug?: { current?: string }
  heroImageUrl?: string
  heroImageUrls?: string[]
  galleryImageUrls?: string[]
}

type StaffPageCopy = {
  title?: string
  kicker?: string
  headline?: string
  intro?: string
}

export default async function StaffExhibitionsPage() {
  const query = groq`{
    "page": *[_id == "page_staff"][0]{
      title,
      kicker,
      headline,
      intro
    },
    "items": *[
      _type == "galleryExhibition" &&
      exhibitorType == "staffVisiting" &&
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
    page?: StaffPageCopy | null
    items?: StaffExhibition[]
  }>(query)

  const page = fetched?.page && !Array.isArray(fetched.page) ? fetched.page : null
  const data = Array.isArray(fetched?.items) ? fetched.items : []
  const randomGuestHeroPool = data
    .flatMap((item) => [...(item.heroImageUrls || []), ...(item.galleryImageUrls || [])])
    .filter((url): url is string => Boolean(url))
    .filter((url, index, all) => all.indexOf(url) === index)
  const randomGuestHeroImage =
    randomGuestHeroPool.length > 0 ? randomGuestHeroPool[randomInt(randomGuestHeroPool.length)] : ''
  const heroImageUrl =
    randomGuestHeroImage ||
    data.find((item) => Boolean(item.heroImageUrl))?.heroImageUrl ||
    '/about-page/Benedict_Enwonwu_Black_Culture.width-1440.jpg'

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
            Portman Gallery • Guest Artists
          </span>
        </div>

        <header className="mb-12 -mx-6 overflow-hidden border-y border-neutral-200 bg-white md:-mx-10 lg:-mx-20">
          <div className="grid md:min-h-[460px] md:grid-cols-2">
            <div className="relative min-h-[300px] bg-neutral-200 md:min-h-full">
              <Image
                src={heroImageUrl}
                alt={page?.title || 'Guest artists hero image'}
                fill
                priority
                sizes="(min-width: 1280px) 50vw, (min-width: 768px) 52vw, 100vw"
                className="object-cover"
              />
            </div>
            <div
              className="flex flex-col justify-center px-7 py-10 md:px-14 md:py-12 lg:px-16"
              style={{ backgroundColor: '#d292b0' }}
            >
              <p className="font-exhibitions text-[11px] uppercase tracking-[0.22em] text-white/90">
                {page?.kicker || 'GUEST ARTISTS'}
              </p>
              <h1 className="font-exhibitions mt-5 text-4xl uppercase tracking-[0.07em] text-white md:text-6xl md:leading-[1.02]">
                {page?.title || 'Guest Artists'}
              </h1>
              <h2 className="font-exhibitions mt-6 text-2xl tracking-[0.05em] text-white md:text-[2.1rem]">
                {page?.headline || 'Practising artists in the classroom'}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/95 md:text-lg">
                {page?.intro ||
                  'Guest artists and invited practitioners exhibit regularly in the Portman Gallery, sharing current practice, research and collaborative projects with students.'}
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
        </div>
      </div>
    </main>
  )
}
