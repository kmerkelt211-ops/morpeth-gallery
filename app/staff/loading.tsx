export default function StaffLoading() {
  return (
    <main className="relative min-h-screen bg-white px-6 py-16 md:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div className="h-3 w-32 rounded bg-neutral-200" />
          <div className="h-3 w-40 rounded bg-neutral-200" />
        </div>
        <div className="mb-12 grid overflow-hidden border-y border-neutral-200 md:min-h-[460px] md:grid-cols-2">
          <div className="min-h-[300px] bg-neutral-200 md:min-h-full" />
          <div className="flex flex-col justify-center gap-4 bg-neutral-100 px-7 py-10 md:px-14 md:py-12">
            <div className="h-3 w-24 rounded bg-neutral-300" />
            <div className="h-10 w-48 rounded bg-neutral-300" />
            <div className="h-6 w-72 rounded bg-neutral-300" />
            <div className="h-4 w-full rounded bg-neutral-300" />
          </div>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="aspect-[4/5] bg-neutral-200" />
              <div className="h-4 w-2/3 rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
