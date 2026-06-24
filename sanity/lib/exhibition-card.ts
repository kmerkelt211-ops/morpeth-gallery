import { groq } from 'next-sanity'
import { randomInt } from 'node:crypto'
import { IMAGE_PARAMS } from './image'

export type ExhibitionCard = {
  _id: string
  title: string
  subtitle?: string
  description?: string
  slug?: { current?: string }
  heroImageUrl?: string
  heroImageUrls?: string[]
  galleryImageUrls?: string[]
}

// Shared projection used by the staff, student and alumni listing pages -
// keeps the heroImage/galleryImage GROQ shape in one place so a fix (or a
// future field addition) only needs to happen here.
export const exhibitionCardProjection = groq`
  _id,
  title,
  subtitle,
  description,
  slug,
  "heroImageUrl": heroImages[0].asset->url + "${IMAGE_PARAMS}",
  "heroImageUrls": heroImages[]{ "url": asset->url + "${IMAGE_PARAMS}" }.url,
  "galleryImageUrls": galleryImages[]{ "url": asset->url + "${IMAGE_PARAMS}" }.url
`

export function pickRandomHeroImage(items: ExhibitionCard[]): string {
  const pool = items
    .flatMap((item) => [...(item.heroImageUrls || []), ...(item.galleryImageUrls || [])])
    .filter((url): url is string => Boolean(url))
    .filter((url, index, all) => all.indexOf(url) === index)

  if (!pool.length) return ''
  return pool[randomInt(pool.length)] || ''
}
