// src/hooks/useSavingsGoal.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { savingsService } from "@/services/savingsService";
import { toast } from "sonner";
import type { SavingsGoal } from "@/types/budget";

// Fetch savings goal
export const useSavingsGoal = () => {
  return useQuery<SavingsGoal, Error>({
    queryKey: ["savings-goal"],
    queryFn: savingsService.getSavingsGoal,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Set new savings goal
export const useSetSavingsGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: savingsService.setSavingsGoal,
    onSuccess: (data) => {
      queryClient.setQueryData(["savings-goal"], data);
      toast.success("Savings goal set successfully");
    },
  });
};

// Update existing savings goal
export const useUpdateSavingsGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: savingsService.updateSavingsGoal,
    onSuccess: (data) => {
      queryClient.setQueryData(["savings-goal"], data);
      toast.success("Savings goal updated successfully");
    },
  });
};
