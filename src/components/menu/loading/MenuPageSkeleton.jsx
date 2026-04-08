import { Skeleton } from "@/components/ui/skeleton";

export function MenuPageSkeleton() {
  return (
    <div className="w-full flex-col pb-20 mt-2">
      <div className="mb-8">
        <div className="flex items-stretch border border-border rounded-2xl overflow-hidden divide-x divide-border shadow-sm">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`menu-tab-skeleton-${index}`}
              className="relative min-w-[120px] flex items-center gap-2 md:gap-3 px-3 md:px-6 py-4 flex-1 justify-center md:justify-start bg-card/10"
            >
              <Skeleton className="w-10 h-10 md:w-11 md:h-11 rounded-xl shrink-0" />
              <Skeleton className="hidden sm:block h-4 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-6 w-32 rounded-xl" />
          <div className="flex-1 h-px bg-border" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-9">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`menu-item-skeleton-${index}`} className="flex flex-col">
              <div className="-mx-3 mb-2 flex items-start gap-4 rounded-xl border-b border-border px-3 py-5">
                <Skeleton className="h-[68px] w-[68px] shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-4 w-2/3 rounded-lg" />
                    <Skeleton className="h-4 w-12 rounded-lg" />
                  </div>
                  <div className="border-b border-dotted border-border" />
                  <Skeleton className="h-3 w-full rounded-full" />
                  <Skeleton className="h-3 w-4/5 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Skeleton className="h-[300px] w-full rounded-3xl" />
    </div>
  );
}
