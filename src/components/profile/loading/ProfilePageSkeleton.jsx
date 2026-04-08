import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePageSkeleton() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading profile"
    >
      <ProfileHeroSkeleton />

      <div className="mt-8 space-y-6">
        {/* Overview */}
        <section>
          <ProfileSectionHeaderSkeleton withAction={false} />
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProfileOverviewCardSkeleton key={`profile-overview-card-${index}`} />
            ))}
          </div>
          <ProfileCarouselNavSkeleton />
        </section>

        <ProfileDividerSkeleton />

        {/* Room Bookings */}
        <ProfileSectionSkeleton />

        <ProfileDividerSkeleton />

        {/* Activity Bookings */}
        <ProfileSectionSkeleton />

        <ProfileDividerSkeleton />

        {/* Restaurant Bookings */}
        <ProfileSectionSkeleton />

        <ProfileDividerSkeleton />

        {/* Wishlist */}
        <ProfileSectionSkeleton />

        <ProfileDividerSkeleton />

        {/* Cart Sections (Unified) */}
        <ProfileCartSectionSkeleton />
      </div>
    </section>
  );
}

// Helper skeletons for profile
export function ProfileHeroSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2 px-1 sm:px-0">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={`profile-hero-action-${index}`} className="h-10 w-10 rounded-full" />
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[2.25rem] border border-border/50 bg-[radial-gradient(circle_at_top_left,rgba(199,161,92,0.14),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.58))] p-8 shadow-sm backdrop-blur-xl dark:bg-[radial-gradient(circle_at_top_left,rgba(199,161,92,0.2),transparent_34%),linear-gradient(135deg,rgba(24,24,27,0.92),rgba(24,24,27,0.76))]">
        <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-5">
            <Skeleton className="h-28 w-28 shrink-0 rounded-full border-4 border-primary/10 sm:h-32 sm:w-32" />

            <div className="flex w-full max-w-2xl flex-1 flex-col items-center space-y-3 lg:items-start lg:pt-2">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-10 w-52 rounded-xl sm:h-12 sm:w-64" />
              <Skeleton className="h-4 w-full max-w-2xl rounded-full" />
              <Skeleton className="h-4 w-5/6 max-w-xl rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSectionHeaderSkeleton({ withAction = true }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-8 w-44 rounded-xl" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full max-w-2xl rounded-full" />
          <Skeleton className="h-4 w-5/6 max-w-xl rounded-full" />
        </div>
      </div>

      {withAction ? <Skeleton className="h-9 w-28 rounded-xl" /> : null}
    </div>
  );
}

export function ProfileOverviewCardSkeleton() {
  return (
    <div className="flex h-full min-h-[9.5rem] flex-col rounded-[1.75rem] border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div>
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="mt-3 h-9 w-28 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-[14rem] rounded-full" />
            <Skeleton className="h-4 w-4/5 max-w-[12rem] rounded-full" />
          </div>
        </div>
        <Skeleton className="h-12 w-12 shrink-0 self-start rounded-2xl" />
      </div>
    </div>
  );
}

export function ProfileBookingCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-[1.75rem] border border-border/40 bg-background/45 p-5 shadow-sm backdrop-blur-sm">
      <div className="relative">
        <Skeleton className="aspect-[5/4] w-full rounded-[1.5rem]" />
        <Skeleton className="absolute left-3 top-3 h-7 w-28 rounded-full" />
        <div className="absolute right-3 top-3 flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-[4.5rem] rounded-full" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <Skeleton className="h-7 w-3/4 rounded-xl" />
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-5/6 rounded-full" />
      </div>

      <div className="mt-5 grid gap-3">
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-4/5 rounded-full" />
        <Skeleton className="h-4 w-3/5 rounded-full" />
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

export function ProfileSectionSkeleton({ cardCount = 3, showAction = true }) {
  return (
    <section>
      <ProfileSectionHeaderSkeleton withAction={showAction} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cardCount }).map((_, index) => (
          <ProfileBookingCardSkeleton key={`profile-section-card-${index}`} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </section>
  );
}

// Dish line card - matches profile restaurant cart carousel shape
export function ProfileRestaurantCartLineSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/40 bg-background/45 shadow-sm backdrop-blur-sm">
      <Skeleton className="aspect-[4/3] w-full shrink-0 rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-6 w-4/5 rounded-lg" />
          <Skeleton className="h-5 w-5 shrink-0 rounded-md" />
        </div>
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-2/3 rounded-full" />
      </div>
    </div>
  );
}

export function ProfileCarouselNavSkeleton() {
  return (
    <div className="mt-6 flex items-center justify-end gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  );
}

export function ProfileDividerSkeleton() {
  return (
    <div className="py-4 sm:py-5" aria-hidden="true">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent" />
    </div>
  );
}

// Cart section: restaurant sub-carousel + room sub-carousel (matches ProfileContentSections)
export function ProfileCartSectionSkeleton() {
  return (
    <section>
      <ProfileSectionHeaderSkeleton withAction />

      <div className="space-y-10">
        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-36 rounded-full" />
              <Skeleton className="h-4 w-full max-w-md rounded-full" />
            </div>
            <Skeleton className="h-9 w-40 shrink-0 rounded-full sm:ms-auto" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <ProfileRestaurantCartLineSkeleton key={`profile-cart-restaurant-${index}`} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-primary/15 bg-primary/8 px-5 py-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-32 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
            <Skeleton className="h-9 min-w-[10rem] rounded-full" />
          </div>

          <ProfileCarouselNavSkeleton />
        </div>

        {/* Activity Cart Subsection */}
        <div className="border-t border-border/40 pt-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-36 rounded-full" />
              <Skeleton className="h-4 w-full max-w-md rounded-full" />
            </div>
            <Skeleton className="h-9 w-40 shrink-0 rounded-full sm:ms-auto" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <ProfileRestaurantCartLineSkeleton key={`profile-cart-activity-${index}`} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-primary/15 bg-primary/8 px-5 py-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-32 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
            <Skeleton className="h-9 min-w-[10rem] rounded-full" />
          </div>

          <ProfileCarouselNavSkeleton />
        </div>

        <div className="border-t border-border/40 pt-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-4 w-full max-w-sm rounded-full" />
            </div>
            <Skeleton className="h-9 w-44 shrink-0 rounded-full sm:ms-auto" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <ProfileBookingCardSkeleton key={`profile-cart-room-${index}`} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-primary/15 bg-primary/8 px-5 py-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
            <Skeleton className="h-9 min-w-[9rem] rounded-full" />
          </div>

          <ProfileCarouselNavSkeleton />
        </div>
      </div>
    </section>
  );
}
