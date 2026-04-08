import axiosInstance from "@/services/axiosInstance";

export async function fetchRoomAvailability(roomId, options = {}) {
  const { signal, ...params } = options;
  const { data } = await axiosInstance.get(`/reservations/availability/${roomId}`, {
    params,
    signal,
  });

  return data?.data || data;
}
