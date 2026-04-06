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

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});