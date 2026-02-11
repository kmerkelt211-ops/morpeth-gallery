import Image from 'next/image'
import Link from 'next/link'
import { groq } from 'next-sanity'
import client from '../../sanity/lib/client'
import { PortableText } from 'next-sanity'
import type { PortableTextBlock } from 'sanity'
import AboutInfoPanels from './about-info-panels'

export const dynamic = 'force-dynamic'

type QuickFact = { label?: string; value?: string }

type CommunityLink = { label?: string; url?: string }

type GallerySnapshot = {
  asset?: { url?: string }
  alt?: string
  title?: string
  artist?: string
  year?: number
  caption?: string
}

type WhatsOnCard = {
  kicker?: string
  title?: string
  ctaLabel?: string
  imageUrl?: string
  imageAlt?: string
  slug?: string
}

type AboutFeatureImage = {
  imageUrl?: string
  alt?: string
  title?: string
  artist?: string
  year?: number
  caption?: string
}

type AboutPageData = {
  title?: string
  intro?: string
  heroKicker?: string
  heroHeadline?: string
  heroSummary?: string
  heroBandColor?: string
  whatsOnTitle?: string
  whatsOnSubtitle?: string
  whatsOnCards?: WhatsOnCard[]
  quickFacts?: QuickFact[]
  pastExhibitions?: Array<string | { title?: string }>
  futurePlans?: Array<string | { title?: string; description?: string }>
  communityLinks?: CommunityLink[]
  aboutFeatureImage?: AboutFeatureImage
  gallerySnapshots?: GallerySnapshot[]
  body?: PortableTextBlock[]
}

type HeroImageCandidate = {
  url: string
  alt?: string
}

const aboutPageQuery = groq`*[_id == "page_about"][0]{
  title,
  intro,
  heroKicker,
  heroHeadline,
  heroSummary,
  heroBandColor,
  whatsOnTitle,
  whatsOnSubtitle,
  whatsOnCards[]{
    kicker,
    title,
    ctaLabel,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, title),
    "slug": exhibition->slug.current
  },
  quickFacts[]{label, value},
  pastExhibitions,
  futurePlans,
  communityLinks[]{
    "label": coalesce(label, title),
    url
  },
  "aboutFeatureImage": aboutFeatureImage{
    title,
    artist,
    year,
    caption,
    "alt": image.alt,
    "imageUrl": image.asset->url
  },
  gallerySnapshots[]{alt, title, artist, year, caption, asset->{url}},
  body
}`

const exhibitionHeroPoolQuery = groq`*[
  _type == "galleryExhibition" &&
  defined(heroImages[0].asset->url)
]{
  "url": heroImages[0].asset->url,
  "alt": coalesce(heroImages[0].alt, title)
}`

type PlacementImage = {
  src: string
  alt: string
  title: string
  artist: string
  year: number
  caption: string
}

const aboutPlacementImages: PlacementImage[] = [
  {
    src: '/about-page/Picasso_The_Three_Dancers.width-1440.jpg',
    alt: 'Reference image of Picasso The Three Dancers',
    title: 'The Three Dancers (Reference)',
    artist: 'Pablo Picasso',
    year: 1925,
    caption: 'Used as a reference for movement, rhythm and distortion in student drawing sessions.',
  },
  {
    src: '/about-page/T16241_10.jpg',
    alt: 'Abstract painting with diagonal red and blue forms',
    title: 'Untitled (Diagonal Study)',
    artist: 'Placement image',
    year: 2024,
    caption: 'Colour and composition reference used for painting and mixed-media workshops.',
  },
  {
    src: '/about-page/Benedict_Enwonwu_Black_Culture.width-1440.jpg',
    alt: 'Painting reference image by Benedict Enwonwu',
    title: 'Black Culture (Reference)',
    artist: 'Benedict Enwonwu',
    year: 2024,
    caption: 'Reference for colour, symbolism and figurative composition.',
  },
  {
    src: '/about-page/T16310_10.jpg',
    alt: 'Interior scene rendered in blue and pink tones',
    title: 'Interior in Blue',
    artist: 'Placement image',
    year: 2024,
    caption: 'Atmospheric scene used to support projects on light, mood and memory.',
  },
  {
    src: '/about-page/width-1200_TNCNkI1.jpg',
    alt: 'Grid-based conceptual artwork with object studies',
    title: 'Studies on Colour and Form',
    artist: 'Placement image',
    year: 2024,
    caption: 'Example of serial composition and repetition used in photography and design units.',
  },
]

