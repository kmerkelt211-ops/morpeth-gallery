import Image from 'next/image'
import RevealOnScroll from '../components/reveal-on-scroll'
import ContactForm from './contact-form'
import {
  getSupportPageData,
  type SupportPageData,
  type SupportPathway,
  type SupportPrintCard,
} from '../../sanity/lib/support-page'

type ResolvedPrintCard = {
  imageUrl: string
  alt: string
  title: string
  artist: string
  year?: number
  priceLabel: string
  availability: string
  ctaLabel: string
  href: string
}

const FALLBACK_PAGE: Required<
  Pick<
    SupportPageData,
    | 'pageTitle'
    | 'pageIntro'
    | 'heroImageUrl'
    | 'heroImageAlt'
    | 'heroPanelColor'
    | 'heroKicker'
    | 'heroHeadline'
    | 'heroBody'
    | 'primaryCtaLabel'
    | 'primaryCtaLink'
    | 'secondaryCtaLabel'
    | 'secondaryCtaLink'
    | 'supportStripTitle'
    | 'printsSectionTitle'
    | 'printsSectionIntro'
    | 'featuredPrintImageUrl'
    | 'featuredPrintImageAlt'
    | 'featuredPrintKicker'
    | 'featuredPrintTitle'
    | 'featuredPrintBody'
    | 'featuredPrintCtaLabel'
    | 'featuredPrintCtaLink'
    | 'contactSectionTitle'
    | 'contactSectionIntro'
    | 'contactEmail'
    | 'contactPhone'
    | 'contactNote'
    | 'formSubmitLabel'
    | 'formSuccessMessage'
  >
> = {
  pageTitle: 'SUPPORT THE GALLERY',
  pageIntro:
    "The Portman Gallery is Morpeth School's dedicated exhibition space. Shows change throughout the year and are open to students, families and visitors by arrangement.",
  heroImageUrl: '/Contact.jpg',
  heroImageAlt: 'Student artwork and photographic collage',
  heroPanelColor: '#8CCFD6',
  heroKicker: 'SUPPORT',
  heroHeadline: 'Help the Portman Gallery grow',
  heroBody:
    'Sales of books and prints, donations and partnerships help us fund new shows, commission projects and provide opportunities for young people at Morpeth.',
  primaryCtaLabel: 'Get in touch',
  primaryCtaLink: '#contact',
  secondaryCtaLabel: 'Browse prints',
  secondaryCtaLink: '#prints',
  supportStripTitle: 'Support pathways',
  printsSectionTitle: 'Prints and editions',
  printsSectionIntro:
    'A curated selection of work available to collect. Every purchase feeds directly back into materials, production and exhibition opportunities.',
  featuredPrintImageUrl: '/about-page/T16241_10.jpg',
  featuredPrintImageAlt: 'Detail of a reference painting used in student workshops',
  featuredPrintKicker: 'Featured print',
  featuredPrintTitle: 'Collect work from the Portman Gallery programme',
  featuredPrintBody:
    'Explore limited runs and open editions connected to current and recent exhibitions.',
  featuredPrintCtaLabel: 'View all prints',
  featuredPrintCtaLink: '#contact',
  contactSectionTitle: 'Contact the gallery',
  contactSectionIntro:
    'Tell us what you are interested in and we will reply with options, prices and next steps.',
  contactEmail: 'info@morpeth.towerhamlets.sch.uk',
  contactPhone: '020 8981 0921',
  contactNote:
    'For school visits and group enquiries, include preferred dates and group size so we can plan with you.',
  formSubmitLabel: 'Send enquiry',
  formSuccessMessage: "Thanks - we'll get back to you shortly.",
}

const FALLBACK_PATHWAYS: SupportPathway[] = [
  {
    title: 'Print purchases',
    description: 'Buy student and reference prints. Proceeds support production and exhibition costs.',
  },
  {
    title: 'Donations',
    description: 'One-off and recurring donations support materials, framing and public events.',
  },
  {
    title: 'Partnerships',
    description: 'Collaborate with us on workshops, talks and community-facing projects.',
  },
  {
    title: 'Volunteer time',
    description: 'Support installs, private views and documentation across the gallery year.',
  },
]

