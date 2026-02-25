import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge, MetaRow, Poster } from './ui'
import { findClubByPathParam, mapSanityClubs } from '../../../lib/clubs'
import { getClubsPageData } from '../page-data'

export async function generateStaticParams() {
  const pageData = await getClubsPageData()
  const clubs = mapSanityClubs(pageData)
  return clubs.map((club) => ({ clubId: club.slug }))
}

export default async function ClubDetailsPage(props: {
  params: Promise<{ clubId: string }>
}) {
  const { clubId } = await props.params
  const pageData = await getClubsPageData()
  const clubs = mapSanityClubs(pageData)
  const club = findClubByPathParam(clubs, clubId)

  if (!club) notFound()

  return (
    <main className="relative min-h-screen bg-white px-6 py-16 text-neutral-900 md:px-10 lg:px-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 halftone-soft opacity-20"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/clubs#whats-running"
            className="font-exhibitions inline-flex items-center gap-2 border border-neutral-900 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900"
          >
            ← Back to clubs
          </Link>
          <p className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
            Club details
          </p>
        </div>

        <article className="grid border border-neutral-200 bg-white md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="border-b border-neutral-200 md:border-b-0 md:border-r">
            <Poster club={club} />
          </div>
          <div className="p-6 pb-12 md:p-10 md:pb-16">
            <h1 className="font-exhibitions text-lg tracking-[0.12em] text-neutral-900">
              {club.title}
            </h1>

            <div className="mt-4 grid gap-3">
              <MetaRow label="When" value={`${club.day} • ${club.time}`} />
              <MetaRow label="Where" value={club.location} />
              <MetaRow label="Type" value={`${club.format} • ${club.strand}`} />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-neutral-800">{club.summary}</p>

            <div className="mt-5">
              <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                You&apos;ll do
              </div>
              {club.whatYoullDo.length ? (
                <ul className="mt-2 list-disc pl-5 text-sm text-neutral-800">
                  {club.whatYoullDo.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-neutral-700">Details coming soon.</p>
              )}
            </div>

            <div className="mt-5 grid gap-5">
              <div>
                <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                  Good for
                </div>
                {club.goodFor.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {club.goodFor.map((entry) => (
                      <span
                        key={entry}
                        className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-800"
                      >
                        {entry}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-neutral-700">Details coming soon.</p>
                )}
              </div>

              <div>
                <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                  Kit
                </div>
                {club.kit.length ? (
                  <ul className="mt-2 list-disc pl-5 text-sm text-neutral-800">
                    {club.kit.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-neutral-700">Details coming soon.</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>{club.signup}</Badge>
              <Badge>{club.day}</Badge>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}