const fallbackSnapshots: GallerySnapshot[] = [
  {
    asset: { url: '/gallery%20snapshots/T16313_10.jpg' },
    alt: 'Gallery snapshot image one',
    title: 'Untitled Study I',
    artist: 'Morpeth Student',
    year: 2024,
  },
  {
    asset: { url: '/gallery%20snapshots/T16404_10.jpg' },
    alt: 'Gallery snapshot image two',
    title: 'Untitled Study II',
    artist: 'Morpeth Student',
    year: 2024,
  },
  {
    asset: { url: '/gallery%20snapshots/T16436_10.jpg' },
    alt: 'Gallery snapshot image three',
    title: 'Untitled Study III',
    artist: 'Morpeth Student',
    year: 2024,
  },
  {
    asset: { url: '/gallery%20snapshots/T16451_10.jpg' },
    alt: 'Gallery snapshot image four',
    title: 'Untitled Study IV',
    artist: 'Morpeth Student',
    year: 2024,
  },
  {
    asset: { url: '/gallery%20snapshots/width-1200_8W84Ttn.jpg' },
    alt: 'Gallery snapshot image five',
    title: 'Untitled Study V',
    artist: 'Morpeth Student',
    year: 2024,
  },
  {
    asset: { url: '/gallery%20snapshots/width-1200_AilzAJC.jpg' },
    alt: 'Gallery snapshot image six',
    title: 'Untitled Study VI',
    artist: 'Morpeth Student',
    year: 2024,
  },
  {
    asset: { url: '/gallery%20snapshots/width-1200_AwsasIH.jpg' },
    alt: 'Gallery snapshot image seven',
    title: 'Untitled Study VII',
    artist: 'Morpeth Student',
    year: 2024,
  },
  {
    asset: { url: '/gallery%20snapshots/width-1200_TNCNkI1.jpg' },
    alt: 'Gallery snapshot image eight',
    title: 'Untitled Study VIII',
    artist: 'Morpeth Student',
    year: 2024,
  },
]

const fallbackQuickFacts: QuickFact[] = [
  { label: 'Location', value: 'Portman Gallery, Morpeth School' },
  { label: 'Programme', value: 'Student and guest artist exhibitions' },
  { label: 'Disciplines', value: 'Fine art, photography, moving image, mixed media' },
  { label: 'Audience', value: 'Students, families, local community and partner schools' },
]

const fallbackPastExhibitions: string[] = [
  'City Lines - Student photography and painting',
  'Between Lessons - Everyday gestures and school life',
  'Bethnal Green in 35mm - Documentary image project',
  'Practice Wall - Guest artists showcase',
]

const fallbackFuturePlans: string[] = [
  'Expanded digital exhibition guides with student audio commentary',
  'Cross-year photography mentorship and portfolio reviews',
  'Collaborative exhibition with local creative partners',
]

const fallbackCommunityLinks: CommunityLink[] = [
  { label: 'Morpeth School', url: 'https://www.morpethschool.org.uk/' },
  { label: 'Portman Gallery Programme', url: '/exhibitions' },
]

const fallbackAboutParagraphs: string[] = [
  'The Portman Gallery is the public-facing heart of art and photography at Morpeth. It functions as a working exhibition space where making, editing and curating happen side by side. Students encounter professional ways of presenting work while still in the process of developing ideas, and that mix of process and presentation is central to the identity of the gallery.',
  'Across the year, the programme moves between studio-based experimentation and focused exhibition moments. Some shows present resolved outcomes, while others document learning in real time: sketchbook pages, test prints, contact sheets, installation notes and reflective text. The result is a space that feels active and current, rather than static.',
  'Students from different year groups contribute to exhibitions throughout the year. Younger artists are introduced to display standards, sequencing and visual editing, while older students refine authorship, scale and context. This progression builds confidence and gives students practical experience in how contemporary artwork is shared with an audience.',
  'Photography is a key strand of the programme. Projects range from documentary and portraiture to staged image-making and moving image experiments. Students learn to work critically with framing, colour, light and rhythm, then translate those decisions into exhibition formats that can be read clearly by viewers in the space and online.',
  'The gallery also supports collaboration across departments and with visiting practitioners. Guest artists, alumni and local creatives help broaden references and challenge students to think about material, concept and audience. These collaborations are designed to make creative careers feel visible, tangible and relevant.',
  'As a school gallery, Portman holds two priorities together: access and ambition. The space welcomes first-time viewers while maintaining high expectations for curation and craft. Every display aims to communicate care in presentation, clarity in storytelling and respect for the work being shown.',
  'Over time, the archive of exhibitions becomes a record of how the department evolves: recurring themes, changing materials, new technologies and the distinct voices of each cohort. The About page introduces that ongoing story and points to the wider programme of exhibitions, projects and partnerships that shape the gallery year.',
]

