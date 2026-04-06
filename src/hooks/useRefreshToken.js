import axiosPrivate from "@/services/axiosInstance";

const useRefreshToken = () => {
  const refresh = async () => {
    const response = await axiosPrivate.get("/auth/refresh-token");
    const newAccessToken = response?.data?.data?.token?.accessToken;
    
    if (newAccessToken) {
      sessionStorage.setItem('accessToken', newAccessToken);
    }
    
    return response;
  };

  return refresh;
};

export default useRefreshToken;
