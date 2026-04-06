import axios from "axios";

const BASE_URL = (
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
    : import.meta.env.VITE_API_BASE_URL ||
      (() => {
        throw new Error(
          "[axiosInstance] VITE_API_BASE_URL is required in production but was not set."
        );
      })()
).replace(/\/$/, "");

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});