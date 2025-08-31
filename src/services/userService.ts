// src/services/userService.ts
import apiClient from "@/lib/apiClient";
import type { User, UserRole, UsersResponse } from "@/types/user";

export const userService = {
  // Sync Firebase user with DB after register/login
  syncUser: async (user: { uid: string; email: string; name?: string }) => {
    const { data } = await apiClient.post("/users/sync", user);
    return data;
  },

  // Get current user profile
  getMyProfile: async (): Promise<User> => {
    const { data } = await apiClient.get("/users/me");
    return data;
  },
  // Get current user profile
  getUserRole: async (): Promise<User> => {
    const { data } = await apiClient.get("/users/me");
    return data?.role;
  },

  // Update current user profile
  updateMyProfile: async (updates: Partial<User>): Promise<User> => {
    const { data } = await apiClient.put("/users/me", updates);
    return data;
  },

  // Admin: Get all users (with optional pagination)
  getAllUsers: async (
    page: number = 1,
    limit: number = 10
  ): Promise<UsersResponse> => {
    const { data } = await apiClient.get<UsersResponse>("/users", {
      params: { page, limit },
    });
    return data;
  },

  // Admin: update user role
  updateUserRole: async (id: string, role: UserRole): Promise<User> => {
    const { data } = await apiClient.put(`/users/${id}/role`, { role });
    return data;
  },
};
