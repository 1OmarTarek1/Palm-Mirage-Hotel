import { useEffect } from "react";

import useRefreshToken from "./useRefreshToken";
import { axiosPrivate } from "@/services/axiosInstance";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();

  useEffect(() => {
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            await refresh();
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            // If refresh fails, clear token and let the app handle logout
            sessionStorage.removeItem('accessToken');
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
