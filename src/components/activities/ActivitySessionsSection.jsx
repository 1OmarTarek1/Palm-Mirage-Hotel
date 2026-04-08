import ActivitySessionCard from "./ActivitySessionCard";

export default function ActivitySessionsSection({
  title,
  subtitle,
  schedules,
  emptyState,
  onBook,
}) {
  return (
    <div className="pt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
            Live Availability
          </span>
          <h2 className="mt-3 text-3xl font-header font-bold text-foreground">{title}</h2>
        </div>

        {subtitle ? (
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {schedules.map((schedule) => (
          <ActivitySessionCard key={schedule.id} schedule={schedule} onBook={onBook} />
        ))}
      </div>

      {schedules.length === 0 && emptyState ? (
        <div className="mt-8 rounded-[2rem] border border-border bg-muted/35 px-6 py-8 text-sm text-muted-foreground">
          {emptyState}
        </div>
      ) : null}
    </div>
  );
}