const FALLBACK_PRINT_CARDS: ResolvedPrintCard[] = [
  {
    imageUrl: '/about-page/Picasso_The_Three_Dancers.width-1440.jpg',
    alt: 'The Three Dancers painting reference',
    title: 'Reference Wall: Movement',
    artist: 'Workshop reference',
    year: 2024,
    priceLabel: 'From £45',
    availability: 'Open edition print',
    ctaLabel: 'Buy print',
    href: '#contact',
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
    href: '#contact',
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
    href: '#contact',
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
    href: '#contact',
  },
]

function asText(value: string | undefined, fallback: string): string {
  const normalized = value?.trim()
  return normalized ? normalized : fallback
}

function asColor(value: string | undefined, fallback: string): string {
  const normalized = value?.trim()
  if (!normalized) return fallback
  const isHex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(normalized)
  return isHex ? normalized : fallback
}

function asHref(value: string | undefined, fallback: string): string {
  const normalized = value?.trim()
  return normalized ? normalized : fallback
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

function resolvePrintHref(card: SupportPrintCard): string {
  if (card.purchaseUrl?.trim()) return card.purchaseUrl.trim()
  if (card.exhibitionSlug?.trim()) return `/${card.exhibitionSlug.trim()}`
  return '#contact'
}

function buildPathways(pathways: SupportPathway[] | undefined): SupportPathway[] {
  const valid = (pathways || []).filter((item) => Boolean(item.title?.trim()))
  if (valid.length >= 2) return valid.slice(0, 6)
  return FALLBACK_PATHWAYS
}

function buildPrintCards(cards: SupportPrintCard[] | undefined): ResolvedPrintCard[] {
  const validCards = (cards || [])
    .filter((item) => Boolean(item.imageUrl) && Boolean(item.title?.trim()))
    .slice(0, 8)
    .map((item) => ({
      imageUrl: item.imageUrl || FALLBACK_PRINT_CARDS[0].imageUrl,
      alt: item.alt || `${item.title || 'Print'} image`,
      title: item.title || 'Untitled print',
      artist: item.artist || 'Portman Gallery',
      year: item.year,
      priceLabel: item.priceLabel || 'Price on request',
      availability: item.availability || 'Availability varies',
      ctaLabel: item.ctaLabel || 'More info',
      href: resolvePrintHref(item),
    }))

  return validCards.length ? validCards : FALLBACK_PRINT_CARDS
}

type SupportPathwayIconKind = 'ticket' | 'donation' | 'partnership' | 'volunteer' | 'default'

function resolveSupportPathwayIconKind(title: string, index: number): SupportPathwayIconKind {
  const normalized = title.trim().toLowerCase()
  if (normalized.includes('print') || normalized.includes('purchase')) return 'ticket'
  if (normalized.includes('donation') || normalized.includes('fund')) return 'donation'
  if (normalized.includes('partner') || normalized.includes('collab')) return 'partnership'
  if (normalized.includes('volunteer') || normalized.includes('time')) return 'volunteer'

  const fallbackKinds: SupportPathwayIconKind[] = ['ticket', 'donation', 'partnership', 'volunteer']
  return fallbackKinds[index % fallbackKinds.length] ?? 'default'
}

function SupportPathwayIcon({ kind }: { kind: SupportPathwayIconKind }) {
  if (kind === 'ticket') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-14 w-14 text-neutral-800" fill="none">
        <path
          d="M12 20h40v8c-3 0-5 2-5 4s2 4 5 4v8H12v-8c3 0 5-2 5-4s-2-4-5-4v-8z"
          stroke="currentColor"
          strokeWidth="2.25"
        />
        <path d="M28 22v20" stroke="currentColor" strokeWidth="2.25" strokeDasharray="2.5 3.5" />
      </svg>
    )
  }

  if (kind === 'donation') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-14 w-14 text-neutral-800" fill="none">
        <path
          d="M31 49s-15-9.5-19-18c-3.1-6.6-.4-14.8 7.5-16.2 5.4-1 9.3 1.6 11.5 5.4 2.2-3.8 6.1-6.4 11.5-5.4 7.9 1.4 10.6 9.6 7.5 16.2-4 8.5-19 18-19 18z"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (kind === 'partnership') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-14 w-14 text-neutral-800" fill="none">
        <circle cx="22" cy="21" r="6.5" stroke="currentColor" strokeWidth="2.25" />
        <circle cx="42" cy="21" r="6.5" stroke="currentColor" strokeWidth="2.25" />
        <path
          d="M11 46v-2.8c0-5.5 4.5-10 10-10h2c5.5 0 10 4.5 10 10V46"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
        <path
          d="M31 46v-2.8c0-5.5 4.5-10 10-10h2c5.5 0 10 4.5 10 10V46"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (kind === 'volunteer') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-14 w-14 text-neutral-800" fill="none">
        <rect x="10" y="14" width="44" height="38" rx="4" stroke="currentColor" strokeWidth="2.25" />
        <path d="M10 26h44" stroke="currentColor" strokeWidth="2.25" />
        <path d="M21 10v8M43 10v8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
        <path d="M31.8 34.8l1.8-4.3 1.8 4.3 4.7.4-3.6 3 1.1 4.6-4-2.5-4 2.5 1.1-4.6-3.6-3 4.7-.4z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-14 w-14 text-neutral-800" fill="none">
      <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="2.25" />
    </svg>
  )
}

