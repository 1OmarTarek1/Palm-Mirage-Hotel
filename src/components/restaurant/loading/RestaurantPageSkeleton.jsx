import { Skeleton } from "@/components/ui/skeleton";

export function RestaurantPageSkeleton() {
  return (
    <div className="text-foreground antialiased overflow-x-hidden">
      <header className="mb-10 grid min-h-[100dvh] gap-4 lg:min-h-0 lg:h-[min(100dvh,900px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-6">
        <div className="order-2 flex flex-col justify-between rounded-2xl border border-border/60 px-6 py-10 shadow-sm sm:px-10 lg:order-1 lg:px-12 lg:py-12">
          <div className="space-y-6">
            <Skeleton className="h-3 w-32 rounded-full sm:w-36" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-40 rounded-xl sm:h-14 sm:w-48" />
              <Skeleton className="h-12 w-52 rounded-xl sm:h-16 sm:w-64" />
            </div>
            <div className="max-w-md space-y-2">
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-4/5 rounded-full" />
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:mt-0">
            <Skeleton className="h-11 flex-1 rounded-full sm:max-w-[11rem]" />
            <Skeleton className="h-11 flex-1 rounded-full sm:max-w-[11rem]" />
          </div>
          <Skeleton className="mt-8 hidden h-3 w-24 rounded-full lg:block" />
        </div>
        <div className="relative order-1 min-h-[52vh] overflow-hidden rounded-2xl border border-border/60 bg-muted/30 lg:order-2 lg:min-h-0">
          <Skeleton className="absolute inset-0 rounded-2xl" />
          <div className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-auto lg:right-8 lg:max-w-xs">
            <div className="rounded-xl border border-border/40 bg-background/80 px-4 py-3 shadow-sm backdrop-blur-sm">
              <Skeleton className="h-2 w-20 rounded-full" />
              <Skeleton className="mt-2 h-1 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden border-0 py-3">
        <div className="flex w-max gap-10 px-6 sm:gap-12 sm:px-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={`rest-nav-${i}`} className="h-3 w-16 shrink-0 rounded-full sm:w-20" />
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden border-0 py-3">
        <div className="flex w-max gap-8 px-6 sm:gap-10 sm:px-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={`rest-tag-${i}`} className="h-3 w-24 shrink-0 rounded-full sm:w-28" />
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 md:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-3 lg:col-span-5">
            <Skeleton className="aspect-[3/4] w-full max-w-md rounded-2xl lg:max-w-none" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="aspect-[4/5] rounded-2xl" />
              <Skeleton className="mt-8 aspect-[4/5] rounded-2xl" />
            </div>
          </div>
          <div className="space-y-6 lg:col-span-7 lg:pt-6">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-10 w-full max-w-lg rounded-xl sm:h-12" />
            <Skeleton className="h-10 w-full max-w-md rounded-xl sm:h-11" />
            <Skeleton className="h-24 w-full max-w-xl rounded-2xl border-l-2 border-transparent pl-6" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`rest-contact-${i}`} className="rounded-2xl border border-border/60 p-5">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="mt-3 h-3 w-16 rounded-full" />
                  <Skeleton className="mt-2 h-4 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10" aria-hidden>
        <div className="flex gap-4 overflow-hidden px-4 sm:px-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={`rest-gal-${i}`}
              className="aspect-[4/5] w-[min(72vw,280px)] shrink-0 rounded-2xl sm:w-[min(50vw,320px)]"
            />
          ))}
        </div>
      </section>

      <RestaurantMenuSectionSkeleton />
      <RestaurantMenuSectionSkeleton reverse />

      <div className="mx-auto flex max-w-6xl justify-center px-4 py-12 sm:px-6">
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>

      <section className="mx-auto max-w-6xl border-t border-border/30 px-4 py-20 sm:px-6 md:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Skeleton className="aspect-[4/3] rounded-2xl lg:aspect-[5/6]" />
          <div className="space-y-4">
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="mt-8 h-11 w-48 rounded-full" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-border/30 px-4 py-20 sm:px-6 md:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-4 lg:order-1">
            <Skeleton className="h-3 w-36 rounded-full" />
            <Skeleton className="h-10 w-4/5 rounded-xl" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="mt-8 h-11 w-52 rounded-full" />
          </div>
          <Skeleton className="aspect-[4/3] rounded-2xl lg:order-2 lg:aspect-[5/6]" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl border-t border-border/30 px-4 pb-20 sm:px-6">
        <div className="scroll-mt-24 py-16 sm:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-24">
            <div className="max-w-md space-y-4">
              <Skeleton className="h-3 w-32 rounded-full" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-5/6 rounded-full" />
            </div>
            <div className="w-full space-y-5">
              <Skeleton className="h-12 w-full rounded-xl" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <Skeleton className="h-12 w-full max-w-xs rounded-xl" />
              <Skeleton className="h-40 w-full rounded-2xl border border-border/50" />
              <Skeleton className="h-14 w-full max-w-xs rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper skeletons for restaurant
function RestaurantMenuSectionSkeleton({ reverse = false }) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 grid items-center gap-10 md:mb-20 lg:grid-cols-12 lg:gap-14">
          <div className={`lg:col-span-5 ${reverse ? "lg:order-2" : ""}`}>
            <Skeleton className="mx-auto aspect-[4/5] max-h-[520px] w-full max-w-md rounded-2xl lg:mx-0" />
          </div>
          <div className={`space-y-4 lg:col-span-7 ${reverse ? "lg:order-1" : ""}`}>
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="h-10 w-48 rounded-xl sm:h-12 sm:w-56" />
            <Skeleton className="h-px w-16 rounded-full" />
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <RestaurantCarouselCardSkeleton key={`rest-cat-card-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RestaurantCarouselCardSkeleton() {
  return (
    <div className="flex h-full min-w-[min(72vw,280px)] sm:min-w-[min(50vw,320px)] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/40 shadow-sm">
      <Skeleton className="aspect-[4/3] w-full shrink-0 rounded-t-2xl" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-5 w-4/5 rounded-lg" />
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-3/5 rounded-full" />
        <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-4">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
        </div>
      </div>
    </div>
  );
}

