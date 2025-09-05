// src/services/studyGoalService.ts
import apiClient from "@/lib/apiClient";
import type { StudyGoal } from "@/types/education";

// Define interface for query parameters
export interface StudyGoalFilters {
  period?: "daily" | "weekly" | "monthly";
}

// Define interface for creating study goals with only the required fields
export interface CreateStudyGoalData {
  subject: string;
  targetHours: number;
  period?: "daily" | "weekly" | "monthly";
  startDate?: Date;
  endDate?: Date;
}

export const studyGoalService = {
  // Updated to support query parameters for filtering
  getStudyGoals: async (filters?: StudyGoalFilters): Promise<StudyGoal[]> => {
    // Convert filters object to query string
    const params = new URLSearchParams();
    if (filters?.period) {
      params.append("period", filters.period);
    }

    const queryString = params.toString();
    const url = queryString ? `/study-goals?${queryString}` : "/study-goals";

    const { data } = await apiClient.get(url);
    return data;
  },

  // Simplified with clearer interface for creating study goals
  createStudyGoal: async (goal: CreateStudyGoalData): Promise<StudyGoal> => {
    const { data } = await apiClient.post("/study-goals", goal);
    return data;
  },

  // Updated to exclude fields that are calculated by the backend
  updateStudyGoal: async (
    id: string,
    updates: Partial<
      Omit<
        StudyGoal,
        "_id" | "createdAt" | "updatedAt" | "completedHours" | "achieved"
      >
    >
  ): Promise<StudyGoal> => {
    const { data } = await apiClient.put(`/study-goals/${id}`, updates);
    return data;
  },

  // This function looks correct as is
  deleteStudyGoal: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/study-goals/${id}`);
    return data;
  },
};
