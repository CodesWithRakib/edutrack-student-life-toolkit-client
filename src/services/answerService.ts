// services/answerService.ts
import apiClient from "@/lib/apiClient";
import type { Answer, GetAnswersResponse } from "@/types/answer";

export const answerService = {
  // ----------------- Answers -----------------
  // Fetch all answers for a question with pagination
  getAnswersByQuestion: async (
    questionId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<GetAnswersResponse> => {
    const { data } = await apiClient.get<GetAnswersResponse>(
      `/answers/question/${questionId}`,
      { params }
    );
    return data;
  },

  // Create a new answer
  createAnswer: async (answer: {
    questionId: string;
    content: string;
  }): Promise<{ success: boolean; data: Answer }> => {
    const { data } = await apiClient.post<{ success: boolean; data: Answer }>(
      "/answers",
      answer
    );
    return data;
  },

  // Update an existing answer
  updateAnswer: async (
    id: string,
    updates: Partial<Answer>
  ): Promise<{ success: boolean; data: Answer }> => {
    const { data } = await apiClient.put<{ success: boolean; data: Answer }>(
      `/answers/${id}`,
      updates
    );
    return data;
  },

  // Delete an answer
  deleteAnswer: async (
    id: string
  ): Promise<{
    success: boolean;
    message: string;
    data?: { newReputation: number };
  }> => {
    const { data } = await apiClient.delete<{
      success: boolean;
      message: string;
      data?: { newReputation: number };
    }>(`/answers/${id}`);
    return data;
  },

  // Vote on an answer
  voteAnswer: async (
    id: string,
    type: "up" | "down"
  ): Promise<{ success: boolean; data: Answer }> => {
    const { data } = await apiClient.post<{ success: boolean; data: Answer }>(
      `/answers/${id}/vote`,
      {
        type,
      }
    );
    return data;
  },

  // Accept an answer
  acceptAnswer: async (
    id: string
  ): Promise<{ success: boolean; data: Answer }> => {
    const { data } = await apiClient.post<{ success: boolean; data: Answer }>(
      `/answers/${id}/accept`
    );
    return data;
  },
};
