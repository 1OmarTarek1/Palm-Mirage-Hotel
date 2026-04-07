import axios from "axios";
import { getBaseUrl } from "@/services/axiosInstance";

const useRefreshToken = () => {
  const refresh = async () => {
    // Create a custom axios instance for refresh token to avoid infinite loop
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Create a separate axios instance for refresh to avoid interceptor loops
    const refreshAxios = axios.create({
      baseURL: getBaseUrl(),
      headers: { "Content-Type": "application/json" },
      withCredentials: false,
    });

    const response = await refreshAxios.get("/auth/refresh-token", {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    });
    
    const newAccessToken = response?.data?.data?.token?.accessToken;
    
    if (newAccessToken) {
      localStorage.setItem('accessToken', newAccessToken);
    }
    
    return response;
  };

  return refresh;
};

export default useRefreshToken;