const [
  referenceDanceImage,
  abstractDiagonalImage,
  portraitStudyImage,
] = aboutPlacementImages
const colourFormImage = aboutPlacementImages[4]

type FeaturedCard =
  {
    kicker: string
    title: string
    cta: string
    imageUrl: string
    imageAlt: string
    slug?: string
  }

const featuredCards: FeaturedCard[] = [
  {
    imageUrl: referenceDanceImage.src,
    imageAlt: referenceDanceImage.alt,
    kicker: 'Portman Gallery',
    title: 'Reference Wall: Movement',
    cta: 'More info',
    slug: undefined,
  },
  {
    imageUrl: abstractDiagonalImage.src,
    imageAlt: abstractDiagonalImage.alt,
    kicker: 'Portman Gallery',
    title: 'Colour Study Session',
    cta: 'More info',
    slug: undefined,
  },
  {
    imageUrl: portraitStudyImage.src,
    imageAlt: portraitStudyImage.alt,
    kicker: 'Portman Gallery',
    title: 'Figure and Symbol',
    cta: 'More info',
  },
]

function pickRandomSanityHeroImage(
  data: AboutPageData | null,
  extraPool: HeroImageCandidate[] = []
): HeroImageCandidate | null {
  if (!data) return null

  const candidates: HeroImageCandidate[] = []

  if (data.aboutFeatureImage?.imageUrl) {
    candidates.push({
      url: data.aboutFeatureImage.imageUrl,
      alt: data.aboutFeatureImage.alt || data.aboutFeatureImage.title,
    })
  }

  for (const snap of data.gallerySnapshots || []) {
    if (!snap?.asset?.url) continue
    candidates.push({
      url: snap.asset.url,
      alt: snap.alt || snap.title,
    })
  }

  for (const card of data.whatsOnCards || []) {
    if (!card?.imageUrl) continue
    candidates.push({
      url: card.imageUrl,
      alt: card.imageAlt || card.title,
    })
  }

  for (const image of extraPool) {
    if (!image?.url) continue
    candidates.push(image)
  }

  const unique = candidates.filter(
    (candidate, index, all) => all.findIndex((item) => item.url === candidate.url) === index
  )
  if (!unique.length) return null

  const randomIndex = Math.floor(Math.random() * unique.length)
  return unique[randomIndex] || null
}

