import { Skeleton } from "@/components/ui/skeleton";
import { RoomCardSkeleton } from "@/components/rooms/RoomCardSkeleton";

// Common reusable skeleton components
export function SectionIntroSkeleton({ compact = false }) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <Skeleton className="h-3 w-28 rounded-full" />
      <Skeleton className="h-9 w-56 rounded-xl" />
      <Skeleton className="h-4 w-full max-w-2xl rounded-full" />
      {!compact ? <Skeleton className="h-4 w-4/5 max-w-xl rounded-full" /> : null}
    </div>
  );
}

export function PillRowSkeleton({ count = 5 }) {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={`pill-skeleton-${index}`}
          className="h-14 min-w-[120px] flex-1 rounded-2xl sm:flex-none sm:w-[150px]"
        />
      ))}
    </div>
  );
}

export function StatsRowSkeleton({ count = 4 }) {
  return (
    <div className={`grid gap-6 ${count >= 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`stat-skeleton-${index}`} className="space-y-2">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Home page featured rooms skeleton */
export function HomeFeaturedRoomsSkeleton() {
  return (
    <section id="rooms" className="py-10 overflow-hidden mb-25">
      <div className="flex flex-col mb-8">
        <SectionIntroSkeleton />
      </div>

      <div className="relative">
        <div className="overflow-hidden p-1">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <RoomCardSkeleton />
            <RoomCardSkeleton />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full sm:hidden" />
          <Skeleton className="h-2.5 w-7 rounded-full" />
          <Skeleton className="h-2.5 w-2.5 rounded-full" />
          <Skeleton className="h-2.5 w-2.5 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full sm:hidden" />
        </div>
      </div>
    </section>
  );
}
