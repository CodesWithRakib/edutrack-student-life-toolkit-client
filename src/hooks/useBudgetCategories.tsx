import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetService } from "@/services/budgetService";
import type { BudgetCategory } from "@/types/budget";

// Fetch all budget categories
export function useBudgetCategories() {
  return useQuery<BudgetCategory[], Error>({
    queryKey: ["budget-categories"],
    queryFn: budgetService.getBudgetCategories,
  });
}

// Create budget category
export function useCreateBudgetCategory() {
  const queryClient = useQueryClient();
  return useMutation<
    BudgetCategory,
    Error,
    { category: string; budget: number; color?: string }
  >({
    mutationFn: budgetService.createBudgetCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget-categories"] }),
  });
}

// Update budget category
export function useUpdateBudgetCategory() {
  const queryClient = useQueryClient();
  return useMutation<
    BudgetCategory,
    Error,
    { id: string; updates: Partial<BudgetCategory> }
  >({
    mutationFn: ({ id, updates }) =>
      budgetService.updateBudgetCategory(id, updates),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget-categories"] }),
  });
}

// Delete budget category
export function useDeleteBudgetCategory() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: budgetService.deleteBudgetCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget-categories"] }),
  });
}
