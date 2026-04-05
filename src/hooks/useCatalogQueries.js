import { useQuery, useQueries } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import {
  fetchRoomsList,
  fetchRoomDetail,
  fetchActivities,
  fetchActivityById,
  fetchActivitySchedules,
  fetchMenuGroupedPayload,
  fetchRestaurantPageImages,
} from "@/lib/catalogFetchers";

const STALE_ROOMS_MS = 60_000;
const STALE_ACTIVITIES_MS = 60_000;
const STALE_ACTIVITY_DETAIL_MS = 60_000;
/** Schedules include live seat counts */
const STALE_ACTIVITY_SCHEDULES_MS = 15_000;
const STALE_MENU_MS = 45_000;
const STALE_RESTAURANT_PAGE_MS = 120_000;

export function useRoomsListQuery(params = { page: 1, limit: 20 }) {
  return useQuery({
    queryKey: queryKeys.rooms.list(params),
    queryFn: () => fetchRoomsList(params),
    staleTime: STALE_ROOMS_MS,
  });
}

export function useRoomDetailQuery(roomId) {
  return useQuery({
    queryKey: queryKeys.rooms.detail(roomId),
    queryFn: () => fetchRoomDetail(roomId),
    enabled: Boolean(roomId),
    staleTime: STALE_ROOMS_MS,
  });
}

export function useActivitiesListQuery() {
  return useQuery({
    queryKey: queryKeys.activities.list({ limit: 100 }),
    queryFn: () => fetchActivities(),
    staleTime: STALE_ACTIVITIES_MS,
  });
}

export function useActivityDetailQuery(activityId) {
  return useQuery({
    queryKey: queryKeys.activities.detail(activityId),
    queryFn: () => fetchActivityById(activityId),
    enabled: Boolean(activityId),
    staleTime: STALE_ACTIVITY_DETAIL_MS,
  });
}

export function useActivitySchedulesQuery(activityId) {
  return useQuery({
    queryKey: queryKeys.activities.schedules(activityId),
    queryFn: () => fetchActivitySchedules(activityId),
    enabled: Boolean(activityId),
    staleTime: STALE_ACTIVITY_SCHEDULES_MS,
    refetchOnWindowFocus: true,
  });
}

export function useMenuGroupedQuery() {
  return useQuery({
    queryKey: queryKeys.menu.grouped(),
    queryFn: fetchMenuGroupedPayload,
    staleTime: STALE_MENU_MS,
  });
}

export function useRestaurantPageImagesQuery() {
  return useQuery({
    queryKey: queryKeys.menu.restaurantPage(),
    queryFn: fetchRestaurantPageImages,
    staleTime: STALE_RESTAURANT_PAGE_MS,
  });
}

export function useRestaurantMenuBundleQuery() {
  return useQueries({
    queries: [
      {
        queryKey: queryKeys.menu.grouped(),
        queryFn: fetchMenuGroupedPayload,
        staleTime: STALE_MENU_MS,
      },
      {
        queryKey: queryKeys.menu.restaurantPage(),
        queryFn: fetchRestaurantPageImages,
        staleTime: STALE_RESTAURANT_PAGE_MS,
      },
    ],
  });
}
