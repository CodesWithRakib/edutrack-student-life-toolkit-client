// src/services/answerService.ts
import apiClient from "@/lib/apiClient";
import type { Answer, AnswersResponse } from "@/types/answer";

export const answerService = {
  // Public: Get answers for a question
  getAnswersByQuestion: async (
    questionId: string
  ): Promise<AnswersResponse> => {
    const { data } = await apiClient.get(`/answers/question/${questionId}`);
    return data;
  },

  // Create a new answer
  createAnswer: async (answer: {
    question: string;
    content: string;
  }): Promise<Answer> => {
    const { data } = await apiClient.post("/answers", answer);
    return data;
  },

  // Update an answer
  updateAnswer: async (
    id: string,
    updates: Partial<Answer>
  ): Promise<Answer> => {
    const { data } = await apiClient.put(`/answers/${id}`, updates);
    return data;
  },

  // Delete an answer
  deleteAnswer: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/answers/${id}`);
    return data;
  },

  // Vote on an answer (upvote or downvote)
  voteAnswer: async (id: string, value: 1 | -1): Promise<Answer> => {
    const { data } = await apiClient.post(`/answers/${id}/vote`, { value });
    return data;
  },

  // Accept an answer (mark as accepted)
  acceptAnswer: async (id: string): Promise<Answer> => {
    const { data } = await apiClient.post(`/answers/${id}/accept`);
    return data;
  },
};
