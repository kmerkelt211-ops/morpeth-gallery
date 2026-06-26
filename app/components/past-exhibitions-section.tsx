import Link from 'next/link'

export type PastExhibitionItem = {
  _id: string
  title: string
  slug?: { current?: string }
  startDate?: string
  endDate?: string
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
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex flex-wrap items-baseline justify-between gap-2 border-b border-neutral-100 pb-3 text-sm"
          >
            {item.slug?.current ? (
              <Link href={`/${item.slug.current}`} className="lux-underline text-neutral-900">
                {item.title}
              </Link>
            ) : (
              <span className="text-neutral-900">{item.title}</span>
            )}
            <span className="font-exhibitions text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              {formatRange(item.startDate, item.endDate)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
