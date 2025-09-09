// src/services/studySessionService.ts
import apiClient from "@/lib/apiClient";
import type {
  CreateStudySessionPayload,
  DeleteStudySessionResponse,
  StudySession,
  StudySessionFilters,
  UpdateStudySessionPayload,
} from "@/types/education";

export const studySessionService = {
  // ✅ Fetch study sessions with optional filters
  async getStudySessions(
    filters?: StudySessionFilters
  ): Promise<StudySession[]> {
    const params = new URLSearchParams();
    if (filters?.period) params.append("period", filters.period);
    if (filters?.completed !== undefined)
      params.append("completed", String(filters.completed));

    const queryString = params.toString();
    const url = queryString
      ? `/study-sessions?${queryString}`
      : "/study-sessions";

    const { data } = await apiClient.get<StudySession[]>(url);
    return data;
  },

  // ✅ Create a new study session
  async createStudySession(
    session: CreateStudySessionPayload
  ): Promise<StudySession> {
    const { data } = await apiClient.post<StudySession>(
      "/study-sessions",
      session
    );
    return data;
  },

  // ✅ Update an existing study session
  async updateStudySession(
    id: string,
    updates: UpdateStudySessionPayload
  ): Promise<StudySession> {
    const { data } = await apiClient.put<StudySession>(
      `/study-sessions/${id}`,
      updates
    );
    return data;
  },

  // ✅ Toggle completion status
  async toggleStudySessionCompletion(id: string): Promise<StudySession> {
    const { data } = await apiClient.patch<StudySession>(
      `/study-sessions/${id}/toggle`
    );
    return data;
  },

  // ✅ Delete a study session
  async deleteStudySession(id: string): Promise<DeleteStudySessionResponse> {
    const { data } = await apiClient.delete<DeleteStudySessionResponse>(
      `/study-sessions/${id}`
    );
    return data;
  },
};
