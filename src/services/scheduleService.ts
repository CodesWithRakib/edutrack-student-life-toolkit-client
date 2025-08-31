import apiClient from "@/lib/apiClient";
import type { SavingsGoal } from "@/types/schedule";

export const scheduleService = {
  // ---------------- Savings Goal ----------------
  getSavingsGoal: async (): Promise<SavingsGoal> => {
    const { data } = await apiClient.get("/savings-goal");
    return data;
  },

  setSavingsGoal: async (
    goal: Omit<SavingsGoal, "_id">
  ): Promise<SavingsGoal> => {
    const { data } = await apiClient.post("/savings-goal", goal);
    return data;
  },

  updateSavingsGoal: async (
    updates: Partial<SavingsGoal>
  ): Promise<SavingsGoal> => {
    const { data } = await apiClient.put("/savings-goal", updates);
    return data;
  },
};
