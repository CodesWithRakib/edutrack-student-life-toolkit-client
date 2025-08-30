import axios from "axios";
import { useAuth } from "./useAuth";

const useAxios = () => {
  const baseURL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const { user } = useAuth();

  const axiosInstance = axios.create({ baseURL });

  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config) => {
      if (user) {
        try {
          const token = await user.getIdToken(true);
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error("Error getting auth token:", error);
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry && user) {
        originalRequest._retry = true;

        try {
          const freshToken = await user.getIdToken(true);
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
