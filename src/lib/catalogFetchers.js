import axiosInstance from "@/services/axiosInstance";
import { fetchActivities, fetchActivityById, fetchActivitySchedules } from "@/services/activityService";
import menuApi from "@/services/menuApi";
import { normalizePagination } from "@/lib/pagination/normalizePagination";

/** Mirrors roomsSlice normalization — single source for list shape */
export function normalizeRoomsListPayload(data, page, limit) {
  const responseData = data?.data?.rooms || data?.data || data;

  if (Array.isArray(responseData?.data)) {
    const pagination = normalizePagination(responseData, page, limit);
    return {
      rooms: responseData.data,
      ...pagination,
    };
  }

  if (Array.isArray(responseData)) {
    return {
      rooms: responseData,
      page,
      limit,
      totalPages: 1,
      totalItems: responseData.length,
    };
  }

  const pagination = normalizePagination(responseData, page, limit);
  return {
    rooms: responseData?.data || responseData || [],
    page: pagination.page,
    limit: pagination.limit,
    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems,
  };
}

export async function fetchRoomsList({ page = 1, limit = 20 } = {}) {
  const { data } = await axiosInstance.get("/rooms", { params: { page, limit } });
  return normalizeRoomsListPayload(data, page, limit);
}

export async function fetchRoomDetail(id) {
  const { data } = await axiosInstance.get(`/rooms/${id}`);
  return data?.data?._doc || data?.data?.room || data?.data || data;
}

export async function fetchMenuGroupedPayload() {
  const raw = await menuApi.getGroupedMenu();
  const dataPayload = raw?.data || {};
  return {
    categories: dataPayload.categories || [],
    groupedItems: dataPayload.categoryMenuItems || {},
  };
}

export async function fetchRestaurantPageImages() {
  const raw = await menuApi.getRestaurantPage();
  return raw?.data?.images ?? null;
}

export { fetchActivities, fetchActivityById, fetchActivitySchedules };
