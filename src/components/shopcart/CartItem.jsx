import { Link } from "react-router-dom";
import { Trash2, BedDouble, Edit3, Eye } from "lucide-react";
import RoomNumberBadge from "@/components/rooms/RoomNumberBadge";
import { calculateCartItemTotal, formatBookingDateLabel } from "@/utils/roomBooking";
import { resolveCartRoomDetailId } from "@/utils/resolveCartRoomDetailId";
import { Button } from "@/components/ui/button";

export default function CartItem({ item, onEditDates, onRemove }) {
  const isAvailable = item.availabilityStatus === "available";
  const roomDetailId = resolveCartRoomDetailId(item);

  return (
    <div className="group overflow-hidden rounded-[30px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex flex-col lg:flex-row">
        <div className="relative h-56 w-full shrink-0 overflow-hidden lg:h-auto lg:w-[250px]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          <RoomNumberBadge
            room={item}
            className="bottom-4 left-4 right-auto top-auto z-30"
          />
        <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-primary px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow-lg">
              {item.category}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] shadow-lg ${
                isAvailable
                  ? "bg-secondary text-white"
                  : "bg-destructive text-white"
              }`}
            >
              {isAvailable ? "Available" : "Needs check"}
            </span>
          </div>
          {roomDetailId ? (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="absolute bottom-4 right-4 z-30 h-9 w-9 rounded-full border border-white/25 bg-black/35 text-white shadow-md backdrop-blur-sm hover:bg-black/50 hover:text-white"
            >
              <Link to={`/rooms/${roomDetailId}`} aria-label="View room details" title="View room details">
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <BedDouble className="h-10 w-10 text-primary" />
          </div>
        )}
      </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-header text-2xl font-bold leading-tight text-foreground">
                {item.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                ${item.price.toFixed(2)} / night
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-start">
              <Button
                type="button"
                variant="light"
                size="icon"
                onClick={() => onEditDates(item)}
                className="h-10 w-10 border-primary/20 bg-primary/5 text-primary transition-colors hover:border-primary/35 hover:bg-primary/15 hover:text-primary"
                aria-label="Edit booking dates"
                title="Edit booking dates"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="light"
                size="icon"
                onClick={() => onRemove(item.id)}
                className="h-10 w-10 text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remove item"
                title="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-border bg-muted/35 px-3 py-2 text-xs font-medium text-foreground">
              {formatBookingDateLabel(item.checkInDate)} - {formatBookingDateLabel(item.checkOutDate)}
            </span>
            <span className="rounded-full border border-border bg-muted/35 px-3 py-2 text-xs font-medium text-foreground">
              {item.adults} adults, {item.children} children
            </span>
            <span className="rounded-full border border-border bg-muted/35 px-3 py-2 text-xs font-medium text-foreground">
              {item.roomsCount} room(s)
            </span>
            <span className="rounded-full border border-border bg-muted/35 px-3 py-2 text-xs font-medium text-foreground">
              {item.nights || 0} night(s)
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border/70 pt-5">
            <p className="text-xl font-bold text-foreground">
              ${calculateCartItemTotal(item).toFixed(2)}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Booking total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
