import { Skeleton } from "@/components/ui/skeleton";
import { RoomCardSkeleton } from "@/components/rooms/RoomCardSkeleton";

function SectionIntroSkeleton({ compact = false }) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <Skeleton className="h-3 w-28 rounded-full" />
      <Skeleton className="h-9 w-56 rounded-xl" />
      <Skeleton className="h-4 w-full max-w-2xl rounded-full" />
      {!compact ? <Skeleton className="h-4 w-4/5 max-w-xl rounded-full" /> : null}
    </div>
  );
}

function PillRowSkeleton({ count = 5 }) {
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

function StatsRowSkeleton({ count = 4 }) {
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

function BookingBarSkeleton() {
  return (
    <div className="w-full">
      <div className="border border-border/50 rounded-[2.5rem] bg-card p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`booking-segment-${index}`} className="rounded-3xl px-6 py-4">
                <Skeleton className="h-3 w-24 rounded-full" />
                <Skeleton className="mt-2 h-4 w-32 rounded-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-full lg:w-44" />
        </div>
      </div>
    </div>
  );
}

function RoomFilterSkeleton() {
  return (
    <div className="space-y-7 rounded-[2rem] border border-border bg-card p-6">
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <div key={`filter-section-${sectionIndex}`} className="space-y-3">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-5/6 rounded-full" />
          <Skeleton className="h-4 w-2/3 rounded-full" />
        </div>
      ))}
      <div className="space-y-3">
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}

function ProfileHeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-border/50 bg-[radial-gradient(circle_at_top_left,rgba(199,161,92,0.14),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.58))] p-8 shadow-sm backdrop-blur-xl dark:bg-[radial-gradient(circle_at_top_left,rgba(199,161,92,0.2),transparent_34%),linear-gradient(135deg,rgba(24,24,27,0.92),rgba(24,24,27,0.76))]">
      <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-5 top-5 z-10 flex items-center gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={`profile-hero-action-${index}`} className="h-10 w-10 rounded-full" />
        ))}
      </div>

      <div className="relative flex items-start gap-5">
        <Skeleton className="h-28 w-28 shrink-0 rounded-full border-4 border-primary/10" />

        <div className="flex-1 space-y-3 pt-2">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-10 w-60 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-2xl rounded-full" />
          <Skeleton className="h-4 w-5/6 max-w-xl rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ProfileSectionHeaderSkeleton({ withAction = true }) {
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

function ProfileOverviewCardSkeleton() {
  return (
    <div className="rounded-[1.75rem] border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-4/5 rounded-full" />
        </div>
        <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
      </div>
    </div>
  );
}

