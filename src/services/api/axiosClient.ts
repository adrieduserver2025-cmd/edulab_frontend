import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Automatically inject Firebase Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle common global errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // Auto logout or redirect on expired token (401 Unauthorized)
      if (status === 401) {
        console.warn("Unauthorized request! Session may have expired.");
        // Optional: Trigger auth store logout if token is invalid
        // useAuthStore.getState().logout();
      }
      
      if (status === 403) {
        console.error("Forbidden resource! You don't have access permissions.");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
