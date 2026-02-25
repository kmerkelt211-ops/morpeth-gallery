import Image from 'next/image'
import type { Club } from '../../../lib/clubs'

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-exhibitions inline-flex items-center rounded-full border border-neutral-900 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-neutral-900">
      {children}
    </span>
  )
}

export function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-4 text-sm">
      <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
        {label}
      </div>
      <div className="text-neutral-900">{value}</div>
    </div>
  )
}

export function Poster({ club }: { club: Club }) {
  return (
    <div className="flex h-full flex-col bg-white p-6">
      {club.posterImageUrl ? (
        <div className="relative mb-4 h-44 w-full overflow-hidden border border-neutral-200 bg-neutral-100">
          <Image
            src={club.posterImageUrl}
            alt={club.posterImageAlt || `${club.title} poster`}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
      ) : null}
      <div className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-700">
        {club.poster.kicker}
      </div>

      <div className="mt-5">
        <div className="font-exhibitions text-2xl tracking-[0.14em] text-neutral-900 md:text-3xl">
          {club.poster.headline}
        </div>
        <div className="mt-2 text-sm font-medium text-neutral-800">{club.poster.subline}</div>
      </div>
    </div>
  )
}
