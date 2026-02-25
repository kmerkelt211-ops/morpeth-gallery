import ClubsPageClient from './clubs-page-client'
import { getClubsPageData } from './page-data'

export default async function ClubsPage() {
  const pageData = await getClubsPageData()
  return <ClubsPageClient initialPageData={pageData} />
}
