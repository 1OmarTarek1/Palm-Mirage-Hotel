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

const AUTH_STORAGE_KEY = "authState";

const addAuthHeader = (config) => {
  try {
    const rawAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (rawAuth) {
      const { token } = JSON.parse(rawAuth);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.error("[axiosInstance] Failed to parse auth for header:", err);
  }
  return config;
};

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const privateInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

instance.interceptors.request.use(addAuthHeader);
privateInstance.interceptors.request.use(addAuthHeader);

export default instance;
export const axiosPrivate = privateInstance;