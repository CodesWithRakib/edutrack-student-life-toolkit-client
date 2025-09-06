// src/services/studySessionService.ts
import apiClient from "@/lib/apiClient";
import type { StudySession } from "@/types/education";

// Filters for fetching study sessions
export interface StudySessionFilters {
  period?: "today" | "week" | "month";
  completed?: boolean;
}

// Payload for creating a study session
export interface CreateStudySessionData {
  subject: string;
  topic: string;
  durationMinutes: number;
  date: Date | string;
  time: string;
  priority?: "high" | "medium" | "low";
  notes?: string;
}

// Payload for updating a study session (only fields allowed by backend)
export interface UpdateStudySessionPayload {
  subject?: string;
  topic?: string;
  durationMinutes?: number;
  date?: string | Date;
  time?: string;
  completed?: boolean;
  priority?: "high" | "medium" | "low";
  notes?: string;
}

export const studySessionService = {
  // Fetch study sessions with optional filters
  getStudySessions: async (
    filters?: StudySessionFilters
  ): Promise<StudySession[]> => {
    const params = new URLSearchParams();
    if (filters?.period) params.append("period", filters.period);
    if (filters?.completed !== undefined)
      params.append("completed", filters.completed.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/study-sessions?${queryString}`
      : "/study-sessions";

    const { data } = await apiClient.get<StudySession[]>(url);
    return data;
  },

  // Create a new study session
  createStudySession: async (
    session: CreateStudySessionData
  ): Promise<StudySession> => {
    const { data } = await apiClient.post<StudySession>(
      "/study-sessions",
      session
    );
    return data;
  },

  // Update an existing study session
  updateStudySession: async (
    id: string,
    updates: UpdateStudySessionPayload
  ): Promise<StudySession> => {
    const { data } = await apiClient.put<StudySession>(
      `/study-sessions/${id}`,
      updates
    );
    return data;
  },

  // Toggle completion status
  toggleStudySessionCompletion: async (id: string): Promise<StudySession> => {
    const { data } = await apiClient.patch<StudySession>(
      `/study-sessions/${id}/toggle`
    );
    return data;
  },

  // Delete a study session
  deleteStudySession: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/study-sessions/${id}`
    );
    return data;
  },
};
