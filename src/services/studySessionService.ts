// src/services/studySessionService.ts
import apiClient from "@/lib/apiClient";
import type { StudySession } from "@/types/education";

// Define interface for query parameters
export interface StudySessionFilters {
  period?: "today" | "week" | "month";
  completed?: boolean;
}

// Define interface for creating study sessions with only the required fields
export interface CreateStudySessionData {
  subject: string;
  topic: string;
  durationMinutes: number;
  date: Date | string;
  time: string;
  priority?: "high" | "medium" | "low";
  notes?: string;
}

export const studySessionService = {
  // Updated to support query parameters for filtering
  getStudySessions: async (
    filters?: StudySessionFilters
  ): Promise<StudySession[]> => {
    // Convert filters object to query string
    const params = new URLSearchParams();
    if (filters?.period) {
      params.append("period", filters.period);
    }
    if (filters?.completed !== undefined) {
      params.append("completed", filters.completed.toString());
    }

    const queryString = params.toString();
    const url = queryString
      ? `/study-sessions?${queryString}`
      : "/study-sessions";

    const { data } = await apiClient.get(url);
    return data;
  },

  // Simplified with clearer interface for creating study sessions
  createStudySession: async (
    session: CreateStudySessionData
  ): Promise<StudySession> => {
    const { data } = await apiClient.post("/study-sessions", session);
    return data;
  },

  // Updated to exclude fields that shouldn't be updated by the client
  updateStudySession: async (
    id: string,
    updates: Partial<
      Omit<StudySession, "_id" | "createdAt" | "updatedAt" | "user">
    >
  ): Promise<StudySession> => {
    const { data } = await apiClient.put(`/study-sessions/${id}`, updates);
    return data;
  },

  // This function looks correct as is
  toggleStudySessionCompletion: async (id: string): Promise<StudySession> => {
    const { data } = await apiClient.patch(`/study-sessions/${id}/toggle`);
    return data;
  },

  // This function looks correct as is
  deleteStudySession: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/study-sessions/${id}`);
    return data;
  },
};
