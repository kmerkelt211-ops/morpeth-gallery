import Image from 'next/image'
import Link from 'next/link'
import client from '../../sanity/lib/client'

type PortableTextSpan = {
  _type: 'span'
  text?: string
}

type PortableTextBlock = {
  _type: 'block'
  children?: PortableTextSpan[]
}

export const revalidate = 60

type GalleryExhibition = {
  _id: string
  title: string
  subtitle?: string
  description?: string
  body?: PortableTextBlock[]
  slug?: { current: string }
  locationType?: 'portman' | 'aroundSchool' | 'external' | 'digital'
  exhibitorType?: 'student' | 'staffVisiting' | 'other'
  isCurrent?: boolean
  startDate?: string
  endDate?: string
  bgColor?: string
  heroImageUrls?: string[]
  galleryImageUrls?: string[]
  guidePdfUrl?: string
  viewLayout?: 'digitalGallery' | 'whatsOn'
  eventUrl?: string
  eventUrlLabel?: string
  venueName?: string
  venueAddress?: string
  venueWebsite?: string
}

export async function generateStaticParams() {
  const query = `*[_type == "galleryExhibition" && defined(slug.current) && !(_id in path("drafts.**"))]{
    "slug": slug.current
  }`
  const rows = (await client.fetch(query)) as { slug: string }[]
  return (rows || []).filter(r => !!r.slug).map(r => ({ slug: r.slug }))
}

async function getExhibition(slug: string): Promise<GalleryExhibition | null> {
  const query = `
    *[_type == "galleryExhibition" && slug.current == $slug][0]{
      _id,
      title,
      subtitle,
      description,
      body,
      slug,
      locationType,
      exhibitorType,
      isCurrent,
      startDate,
      endDate,
      bgColor,
      viewLayout,
      eventUrl,
      eventUrlLabel,
      venueName,
      venueAddress,
      venueWebsite,
      "heroImageUrls": heroImages[].asset->url,
      "galleryImageUrls": galleryImages[].asset->url,
      "guidePdfUrl": guidePdf.asset->url
    }
  `
  try {
    const ex = (await client.fetch(query, { slug })) as GalleryExhibition | null
    return ex || null
  } catch (err) {
    console.error('Error fetching gallery exhibition by slug', err)
    return null
  }
}

function formatDate(date?: string) {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return date
  }
}

// Simple “good enough for today” Portable Text -> paragraphs
function portableTextToParagraphs(value?: PortableTextBlock[]): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((b) => b && b._type === 'block' && Array.isArray(b.children))
    .map((b) => (b.children || []).map((c) => c.text || '').join(''))
    .map((t) => t.trim())
    .filter(Boolean)
}

