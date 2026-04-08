import { Skeleton } from "@/components/ui/skeleton";

function RoomCartCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[30px] border border-border/12 bg-card/12">
      <div className="flex flex-col lg:flex-row">
        <div className="relative h-56 w-full shrink-0 overflow-hidden lg:h-auto lg:w-[250px]">
          <Skeleton className="h-full w-full rounded-none" />
          <Skeleton className="absolute left-4 top-4 h-6 w-18 rounded-full" />
          <Skeleton className="absolute left-24 top-4 h-6 w-20 rounded-full" />
          <Skeleton className="absolute bottom-4 left-4 h-8 w-20 rounded-full" />
          <Skeleton className="absolute bottom-4 right-4 h-9 w-9 rounded-full" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-8 w-2/3 rounded-xl" />
              <Skeleton className="mt-3 h-4 w-28 rounded-full" />
            </div>
            <div className="flex shrink-0 items-center gap-2 self-start">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-44 rounded-full" />
            <Skeleton className="h-9 w-36 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>

          <div className="flex items-center justify-between border-t border-border/10 pt-5">
            <Skeleton className="h-7 w-24 rounded-lg" />
            <Skeleton className="h-3.5 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RestaurantCartCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[30px] border border-border/12 bg-card/12">
      <div className="flex flex-col lg:flex-row">
        <div className="relative flex h-56 w-full shrink-0 flex-col justify-between overflow-hidden bg-muted/10 p-4 lg:h-auto lg:w-[250px]">
          <Skeleton className="h-6 w-24 rounded-full" />

          <div className="flex flex-col items-center justify-center gap-3">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>

          <div className="flex justify-center">
            <Skeleton className="h-3.5 w-20 rounded-full" />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-8 w-60 rounded-xl" />
              <Skeleton className="mt-3 h-7 w-30 rounded-full" />
            </div>
            <div className="flex shrink-0 items-center gap-2 self-start">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-36 rounded-full" />
          </div>

          <div className="flex items-center justify-between border-t border-border/10 pt-5">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="h-3 w-28 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityCartCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[30px] border border-border/12 bg-card/12">
      <div className="flex flex-col lg:flex-row">
        <div className="relative h-56 w-full shrink-0 overflow-hidden lg:h-auto lg:w-[250px]">
          <Skeleton className="h-full w-full rounded-none" />
          <Skeleton className="absolute left-4 top-4 h-6 w-20 rounded-full" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-8 w-2/3 rounded-xl" />
              <Skeleton className="mt-3 h-4 w-full rounded-full" />
              <Skeleton className="mt-2 h-4 w-4/5 rounded-full" />
            </div>
            <div className="flex shrink-0 items-center gap-2 self-start">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-40 rounded-full" />
            <Skeleton className="h-9 w-30 rounded-full" />
            <Skeleton className="h-9 w-26 rounded-full" />
          </div>

          <div className="flex items-center justify-between border-t border-border/10 pt-5">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="h-3.5 w-32 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummarySkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border/12 bg-card/12 p-6 lg:min-h-[calc(100vh-7rem)]">
      <Skeleton className="h-7 w-36 rounded-xl" />

      <div className="mt-5 flex-1 space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`summary-line-${index}`} className="flex justify-between gap-3">
            <div className="min-w-0 flex-1 pr-2">
              <Skeleton className="h-4 w-3/4 rounded-full" />
              <Skeleton className="mt-2 h-3 w-1/2 rounded-full" />
            </div>
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        ))}

        <div className="border-t border-border/10 pt-3 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-3.5 w-28 rounded-full" />
            <Skeleton className="h-3.5 w-16 rounded-full" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3.5 w-24 rounded-full" />
            <Skeleton className="h-3.5 w-14 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border/10 pt-4">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-5/6 rounded-full" />
      </div>

      <Skeleton className="mt-5 h-12 w-full rounded-xl" />
    </div>
  );
}

export function ShopCartSkeleton() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <Skeleton className="h-28 w-28 rounded-full" />
          <Skeleton className="mt-6 h-6 w-56 rounded-xl" />
          <Skeleton className="mt-3 h-3.5 w-full max-w-md rounded-full" />
          <Skeleton className="mt-2 h-3.5 w-72 rounded-full" />
          <Skeleton className="mt-8 h-11 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ShopCartWithItemsSkeleton() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <RoomCartCardSkeleton />
            <RestaurantCartCardSkeleton />
            <ActivityCartCardSkeleton />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <OrderSummarySkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return <RoomCartCardSkeleton />;
}
