import axios from "axios";

// Central Axios instance.
// When the Node.js / Express / MongoDB backend is ready, set
// REACT_APP_API_URL in .env and the services will automatically
// talk to it. Until then, services fall back to local sample data.

const API_URL = process.env.REACT_APP_API_URL || "";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token (if present) to every request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("driveeasy_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Surface a clean error message to callers.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