export default async function GalleryExhibitionPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const exhibition = await getExhibition(slug)


  if (!exhibition) {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-24 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-exhibitions text-xs tracking-[0.35em] text-neutral-500">
            EXHIBITIONS
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
            Exhibition not found
          </h1>
          <p className="mt-4 text-sm text-neutral-700">
            We couldn&apos;t find this exhibition. It may have been removed or the link
            might be incorrect.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="font-exhibitions inline-flex items-center gap-2 border border-neutral-900 px-4 py-2 text-[11px] uppercase tracking-[0.26em]"
            >
              ← Back to exhibitions
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const {
    title,
    subtitle,
    description,
    locationType,
    exhibitorType,
    isCurrent,
    startDate,
    endDate,
    bgColor,
    heroImageUrls,
    galleryImageUrls,
    guidePdfUrl,
    body,
    viewLayout,
    eventUrl,
    eventUrlLabel,
    venueName,
    venueAddress,
    venueWebsite,
  } = exhibition

  const isDigital = locationType === 'digital'
  const layoutType: 'digitalGallery' | 'whatsOn' =
    viewLayout || (isDigital ? 'digitalGallery' : 'whatsOn')

  const listHref =
    exhibitorType === 'student'
      ? '/student'
      : exhibitorType === 'staffVisiting'
      ? '/guest-artists'
      : '/exhibitions'

  const bodyParas = portableTextToParagraphs(body)
  const seriesImages =
    galleryImageUrls && galleryImageUrls.length > 0
      ? galleryImageUrls
      : heroImageUrls && heroImageUrls.length > 2
      ? heroImageUrls.slice(2)
      : []

  const heroThumbs = heroImageUrls ? heroImageUrls.slice(0, 2) : []
  const lightboxImages = [...heroThumbs, ...seriesImages]

  if (layoutType === 'whatsOn') {
    const label = 'WHAT’S ON'

    return (
      <main
        className="min-h-screen bg-neutral-50 px-6 py-16 md:px-10 lg:px-20"
        style={{ backgroundColor: bgColor || '#F5F5F5' }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={listHref}
                className="font-exhibitions inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-neutral-800"
              >
                ← Back to list
              </Link>
              <Link
                href="/exhibitions"
                className="font-exhibitions inline-flex items-center gap-2 border border-neutral-900 px-3 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900"
              >
                Exhibitions home
              </Link>
            </div>
            {isCurrent && (
              <span className="font-exhibitions inline-flex items-center rounded-full border border-neutral-900 px-3 py-1 text-[10px] uppercase tracking-[0.26em]">
                Current exhibition
              </span>
            )}
          </div>

          {/* Hero image */}
          {heroImageUrls && heroImageUrls.length > 0 && (
            <div className="relative mb-10 aspect-[4/3] w-full bg-neutral-200">
              <Image
                src={heroImageUrls[0]}
                alt={title}
                fill
                sizes="(min-width: 768px) 70vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Two-column layout: text + info panel (Whitechapel-style) */}
          <section className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
            <article>
              <p className="font-exhibitions text-xs tracking-[0.35em] text-neutral-800">
                {label}
              </p>

              <h1 className="font-exhibitions mt-4 text-3xl font-normal tracking-[0.12em] text-neutral-900 md:text-4xl">
                {title}
              </h1>

              {subtitle && (
                <p className="mt-3 text-sm font-medium text-neutral-900">
                  {subtitle}
                </p>
              )}

              {(startDate || endDate) && (
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-neutral-700">
                  {formatDate(startDate)}
                  {endDate ? ` – ${formatDate(endDate)}` : ''}
                </p>
              )}

              {description && (
                <p className="mt-6 text-sm leading-relaxed text-neutral-900">
                  {description}
                </p>
              )}

              {bodyParas.length > 0 && (
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-neutral-900">
                  {bodyParas.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              )}
            </article>

            <aside className="space-y-6">
              <div className="border border-neutral-200 bg-white p-6 text-sm text-neutral-800">
                <h2 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                  Exhibition info
                </h2>

                <div className="mt-4 space-y-2">
                  {exhibitorType && (
                    <p>
                      <span className="font-semibold">Who:</span>{' '}
                      {exhibitorType === 'student'
                        ? 'Student work'
                        : exhibitorType === 'staffVisiting'
                        ? 'Guest artists'
                        : 'Collaborative / other'}
                    </p>
                  )}
                  {locationType && (
                    <p>
                      <span className="font-semibold">Where:</span>{' '}
                      {locationType === 'portman'
                        ? 'Portman Gallery (Morpeth School)'
                        : locationType === 'aroundSchool'
                        ? 'Around the school'
                        : locationType === 'external'
                        ? 'External gallery / venue'
                        : 'Digital-only'}
                    </p>
                  )}
                  {(startDate || endDate) && (
                    <p>
                      <span className="font-semibold">Dates:</span>{' '}
                      {formatDate(startDate)}
                      {endDate ? ` – ${formatDate(endDate)}` : ''}
                    </p>
                  )}
                  {venueName && (
                    <p>
                      <span className="font-semibold">Venue:</span> {venueName}
                    </p>
                  )}
                  {venueAddress && (
                    <p className="whitespace-pre-line">
                      <span className="font-semibold">Address:</span>{' '}
                      {venueAddress}
                    </p>
                  )}
                </div>

                {guidePdfUrl && (
                  <div className="mt-4">
                    <a
                      href={guidePdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-exhibitions inline-flex items-center gap-2 border border-neutral-900 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900"
                    >
                      Download exhibition guide <span aria-hidden>→</span>
                    </a>
                  </div>
                )}
                {eventUrl && (
                  <div className="mt-4">
                    <a
                      href={eventUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-exhibitions inline-flex items-center gap-2 border border-neutral-900 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900"
                    >
                      {eventUrlLabel || 'View event on gallery site'}
                      <span aria-hidden>↗</span>
                    </a>
                  </div>
                )}
                {venueWebsite && !eventUrl && (
                  <div className="mt-3 text-xs">
                    <a
                      href={venueWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2"
                    >
                      Visit venue website ↗
                    </a>
                  </div>
                )}
              </div>

              {seriesImages.length > 0 && (
                <div className="border border-neutral-200 bg-white p-6">
                  <h3 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                    Images
                  </h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {seriesImages.slice(0, 4).map((src, i) => (
                      <div
                        key={`${src}-${i}`}
                        className="relative aspect-[4/3] w-full bg-neutral-100"
                      >
                        <Image
                          src={src}
                          alt={`${title} image ${i + 1}`}
                          fill
                          sizes="(min-width: 768px) 20vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen px-6 py-16 md:px-10 lg:px-20"
      style={{ backgroundColor: bgColor || '#F5F5F5' }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={listHref}
              className="font-exhibitions inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-neutral-800"
            >
              ← Back to list
            </Link>
            <Link
              href="/exhibitions"
              className="font-exhibitions inline-flex items-center gap-2 border border-neutral-900 px-3 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900"
            >
              Exhibitions home
            </Link>
          </div>
          {isCurrent && (
            <span className="font-exhibitions inline-flex items-center rounded-full border border-neutral-900 px-3 py-1 text-[10px] uppercase tracking-[0.26em]">
              Current exhibition
            </span>
          )}
        </div>

        <header className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
          <div>
            <p className="font-exhibitions text-xs tracking-[0.35em] text-neutral-800">
              {isDigital ? 'DIGITAL EXHIBITION' : 'EXHIBITION'}
            </p>

            <h1 className="font-exhibitions mt-4 text-3xl font-normal tracking-[0.12em] text-neutral-900 md:text-4xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-3 text-sm font-medium text-neutral-900">{subtitle}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-700">
              {exhibitorType && (
                <span>
                  👥{' '}
                  {exhibitorType === 'student'
                    ? 'Student work'
                    : exhibitorType === 'staffVisiting'
                    ? 'Guest artists'
                    : 'Collaborative / other'}
                </span>
              )}
              {locationType && (
                <span>
                  📍{' '}
                  {locationType === 'portman'
                    ? 'Portman Gallery'
                    : locationType === 'aroundSchool'
                    ? 'Around the school'
                    : locationType === 'external'
                    ? 'External gallery'
                    : 'Digital-only'}
                </span>
              )}
              {(startDate || endDate) && (
                <span>
                  📅 {formatDate(startDate)}
                  {endDate ? ` – ${formatDate(endDate)}` : ''}
                </span>
              )}
            </div>

            {description && (
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-neutral-900">
                {description}
              </p>
            )}

            {guidePdfUrl && (
              <div className="mt-6">
                <a
                  href={guidePdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-exhibitions inline-flex items-center gap-2 border border-neutral-900 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900"
                >
                  Download exhibition guide <span aria-hidden>→</span>
                </a>
              </div>
            )}

            {isDigital && (
              <p className="mt-4 max-w-xl text-xs uppercase tracking-[0.16em] text-neutral-700">
                This is a digital-only exhibition. Explore the full series of works below.
              </p>
            )}
          </div>

          {heroImageUrls && heroImageUrls.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {heroImageUrls.slice(0, 2).map((src, i) => (
                <a
                  key={`${src}-${i}`}
                  href={`#lb-${i}`}
                  className="group block relative aspect-[4/3] bg-neutral-200"
                  aria-label={`Open image ${i + 1} fullscreen`}
                >
                  <Image
                    src={src}
                    alt={`${title} image ${i + 1}`}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </a>
              ))}
            </div>
          )}
        </header>

        {bodyParas.length > 0 && (
          <section className="mt-16 max-w-3xl">
            <h2 className="font-exhibitions mb-6 text-xs tracking-[0.35em] text-neutral-700">
              ABOUT
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-neutral-900">
              {bodyParas.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {seriesImages.length > 0 && (
          <section id="gallery" className="mt-16">
            <h2 className="font-exhibitions mb-6 text-xs tracking-[0.35em] text-neutral-700">
              IMAGE SERIES
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {seriesImages.map((src, i) => (
                <a
                  key={`${src}-${i}`}
                  href={`#lb-${i + heroThumbs.length}`}
                  className="group block relative aspect-[4/5] bg-neutral-200"
                  aria-label={`Open image ${i + 1} fullscreen`}
                >
                  <Image
                    src={src}
                    alt={`${title} image ${i + 1}`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        {lightboxImages.length > 0 && (
          <>
            {lightboxImages.map((src, i) => {
              const prev = i === 0 ? lightboxImages.length - 1 : i - 1
              const next = i === lightboxImages.length - 1 ? 0 : i + 1

              return (
                <div key={`lb-${src}-${i}`} id={`lb-${i}`} className="lb" role="dialog" aria-modal="true">
                  <a href="#gallery" className="lb__backdrop" aria-label="Close fullscreen view" />

                  <div className="lb__inner">
                    <Image
                      src={src}
                      alt={`${title} fullscreen image ${i + 1}`}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      priority={i === 0}
                    />

                    <a href="#gallery" className="lb__close" aria-label="Close">×</a>
                    <a href={`#lb-${prev}`} className="lb__nav lb__prev" aria-label="Previous image">‹</a>
                    <a href={`#lb-${next}`} className="lb__nav lb__next" aria-label="Next image">›</a>
                  </div>
                </div>
              )
            })}

            <style>{`
              .lb {
                position: fixed;
                inset: 0;
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 60;
                padding: 24px;
              }
              .lb:target {
                display: flex;
              }
              .lb__backdrop {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.92);
              }
              .lb__inner {
                position: relative;
                width: min(92vw, 1200px);
                height: min(90vh, 820px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                background: rgba(0, 0, 0, 0.35);
                backdrop-filter: blur(6px);
              }
              .lb__close {
                position: absolute;
                top: 12px;
                right: 14px;
                width: 40px;
                height: 40px;
                display: grid;
                place-items: center;
                color: white;
                text-decoration: none;
                font-size: 28px;
                line-height: 1;
                border: 1px solid rgba(255, 255, 255, 0.25);
                background: rgba(0, 0, 0, 0.35);
              }
              .lb__nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 44px;
                height: 44px;
                display: grid;
                place-items: center;
                color: white;
                text-decoration: none;
                font-size: 34px;
                border: 1px solid rgba(255, 255, 255, 0.25);
                background: rgba(0, 0, 0, 0.25);
                user-select: none;
              }
              .lb__prev {
                left: 12px;
              }
              .lb__next {
                right: 12px;
              }
              @media (max-width: 640px) {
                .lb {
                  padding: 12px;
                }
                .lb__inner {
                  width: 96vw;
                  height: 86vh;
                }
              }
            `}</style>
          </>
        )}
      </div>
    </main>
  )
}
