import { groq } from 'next-sanity'
import client from './client'

export type SupportPathway = {
  title?: string
  description?: string
}

export type SupportPrintCard = {
  imageUrl?: string
  alt?: string
  title?: string
  artist?: string
  year?: number
  priceLabel?: string
  availability?: string
  ctaLabel?: string
  purchaseUrl?: string
  exhibitionSlug?: string
}

export type SupportPageData = {
  pageTitle?: string
  pageIntro?: string
  heroImageUrl?: string
  heroImageAlt?: string
  heroPanelColor?: string
  heroKicker?: string
  heroHeadline?: string
  heroBody?: string
  primaryCtaLabel?: string
  primaryCtaLink?: string
  secondaryCtaLabel?: string
  secondaryCtaLink?: string
  supportStripTitle?: string
  supportPathways?: SupportPathway[]
  printsSectionTitle?: string
  printsSectionIntro?: string
  featuredPrintImageUrl?: string
  featuredPrintImageAlt?: string
  featuredPrintKicker?: string
  featuredPrintTitle?: string
  featuredPrintBody?: string
  featuredPrintCtaLabel?: string
  featuredPrintCtaLink?: string
  printCards?: SupportPrintCard[]
  contactSectionTitle?: string
  contactSectionIntro?: string
  contactEmail?: string
  contactPhone?: string
  contactNote?: string
  formSubmitLabel?: string
  formSuccessMessage?: string
}

export const supportPageQuery = groq`*[_id == "page_support"][0]{
  pageTitle,
  pageIntro,
  "heroImageUrl": heroImage.asset->url,
  "heroImageAlt": heroImage.alt,
  heroPanelColor,
  heroKicker,
  heroHeadline,
  heroBody,
  primaryCtaLabel,
  primaryCtaLink,
  secondaryCtaLabel,
  secondaryCtaLink,
  supportStripTitle,
  supportPathways[]{
    title,
    description
  },
  printsSectionTitle,
  printsSectionIntro,
  "featuredPrintImageUrl": featuredPrintImage.asset->url,
  "featuredPrintImageAlt": featuredPrintImage.alt,
  featuredPrintKicker,
  featuredPrintTitle,
  featuredPrintBody,
  featuredPrintCtaLabel,
  featuredPrintCtaLink,
  printCards[]{
    "imageUrl": image.asset->url,
    "alt": image.alt,
    title,
    artist,
    year,
    priceLabel,
    availability,
    ctaLabel,
    purchaseUrl,
    "exhibitionSlug": linkedExhibition->slug.current
  },
  contactSectionTitle,
  contactSectionIntro,
  contactEmail,
  contactPhone,
  contactNote,
  formSubmitLabel,
  formSuccessMessage
}`

export async function getSupportPageData(): Promise<SupportPageData | null> {
  try {
    const data = await client.fetch<SupportPageData | null>(supportPageQuery)
    return data && !Array.isArray(data) ? data : null
  } catch {
    return null
  }
}