function ProfileBookingCardSkeleton() {
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

function ProfileSectionSkeleton({ cardCount = 3, showAction = true }) {
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

export function MenuPageSkeleton() {
  return (
    <div className="w-full min-h-[50vh]">
      <div className="mt-2 mb-8">
        <PillRowSkeleton count={5} />
      </div>

      <div className="mb-20">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-px flex-1 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-9">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`menu-item-${index}`} className="rounded-2xl border border-border/60 px-3 py-5">
              <div className="flex items-start gap-4">
                <Skeleton className="h-[68px] w-[68px] shrink-0 rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <Skeleton className="h-5 w-32 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <Skeleton className="h-px w-full rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                  <Skeleton className="h-4 w-4/5 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <div className="relative min-h-[500px] overflow-hidden rounded-3xl">
          <Skeleton className="absolute inset-0 rounded-none" />
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <Skeleton className="h-8 w-36 rounded-full bg-white/20" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-10 sm:px-8 md:px-12 md:pb-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <Skeleton className="h-3 w-32 rounded-full bg-white/20" />
                <Skeleton className="h-12 w-56 rounded-xl bg-white/20" />
                <Skeleton className="h-12 w-48 rounded-xl bg-white/20" />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-72 rounded-full bg-white/20" />
                  <Skeleton className="h-4 w-64 rounded-full bg-white/20" />
                </div>
                <Skeleton className="h-11 w-36 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

export function RoomsPageSkeleton({ count = 8 }) {
  return (
    <section className="text-center">
      <div className="mb-10">
        <div className="mt-12">
          <BookingBarSkeleton />
        </div>
      </div>

      <div className="mb-6 flex justify-end px-4 lg:hidden">
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-9">
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
                <Skeleton className="h-4 w-5/6 rounded-full" />
                <Skeleton className="h-4 w-4/5 rounded-full" />
              </div>
            </section>

            <div className="flex justify-center py-1">
              <Skeleton className="h-px w-full max-w-5xl rounded-full" />
            </div>

            <section className="space-y-10">
              {Array.from({ length: 3 }).map((_, sectionIndex) => (
                <div key={`room-amenity-group-${sectionIndex}`}>
                  <Skeleton className="mb-6 h-8 w-48 rounded-xl" />
                  <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((__, itemIndex) => (
                      <div key={`room-detail-item-${sectionIndex}-${itemIndex}`} className="flex items-center gap-3">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-28 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <div className="flex justify-center py-1">
              <Skeleton className="h-px w-full max-w-5xl rounded-full" />
            </div>

            <section>
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-56 rounded-xl" />
                  <Skeleton className="h-4 w-72 rounded-full" />
                </div>
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
              <Skeleton className="h-[26rem] w-full rounded-[26px]" />
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={`availability-summary-${index}`} className="h-20 rounded-2xl" />
                ))}
              </div>
            </section>

            <div className="flex justify-center py-1">
              <Skeleton className="h-px w-full max-w-5xl rounded-full" />
            </div>

            <section>
              <Skeleton className="mb-8 h-8 w-52 rounded-xl" />
              <div className="space-y-8">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={`policy-item-${index}`} className="relative pl-14">
                    <Skeleton className="absolute left-0 top-0 h-9 w-9 rounded-full" />
                    <Skeleton className="h-6 w-48 rounded-full" />
                    <div className="mt-3 space-y-2">
                      <Skeleton className="h-4 w-full rounded-full" />
                      <Skeleton className="h-4 w-5/6 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-center py-1">
              <Skeleton className="h-px w-full max-w-5xl rounded-full" />
            </div>

            <section>
              <Skeleton className="mb-6 h-8 w-64 rounded-xl" />
              <div className="space-y-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={`faq-item-${index}`} className="space-y-3 border-b border-border/40 pb-5">
                    <div className="flex items-center justify-between gap-4">
                      <Skeleton className="h-5 w-3/4 rounded-full" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-center py-1">
              <Skeleton className="h-px w-full max-w-5xl rounded-full" />
            </div>

            <section>
              <Skeleton className="mb-6 h-8 w-36 rounded-xl" />
              <div className="rounded-[28px] border border-border bg-muted/15 p-6">
                <div className="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)]">
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-28 rounded-xl" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={`review-bar-${index}`} className="grid grid-cols-[56px_minmax(0,1fr)_24px] items-center gap-3">
                        <Skeleton className="h-4 w-12 rounded-full" />
                        <Skeleton className="h-2 rounded-full" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div>
            <div className="space-y-6 rounded-[28px] border border-border bg-card p-6 shadow-sm">
              <div className="space-y-2">
                <Skeleton className="h-8 w-44 rounded-xl" />
                <Skeleton className="h-4 w-56 rounded-full" />
              </div>
              <Skeleton className="h-24 rounded-[24px]" />
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`booking-field-${index}`} className="space-y-2">
                  <Skeleton className="h-3 w-24 rounded-full" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
              <Skeleton className="h-28 rounded-[24px]" />
              <Skeleton className="h-24 rounded-[24px]" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>

        <section className="mb-10 mt-20">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-56 rounded-xl" />
              <Skeleton className="h-4 w-72 rounded-full" />
            </div>
            <Skeleton className="hidden h-10 w-40 rounded-xl sm:block" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <RoomCardSkeleton key={`similar-room-${index}`} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

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

export function ProfilePageSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ProfileHeroSkeleton />

      <div className="mt-8 space-y-6">
        <section>
          <ProfileSectionHeaderSkeleton withAction={false} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProfileOverviewCardSkeleton key={`profile-overview-card-${index}`} />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-end gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </section>

        <div className="py-4 sm:py-5" aria-hidden="true">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent" />
        </div>

        <ProfileSectionSkeleton />

        <div className="py-4 sm:py-5" aria-hidden="true">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent" />
        </div>

        <ProfileSectionSkeleton />

        <div className="py-4 sm:py-5" aria-hidden="true">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent" />
        </div>

        <ProfileSectionSkeleton />

        <div className="py-4 sm:py-5" aria-hidden="true">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent" />
        </div>

        <ProfileSectionSkeleton />

        <div className="py-4 sm:py-5" aria-hidden="true">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent" />
        </div>

        <ProfileSectionSkeleton />
      </div>
    </section>
  );
}
