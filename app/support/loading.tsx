export default function SupportLoading() {
  return (
    <main className="bg-morpeth-offwhite text-neutral-900">
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-[1520px] animate-pulse px-0 sm:px-4 lg:px-8">
          <div className="grid overflow-hidden border border-slate-200 bg-white lg:min-h-[470px] lg:grid-cols-2">
            <div className="order-2 space-y-4 bg-neutral-100 px-6 py-8 sm:px-10 sm:py-10 lg:order-1 lg:px-12 lg:py-10">
              <div className="h-10 w-64 rounded bg-neutral-200" />
              <div className="h-4 w-full max-w-md rounded bg-neutral-200" />
              <div className="mt-6 h-3 w-24 rounded bg-neutral-200" />
              <div className="h-12 w-80 rounded bg-neutral-200" />
              <div className="h-4 w-full max-w-lg rounded bg-neutral-200" />
              <div className="mt-6 flex gap-3">
                <div className="h-11 w-32 rounded bg-neutral-200" />
                <div className="h-11 w-32 rounded bg-neutral-200" />
              </div>
            </div>
            <div className="order-1 min-h-[260px] bg-neutral-200 sm:min-h-[360px] lg:order-2 lg:min-h-[540px]" />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#f3f3f3]">
        <div className="mx-auto max-w-[1520px] animate-pulse px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
          <div className="h-3 w-40 rounded bg-neutral-300" />
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-neutral-300" />
                <div className="h-4 w-32 rounded bg-neutral-300" />
                <div className="h-3 w-40 rounded bg-neutral-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1520px] animate-pulse px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="h-8 w-64 rounded bg-neutral-200" />
          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-neutral-200" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-slate-200 bg-[#f2f2f2]">
                <div className="aspect-[4/3] bg-neutral-200" />
                <div className="space-y-2 border-t border-slate-200 bg-white px-4 py-4">
                  <div className="h-5 w-2/3 rounded bg-neutral-200" />
                  <div className="h-3 w-1/2 rounded bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
