import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "./useAxios";
import { userService } from "@/services/userService";

export const useUser = () => {
  const axiosInstance = useAxios();
  const service = userService(axiosInstance);
  const queryClient = useQueryClient();

  // Get my profile
  const myProfileQuery = useQuery({
    queryKey: ["users", "me"],
    queryFn: service.getMyProfile,
    enabled: !!axiosInstance, // only run when axios is ready
  });

  // Sync user after login/signup
  const syncUser = useMutation({
    mutationFn: service.syncUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });

  // Update my profile
  const updateProfile = useMutation({
    mutationFn: service.updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });

  // Admin only
  const allUsersQuery = useQuery({
    queryKey: ["users"],
    queryFn: service.getAllUsers,
    enabled: !!axiosInstance,
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      service.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    myProfileQuery,
    syncUser,
    updateProfile,
    allUsersQuery,
    updateRole,
  };
};
