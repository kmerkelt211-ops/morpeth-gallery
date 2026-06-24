import Image from 'next/image'
import Link from 'next/link'
import client from '../../sanity/lib/client'
import LightboxKeyboardControls from '../components/lightbox-keyboard-controls'
import RevealOnScroll from '../components/reveal-on-scroll'

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
      "locationType": select(
        locationType in ["portman", "portmanGallery"] => "portman",
        locationType in ["aroundSchool", "around-school", "around_school"] => "aroundSchool",
        locationType in ["external", "externalGallery", "external-gallery", "offsite", "offSite"] => "external",
        locationType in ["digital", "digitalOnly", "digital-only"] => "digital",
        null
      ),
      "exhibitorType": select(
        exhibitorType in ["student", "studentWork", "student-work"] => "student",
        exhibitorType in ["staffVisiting", "guestArtists", "guestArtist", "guest-artists", "staff"] => "staffVisiting",
        "other"
      ),
      isCurrent,
      startDate,
      endDate,
      bgColor,
      "viewLayout": select(
        viewLayout in ["whatsOn", "whats_on", "whatson", "event"] => "whatsOn",
        viewLayout == "digitalGallery" => "digitalGallery",
        null
      ),
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
            <RevealOnScroll effect="scale-in" className="relative mb-10 aspect-[4/3] w-full bg-neutral-200">
              <Image
                src={heroImageUrls[0]}
                alt={title}
                fill
                sizes="(min-width: 768px) 70vw, 100vw"
                className="object-cover"
                priority
              />
            </RevealOnScroll>
          )}

          {/* Two-column layout: text + info panel (Whitechapel-style) */}
          <section className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
            <RevealOnScroll effect="fade-right">
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
            </RevealOnScroll>

            <RevealOnScroll effect="fade-left" delay={90} className="space-y-6">
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
            </RevealOnScroll>
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
          <RevealOnScroll effect="fade-right">
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
          </RevealOnScroll>

          {heroImageUrls && heroImageUrls.length > 0 && (
            <RevealOnScroll effect="fade-left" delay={90} className="grid gap-4 md:grid-cols-2">
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
            </RevealOnScroll>
          )}
        </header>

        {bodyParas.length > 0 && (
          <RevealOnScroll className="mt-16 max-w-3xl">
            <h2 className="font-exhibitions mb-6 text-xs tracking-[0.35em] text-neutral-700">
              ABOUT
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-neutral-900">
              {bodyParas.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </RevealOnScroll>
        )}

        {seriesImages.length > 0 && (
          <section id="gallery" className="mt-16">
            <RevealOnScroll>
              <h2 className="font-exhibitions mb-6 text-xs tracking-[0.35em] text-neutral-700">
                IMAGE SERIES
              </h2>
            </RevealOnScroll>
            <div className="grid gap-6 md:grid-cols-3">
              {seriesImages.map((src, i) => (
                <RevealOnScroll key={`${src}-${i}`} delay={Math.min(i * 50, 250)}>
                  <a
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
                </RevealOnScroll>
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

              const stripWindow = 9
              const half = Math.floor(stripWindow / 2)
              let stripStart = Math.max(0, i - half)
              const stripEnd = Math.min(lightboxImages.length, stripStart + stripWindow)
              stripStart = Math.max(0, stripEnd - stripWindow)
              const stripIndexes = Array.from(
                { length: stripEnd - stripStart },
                (_, idx) => stripStart + idx
              )

              return (
                <div key={`lb-${src}-${i}`} id={`lb-${i}`} className="lb" role="dialog" aria-modal="true">
                  <a href="#exhibition-top" className="lb__backdrop" aria-label="Close fullscreen view" />

                  <div className="lb__shell">
                    <div className="lb__topbar">
                      <p className="lb__count">
                        {i + 1} / {lightboxImages.length}
                      </p>
                      <a href="#exhibition-top" className="lb__close" aria-label="Close">
                        ×
                      </a>
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

                    <div className="lb__caption">
                      <p className="lb__title">{title}</p>
                      <p className="lb__label">Image {i + 1} from this exhibition</p>
                    </div>

                    {lightboxImages.length > 1 && (
                      <div className="lb__strip" aria-label="Image navigation">
                        {stripIndexes.map((stripIndex) => (
                          <a
                            key={`lb-strip-${stripIndex}`}
                            href={`#lb-${stripIndex}`}
                            className={`lb__thumb ${stripIndex === i ? 'is-active' : ''}`}
                            aria-label={`Go to image ${stripIndex + 1}`}
                          >
                            <img
                              src={`${lightboxImages[stripIndex]}?w=112&h=112&fit=crop&auto=format`}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          </a>
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
                background: rgba(20, 20, 20, 0.55);
              }
              .lb__shell {
                position: relative;
                width: min(94vw, 1100px);
                height: min(92vh, 800px);
                display: grid;
                grid-template-rows: auto 1fr auto auto;
                gap: 0;
                background: #ffffff;
                border-radius: 14px;
                overflow: hidden;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
              }
              .lb:target .lb__shell {
                animation: lb-enter 220ms cubic-bezier(0.22, 1, 0.36, 1);
              }
              .lb__topbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                border-bottom: 1px solid #e5e5e5;
              }
              .lb__label,
              .lb__title,
              .lb__count {
                margin: 0;
              }
              .lb__count {
                font-size: 11px;
                letter-spacing: 0.14em;
                text-transform: uppercase;
                color: #171717;
                font-weight: 500;
              }
              .lb__inner {
                position: relative;
                overflow: hidden;
                background: #0a0a0a;
              }
              .lb__image {
                padding: clamp(10px, 1.4vw, 20px);
              }
              .lb__close {
                width: 32px;
                height: 32px;
                display: grid;
                place-items: center;
                color: #fff;
                text-decoration: none;
                font-size: 20px;
                line-height: 1;
                border-radius: 999px;
                background: #171717;
                transition: background-color 180ms ease, transform 180ms ease;
              }
              .lb__nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 40px;
                height: 40px;
                display: grid;
                place-items: center;
                z-index: 2;
                color: #171717;
                text-decoration: none;
                font-size: 24px;
                border-radius: 999px;
                background: #ffffff;
                box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
                user-select: none;
                transition: background-color 180ms ease, transform 180ms ease;
              }
              .lb__prev {
                left: 16px;
              }
              .lb__next {
                right: 16px;
              }
              .lb__caption {
                padding: 14px 18px;
                border-bottom: 1px solid #e5e5e5;
              }
              .lb__caption .lb__title {
                font-size: 13px;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #171717;
                font-weight: 600;
              }
              .lb__caption .lb__label {
                margin-top: 4px;
                font-size: 12px;
                color: #737373;
              }
              .lb__strip {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                gap: 8px;
                padding: 12px 18px;
              }
              .lb__thumb {
                position: relative;
                width: 56px;
                height: 56px;
                flex-shrink: 0;
                overflow: hidden;
                border-radius: 8px;
                opacity: 0.5;
                border: 2px solid transparent;
                transition: opacity 180ms ease, border-color 180ms ease;
              }
              .lb__thumb.is-active {
                opacity: 1;
                border-color: #171717;
              }
              @media (hover: hover) {
                .lb__close:hover {
                  background: #404040;
                }
                .lb__nav:hover {
                  transform: translateY(-50%) scale(1.06);
                }
                .lb__thumb:hover {
                  opacity: 0.85;
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
                }
                .lb__topbar {
                  padding: 10px 14px;
                }
                .lb__caption {
                  padding: 10px 14px;
                }
                .lb__strip {
                  padding: 10px 14px;
                }
                .lb__nav {
                  width: 36px;
                  height: 36px;
                  font-size: 20px;
                }
                .lb__prev {
                  left: 10px;
                }
                .lb__next {
                  right: 10px;
                }
                .lb__thumb {
                  width: 44px;
                  height: 44px;
                }
              }
            `}</style>
          </>
        )}
      </div>
    </main>
  )
}
