import { Skeleton } from "@/components/ui/skeleton";

export function ContactPageSkeleton() {
  return (
    <section className="container mx-auto my-10 max-w-full text-center text-foreground">
      <div className="relative w-screen left-1/2 -translate-x-1/2 min-h-[380px] h-[min(72vh,760px)] overflow-hidden rounded-none border-y border-border/60 bg-muted/30 dark:bg-muted/20">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Skeleton className="h-6 w-48 rounded-full bg-white/20" />
            <Skeleton className="h-12 w-64 rounded-xl bg-white/20" />
            <Skeleton className="h-4 w-80 rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      <div className="relative mt-20 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-3 w-32 rounded-full" />
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`contact-info-${i}`} className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm">
                <Skeleton className="h-5 w-5 rounded-full flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-border/50 bg-card/60 p-8 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-10 w-48 rounded-xl" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`contact-form-${i}`} className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded-full" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
