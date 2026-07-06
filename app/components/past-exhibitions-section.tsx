import Image from 'next/image'
import Link from 'next/link'

export type PastExhibitionItem = {
  _id: string
  title: string
  slug?: { current?: string }
  startDate?: string
  endDate?: string
  heroImageUrl?: string | null
}

function formatDate(value?: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function formatRange(startDate?: string, endDate?: string): string {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  if (start && end) return `${start} - ${end}`
  return start || end || ''
}

export default function PastExhibitionsSection({ items }: { items: PastExhibitionItem[] }) {
  if (!items.length) return null

  return (
    <section className="mb-16 border-t border-neutral-200 pt-10" aria-labelledby="past-exhibitions-heading">
      <h3
        id="past-exhibitions-heading"
        className="font-exhibitions text-[11px] uppercase tracking-[0.26em] text-neutral-600"
      >
        Past exhibitions
      </h3>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {items.map((item) => {
          const content = (
            <>
              <div className="relative aspect-[4/5] bg-neutral-100">
                {item.heroImageUrl ? (
                  <Image
                    src={item.heroImageUrl}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="mt-2">
                <p className="text-sm text-neutral-900">{item.title}</p>
                <p className="font-exhibitions mt-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                  {formatRange(item.startDate, item.endDate)}
                </p>
              </div>
            </>
          )

          return item.slug?.current ? (
            <Link key={item._id} href={`/${item.slug.current}`} className="block">
              {content}
            </Link>
          ) : (
            <div key={item._id}>{content}</div>
          )
        })}
      </div>
    </section>
  )
}
