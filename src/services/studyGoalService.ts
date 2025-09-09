import apiClient from "@/lib/apiClient";
import type {
  CreateStudyGoalData,
  StudyGoal,
  StudyGoalFilters,
  UpdateStudyGoalPayload,
} from "@/types/education";

export const studyGoalService = {
  getStudyGoals: async (filters?: StudyGoalFilters): Promise<StudyGoal[]> => {
    const params = new URLSearchParams();
    if (filters?.period) params.append("period", filters.period);
    const queryString = params.toString();
    const url = queryString ? `/study-goals?${queryString}` : "/study-goals";
    const { data } = await apiClient.get<StudyGoal[]>(url);
    return data;
  },

  createStudyGoal: async (goal: CreateStudyGoalData): Promise<StudyGoal> => {
    const { data } = await apiClient.post<StudyGoal>("/study-goals", goal);
    return data;
  },

  updateStudyGoal: async (
    id: string,
    updates: UpdateStudyGoalPayload
  ): Promise<StudyGoal> => {
    const { data } = await apiClient.put<StudyGoal>(
      `/study-goals/${id}`,
      updates
    );
    return data;
  },

  deleteStudyGoal: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/study-goals/${id}`
    );
    return data;
  },
};
