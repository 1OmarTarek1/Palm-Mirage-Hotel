import { Skeleton } from "@/components/ui/skeleton";

export function WishlistPageSkeleton() {
  return (
    <div className="min-h-screen py-3 px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-8 w-52 rounded-xl" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`wishlist-skeleton-${index}`}
              className="overflow-hidden rounded-[2rem] border border-border/40 bg-card/40 p-0"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-4 p-5">
                <Skeleton className="h-6 w-3/5 rounded-xl" />
                <Skeleton className="h-4 w-2/5 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsPageSkeleton() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <Skeleton className="mb-8 h-10 w-40 rounded-xl" />

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`settings-skeleton-${index}`}
            className="flex items-center justify-between rounded-2xl border border-border/40 bg-card/40 p-5"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-36 rounded-full" />
                <Skeleton className="h-3 w-56 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-9 w-20 rounded-xl" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function CheckoutPageSkeleton() {
  return (
    <div className="relative min-h-screen">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="rounded-3xl border border-border/40 bg-card/35 p-6 sm:p-8">
            <div className="space-y-3">
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="h-9 w-56 rounded-xl" />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={`checkout-field-${index}`} className="space-y-2">
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            <div className="rounded-3xl border border-border/40 bg-card/35 p-6">
              <Skeleton className="mb-6 h-8 w-36 rounded-xl" />

              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={`checkout-item-${index}`} className="space-y-2">
                    <Skeleton className="h-4 w-4/5 rounded-full" />
                    <Skeleton className="h-3 w-3/5 rounded-full" />
                  </div>
                ))}
              </div>

              <div className="my-6 border-t border-border/50" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/40 bg-card/35 p-6">
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
