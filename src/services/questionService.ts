import apiClient from "@/lib/apiClient";
import type { Question, QuestionStats, PopularTag } from "@/types/question";

export const questionService = {
  // ---------------- Questions ----------------
  getQuestions: async (params: {
    subject?: string;
    tags?: string[];
    search?: string;
    sort?: "newest" | "most-voted" | "most-viewed";
    page?: number;
    limit?: number;
  }): Promise<{
    questions: Question[];
    totalPages: number;
    currentPage: number;
    total: number;
  }> => {
    const { data } = await apiClient.get("/questions", { params });
    return data;
  },

  getQuestionById: async (id: string): Promise<Question> => {
    const { data } = await apiClient.get(`/questions/${id}`);
    return data;
  },

  createQuestion: async (question: {
    title: string;
    content: string;
    subject: string;
    tags: string[];
    attachments?: Array<{
      url: string;
      type: string;
      size: number;
    }>;
  }): Promise<Question> => {
    const { data } = await apiClient.post("/questions", question);
    return data;
  },

  updateQuestion: async (
    id: string,
    updates: Partial<Question>
  ): Promise<Question> => {
    const { data } = await apiClient.put(`/questions/${id}`, updates);
    return data;
  },

  deleteQuestion: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/questions/${id}`);
    return data;
  },

  voteQuestion: async (id: string, type: "up" | "down"): Promise<Question> => {
    const { data } = await apiClient.post(`/questions/${id}/vote`, { type });
    return data;
  },

  // ---------------- Tags ----------------
  getPopularTags: async (): Promise<PopularTag[]> => {
    const { data } = await apiClient.get("/questions/tags");
    return data;
  },

  // ---------------- Stats ----------------
  getStats: async (): Promise<QuestionStats> => {
    const { data } = await apiClient.get("/questions/stats");
    return data;
  },
};
