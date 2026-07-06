import client from '../../sanity/lib/client'
import Image from 'next/image'
import Link from 'next/link'
import { groq } from 'next-sanity'
import RevealOnScroll from '../components/reveal-on-scroll'
import { exhibitionCardProjection, pickRandomHeroImage, type ExhibitionCard } from '../../sanity/lib/exhibition-card'
import { IMAGE_PARAMS } from '../../sanity/lib/image'
import { ARCHIVED_FILTER } from '../../sanity/lib/exhibition-status'
import PastExhibitionsSection, { type PastExhibitionItem } from '../components/past-exhibitions-section'

export const revalidate = 60

type HousePageCopy = {
  title?: string
  kicker?: string
  headline?: string
  intro?: string
  heroBandColor?: string
  heroImageOverride?: {
    imageUrl?: string
    alt?: string
  }
  aboutTitle?: string
  aboutBody?: string
}

const query = groq`{
  "page": *[_id == "page_house"][0]{
    title,
    kicker,
    headline,
    intro,
    heroBandColor,
    "heroImageOverride": heroImageOverride{
      "imageUrl": image.asset->url + "${IMAGE_PARAMS}",
      "alt": image.alt
    },
    aboutTitle,
    aboutBody
  },
  "items": *[
    _type == "galleryExhibition" &&
    exhibitorType == "house" &&
    defined(slug.current) &&
    !(${ARCHIVED_FILTER})
  ] | order(startDate desc) {
      ${exhibitionCardProjection}
    },
  "past": *[
    _type == "galleryExhibition" &&
    exhibitorType == "house" &&
    defined(slug.current) &&
    (${ARCHIVED_FILTER})
  ] | order(coalesce(endDate, startDate) desc) [0...8] {
    _id, title, slug, startDate, endDate,
    "heroImageUrl": coalesce(heroImages[0].asset->url + "${IMAGE_PARAMS}", galleryImages[0].asset->url + "${IMAGE_PARAMS}")
  }
}`

const fallbackAboutTitle = 'About The House'
const fallbackAboutBody =
  'Recognised for our inclusive, community-centred ethos, Morpeth School offers a dedicated in-school alternative provision known as "The House." This specialist programme serves as a central learning hub for a small, carefully selected group of students who are admitted at various points throughout the year for a range of individual needs.\n\nThe House is staffed by a committed team focused on delivering pupil-centred, inclusive education. As part of a two-week timetable cycle, students take part in photography workshops designed to develop their creativity, confidence and artistic skills. The projects shown here are the work produced during those sessions.'

export default async function HousePage() {
  const fetched = await client
    .fetch<{
      page?: HousePageCopy | null
      items?: ExhibitionCard[]
      past?: PastExhibitionItem[]
    }>(query)
    .catch((err) => {
      console.error('Failed to fetch The House page', err)
      return null
    })

  const page = fetched?.page && !Array.isArray(fetched.page) ? fetched.page : null
  const data = Array.isArray(fetched?.items) ? fetched.items : []
  const pastExhibitions = Array.isArray(fetched?.past) ? fetched.past : []
  const heroImageUrl =
    page?.heroImageOverride?.imageUrl ||
    pickRandomHeroImage(data) ||
    data.find((item) => Boolean(item.heroImageUrl))?.heroImageUrl

  const aboutTitle = page?.aboutTitle?.trim() || fallbackAboutTitle
  const aboutBody = page?.aboutBody?.trim() || fallbackAboutBody
  const aboutParagraphs = aboutBody.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)

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
            Portman Gallery • The House
          </span>
        </div>

        <header className="mb-12 -mx-6 overflow-hidden border-y border-neutral-200 bg-white md:-mx-10 lg:-mx-20">
          <div className="grid md:min-h-[460px] md:grid-cols-2">
            <RevealOnScroll effect="fade-left" className="relative min-h-[300px] bg-neutral-200 md:min-h-full">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt={page?.title || 'The House hero image'}
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
              style={{ backgroundColor: page?.heroBandColor || '#C9A66B' }}
            >
              <p className="font-exhibitions text-[11px] uppercase tracking-[0.22em] text-white/90">
                {page?.kicker || 'THE HOUSE'}
              </p>
              <h1 className="font-exhibitions mt-5 text-4xl uppercase tracking-[0.07em] text-white md:text-6xl md:leading-[1.02]">
                {page?.title || 'The House'}
              </h1>
              <h2 className="font-exhibitions mt-6 text-2xl tracking-[0.05em] text-white md:text-[2.1rem]">
                {page?.headline || 'Photography projects with The House'}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/95 md:text-lg">
                {page?.intro ||
                  "The House is Morpeth School's in-school alternative provision - a specialist, pupil-centred learning hub. As part of a two-week timetable cycle, students take part in photography workshops designed to build creativity, confidence and artistic skills."}
              </p>
            </RevealOnScroll>
          </div>
        </header>

        <section className="mb-16" aria-labelledby="house-about-heading">
          <h3
            id="house-about-heading"
            className="font-exhibitions text-[11px] uppercase tracking-[0.26em] text-neutral-600"
          >
            {aboutTitle}
          </h3>
          <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-neutral-800">
            {aboutParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="mb-16" aria-labelledby="house-projects-heading">
          <h3
            id="house-projects-heading"
            className="font-exhibitions text-[11px] uppercase tracking-[0.26em] text-neutral-600"
          >
            Projects
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
          ) : (
            <p className="mt-6 text-sm text-neutral-600">
              No House projects are published in Sanity yet.
            </p>
          )}
        </section>

        <PastExhibitionsSection items={pastExhibitions} />
      </div>
    </main>
  )
}
