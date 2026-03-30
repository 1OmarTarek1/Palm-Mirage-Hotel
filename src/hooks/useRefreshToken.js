import axiosInstance from "@/services/axiosInstance";

const useRefreshToken = () => {
  const refresh = async () => {
    await axiosInstance.get("/auth/refresh-token");
  };

  return refresh;
};

export default useRefreshToken;
