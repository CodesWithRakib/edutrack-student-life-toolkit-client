import apiClient from "@/lib/apiClient";
import type { StudyGoal } from "@/types/education";

export const studyGoalService = {
  // ---------------- Study Goals ----------------
  getStudyGoals: async (): Promise<StudyGoal[]> => {
    const { data } = await apiClient.get("/study-goals");
    return data;
  },

  createStudyGoal: async (goal: Omit<StudyGoal, "_id">): Promise<StudyGoal> => {
    const { data } = await apiClient.post("/study-goals", goal);
    return data;
  },

  updateStudyGoal: async (
    id: string,
    updates: Partial<StudyGoal>
  ): Promise<StudyGoal> => {
    const { data } = await apiClient.put(`/study-goals/${id}`, updates);
    return data;
  },

  deleteStudyGoal: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/study-goals/${id}`);
    return data;
  },
};
