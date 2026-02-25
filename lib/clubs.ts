export type Club = {
  id: string
  slug: string
  title: string
  strand: string
  format: string
  day: string
  time: string
  location: string
  poster: {
    kicker: string
    headline: string
    subline: string
  }
  posterImageUrl?: string
  posterImageAlt?: string
  summary: string
  whatYoullDo: string[]
  goodFor: string[]
  kit: string[]
  signup: string
  ctaLabel: string
  accent?: string
}

export type SanityClub = {
  _key?: string
  title?: string
  strand?: string
  format?: string
  day?: string
  time?: string
  location?: string
  poster?: {
    kicker?: string
    headline?: string
    subline?: string
  }
  posterImageUrl?: string
  posterImageAlt?: string
  summary?: string
  whatYoullDo?: string[]
  goodFor?: string[]
  kit?: string[]
  signup?: string
  ctaLabel?: string
  accent?: string
}

export type FaqItem = {
  question: string
  answer: string
}

export type ClubsPageData = {
  title?: string
  kicker?: string
  headline?: string
  intro?: string
  heroImageUrl?: string
  heroImageAlt?: string
  heroPanelColor?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaHref?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaHref?: string
  badges?: string[]
  note?: string
  clubsSectionTitle?: string
  clubs?: SanityClub[]
  faqTitle?: string
  faqItems?: FaqItem[]
}

export function normalizeText(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed || fallback
}

export function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'club'
}

function normalizeClubId(value: string): string {
  return value.trim().toLowerCase()
}

export function mapSanityClubs(pageData: ClubsPageData | null): Club[] {
  const source = pageData?.clubs || []
  const usedSlugs = new Set<string>()

  return source
    .filter((club) => normalizeText(club?.title))
    .map((club, index) => {
      const fallbackId = `club-${index + 1}`
      const title = normalizeText(club.title, `Club ${index + 1}`)
      const rawId = normalizeText(club._key, fallbackId)
      const baseSlug = slugify(title)
      let slug = baseSlug
      let suffix = 2
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix}`
        suffix += 1
      }
      usedSlugs.add(slug)

      return {
        id: rawId,
        slug,
        title,
        strand: normalizeText(club.strand, 'Mixed media'),
        format: normalizeText(club.format, 'Lunchtime'),
        day: normalizeText(club.day, 'TBC'),
        time: normalizeText(club.time, 'TBC'),
        location: normalizeText(club.location, 'TBC'),
        poster: {
          kicker: normalizeText(club.poster?.kicker, 'PORTMAN GALLERY'),
          headline: normalizeText(club.poster?.headline, title.toUpperCase()),
          subline: normalizeText(club.poster?.subline, 'Create • Learn • Share'),
        },
        posterImageUrl: normalizeText(club.posterImageUrl) || undefined,
        posterImageAlt: normalizeText(club.posterImageAlt) || undefined,
        summary: normalizeText(club.summary, 'Details coming soon.'),
        whatYoullDo: normalizeStringArray(club.whatYoullDo),
        goodFor: normalizeStringArray(club.goodFor),
        kit: normalizeStringArray(club.kit),
        signup: normalizeText(club.signup, 'Drop-in'),
        ctaLabel: normalizeText(club.ctaLabel, 'More info'),
        accent: normalizeText(club.accent) || undefined,
      }
    })
}

export function mapFaqItems(pageData: ClubsPageData | null): FaqItem[] {
  const source = pageData?.faqItems || []
  return source.filter(
    (item): item is FaqItem =>
      Boolean(normalizeText(item?.question)) && Boolean(normalizeText(item?.answer))
  )
}

export function findClubByPathParam(clubs: Club[], rawParam: string): Club | null {
  let decodedParam = rawParam || ''
  try {
    decodedParam = decodeURIComponent(decodedParam)
  } catch {
    decodedParam = rawParam || ''
  }
  const normalizedParam = normalizeClubId(decodedParam)
  return (
    clubs.find((club) => normalizeClubId(club.slug) === normalizedParam) ||
    clubs.find((club) => normalizeClubId(club.id) === normalizedParam) ||
    null
  )
}
