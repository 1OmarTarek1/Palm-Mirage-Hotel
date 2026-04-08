import { cn } from "@/lib/utils";
import { resolveRoomNumber } from "@/utils/resolveRoomNumber";

/**
 * Pill tag for room number — default: absolute top-right on image overlays.
 * @param {boolean} [showPrefix=true] — when false, shows only the number (e.g. cart sidebar).
 */
export default function RoomNumberBadge({ room, roomNumber, className, floating = true, showPrefix = true }) {
  const label =
    roomNumber !== undefined && roomNumber !== null && roomNumber !== ""
      ? String(roomNumber).trim()
      : resolveRoomNumber(room);
  if (!label) return null;

  return (
    <span
      className={cn(
        "pointer-events-none rounded-full border border-border/60 bg-card/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary shadow-md backdrop-blur-sm",
        floating && "absolute right-3 top-3 z-20",
        className,
      )}
      aria-label={`Room ${label}`}
    >
      {showPrefix ? `No. ${label}` : label}
    </span>
  );
}
