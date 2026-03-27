import axios from "axios";

const BASE_URL = "http://localhost:5000";

// Public instance
export default axios.create({
  baseURL: BASE_URL,
});

// Private instance 
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});