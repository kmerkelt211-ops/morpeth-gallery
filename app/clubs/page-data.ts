import { groq } from 'next-sanity'
import client from '../../sanity/lib/client'
import type { ClubsPageData } from '../../lib/clubs'

const clubsPageQuery = groq`*[_id == "page_clubs"][0]{
  title,
  kicker,
  headline,
  intro,
  "heroImageUrl": heroImage.asset->url,
  "heroImageAlt": heroImage.alt,
  heroPanelColor,
  heroPrimaryCtaLabel,
  heroPrimaryCtaHref,
  heroSecondaryCtaLabel,
  heroSecondaryCtaHref,
  badges,
  note,
  clubsSectionTitle,
  clubs[]{
    _key,
    title,
    strand,
    format,
    day,
    time,
    location,
    poster{
      kicker,
      headline,
      subline
    },
    "posterImageUrl": posterImage.asset->url,
    "posterImageAlt": coalesce(posterImage.alt, title),
    summary,
    whatYoullDo,
    goodFor,
    kit,
    signup,
    ctaLabel,
    accent
  },
  faqTitle,
  faqItems[]{
    question,
    answer
  }
}`

export async function getClubsPageData(): Promise<ClubsPageData | null> {
  try {
    const data = await client.fetch<ClubsPageData | null>(clubsPageQuery)
    return data && !Array.isArray(data) ? data : null
  } catch {
    return null
  }
}
