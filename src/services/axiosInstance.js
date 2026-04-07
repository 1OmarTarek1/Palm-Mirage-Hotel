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

// Export both default and named exports
export default axiosInstance;
export { getBaseUrl };