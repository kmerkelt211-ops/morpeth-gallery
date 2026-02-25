import { groq } from 'next-sanity'
import { randomInt } from 'node:crypto'
import client from '../../sanity/lib/client'
import HomePageClient, {
  type GalleryExhibition,
  type HomePageCopy,
} from '../home-page-client'

export const dynamic = 'force-dynamic'

const homePageQuery = groq`{
  "page": *[_id == "page_home"][0]{
    heroKicker,
    heroHeadline,
    heroSummary,
    currentStripLabel,
    currentStripHelp,
    whatsOnIntro
  },
  "exhibitions": *[_type == "galleryExhibition"] | order(orderRank asc, startDate desc) {
    _id,
    title,
    subtitle,
    description,
    slug,
    "viewLayout": select(
      viewLayout in ["whatsOn", "whats_on", "whatson", "event"] => "whatsOn",
      viewLayout in ["digitalGallery", "digital_gallery", "digital"] => "digitalGallery",
      null
    ),
    locationType,
    "exhibitorType": select(
      exhibitorType in ["student", "studentWork", "student-work"] => "student",
      exhibitorType in ["staffVisiting", "guestArtists", "guestArtist", "guest-artists", "staff"] => "staffVisiting",
      "other"
    ),
    isCurrent,
    startDate,
    endDate,
    bgColor,
    "heroImageUrl": coalesce(heroImages[0].asset->url, galleryImages[0].asset->url),
    "galleryImageUrls": galleryImages[].asset->url,
    "guidePdfUrl": guidePdf.asset->url
  }
}`

function pickFeaturedHeroImage(exhibitions: GalleryExhibition[]): string | null {
  const pool = exhibitions
    .flatMap((ex) => [ex.heroImageUrl, ...(ex.galleryImageUrls || [])])
    .filter((url): url is string => Boolean(url))
    .filter((url, index, all) => all.indexOf(url) === index)

  if (!pool.length) return null
  return pool[randomInt(pool.length)] || null
}

export default async function ExhibitionsPage() {
  const fetched = await client.fetch<{
    page?: HomePageCopy | null
    exhibitions?: GalleryExhibition[]
  }>(homePageQuery)

  const pageCopy = fetched?.page && !Array.isArray(fetched.page) ? fetched.page : null
  const exhibitions = Array.isArray(fetched?.exhibitions) ? fetched.exhibitions : []
  const heroImageUrl = pickFeaturedHeroImage(exhibitions)

  return (
    <HomePageClient
      exhibitions={exhibitions}
      pageCopy={pageCopy}
      heroImageUrl={heroImageUrl}
    />
  )
}
