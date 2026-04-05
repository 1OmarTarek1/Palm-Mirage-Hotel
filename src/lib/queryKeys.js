/**
 * Stable TanStack Query keys for public catalog / display data.
 * Invalidation: website has few mutations; rely on staleTime + refetchOnWindowFocus.
 * Socket (BookingRealtimeBridge) invalidates notifications only — catalog is unchanged by bookings.
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
