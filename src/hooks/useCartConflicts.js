import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectPendingRestaurantBookings,
  selectPendingActivityBookings,
} from "@/store/slices/cartSlice";
import { isRestaurantTableMode } from "@/components/profile/profileUtils";

/**
 * Returns a map of { [bookingId]: conflictReason } for every item
 * in the cart that has a detectable client-side conflict.
 *
 * Conflict types:
 *  - room_no_dates      : room is missing check-in / check-out
 *  - room_unavailable   : room was flagged unavailable by a previous availability check
 *  - table_duplicate    : same table + date + time booked more than once
 *  - schedule_duplicate : same activity schedule booked more than once
 */
export function useCartConflicts() {
  const cartItems = useSelector(selectCartItems);
  const restaurantBookings = useSelector(selectPendingRestaurantBookings);
  const activityBookings = useSelector(selectPendingActivityBookings);

  const conflicts = useMemo(() => {
    const map = {}; // { id -> { type, message } }

    // ── Rooms ────────────────────────────────────────────────────────────────
    cartItems.forEach((item) => {
      if (!item.checkInDate || !item.checkOutDate) {
        map[item.id] = {
          type: "room_no_dates",
          message: "Select check-in and check-out dates before checkout.",
        };
        return;
      }
      if (item.availabilityStatus === "unavailable") {
        map[item.id] = {
          type: "room_unavailable",
          message: "This room is unavailable for the selected dates.",
        };
      }
    });

    // ── Restaurant — duplicate table + date + time ────────────────────────
    const tableSlotsSeen = {}; // "tableNumber|date|time" -> first bookingId
    restaurantBookings.forEach((booking) => {
      if (isRestaurantTableMode(booking.bookingMode)) {
        const key = `${booking.number ?? booking.selectedTable}|${booking.date}|${booking.time}`;
        if (!key.startsWith("undefined|")) {
          if (tableSlotsSeen[key]) {
            // Mark both as conflicting
            const firstId = tableSlotsSeen[key];
            map[firstId] = {
              type: "table_duplicate",
              message: `Table ${booking.number ?? booking.selectedTable} on ${booking.date} at ${booking.time} is booked twice.`,
            };
            map[booking.id] = {
              type: "table_duplicate",
              message: `Table ${booking.number ?? booking.selectedTable} on ${booking.date} at ${booking.time} is booked twice.`,
            };
          } else {
            tableSlotsSeen[key] = booking.id;
          }
        }
      }
    });

    // ── Activities — duplicate scheduleId ────────────────────────────────
    const schedulesSeen = {}; // scheduleId -> first bookingId
    activityBookings.forEach((booking) => {
      const sid = booking.scheduleId;
      if (!sid) return;
      if (schedulesSeen[sid]) {
        const firstId = schedulesSeen[sid];
        map[firstId] = {
          type: "schedule_duplicate",
          message: `"${booking.activityTitle || "This activity"}" is booked twice on the same schedule.`,
        };
        map[booking.id] = {
          type: "schedule_duplicate",
          message: `"${booking.activityTitle || "This activity"}" is booked twice on the same schedule.`,
        };
      } else {
        schedulesSeen[sid] = booking.id;
      }
    });

    return map;
  }, [cartItems, restaurantBookings, activityBookings]);

  const conflictCount = Object.keys(conflicts).length;
  const hasConflicts = conflictCount > 0;

  // Human-readable list for the summary panel
  const conflictList = useMemo(() => {
    const seen = new Set();
    return Object.values(conflicts).filter((c) => {
      if (seen.has(c.message)) return false;
      seen.add(c.message);
      return true;
    });
  }, [conflicts]);

  return { conflicts, hasConflicts, conflictCount, conflictList };
}
