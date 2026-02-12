import Image from 'next/image'
import Link from 'next/link'
import client from '../../sanity/lib/client'
import LightboxKeyboardControls from '../components/lightbox-keyboard-controls'

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
      <main className="min-h-screen bg-neutral-50 px-6 py-16 md:px-10 lg:px-20">
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
    <main id="exhibition-top" className="min-h-screen bg-neutral-50 px-6 py-16 md:px-10 lg:px-20">
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
            <LightboxKeyboardControls imageCount={lightboxImages.length} />
            {lightboxImages.map((src, i) => {
              const prev = i === 0 ? lightboxImages.length - 1 : i - 1
              const next = i === lightboxImages.length - 1 ? 0 : i + 1

              return (
                <div key={`lb-${src}-${i}`} id={`lb-${i}`} className="lb" role="dialog" aria-modal="true">
                  <a href="#exhibition-top" className="lb__backdrop" aria-label="Close fullscreen view" />

                  <div className="lb__shell">
                    <div className="lb__meta">
                      <p className="lb__label">Artwork view</p>
                      <p className="lb__title">{title}</p>
                      <p className="lb__count">
                        {i + 1} / {lightboxImages.length}
                      </p>
                    </div>

                    <div className="lb__inner">
                      <Image
                        src={src}
                        alt={`${title} fullscreen image ${i + 1}`}
                        fill
                        sizes="100vw"
                        className="lb__image object-contain"
                        priority={i === 0}
                      />

                      <a href="#exhibition-top" className="lb__close" aria-label="Close">
                        ×
                      </a>
                      {lightboxImages.length > 1 && (
                        <>
                          <a href={`#lb-${prev}`} className="lb__nav lb__prev" aria-label="Previous image">
                            ‹
                          </a>
                          <a href={`#lb-${next}`} className="lb__nav lb__next" aria-label="Next image">
                            ›
                          </a>
                        </>
                      )}
                    </div>

                    {lightboxImages.length > 1 && (
                      <div className="lb__strip" aria-label="Image navigation">
                        {lightboxImages.map((_, stripIndex) => (
                          <a
                            key={`lb-strip-${stripIndex}`}
                            href={`#lb-${stripIndex}`}
                            className={`lb__dot ${stripIndex === i ? 'is-active' : ''}`}
                            aria-label={`Go to image ${stripIndex + 1}`}
                          />
                        ))}
                      </div>
                    )}
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
                padding: clamp(10px, 1.8vw, 24px);
              }
              .lb:target {
                display: flex;
              }
              .lb__backdrop {
                position: absolute;
                inset: 0;
                background:
                  radial-gradient(circle at 18% 18%, rgba(88, 137, 214, 0.18), transparent 42%),
                  radial-gradient(circle at 82% 85%, rgba(255, 255, 255, 0.09), transparent 44%),
                  rgba(5, 8, 16, 0.9);
                backdrop-filter: blur(12px);
              }
              .lb__shell {
                position: relative;
                width: min(94vw, 1280px);
                height: min(92vh, 860px);
                display: grid;
                grid-template-rows: auto 1fr auto;
                gap: 12px;
              }
              .lb:target .lb__shell {
                animation: lb-enter 260ms cubic-bezier(0.22, 1, 0.36, 1);
              }
              .lb__meta {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 0 4px;
                color: rgba(255, 255, 255, 0.9);
              }
              .lb__label,
              .lb__title,
              .lb__count {
                margin: 0;
              }
              .lb__label {
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.24em;
                opacity: 0.7;
              }
              .lb__title {
                font-size: 13px;
                letter-spacing: 0.14em;
                text-transform: uppercase;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .lb__count {
                margin-left: auto;
                font-size: 11px;
                letter-spacing: 0.14em;
                text-transform: uppercase;
                opacity: 0.8;
              }
              .lb__inner {
                position: relative;
                overflow: hidden;
                border-radius: 18px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                background:
                  linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03)),
                  rgba(0, 0, 0, 0.65);
                box-shadow:
                  0 28px 80px rgba(0, 0, 0, 0.55),
                  0 2px 0 rgba(255, 255, 255, 0.12) inset;
              }
              .lb__inner::after {
                content: '';
                position: absolute;
                inset: 0;
                pointer-events: none;
                background: radial-gradient(circle at center, transparent 45%, rgba(0, 0, 0, 0.25) 100%);
              }
              .lb__image {
                padding: clamp(14px, 1.8vw, 24px);
              }
              .lb__close {
                position: absolute;
                top: 16px;
                right: 16px;
                width: 42px;
                height: 42px;
                display: grid;
                place-items: center;
                z-index: 2;
                color: #fff;
                text-decoration: none;
                font-size: 30px;
                line-height: 1;
                border-radius: 999px;
                border: 1px solid rgba(255, 255, 255, 0.28);
                background: rgba(0, 0, 0, 0.35);
                backdrop-filter: blur(5px);
                transition: background-color 180ms ease, border-color 180ms ease, transform 180ms ease;
              }
              .lb__nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 46px;
                height: 46px;
                display: grid;
                place-items: center;
                z-index: 2;
                color: #fff;
                text-decoration: none;
                font-size: 30px;
                border-radius: 999px;
                border: 1px solid rgba(255, 255, 255, 0.28);
                background: rgba(0, 0, 0, 0.35);
                backdrop-filter: blur(5px);
                user-select: none;
                transition: background-color 180ms ease, border-color 180ms ease, transform 180ms ease;
              }
              .lb__prev {
                left: 16px;
              }
              .lb__next {
                right: 16px;
              }
              .lb__strip {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                gap: 6px;
                padding: 2px 0 0;
              }
              .lb__dot {
                width: 22px;
                height: 4px;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.35);
                transition: width 180ms ease, background-color 180ms ease, opacity 180ms ease;
              }
              .lb__dot.is-active {
                width: 40px;
                background: rgba(255, 255, 255, 0.95);
              }
              @media (hover: hover) {
                .lb__close:hover,
                .lb__nav:hover {
                  border-color: rgba(255, 255, 255, 0.6);
                  background: rgba(0, 0, 0, 0.55);
                  transform: translateY(-50%) scale(1.04);
                }
                .lb__close:hover {
                  transform: scale(1.04);
                }
                .lb__dot:hover {
                  background: rgba(255, 255, 255, 0.65);
                }
              }
              @keyframes lb-enter {
                0% {
                  opacity: 0;
                  transform: translateY(8px) scale(0.985);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
              @media (max-width: 640px) {
                .lb__shell {
                  width: 96vw;
                  height: 92vh;
                  gap: 10px;
                }
                .lb__meta {
                  gap: 8px;
                }
                .lb__label {
                  letter-spacing: 0.16em;
                }
                .lb__title {
                  font-size: 12px;
                  letter-spacing: 0.1em;
                }
                .lb__count {
                  font-size: 10px;
                }
                .lb__close {
                  top: 10px;
                  right: 10px;
                  width: 38px;
                  height: 38px;
                  font-size: 26px;
                }
                .lb__nav {
                  width: 38px;
                  height: 38px;
                  font-size: 24px;
                }
                .lb__prev {
                  left: 10px;
                }
                .lb__next {
                  right: 10px;
                }
                .lb__dot {
                  width: 16px;
                }
                .lb__dot.is-active {
                  width: 30px;
                }
              }
            `}</style>
          </>
        )}
      </div>
    </main>
  )
}
