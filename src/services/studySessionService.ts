import apiClient from "@/lib/apiClient";
import type { StudySession } from "@/types/education";

export const studySessionService = {
  // ---------------- Study Sessions ----------------
  getStudySessions: async (): Promise<StudySession[]> => {
    const { data } = await apiClient.get("/study-sessions");
    return data;
  },

  createStudySession: async (
    session: Omit<StudySession, "_id">
  ): Promise<StudySession> => {
    const { data } = await apiClient.post("/study-sessions", session);
    return data;
  },

  updateStudySession: async (
    id: string,
    updates: Partial<StudySession>
  ): Promise<StudySession> => {
    const { data } = await apiClient.put(`/study-sessions/${id}`, updates);
    return data;
  },

  toggleStudySessionCompletion: async (id: string): Promise<StudySession> => {
    const { data } = await apiClient.patch(`/study-sessions/${id}/toggle`);
    return data;
  },

  deleteStudySession: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/study-sessions/${id}`);
    return data;
  },
};
