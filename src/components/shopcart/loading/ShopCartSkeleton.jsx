import { Skeleton } from "@/components/ui/skeleton";

export function ShopCartSkeleton() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Cart Header */}
        <div className="mb-8">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="mt-2 h-4 w-64 rounded-full" />
        </div>

        {/* Empty Cart State */}
        <div className="flex flex-col items-center justify-center py-20">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="mt-6 h-8 w-64 rounded-xl" />
          <Skeleton className="mt-3 h-4 w-96 rounded-full" />
          <Skeleton className="mt-8 h-12 w-48 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ShopCartWithItemsSkeleton() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Cart Header */}
        <div className="mb-8">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="mt-2 h-4 w-64 rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`cart-item-${index}`} className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-24 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-full" />
                    <Skeleton className="h-4 w-2/3 rounded-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24 rounded-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <Skeleton className="h-6 w-32 rounded-lg mb-6" />
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 rounded-full" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-28 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded-full" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 rounded-full" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-20 rounded-lg" />
                    <Skeleton className="h-6 w-24 rounded-lg" />
                  </div>
                </div>

                <Skeleton className="mt-6 h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
      <div className="flex gap-4">
        <Skeleton className="h-24 w-24 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-2/3 rounded-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
