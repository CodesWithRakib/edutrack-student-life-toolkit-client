// src/services/questionService.ts
import apiClient from "@/lib/apiClient";
import type {
  Question,
  QuestionStats,
  PopularTag,
  Attachment,
} from "@/types/question";

type GetQuestionsParams = {
  subject?: string;
  tags?: string[];
  search?: string;
  sort?: "newest" | "most-voted" | "most-viewed";
  page?: number;
  limit?: number;
};

type CreateQuestionPayload = {
  title: string;
  content: string;
  subject: string;
  tags: string[];
  attachments?: Attachment[];
};

type UpdateQuestionPayload = Partial<{
  title: string;
  content: string;
  subject: string;
  tags: string[];
  attachments: Attachment[];
}>;

export const questionService = {
  // ---------------- Questions ----------------
  getQuestions: async (
    params: GetQuestionsParams
  ): Promise<{
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

  createQuestion: async (payload: CreateQuestionPayload): Promise<Question> => {
    const { data } = await apiClient.post("/questions", payload);
    return data.question ?? data; // backend wraps in `question`
  },

  updateQuestion: async (
    id: string,
    payload: UpdateQuestionPayload
  ): Promise<Question> => {
    const { data } = await apiClient.put(`/questions/${id}`, payload);
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
