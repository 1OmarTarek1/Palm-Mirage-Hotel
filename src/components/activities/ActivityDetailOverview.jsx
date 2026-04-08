import { MapPin } from "lucide-react";

export default function ActivityDetailOverview({ activity }) {
  return (
    <div className="grid gap-6 border-b border-border/50 pb-10 md:grid-cols-4">
      <div className="space-y-1">
        <div className="text-2xl font-header font-bold text-secondary">${activity.basePrice}</div>
        <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          {activity.pricingType === "per_group" ? "Per Group" : "Per Person"}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-header font-bold text-secondary">{activity.durationMinutes}</div>
        <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Minutes
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-lg font-header font-bold text-secondary">{activity.defaultCapacity}</div>
        <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Default Capacity
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-lg font-header font-bold text-secondary">
          <MapPin size={18} />
          <span>{activity.location || "Hotel concierge"}</span>
        </div>
        <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Meeting Point
        </div>
      </div>
    </div>
  );
}
