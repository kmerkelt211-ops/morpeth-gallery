import Link from 'next/link'
import Image from 'next/image'
import { randomInt } from 'node:crypto'
import RevealOnScroll from '../components/reveal-on-scroll'
import PrintCard from '../support/print-card'
import { getShopData, shuffle, type ShopProduct } from '../../sanity/lib/shop'

export const revalidate = 60

type ResolvedCard = {
  imageUrl: string
  alt: string
  title: string
  artist: string
  year?: number
  priceLabel: string
  availability: string
  ctaLabel: string
  href: string
  soldOut: boolean
}

const FALLBACK_PRODUCTS: ResolvedCard[] = [
  {
    imageUrl: '/about-page/Picasso_The_Three_Dancers.width-1440.jpg',
    alt: 'The Three Dancers painting reference',
    title: 'Reference Wall: Movement',
    artist: 'Workshop reference',
    year: 2024,
    priceLabel: 'From £45',
    availability: 'Open edition print',
    ctaLabel: 'Buy print',
    href: '/support?print=Reference%20Wall%3A%20Movement#contact',
    soldOut: false,
  },
  {
    imageUrl: '/about-page/T16241_10.jpg',
    alt: 'Abstract diagonal painting study',
    title: 'Colour Study Session',
    artist: 'Placement image',
    year: 2024,
    priceLabel: 'From £45',
    availability: 'Open edition print',
    ctaLabel: 'Buy print',
    href: '/support?print=Colour%20Study%20Session#contact',
    soldOut: false,
  },
  {
    imageUrl: '/about-page/Benedict_Enwonwu_Black_Culture.width-1440.jpg',
    alt: 'Benedict Enwonwu artwork reference',
    title: 'Figure and Symbol',
    artist: 'Placement image',
    year: 2024,
    priceLabel: 'From £60',
    availability: 'Limited run',
    ctaLabel: 'Buy print',
    href: '/support?print=Figure%20and%20Symbol#contact',
    soldOut: false,
  },
  {
    imageUrl: '/about-page/width-1200_TNCNkI1.jpg',
    alt: 'Studies on colour and form reference',
    title: 'Studies on Colour and Form',
    artist: 'Placement image',
    year: 2024,
    priceLabel: 'From £55',
    availability: 'Open edition print',
    ctaLabel: 'Buy print',
    href: '/support?print=Studies%20on%20Colour%20and%20Form#contact',
    soldOut: false,
  },
]

function isSoldOut(product: ShopProduct): boolean {
  if (product.inStock === false) return true
  return /sold out|unavailable|no longer available/i.test(product.availability || '')
}

function resolveHref(product: ShopProduct): string {
  if (product.purchaseUrl?.trim()) return product.purchaseUrl.trim()
  if (product.exhibitionSlug?.trim()) return `/${product.exhibitionSlug.trim()}`
  return `/support?print=${encodeURIComponent(product.title || 'this print')}#contact`
}

function resolveProducts(products: ShopProduct[]): ResolvedCard[] {
  const valid = products.filter((item) => Boolean(item.imageUrl) && Boolean(item.title?.trim()))
  if (!valid.length) return shuffle(FALLBACK_PRODUCTS)

  return shuffle(
    valid.map((item) => ({
      imageUrl: item.imageUrl as string,
      alt: item.alt || `${item.title} image`,
      title: item.title as string,
      artist: item.artist || 'Portman Gallery',
      year: item.year,
      priceLabel: item.priceLabel || 'Price on request',
      availability: item.availability || 'Availability varies',
      ctaLabel: item.ctaLabel || 'Buy print',
      href: resolveHref(item),
      soldOut: isSoldOut(item),
    }))
  )
}

export default async function ShopPage() {
  const { page, products } = await getShopData()
  const cards = resolveProducts(products)

  const featuredPool = cards.filter((card) => !card.soldOut)
  const featured = featuredPool.length > 0 ? featuredPool[randomInt(featuredPool.length)] : cards[0]

  const kicker = page?.kicker?.trim() || 'SHOP'
  const headline =
    page?.headline?.trim() || 'Collect work from the Portman Gallery programme'
  const intro =
    page?.intro?.trim() ||
    'Explore limited runs and open editions connected to current and recent exhibitions. Every purchase feeds directly back into the gallery programme.'
  const featuredKicker = page?.featuredKicker?.trim() || 'Featured print'
  const note = page?.note?.trim()
  const collectionNote = page?.collectionNote?.trim()

  return (
    <main className="relative min-h-screen bg-white px-6 py-16 text-neutral-900 md:px-10 lg:px-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 halftone-soft opacity-20" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/support#prints"
            className="font-exhibitions inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-neutral-800"
          >
            ← Back to support
          </Link>
          <span className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
            {kicker}
          </span>
        </div>

        <RevealOnScroll>
          <h1 className="font-exhibitions text-3xl uppercase tracking-[0.1em] text-neutral-900 sm:text-4xl">
            {headline}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-700 sm:text-lg">
            {intro}
          </p>
        </RevealOnScroll>

        {featured ? (
          <RevealOnScroll
            effect="wipe-right"
            className="mt-10 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100"
          >
            <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="relative min-h-[260px] sm:min-h-[330px] lg:min-h-[400px]">
                <Image
                  src={featured.imageUrl}
                  alt={featured.alt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
              </div>
              <div className="flex items-center bg-[#f7f7f4] px-6 py-8 sm:px-8 lg:px-10">
                <div>
                  <p className="font-exhibitions text-[11px] uppercase tracking-[0.28em] text-neutral-700">
                    {featuredKicker}
                  </p>
                  <h2 className="font-exhibitions mt-4 text-2xl uppercase tracking-[0.08em] text-neutral-900 sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-sm font-semibold text-neutral-900">{featured.priceLabel}</p>
                  <div className="mt-6">
                    <a
                      href={featured.href}
                      target={/^https?:\/\//i.test(featured.href) ? '_blank' : undefined}
                      rel={/^https?:\/\//i.test(featured.href) ? 'noopener noreferrer' : undefined}
                      className="lux-hover-rise font-exhibitions inline-flex items-center gap-2 border border-neutral-900 bg-neutral-900 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-white"
                    >
                      {featured.ctaLabel} <span aria-hidden>→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        ) : null}

        {collectionNote ? (
          <p className="mt-8 max-w-3xl border-l-2 border-neutral-900 pl-4 text-sm leading-relaxed text-neutral-800">
            {collectionNote}
          </p>
        ) : null}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => (
            <RevealOnScroll
              key={`${card.title}-${index}`}
              delay={Math.min(index * 60, 300)}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white"
            >
              <PrintCard card={card} />
            </RevealOnScroll>
          ))}
        </div>

        {note ? (
          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-neutral-600">{note}</p>
        ) : null}
      </div>
    </main>
  )
}
