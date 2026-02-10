import { groq } from 'next-sanity'
import client from '../../sanity/lib/client'
import HomePageClient, {
  type GalleryExhibition,
  type HomePageCopy,
} from '../home-page-client'

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
    locationType,
    exhibitorType,
    isCurrent,
    startDate,
    endDate,
    bgColor,
    "heroImageUrl": heroImages[0].asset->url,
    "galleryImageUrls": galleryImages[].asset->url,
    "guidePdfUrl": guidePdf.asset->url
  }
}`

function pickFeaturedHeroImage(exhibitions: GalleryExhibition[]): string | null {
  const galleryImage = exhibitions
    .flatMap((ex) => ex.galleryImageUrls || [])
    .find((url): url is string => Boolean(url))

  if (galleryImage) return galleryImage

  const heroImage = exhibitions
    .map((ex) => ex.heroImageUrl)
    .find((url): url is string => Boolean(url))

  return heroImage || null
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
