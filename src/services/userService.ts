// src/services/userService.ts
import apiClient from "@/lib/apiClient";
import type {
  User,
  UsersResponse,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
} from "@/types/user";

export const userService = {
  // Sync Firebase user with backend
  syncUser: async (payload: {
    uid: string;
    email: string;
    name?: string;
  }): Promise<{ message: string; user: User }> => {
    const { data } = await apiClient.post("/users/sync", payload);
    return data;
  },

  // Get current user profile
  getMyProfile: async (): Promise<User> => {
    const { data } = await apiClient.get("/users/me");
    return data;
  },

  // Update current user profile
  updateMyProfile: async (updates: Partial<User>): Promise<User> => {
    const { data } = await apiClient.put("/users/me", updates);
    return data;
  },

  // Admin: get all users
  getAllUsers: async (page = 1, limit = 10): Promise<UsersResponse> => {
    const { data } = await apiClient.get("/users", {
      params: { page, limit },
    });
    return data;
  },

  // Admin: update role
  updateUserRole: async (payload: UpdateUserRolePayload): Promise<User> => {
    const { data } = await apiClient.patch(`/users/${payload.id}/role`, {
      role: payload.role,
    });
    return data;
  },

  // Admin: update status
  updateUserStatus: async (payload: UpdateUserStatusPayload): Promise<User> => {
    const { data } = await apiClient.patch(`/users/${payload.id}/status`, {
      status: payload.status,
    });
    return data;
  },
  // Delete a user (Admin + Firebase)
  deleteUser: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/users/${id}/delete`);
    return data;
  },

  // Suspend a user
  suspendUser: async (id: string): Promise<User> => {
    const { data } = await apiClient.patch(`/users/${id}/suspend`);
    return data;
  },

  // Activate a user
  activateUser: async (id: string): Promise<User> => {
    const { data } = await apiClient.patch(`/users/${id}/activate`);
    return data;
  },
};
