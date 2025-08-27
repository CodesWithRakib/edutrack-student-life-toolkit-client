// src/services/authService.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api";

//process.env.REACT_APP_API_URL ||

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get("/auth/verify");
    return response.data;
  },
};

export default api;
