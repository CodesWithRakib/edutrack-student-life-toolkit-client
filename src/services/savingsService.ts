// src/services/savingsService.ts
import apiClient from "@/lib/apiClient";
import type { SavingsGoal } from "@/types/budget";

export const savingsService = {
  // ---------------- Savings Goal ----------------
  getSavingsGoal: async (): Promise<SavingsGoal> => {
    const { data } = await apiClient.get("/savings-goals");
    return data;
  },

  setSavingsGoal: async (
    goal: Omit<SavingsGoal, "_id">
  ): Promise<SavingsGoal> => {
    const { data } = await apiClient.post("/savings-goals", goal);
    return data;
  },

  updateSavingsGoal: async (
    updates: Partial<SavingsGoal>
  ): Promise<SavingsGoal> => {
    const { data } = await apiClient.put("/savings-goals", updates);
    return data;
  },
};