export default async function AboutPage() {
  const [data, exhibitionHeroPool] = await Promise.all([
    client.fetch<AboutPageData | null>(aboutPageQuery),
    client.fetch<HeroImageCandidate[]>(exhibitionHeroPoolQuery),
  ])

  const heroBand = data?.heroBandColor || '#88B4A8'
  const kicker = data?.heroKicker || 'PORTMAN GALLERY'
  const headline = data?.heroHeadline || data?.title || 'A WORLD OF STUDENT ART'
  const summary =
    data?.heroSummary ||
    "Regular shows of work from across Morpeth School. A working gallery where students, guest artists and collaborators experiment, exhibit and share what they're making."

  const quickFacts =
    data?.quickFacts?.filter((f: QuickFact) => (f?.label || '').trim() || (f?.value || '').trim()) || []

  const past = (data?.pastExhibitions || [])
    .map((item) => (typeof item === 'string' ? item : item?.title || ''))
    .filter(Boolean)
  const future = (data?.futurePlans || [])
    .map((item) => {
      if (typeof item === 'string') return item
      const titlePart = item?.title || ''
      const descPart = item?.description || ''
      return [titlePart, descPart].filter(Boolean).join(' - ')
    })
    .filter(Boolean)
  const links = (data?.communityLinks || []).filter((l: CommunityLink) => l?.label && l?.url)
  const sanitySnaps = (data?.gallerySnapshots || []).filter((img: GallerySnapshot) => img?.asset?.url)
  const snaps = sanitySnaps.length ? sanitySnaps : fallbackSnapshots
  const quickFactsToShow = quickFacts.length ? quickFacts : fallbackQuickFacts
  const pastToShow = past.length ? past : fallbackPastExhibitions
  const futureToShow = future.length ? future : fallbackFuturePlans
  const linksToShow = links.length ? links : fallbackCommunityLinks
  const hasPortableBody = Array.isArray(data?.body) && data.body.length > 0
  const leadParagraph = data?.intro || fallbackAboutParagraphs[0]
  const whatsOnHeading = data?.whatsOnTitle || "WHAT'S ON AT PORTMAN"
  const whatsOnSubheading = data?.whatsOnSubtitle || 'FEATURED'
  const sanityFeaturedCards =
    (data?.whatsOnCards || []).filter(
      (card): card is WhatsOnCard =>
        Boolean(card?.title?.trim()) && Boolean(card?.imageUrl?.trim())
    ) || []
  const featuredCardsToShow: FeaturedCard[] =
    sanityFeaturedCards.length > 0
      ? sanityFeaturedCards.map((card) => ({
          kicker: card.kicker || 'Portman Gallery',
          title: card.title || 'Featured exhibition',
          cta: card.ctaLabel || 'More info',
          imageUrl: card.imageUrl || '',
          imageAlt: card.imageAlt || card.title || 'Featured card image',
          slug: card.slug,
        }))
      : featuredCards
  const featuredGridClass =
    featuredCardsToShow.length >= 4
      ? 'md:grid-cols-4'
      : featuredCardsToShow.length === 3
      ? 'md:grid-cols-3'
      : featuredCardsToShow.length === 2
      ? 'sm:grid-cols-2'
      : 'grid-cols-1'
  const aboutFeatureImageToShow: AboutFeatureImage = {
    imageUrl: colourFormImage.src,
    alt: colourFormImage.alt,
    title: data?.aboutFeatureImage?.title || colourFormImage.title,
    artist: data?.aboutFeatureImage?.artist || colourFormImage.artist,
    year: data?.aboutFeatureImage?.year || colourFormImage.year,
    caption: data?.aboutFeatureImage?.caption || colourFormImage.caption,
  }
  const randomSanityHeroImage = pickRandomSanityHeroImage(data, exhibitionHeroPool || [])
  const aboutHeroImageUrl = randomSanityHeroImage?.url || aboutFeatureImageToShow.imageUrl || colourFormImage.src
  const aboutHeroImageAlt =
    randomSanityHeroImage?.alt || aboutFeatureImageToShow.alt || colourFormImage.alt
  return (
    <main className="relative min-h-screen bg-white px-6 py-16 text-neutral-900 md:px-10 lg:px-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 halftone-soft opacity-20" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-end gap-4">
          <span className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
            Portman Gallery • About
          </span>
        </div>

        <header className="mb-16 -mx-6 overflow-hidden border-y border-neutral-200 bg-white md:-mx-10 lg:-mx-20">
          <div className="grid md:min-h-[460px] md:grid-cols-2">
            <div className="relative min-h-[300px] bg-neutral-200 md:min-h-full">
              <Image
                src={aboutHeroImageUrl}
                alt={aboutHeroImageAlt}
                fill
                priority
                sizes="(min-width: 1280px) 50vw, (min-width: 768px) 52vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center px-7 py-10 text-white md:px-14 md:py-12 lg:px-16" style={{ backgroundColor: heroBand }}>
              <p className="font-exhibitions text-[11px] uppercase tracking-[0.22em] text-white/90">{kicker}</p>
              <h1 className="font-exhibitions mt-5 text-4xl uppercase tracking-[0.07em] text-white md:text-6xl md:leading-[1.02]">
                {headline}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white md:text-lg">{summary}</p>
            </div>
          </div>
        </header>

        <section id="stories" className="space-y-10">
          <article>
            <h2 className="font-exhibitions text-xs tracking-[0.35em] text-neutral-700">ABOUT THE SPACE</h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-800">{leadParagraph}</p>
          </article>

          <div className="border-t border-neutral-200 pt-8">
            <h3 className="font-exhibitions text-center text-4xl tracking-[0.12em] text-neutral-900 md:text-5xl">
              {whatsOnHeading}
            </h3>
            <p className="font-exhibitions mt-8 text-center text-[10px] uppercase tracking-[0.32em] text-neutral-600">
              {whatsOnSubheading}
            </p>
            <div className={`mt-5 grid grid-cols-1 gap-[2px] bg-neutral-200 ${featuredGridClass}`}>
              {featuredCardsToShow.map((card, idx) => {
                return (
                  <article
                    key={`featured-image-${idx}-${card.title}`}
                    className="relative h-[360px] overflow-hidden bg-neutral-100 sm:h-[400px] md:h-[420px]"
                  >
                    <Image
                      src={card.imageUrl}
                      alt={card.imageAlt}
                      width={900}
                      height={1200}
                      sizes="(min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <p className="font-exhibitions text-[11px] uppercase tracking-[0.14em] text-white/85">
                        {card.kicker}
                      </p>
                      <h4 className="mt-2 text-4xl uppercase leading-[1.05] tracking-[0.01em]">
                        {card.title}
                      </h4>
                      {card.slug ? (
                        <Link
                          href={`/${card.slug}`}
                          className="mt-6 inline-flex items-center bg-white px-4 py-2 text-3xl text-neutral-900"
                        >
                          {card.cta} →
                        </Link>
                      ) : (
                        <span className="mt-6 inline-flex items-center bg-white/85 px-4 py-2 text-3xl text-neutral-700">
                          {card.cta} →
                        </span>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <article className="space-y-4 text-sm leading-relaxed text-neutral-800">
              {hasPortableBody ? (
                <div className="prose prose-neutral max-w-none prose-p:leading-relaxed">
                  <PortableText value={data.body || []} />
                </div>
              ) : (
                <>
                  {fallbackAboutParagraphs.slice(1).map((paragraph, idx) => (
                    <p key={`fallback-about-detail-${idx}`}>{paragraph}</p>
                  ))}
                </>
              )}

              <figure className="overflow-hidden border border-neutral-200 bg-white">
                <Image
                  src={aboutFeatureImageToShow.imageUrl || colourFormImage.src}
                  alt={aboutFeatureImageToShow.alt || colourFormImage.alt}
                  width={1184}
                  height={800}
                  className="h-auto w-full object-cover"
                />
                <figcaption className="border-t border-neutral-200 px-3 py-2 text-xs text-neutral-700">
                  <p className="font-medium text-neutral-900">
                    {aboutFeatureImageToShow.title || colourFormImage.title}
                  </p>
                  <p>
                    {aboutFeatureImageToShow.artist || colourFormImage.artist}
                    {aboutFeatureImageToShow.year ? `, ${aboutFeatureImageToShow.year}` : ''}
                  </p>
                </figcaption>
              </figure>
            </article>

            <AboutInfoPanels
              quickFacts={quickFactsToShow}
              pastExhibitions={pastToShow}
              futurePlans={futureToShow}
              communityLinks={linksToShow}
            />
          </div>
        </section>

        <section className="mt-16 border-t border-neutral-200 pt-12">
          <h2 className="font-exhibitions text-xs tracking-[0.35em] text-neutral-700">GALLERY SNAPSHOTS</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {snaps.length
              ? snaps.slice(0, 6).map((img: GallerySnapshot, idx: number) => (
                  <figure key={idx} className="overflow-hidden border border-neutral-200 bg-white">
                    <div className="relative aspect-[4/3] bg-neutral-100">
                      {img.asset?.url ? (
                        <Image
                          src={img.asset.url}
                          alt={img.alt || img.title || ''}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <figcaption className="border-t border-neutral-200 px-3 py-2 text-xs leading-relaxed text-neutral-700">
                      <p className="font-medium text-neutral-900">{img.title || `Snapshot ${idx + 1}`}</p>
                      <p className="text-neutral-600">
                        {img.artist || 'Unknown artist'}
                        {img.year ? `, ${img.year}` : ''}
                      </p>
                    </figcaption>
                  </figure>
                ))
              : null}
          </div>
        </section>

      </div>
    </main>
  )
}
