import { groq } from 'next-sanity'
import client from './client'

export type ShopProduct = {
  _id?: string
  imageUrl?: string
  alt?: string
  title?: string
  artist?: string
  year?: number
  priceLabel?: string
  availability?: string
  inStock?: boolean
  isFeatured?: boolean
  ctaLabel?: string
  purchaseUrl?: string
  exhibitionSlug?: string
}

export type ShopPageData = {
  kicker?: string
  headline?: string
  intro?: string
  featuredKicker?: string
  note?: string
  collectionNote?: string
}

export const shopPageQuery = groq`{
  "page": *[_id == "page_shop"][0]{
    kicker,
    headline,
    intro,
    featuredKicker,
    note,
    collectionNote
  },
  "products": *[_type == "product"]{
    _id,
    "imageUrl": image.asset->url + "?w=1600&auto=format&q=82",
    "alt": image.alt,
    title,
    artist,
    year,
    priceLabel,
    availability,
    inStock,
    isFeatured,
    ctaLabel,
    purchaseUrl,
    "exhibitionSlug": linkedExhibition->slug.current
  }
}`

export async function getShopData(): Promise<{
  page: ShopPageData | null
  products: ShopProduct[]
}> {
  try {
    const data = await client.fetch<{ page: ShopPageData | null; products: ShopProduct[] }>(
      shopPageQuery
    )
    return {
      page: data?.page && !Array.isArray(data.page) ? data.page : null,
      products: Array.isArray(data?.products) ? data.products : [],
    }
  } catch {
    return { page: null, products: [] }
  }
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
