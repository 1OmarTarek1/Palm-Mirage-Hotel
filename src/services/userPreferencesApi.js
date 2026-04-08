import axiosInstance from "@/services/axiosInstance";

export const fetchUserPreferences = async () => {
  const response = await axiosInstance({
    method: "get",
    url: "/user/preferences",
  });

  return response?.data?.data ?? {};
};

export const updateUserPreferences = async (payload) => {
  const response = await axiosInstance({
    method: "patch",
    url: "/user/preferences",
    data: payload,
  });

  return response?.data?.data ?? {};
};
