import apiClient from "@/lib/apiClient";
import type { BudgetCategory } from "@/types/budget";

export const budgetService = {
  // ---------------- Budget Categories ----------------
  getBudgetCategories: async (): Promise<BudgetCategory[]> => {
    const { data } = await apiClient.get("/budget-categories");
    return data;
  },

  createBudgetCategory: async (
    category: Omit<BudgetCategory, "_id">
  ): Promise<BudgetCategory> => {
    const { data } = await apiClient.post("/budget-categories", category);
    return data;
  },

  updateBudgetCategory: async (
    id: string,
    updates: Partial<BudgetCategory>
  ): Promise<BudgetCategory> => {
    const { data } = await apiClient.put(`/budget-categories/${id}`, updates);
    return data;
  },

  deleteBudgetCategory: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/budget-categories/${id}`);
    return data;
  },
};
