import { useDispatch } from "react-redux";

import axiosInstance from "@/services/axiosInstance";
import { updateAccessToken } from "@/store/slices/authSlice";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const refresh = async () => {
    const response = await axiosInstance.get("/refresh", {
      withCredentials: true,
    });

    const newAccessToken = response.data.accessToken;
    dispatch(updateAccessToken(newAccessToken));
    return newAccessToken;
  };

  return refresh;
};

export default useRefreshToken;
