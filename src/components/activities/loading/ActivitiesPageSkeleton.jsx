import { Skeleton } from "@/components/ui/skeleton";

export function ActivitiesPageSkeleton() {
  return (
    <div className="overflow-x-hidden text-foreground">
      <section className="relative mt-20 h-[60vh] overflow-hidden rounded-2xl lg:h-[75vh]">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="flex flex-col items-center space-y-3">
            <Skeleton className="h-5 w-48 rounded-full bg-white/20" />
            <Skeleton className="h-12 w-72 rounded-xl bg-white/20" />
          </div>
        </div>
      </section>

      <section className="py-15">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionIntroSkeleton />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
        <PillRowSkeleton count={6} />
      </section>

      <section className="space-y-20 pb-16 sm:pb-20 lg:space-y-28">
        <ActivityCardSkeleton />
        <ActivityCardSkeleton reverse />
        <ActivityCardSkeleton />
      </section>

      <div className="flex items-center justify-center gap-2 pb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={`activity-page-dot-${index}`} className="h-10 w-10 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function ActivityDetailPageSkeleton() {
  return (
    <div className="overflow-x-hidden text-foreground">
      <section className="relative overflow-hidden rounded-[2.5rem]">
        <Skeleton className="h-[55vh] w-full rounded-none" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10">
            <Skeleton className="h-10 w-44 rounded-full bg-white/20" />
            <div className="max-w-3xl space-y-3">
              <Skeleton className="h-3 w-24 rounded-full bg-white/20" />
              <Skeleton className="h-12 w-80 rounded-xl bg-white/20" />
              <Skeleton className="h-4 w-full max-w-2xl rounded-full bg-white/20" />
              <Skeleton className="h-4 w-5/6 max-w-xl rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="border-b border-border/50 pb-10">
          <StatsRowSkeleton count={4} />
        </div>

        <div className="pt-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <SectionIntroSkeleton compact />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-5/6 rounded-full" />
              <Skeleton className="h-4 w-4/5 rounded-full" />
            </div>
            <Skeleton className="min-h-[20rem] rounded-[2rem]" />
          </div>
        </div>

        <div className="pt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionIntroSkeleton compact />
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <SessionCardSkeleton />
            <SessionCardSkeleton />
            <SessionCardSkeleton />
            <SessionCardSkeleton />
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper skeletons for activities
function SectionIntroSkeleton({ compact = false }) {
  return (
    <div className="space-y-4">
      <Skeleton className={`h-3 w-32 rounded-full ${compact ? "h-2 w-24" : ""}`} />
      <Skeleton className={`h-8 w-64 rounded-xl sm:h-10 ${compact ? "h-6 w-48" : ""}`} />
      {!compact && (
        <Skeleton className="h-4 w-full max-w-lg rounded-full" />
      )}
    </div>
  );
}

function PillRowSkeleton({ count = 5 }) {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={`pill-${index}`} className="h-8 w-20 rounded-full" />
      ))}
    </div>
  );
}

function StatsRowSkeleton({ count = 4 }) {
  return (
    <div className={`grid gap-6 ${count >= 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`stat-${index}`} className="text-center">
          <Skeleton className="mx-auto h-8 w-16 rounded-xl" />
          <Skeleton className="mt-2 h-3 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function ActivityCardSkeleton({ reverse = false }) {
  return (
    <div
      className={`flex flex-col gap-10 lg:items-center lg:gap-16 ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="w-full lg:basis-[55%]">
        <Skeleton className="aspect-3/2 w-full rounded-[2.5rem]" />
      </div>

      <div className="space-y-6 lg:basis-[45%]">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-10 w-3/4 rounded-xl" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-5/6 rounded-full" />
          <Skeleton className="h-4 w-4/5 rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-6 border-t border-border/50 pt-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`activity-metric-${index}`} className="space-y-2">
              <Skeleton className="h-7 w-20 rounded-xl" />
              <Skeleton className="h-3 w-16 rounded-full" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function SessionCardSkeleton() {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40 rounded-xl" />
          <Skeleton className="h-4 w-28 rounded-full" />
        </div>
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-16 rounded-2xl" />
      </div>
    </div>
  );
}
