export function RoomCardSkeleton() {
  return (
    <div className="bg-card rounded-3xl overflow-hidden shadow-sm animate-pulse h-full">
      <div className="h-48 bg-slate-200" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
        </div>
        <div className="flex gap-2 mt-4">
          <div className="h-9 flex-1 bg-slate-200 rounded" />
          <div className="h-9 w-9 bg-slate-200 rounded" />
          <div className="h-9 w-9 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}