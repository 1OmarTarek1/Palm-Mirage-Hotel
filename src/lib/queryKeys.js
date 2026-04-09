/**
 * Stable TanStack Query keys for public catalog / display data.
 * Invalidation: booking and payment events can affect public availability
 * (for example room inventory, activity seat counts, and restaurant capacity).
 * BookingRealtimeBridge and checkout success flows invalidate these keys so
 * active screens refresh without waiting for a manual reload.
 */

export const queryKeys = {
  rooms: {
    all: () => ["website", "rooms"],
    list: (params = {}) => ["website", "rooms", "list", params],
    detail: (id) => ["website", "rooms", "detail", id],
  },
  activities: {
    all: () => ["website", "activities"],
    list: (opts = {}) => ["website", "activities", "list", opts],
    detail: (id) => ["website", "activities", "detail", id],
    /** Seat counts — keep short staleTime */
    schedules: (activityId) => ["website", "activities", "schedules", activityId],
  },
  menu: {
    all: () => ["website", "menu"],
    grouped: () => ["website", "menu", "grouped"],
    restaurantPage: () => ["website", "menu", "restaurant-page"],
  },
};
