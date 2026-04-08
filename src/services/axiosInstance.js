import axios from "axios";

const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (url) return url.trim().replace(/\/$/, "");

  // Fallback to localhost only during local development
  if (import.meta.env.MODE === "development") {
    return "http://localhost:5000";
  }

  // Explicitly fail in production if the variable is missing
  throw new Error(
    "[axiosInstance] VITE_API_BASE_URL is not configured in production settings."
  );
};

const BASE_URL = getBaseUrl();

// Add Authorization header interceptor for requests
const addAuthHeader = (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Disable cookies for Website
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // Disable cookies for Website
});

// Add request interceptor to include Authorization header
axiosPrivate.interceptors.request.use(addAuthHeader);
axiosInstance.interceptors.request.use(addAuthHeader);

let store;
export const setupInterceptors = (_store) => {
  store = _store;
};

// Token refresh concurrency control
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleResponseError = async (error) => {
  const originalRequest = error?.config;

  if (!originalRequest) return Promise.reject(error);

  const status = error?.response?.status;
  const message = String(error?.response?.data?.message || "").toLowerCase();
  
  const isAuthFailure =
    status === 401 ||
    (status === 403 && /authorization|token|credential|in-valid/.test(message));

  // If the refresh token request itself fails, logout and reject immediately
  if (isAuthFailure && originalRequest.url.includes('/auth/refresh-token')) {
    if (store) {
      const { logout } = await import('@/store/slices/authSlice');
      store.dispatch(logout());
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    return Promise.reject(error);
  }

  if (isAuthFailure && !originalRequest._retry) {
    if (isRefreshing) {
      try {
        const token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshTokenString = localStorage.getItem('refreshToken');
    if (!refreshTokenString) {
      isRefreshing = false;
      if (store) {
        const { logout } = await import('@/store/slices/authSlice');
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }

    try {
      // Intentionally avoid using axiosPrivate to prevent interceptor loops
      const response = await axios.get(`${BASE_URL}/auth/refresh-token`, {
        headers: { Authorization: `Bearer ${refreshTokenString}` },
      });

      const data = response?.data?.data;
      const newAccessToken = data?.token?.accessToken || data?.accessToken;
      const newRefreshToken = data?.token?.refreshToken || data?.refreshToken;

      if (!newAccessToken) throw new Error('No new access token received');

      localStorage.setItem('accessToken', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      // Sync Redux State if possible!
      if (store) {
        const state = store.getState();
        const user = state?.auth?.user || JSON.parse(localStorage.getItem('user') || 'null');
        
        if (user) {
          const { setCredentials } = await import('@/store/slices/authSlice');
          store.dispatch(setCredentials({
            user,
            token: newAccessToken,
            refreshToken: newRefreshToken || refreshTokenString,
            skipCollectionsSync: true,
          }));
        }
      }

      processQueue(null, newAccessToken);
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      
      // Clear session completely if refresh fails
      if (store) {
        const { logout } = await import('@/store/slices/authSlice');
        store.dispatch(logout());
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

// Attach the global response interceptor for Auth Failures
axiosPrivate.interceptors.response.use((response) => response, handleResponseError);
axiosInstance.interceptors.response.use((response) => response, handleResponseError);

// Export both default and named exports
export default axiosInstance;
export { getBaseUrl };