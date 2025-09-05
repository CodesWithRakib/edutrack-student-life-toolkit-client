// src/hooks/useUsers.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { userService } from "@/services/userService";
import type {
  User,
  UsersResponse,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
} from "@/types/user";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...userKeys.lists(), { page, limit }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  me: ["users", "me"] as const,
};

// Current user
export function useMyProfile() {
  return useQuery<User>({
    queryKey: userKeys.me,
    queryFn: userService.getMyProfile,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me });
    },
  });
}

// Admin: all users
export function useUsers(page = 1, limit = 10) {
  return useQuery<UsersResponse>({
    queryKey: userKeys.list(page, limit),
    queryFn: () => userService.getAllUsers(page, limit),
    placeholderData: keepPreviousData, // for better pagination UX
  });
}

// Admin: update role
export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserRolePayload) =>
      userService.updateUserRole(payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}

// Admin: update status
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserStatusPayload) =>
      userService.updateUserStatus(payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}

// Admin: suspend user
export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.suspendUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}

// Admin: activate user
export function useActivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.activateUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}

// Admin: delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}
