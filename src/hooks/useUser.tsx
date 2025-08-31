// src/hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import type { UserRole } from "@/types/user";
import { auth } from "@/lib/firebase.config";

// Current logged-in user
export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: userService.getMyProfile,
    enabled: !!auth.currentUser,
  });
};

// User role (more descriptive name)
export const useCurrentUserRole = () => {
  return useQuery({
    queryKey: ["currentUserRole"],
    queryFn: userService.getUserRole,
    enabled: !!auth.currentUser,
  });
};

// All users (admin only)
export const useAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: userService.getAllUsers,
  });
};

// Update my profile
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// Update user role (admin only)
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      userService.updateUserRole(id, role as UserRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
};
