import { Skeleton } from "@/components/ui/skeleton";

export function RoomCardSkeleton() {
  return (
    <div className="bg-card rounded-3xl overflow-hidden shadow-sm h-full border border-transparent">
      <Skeleton className="h-48 rounded-none bg-muted" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4 rounded-full" />
        <Skeleton className="h-4 w-1/2 rounded-full" />
        <div className="grid grid-cols-3 gap-2 mt-3">
          <Skeleton className="h-4 rounded-full" />
          <Skeleton className="h-4 rounded-full" />
          <Skeleton className="h-4 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
        </div>
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
