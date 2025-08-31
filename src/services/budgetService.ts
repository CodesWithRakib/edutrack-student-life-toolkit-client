import apiClient from "@/lib/apiClient";
import type { BudgetCategory, TransactionSummary } from "@/types/budget";

export const budgetService = {
  // ---------------- Budget Categories ----------------
  getBudgetCategories: async (): Promise<BudgetCategory[]> => {
    const { data } = await apiClient.get("/budget-categories");
    return data.map((cat: BudgetCategory) => ({
      ...cat,
      spent: cat.spent || 0,
    }));
  },

  getTransactionSummary: async (): Promise<TransactionSummary> => {
    const { data } = await apiClient.get("/transactions/summary");
    return data;
  },

  createBudgetCategory: async (category: {
    category: string;
    budget: number;
    color?: string;
  }): Promise<BudgetCategory> => {
    const { data } = await apiClient.post("/budget-categories", category);
    return { ...data, spent: 0 };
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
