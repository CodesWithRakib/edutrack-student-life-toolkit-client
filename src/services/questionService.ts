import apiClient from "@/lib/apiClient";
import type { QuestionStats, Question } from "@/types/question";

export const questionService = {
  // Get all questions
  getQuestions: async (): Promise<Question[]> => {
    const { data } = await apiClient.get("/questions");
    return data;
  },

  // Get popular tags
  getPopularTags: async (): Promise<string[]> => {
    const { data } = await apiClient.get("/questions/tags");
    return data;
  },

  // Get stats
  getStats: async (): Promise<QuestionStats> => {
    const { data } = await apiClient.get("/questions/stats");
    return data;
  },

  // Get single question by id
  getQuestionById: async (id: string): Promise<Question> => {
    const { data } = await apiClient.get(`/questions/${id}`);
    return data;
  },

  // Protected: create question
  createQuestion: async (question: Partial<Question>): Promise<Question> => {
    const { data } = await apiClient.post("/questions", question);
    return data;
  },

  // Protected: update question
  updateQuestion: async (
    id: string,
    updates: Partial<Question>
  ): Promise<Question> => {
    const { data } = await apiClient.put(`/questions/${id}`, updates);
    return data;
  },

  // Protected: delete question
  deleteQuestion: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/questions/${id}`);
    return data;
  },

  // Protected: vote question
  voteQuestion: async (id: string, value: 1 | -1): Promise<Question> => {
    const { data } = await apiClient.post(`/questions/${id}/vote`, { value });
    return data;
  },
};
