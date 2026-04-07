import { Skeleton } from "@/components/ui/skeleton";
import { RoomCardSkeleton } from "@/components/rooms/RoomCardSkeleton";

export function RoomsPageSkeleton({ count = 8 }) {
  return (
    <section className="text-center">
      <div className="mb-10 hidden lg:block">
        <div className="mt-12">
          <BookingBarSkeleton />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-9">
          <div className="mb-5 flex justify-center px-4 lg:hidden">
            <Skeleton className="h-12 w-full max-w-sm rounded-full" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: count }).map((_, index) => (
              <RoomCardSkeleton key={`rooms-page-card-${index}`} />
            ))}
          </div>
        </div>

        <div className="hidden lg:col-span-3 lg:block">
          <RoomFilterSkeleton />
        </div>

        <div className="col-span-12">
          <div className="mt-2 flex items-center justify-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`rooms-pagination-${index}`} className="h-10 w-10 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function RoomDetailsPageSkeleton() {
  return (
    <div className="min-h-screen text-foreground">
      <div className="container pb-10 font-main">
        <div className="mb-10">
          <Skeleton className="aspect-[4/5] w-full rounded-[28px] sm:aspect-video" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(340px,0.9fr)]">
          <div className="space-y-10">
            <section className="space-y-5">
              <Skeleton className="h-4 w-40 rounded-full" />
              <Skeleton className="h-12 w-80 rounded-xl" />
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={`room-tag-${index}`} className="h-10 w-32 rounded-full" />
                ))}
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-full" />
              </div>
            </section>

            <section className="space-y-5">
              <Skeleton className="h-4 w-32 rounded-full" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={`room-amenity-${index}`} className="h-16 rounded-xl" />
                ))}
              </div>
            </section>

            <section className="space-y-5">
              <Skeleton className="h-4 w-24 rounded-full" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={`room-rule-${index}`} className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded-full flex-shrink-0 mt-0.5" />
                    <Skeleton className="h-4 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-24">
              <div className="rounded-[2rem] border border-border/50 bg-card/60 p-6 backdrop-blur-sm">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-32 rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
              </div>

              <div className="mt-6">
                <Skeleton className="aspect-[4/3] w-full rounded-[2rem]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <RoomCardSkeleton key={`similar-room-${index}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper skeletons for rooms
function BookingBarSkeleton() {
  return (
    <div className="rounded-[2rem] border border-border/50 bg-card/60 p-6 backdrop-blur-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

function RoomFilterSkeleton() {
  return (
    <div className="rounded-[2rem] border border-border/50 bg-card/60 p-6 backdrop-blur-sm">
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24 rounded-full" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`filter-${index}`} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-20 rounded-full" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={`price-filter-${index}`} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
