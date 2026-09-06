function Shimmer({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={`skeleton-shimmer ${className ?? ''}`} {...props} />;
}

export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading clubhouse" className="space-y-8">
      <div className="border-b border-border pb-5">
        <Shimmer className="h-3 w-36" />
        <Shimmer className="mt-3 h-9 w-64 max-w-full" />
      </div>
      <div className="clubhouse-picks-grid">
        <div className="pick-spotlight space-y-5">
          <Shimmer className="h-3 w-32" />
          <Shimmer className="h-20 w-4/5" />
          <Shimmer className="h-12 w-full" />
          <Shimmer className="h-11 w-44" />
        </div>
        <div className="prediction-race space-y-5">
          <Shimmer className="h-7 w-48" />
          <Shimmer className="h-36 w-full" />
        </div>
      </div>
      <Shimmer className="h-7 w-52" />
      <Shimmer className="h-52 w-full" />
      <span className="sr-only">Loading league content.</span>
    </div>
  );
}

export function PicksSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading weekly picks"
      className="space-y-5"
    >
      <Shimmer className="h-9 w-3/4" />
      <Shimmer className="h-12 w-full" />
      <Shimmer className="h-28 w-full" />
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          className="grid grid-cols-2 gap-3 rounded-xl border border-border p-4"
        >
          <Shimmer className="h-36 w-full" />
          <Shimmer className="h-36 w-full" />
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="records-hero">
      <div className="relative z-10">
        <Shimmer className="h-3 w-40" />
        <Shimmer className="mt-3 h-9 w-64 sm:h-12 sm:w-96" />
        <Shimmer className="mt-2 h-9 w-48 sm:h-12 sm:w-72" />
        <Shimmer className="mt-4 hidden h-4 w-80 sm:block" />
      </div>
      <div className="relative z-10 grid grid-cols-3 gap-2 sm:max-w-md lg:ml-auto lg:w-full">
        {[0, 1, 2].map((i) => (
          <div key={i} className="record-stat">
            <Shimmer className="h-7 w-10 sm:h-8" />
            <Shimmer className="mt-1 h-2 w-12" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function StandingsSkeleton() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 border-b border-white/8 pb-6 sm:flex-row sm:items-end">
        <div>
          <Shimmer className="h-3 w-24" />
          <Shimmer className="mt-2 h-9 w-64 sm:h-12 sm:w-80" />
          <Shimmer className="mt-3 hidden h-4 w-96 sm:block" />
        </div>
        <Shimmer className="h-7 w-36 rounded-full" />
      </section>

      <section className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-white/[0.075] bg-card/90 p-4"
          >
            <Shimmer className="h-2.5 w-16" />
            <Shimmer className="mt-2 h-4 w-28" />
            <Shimmer className="mt-1 h-3 w-16" />
          </div>
        ))}
      </section>

      <section>
        <div className="mb-3">
          <Shimmer className="h-3 w-20" />
          <Shimmer className="mt-1 h-6 w-44" />
        </div>
        <div className="rounded-xl border border-white/[0.075] bg-card/90">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-b border-white/[0.055] px-4 py-3.5 last:border-0"
            >
              <Shimmer className="h-4 w-6" />
              <Shimmer className="size-7 rounded-full" />
              <Shimmer className="h-4 w-28" />
              <div className="ml-auto flex gap-6">
                <Shimmer className="h-3.5 w-12" />
                <Shimmer className="h-3.5 w-16" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function RecordsSkeleton() {
  return (
    <div className="space-y-7">
      <HeroSkeleton />

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <Shimmer className="h-3 w-32" />
            <Shimmer className="mt-1 h-6 w-40" />
          </div>
          <Shimmer className="h-5 w-28 rounded-full" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.075] bg-card/90 p-4"
            >
              <div className="flex items-center justify-between">
                <Shimmer className="h-4 w-10" />
                <Shimmer className="size-4 rounded" />
              </div>
              <div className="my-6 flex justify-center">
                <Shimmer className="size-14 rounded-full" />
              </div>
              <Shimmer className="mx-auto h-3 w-24" />
              <Shimmer className="mx-auto mt-1 h-2.5 w-32" />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]">
        <Shimmer className="h-96 rounded-xl" />
        <div className="space-y-2">
          <div className="mb-3">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="mt-1 h-6 w-20" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <Shimmer key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  );
}

export function ManagersSkeleton() {
  return (
    <div className="space-y-7">
      <HeroSkeleton />

      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/[0.075] bg-card/90 p-5 sm:p-6"
          >
            <div className="flex items-center gap-3">
              <Shimmer className="size-10 rounded-full" />
              <div>
                <Shimmer className="h-4 w-32" />
                <Shimmer className="mt-1 h-3 w-20" />
              </div>
              <Shimmer className="ml-auto size-5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WallOfShameSkeleton() {
  return (
    <div className="space-y-7">
      <HeroSkeleton />

      <section>
        <div className="mb-5">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="mt-1 h-6 w-36" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-white/[0.075] bg-card/90"
            >
              <div className="flex flex-col md:flex-row">
                <Shimmer className="aspect-[4/3] w-full shrink-0 rounded-none md:aspect-square md:w-72" />
                <div className="flex-1 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <Shimmer className="h-7 w-14" />
                    <Shimmer className="h-3 w-16" />
                  </div>
                  <div className="mt-3 flex items-center gap-2.5">
                    <Shimmer className="size-8 rounded-full" />
                    <Shimmer className="h-5 w-32" />
                  </div>
                  <Shimmer className="mt-3 h-4 w-full max-w-lg" />
                  <Shimmer className="mt-2 h-4 w-3/4 max-w-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