function renderActionLink(
  href: string,
  label: string,
  className: string,
  ariaLabel?: string
) {
  const external = isExternalHref(href)
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {label} <span aria-hidden>→</span>
    </a>
  )
}

export default async function SupportPage() {
  const pageData = await getSupportPageData()

  const pageTitle = asText(pageData?.pageTitle, FALLBACK_PAGE.pageTitle)
  const pageIntro = asText(pageData?.pageIntro, FALLBACK_PAGE.pageIntro)
  const heroImageUrl = asText(pageData?.heroImageUrl, FALLBACK_PAGE.heroImageUrl)
  const heroImageAlt = asText(pageData?.heroImageAlt, FALLBACK_PAGE.heroImageAlt)
  const heroPanelColor = asColor(pageData?.heroPanelColor, FALLBACK_PAGE.heroPanelColor)
  const heroKicker = asText(pageData?.heroKicker, FALLBACK_PAGE.heroKicker)
  const heroHeadline = asText(pageData?.heroHeadline, FALLBACK_PAGE.heroHeadline)
  const heroBody = asText(pageData?.heroBody, FALLBACK_PAGE.heroBody)
  const primaryCtaLabel = asText(pageData?.primaryCtaLabel, FALLBACK_PAGE.primaryCtaLabel)
  const primaryCtaLink = asHref(pageData?.primaryCtaLink, FALLBACK_PAGE.primaryCtaLink)
  const secondaryCtaLabel = asText(pageData?.secondaryCtaLabel, FALLBACK_PAGE.secondaryCtaLabel)
  const secondaryCtaLink = asHref(pageData?.secondaryCtaLink, FALLBACK_PAGE.secondaryCtaLink)

  const supportStripTitle = asText(pageData?.supportStripTitle, FALLBACK_PAGE.supportStripTitle)
  const pathways = buildPathways(pageData?.supportPathways)

  const printsSectionTitle = asText(pageData?.printsSectionTitle, FALLBACK_PAGE.printsSectionTitle)
  const printsSectionIntro = asText(pageData?.printsSectionIntro, FALLBACK_PAGE.printsSectionIntro)
  const featuredPrintImageUrl = asText(
    pageData?.featuredPrintImageUrl,
    FALLBACK_PAGE.featuredPrintImageUrl
  )
  const featuredPrintImageAlt = asText(
    pageData?.featuredPrintImageAlt,
    FALLBACK_PAGE.featuredPrintImageAlt
  )
  const featuredPrintKicker = asText(pageData?.featuredPrintKicker, FALLBACK_PAGE.featuredPrintKicker)
  const featuredPrintTitle = asText(pageData?.featuredPrintTitle, FALLBACK_PAGE.featuredPrintTitle)
  const featuredPrintBody = asText(pageData?.featuredPrintBody, FALLBACK_PAGE.featuredPrintBody)
  const featuredPrintCtaLabel = asText(
    pageData?.featuredPrintCtaLabel,
    FALLBACK_PAGE.featuredPrintCtaLabel
  )
  const featuredPrintCtaLink = asHref(pageData?.featuredPrintCtaLink, FALLBACK_PAGE.featuredPrintCtaLink)
  const printCards = buildPrintCards(pageData?.printCards)

  const contactSectionTitle = asText(
    pageData?.contactSectionTitle,
    FALLBACK_PAGE.contactSectionTitle
  )
  const contactSectionIntro = asText(pageData?.contactSectionIntro, FALLBACK_PAGE.contactSectionIntro)
  const contactEmail = asText(pageData?.contactEmail, FALLBACK_PAGE.contactEmail)
  const contactPhone = asText(pageData?.contactPhone, FALLBACK_PAGE.contactPhone)
  const contactNote = asText(pageData?.contactNote, FALLBACK_PAGE.contactNote)
  const formSubmitLabel = asText(pageData?.formSubmitLabel, FALLBACK_PAGE.formSubmitLabel)
  const formSuccessMessage = asText(
    pageData?.formSuccessMessage,
    FALLBACK_PAGE.formSuccessMessage
  )

  return (
    <main className="bg-morpeth-offwhite text-neutral-900">
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-[1520px] px-0 sm:px-4 lg:px-8">
          <RevealOnScroll className="support-page-enter overflow-hidden border border-slate-200 bg-white" effect="fade-in">
            <div className="grid lg:min-h-[470px] lg:grid-cols-2">
              <div
                className="relative order-2 px-6 py-8 sm:px-10 sm:py-10 lg:order-1 lg:flex lg:min-h-[470px] lg:flex-col lg:justify-start lg:px-12 lg:py-10 xl:px-14"
                style={{ backgroundColor: heroPanelColor }}
              >
                <RevealOnScroll effect="fade-right" className="max-w-3xl">
                  <h1 className="font-heading text-4xl uppercase tracking-[0.12em] text-neutral-900 sm:text-5xl lg:text-6xl">
                    {pageTitle}
                  </h1>
                  <p className="mt-4 text-base leading-relaxed text-neutral-800 sm:text-lg">{pageIntro}</p>
                </RevealOnScroll>

                <RevealOnScroll effect="fade-right" delay={90} className="mt-6 max-w-3xl">
                  <p className="font-heading text-[11px] uppercase tracking-[0.28em] text-neutral-800">{heroKicker}</p>
                  <h2 className="font-heading mt-5 text-3xl uppercase tracking-[0.08em] text-neutral-900 sm:text-4xl lg:text-[3.35rem] lg:leading-[0.95]">
                    {heroHeadline}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-neutral-900 sm:text-[1.12rem]">{heroBody}</p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {renderActionLink(
                      primaryCtaLink,
                      primaryCtaLabel,
                      'font-heading lux-hover-rise inline-flex min-h-11 items-center gap-2 bg-neutral-950 px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-white',
                      'Primary support action'
                    )}
                    {renderActionLink(
                      secondaryCtaLink,
                      secondaryCtaLabel,
                      'font-heading lux-hover-rise inline-flex min-h-11 items-center gap-2 border border-neutral-900 bg-white/85 px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-neutral-900',
                      'Secondary support action'
                    )}
                  </div>
                </RevealOnScroll>
              </div>

              <RevealOnScroll
                effect="fade-left"
                className="relative order-1 min-h-[260px] bg-neutral-200 sm:min-h-[360px] lg:order-2 lg:min-h-[540px]"
              >
                <Image
                  src={heroImageUrl}
                  alt={heroImageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              </RevealOnScroll>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#f3f3f3]">
        <div className="mx-auto max-w-[1520px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
          <RevealOnScroll>
            <h2 className="font-heading text-[11px] uppercase tracking-[0.32em] text-neutral-700">
              {supportStripTitle}
            </h2>
          </RevealOnScroll>

          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {pathways.map((item, index) => (
              <RevealOnScroll
                key={`${item.title || 'pathway'}-${index}`}
                delay={index * 45}
                effect="fade-up"
                className="flex h-full flex-col items-center text-center"
              >
                <div className="flex h-16 items-center justify-center">
                  <SupportPathwayIcon kind={resolveSupportPathwayIconKind(item.title || '', index)} />
                </div>
                <h3 className="mt-4 max-w-[16ch] font-heading text-[20px] uppercase leading-[1.25] tracking-[0.14em] text-neutral-800 sm:text-[24px]">
                  {item.title}
                </h3>
                <div className="mt-5 max-w-[26ch]">
                  {item.description ? (
                    <p className="text-lg leading-[1.4] text-neutral-800 sm:text-[22px]">{item.description}</p>
                  ) : null}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="prints" className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1520px] px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
          <RevealOnScroll>
            <h2 className="font-heading text-3xl uppercase tracking-[0.1em] text-neutral-900 sm:text-4xl">
              {printsSectionTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg">
              {printsSectionIntro}
            </p>
          </RevealOnScroll>

          <RevealOnScroll
            className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
            effect="wipe-right"
          >
            <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="relative min-h-[260px] sm:min-h-[330px] lg:min-h-[400px]">
                <Image
                  src={featuredPrintImageUrl}
                  alt={featuredPrintImageAlt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
              </div>
              <div className="flex items-center bg-[#f7f7f4] px-6 py-8 sm:px-8 lg:px-10">
                <div>
                  <p className="font-heading text-[11px] uppercase tracking-[0.28em] text-slate-700">
                    {featuredPrintKicker}
                  </p>
                  <h3 className="font-heading mt-4 text-2xl uppercase tracking-[0.08em] text-neutral-900 sm:text-3xl">
                    {featuredPrintTitle}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">{featuredPrintBody}</p>
                  <div className="mt-6">
                    {renderActionLink(
                      featuredPrintCtaLink,
                      featuredPrintCtaLabel,
                      'font-heading lux-hover-rise inline-flex min-h-11 items-center gap-2 border border-neutral-900 bg-neutral-900 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-white',
                      'Featured print action'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {printCards.map((card, index) => {
              const lineTwo = [card.artist, card.year].filter(Boolean).join(', ')
              return (
                <RevealOnScroll
                  key={`${card.title}-${index}`}
                  delay={index * 60}
                  effect="fade-up"
                  className="lux-hover-rise overflow-hidden rounded-xl border border-slate-200 bg-[#f2f2f2]"
                >
                  <div className="relative aspect-[4/3] bg-neutral-200">
                    <Image
                      src={card.imageUrl}
                      alt={card.alt}
                      fill
                      sizes="(min-width: 1280px) 23vw, (min-width: 640px) 48vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2 border-t border-slate-200 bg-white px-4 py-4">
                    <h4 className="text-2xl leading-tight text-neutral-900">{card.title}</h4>
                    {lineTwo ? <p className="text-sm text-slate-600">{lineTwo}</p> : null}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{card.priceLabel}</p>
                        <p className="text-xs text-slate-600">{card.availability}</p>
                      </div>
                      {renderActionLink(
                        card.href,
                        card.ctaLabel,
                        'font-heading lux-underline inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-900',
                        `${card.ctaLabel} for ${card.title}`
                      )}
                    </div>
                  </div>
                </RevealOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-morpeth-offwhite px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-[1200px]">
          <RevealOnScroll>
            <h2 className="font-heading text-3xl uppercase tracking-[0.1em] text-neutral-900 sm:text-4xl">
              {contactSectionTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg">
              {contactSectionIntro}
            </p>
          </RevealOnScroll>

          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:items-start">
            <RevealOnScroll
              delay={40}
              effect="fade-right"
              className="rounded-2xl border border-slate-200 bg-[#f7f7f4] p-6 sm:p-7"
            >
              <p className="font-heading text-[11px] uppercase tracking-[0.24em] text-slate-700">Support office</p>
              <div className="mt-5 space-y-4 text-sm text-slate-700 sm:text-base">
                <p>
                  <span className="font-heading mr-2 text-[10px] uppercase tracking-[0.2em] text-slate-600">
                    Email
                  </span>
                  <a href={`mailto:${contactEmail}`} className="lux-underline text-neutral-900">
                    {contactEmail}
                  </a>
                </p>
                <p>
                  <span className="font-heading mr-2 text-[10px] uppercase tracking-[0.2em] text-slate-600">
                    Phone
                  </span>
                  <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="lux-underline text-neutral-900">
                    {contactPhone}
                  </a>
                </p>
              </div>
              <p className="mt-5 border-t border-slate-300 pt-5 text-sm leading-relaxed text-slate-700 sm:text-base">
                {contactNote}
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={100} effect="fade-left">
              <ContactForm submitLabel={formSubmitLabel} successMessage={formSuccessMessage} />
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </main>
  )
}
