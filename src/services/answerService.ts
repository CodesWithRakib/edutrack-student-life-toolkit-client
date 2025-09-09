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
  }): Promise<Answer> => {
    const { data } = await apiClient.post<Answer>("/answers", answer);
    return data;
  },

  // Update an existing answer
  updateAnswer: async (
    id: string,
    updates: Partial<Answer>
  ): Promise<Answer> => {
    const { data } = await apiClient.put<Answer>(`/answers/${id}`, updates);
    return data;
  },

  // Delete an answer
  deleteAnswer: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/answers/${id}`
    );
    return data;
  },

  // Vote on an answer
  voteAnswer: async (id: string, type: "up" | "down"): Promise<Answer> => {
    const { data } = await apiClient.post<Answer>(`/answers/${id}/vote`, {
      type,
    });
    return data;
  },

  // Accept an answer
  acceptAnswer: async (id: string): Promise<Answer> => {
    const { data } = await apiClient.post<Answer>(`/answers/${id}/accept`);
    return data;
  },
};
