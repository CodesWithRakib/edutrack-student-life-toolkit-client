import useAxios from "@/hooks/useAxios";
import type { User } from "@/types/user";

export const userService = (axiosInstance: ReturnType<typeof useAxios>) => ({
  // Sync Firebase user with DB
  syncUser: async () => {
    const { data } = await axiosInstance.post("/users/sync");
    return data;
  },

  // Get own profile
  getMyProfile: async () => {
    const { data } = await axiosInstance.get("/users/me");
    return data;
  },

  // Update own profile
  updateMyProfile: async (payload: User) => {
    const { data } = await axiosInstance.put("/users/me", payload);
    return data;
  },

  // Admin only: Get all users
  getAllUsers: async () => {
    const { data } = await axiosInstance.get("/users");
    return data;
  },

  // Admin only: Update user role
  updateUserRole: async (id: string, role: string) => {
    const { data } = await axiosInstance.patch(`/users/${id}/role`, { role });
    return data;
  },
});
