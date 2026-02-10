import { groq } from 'next-sanity'
import ClubsPageClient, { type ClubsPageData } from './clubs-page-client'
import client from '../../sanity/lib/client'

const clubsPageQuery = groq`*[_id == "page_clubs"][0]{
  title,
  kicker,
  headline,
  intro,
  badges,
  note
}`

async function getClubsPageData(): Promise<ClubsPageData | null> {
  try {
    const data = await client.fetch<ClubsPageData | null>(clubsPageQuery)
    return data && !Array.isArray(data) ? data : null
  } catch {
    return null
  }
}

export default async function ClubsPage() {
  const pageData = await getClubsPageData()

  return <ClubsPageClient initialPageData={pageData} />
}
