import { CalendarDays, Clock3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ActivitySessionCard({ schedule, onBook, conflict = null }) {
  const isAvailable = schedule.status !== "cancelled" && schedule.availableSeats > 0;
  const isBookedByGuest = conflict?.type === "existing_booking";
  const isInCart = conflict?.type === "pending_cart";
  const isDisabled = !isAvailable || isBookedByGuest || isInCart;
  const statusLabel = isBookedByGuest
    ? "Already Booked"
    : isInCart
      ? "In Your Cart"
      : isAvailable
        ? "Available"
        : "Fully Booked";
  const statusClassName = isBookedByGuest
    ? "bg-amber-500/12 text-amber-700"
    : isInCart
      ? "bg-sky-500/12 text-sky-700"
      : isAvailable
        ? "bg-emerald-500/12 text-emerald-600"
        : "bg-red-500/12 text-red-500";

  return (
    <div
      className={`rounded-[2rem] border p-6 transition-colors ${
        isDisabled ? "border-border/60 bg-muted/35 opacity-80" : "border-border bg-card"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarDays size={16} className="text-secondary" />
            <span>{schedule.date}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 size={16} className="text-secondary" />
            <span>
              {schedule.startTime} - {schedule.endTime}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={16} className="text-secondary" />
            <span>{schedule.availableSeats} seats left</span>
          </div>
        </div>

        <div className="space-y-3 text-right">
          <div>
            <p className="text-xl font-header font-bold text-secondary">${schedule.resolvedPrice}</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {schedule.pricingType === "per_group" ? "Per Group" : "Per Person"}
            </p>
          </div>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${statusClassName}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {schedule.notes ? (
        <p className="mt-5 border-t border-border/50 pt-5 text-sm leading-relaxed text-muted-foreground">
          {schedule.notes}
        </p>
      ) : null}

      {conflict ? (
        <p className="mt-5 border-t border-border/50 pt-5 text-sm leading-relaxed text-muted-foreground">
          {conflict.message}
        </p>
      ) : null}

      <div className="mt-5">
        <Button
          variant={isDisabled ? "palmSecondary" : "palmPrimary"}
          type="button"
          disabled={isDisabled}
          onClick={() => onBook(schedule.id)}
        >
          {isBookedByGuest
            ? "Already Booked"
            : isInCart
              ? "Already In Cart"
              : isAvailable
                ? "Book This Session"
                : "Session Full"}
        </Button>
      </div>
    </div>
  );
}
