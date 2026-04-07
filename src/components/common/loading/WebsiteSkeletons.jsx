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

export function HomeExperienceSkeleton() {
  return (
    <section className="py-10 mb-30">
      <div className="space-y-3 mb-6">
        <Skeleton className="h-4 w-40 rounded-full" />
        <Skeleton className="h-12 w-64 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        <Skeleton className="h-[420px] rounded-3xl lg:col-span-2" />
        <Skeleton className="h-[420px] rounded-3xl" />
        <Skeleton className="h-[420px] rounded-3xl" />
      </div>
    </section>
  );
}

export function HomeActivitiesSkeleton() {
  return (
    <section className="py-20 space-y-16">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={`home-activity-skeleton-${index}`} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-10 w-56 rounded-xl" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
            <div className="grid grid-cols-3 gap-3 pt-2">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-[320px] rounded-[2rem] lg:col-span-8" />
        </div>
      ))}
    </section>
  );
}

export function HomeTestimonialsSkeleton() {
  return (
    <section className="py-24 my-20 space-y-10">
      <div className="mx-auto max-w-5xl space-y-4 text-center">
        <Skeleton className="h-3 w-32 rounded-full mx-auto" />
        <Skeleton className="h-8 w-4/5 rounded-xl mx-auto" />
        <Skeleton className="h-8 w-3/5 rounded-xl mx-auto" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={`home-testimonial-image-skeleton-${index}`}
            className="h-52 w-44 shrink-0 rounded-3xl md:h-64 md:w-56"
          />
        ))}
      </div>
    </section>
  );
}

export function HomePlatformsSkeleton() {
  return (
    <section className="py-10 mb-20">
      <Skeleton className="h-10 w-96 max-w-full rounded-2xl mx-auto mb-12" />
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={`home-platform-skeleton-${index}`} className="h-12 rounded-xl" />
        ))}
      </div>
    </section>
  );
}

export function HomeAwardsSkeleton() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
        <Skeleton className="h-3 w-36 rounded-full mx-auto" />
        <Skeleton className="h-10 w-80 max-w-full rounded-2xl mx-auto" />
      </div>
      <div className="mx-auto max-w-5xl space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={`home-award-skeleton-${index}`} className="h-36 rounded-[2rem]" />
        ))}
      </div>
    </section>
  );
}

export function HomeContactSkeleton() {
  return (
    <section className="py-24">
      <Skeleton className="h-[420px] w-full rounded-[2.5rem]" />
    </section>
  );
}

export function HomeHeroSkeleton() {
  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 h-dvh overflow-hidden bg-black/70">
      <Skeleton className="absolute inset-0 rounded-none" />

      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-5 px-4 text-center">
        <Skeleton className="h-14 w-4/5 max-w-3xl rounded-2xl" />
        <Skeleton className="h-14 w-3/5 max-w-2xl rounded-2xl" />
        <Skeleton className="h-5 w-2/3 max-w-xl rounded-full" />
      </div>

      {/* Left vertical section navigator (match real home nav) */}
      <div className="absolute left-8 top-1/2 z-10 hidden -translate-y-1/2 lg:flex flex-col items-center">
        <Skeleton className="absolute top-[28px] bottom-[28px] w-[2px] rounded-full opacity-70" />
        <div className="relative flex flex-col gap-8 py-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={`hero-nav-dot-skeleton-${index}`} className="flex h-6 w-6 items-center justify-center">
              <Skeleton className={`${index === 0 ? "h-3 w-3" : "h-2.5 w-2.5"} rounded-full`} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile / tablet CTA placement */}
      <div className="pointer-events-none absolute inset-x-0 z-10 flex justify-center px-4 xl:hidden bottom-[max(10.5rem,34svh,calc(env(safe-area-inset-bottom,0px)+7.25rem))] sm:bottom-[max(11.75rem,31svh,calc(env(safe-area-inset-bottom,0px)+8rem))] md:bottom-[max(12.75rem,29svh,calc(env(safe-area-inset-bottom,0px)+8.5rem))]">
        <Skeleton className="pointer-events-auto h-12 w-44 rounded-full" />
      </div>

      {/* Desktop booking bar / check availability */}
      <div className="absolute bottom-24 left-0 z-10 hidden w-full px-4 xl:block md:bottom-20">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-20 w-full rounded-full" />
        </div>
      </div>

      {/* Right slide indicators */}
      <div className="absolute bottom-12 right-6 z-10 flex flex-col items-end gap-4 md:bottom-16 md:right-12 lg:right-12 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:gap-5">
        <Skeleton className="h-[2px] w-24 rounded-full" />
        <Skeleton className="h-[2px] w-18 rounded-full opacity-80" />
        <Skeleton className="h-[2px] w-13 rounded-full opacity-70" />
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2">
        <Skeleton className="h-2 w-16 rounded-full opacity-80" />
        <Skeleton className="h-12 w-[2px] rounded-full" />
      </div>
    </section>
  );
}
