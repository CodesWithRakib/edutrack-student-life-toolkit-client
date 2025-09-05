import apiClient from "@/lib/apiClient";
import type { Answer, AnswersResponse } from "@/types/answer";
import type { AxiosError } from "axios";

export const answerService = {
  // Public: Get paginated answers for a question
  getAnswersByQuestion: async (
    questionId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AnswersResponse> => {
    try {
      const { data } = await apiClient.get<AnswersResponse>(
        `/answers/question/${questionId}`,
        { params: { page, limit } }
      );
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(
        axiosError.response?.data?.message || "Failed to fetch answers"
      );
    }
  },

  // Create a new answer
  createAnswer: async (answerData: {
    questionId: string;
    content: string;
  }): Promise<Answer> => {
    const { data } = await apiClient.post<Answer>("/answers", answerData);
    return data;
  },
  // Update an answer
  updateAnswer: async (
    id: string,
    updates: Partial<Answer>
  ): Promise<Answer> => {
    try {
      const { data } = await apiClient.put<Answer>(`/answers/${id}`, updates);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(
        axiosError.response?.data?.message || "Failed to update answer"
      );
    }
  },

  // Delete an answer
  deleteAnswer: async (id: string): Promise<{ message: string }> => {
    try {
      const { data } = await apiClient.delete<{ message: string }>(
        `/answers/${id}`
      );
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(
        axiosError.response?.data?.message || "Failed to delete answer"
      );
    }
  },

  // Vote on an answer
  voteAnswer: async (id: string, value: "up" | "down"): Promise<Answer> => {
    try {
      const { data } = await apiClient.post<Answer>(`/answers/${id}/vote`, {
        type: value,
      });
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(
        axiosError.response?.data?.message || "Failed to cast vote"
      );
    }
  },

  // Accept an answer
  acceptAnswer: async (id: string): Promise<Answer> => {
    try {
      const { data } = await apiClient.post<Answer>(`/answers/${id}/accept`);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(
        axiosError.response?.data?.message || "Failed to accept answer"
      );
    }
  },
};
