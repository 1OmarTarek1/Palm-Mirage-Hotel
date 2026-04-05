import axiosInstance from "@/services/axiosInstance";

const isAuthFailure = (error) => {
  const status = error?.response?.status;
  return status === 401 || status === 403;
};

const runAuthorizedRequest = async (config) => {
  try {
    return await axiosInstance(config);
  } catch (error) {
    if (!isAuthFailure(error)) {
      throw error;
    }

    await axiosInstance.get("/auth/refresh-token");
    return axiosInstance(config);
  }
};

export const fetchUserPreferences = async () => {
  const response = await runAuthorizedRequest({
    method: "get",
    url: "/user/preferences",
  });

  return response?.data?.data ?? {};
};

export const updateUserPreferences = async (payload) => {
  const response = await runAuthorizedRequest({
    method: "patch",
    url: "/user/preferences",
    data: payload,
  });

  return response?.data?.data ?? {};
};
