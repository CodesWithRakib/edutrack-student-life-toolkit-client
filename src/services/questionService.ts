// src/services/questionService.ts
import apiClient from "@/lib/apiClient";
import type {
  Question,
  QuestionStats,
  PopularTag,
  Attachment,
  QuestionsResponse,
  QuestionResponse,
  ApiResponse,
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
  ): Promise<QuestionsResponse> => {
    const { data } = await apiClient.get<QuestionsResponse>("/questions", {
      params,
    });
    return data;
  },

  getQuestionById: async (id: string): Promise<QuestionResponse> => {
    const { data } = await apiClient.get<QuestionResponse>(`/questions/${id}`);
    return data;
  },

  createQuestion: async (
    payload: CreateQuestionPayload
  ): Promise<ApiResponse<Question>> => {
    const { data } = await apiClient.post<ApiResponse<Question>>(
      "/questions",
      payload
    );
    return data;
  },

  updateQuestion: async (
    id: string,
    payload: UpdateQuestionPayload
  ): Promise<ApiResponse<Question>> => {
    const { data } = await apiClient.put<ApiResponse<Question>>(
      `/questions/${id}`,
      payload
    );
    return data;
  },

  deleteQuestion: async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/questions/${id}`
    );
    return data;
  },

  voteQuestion: async (
    id: string,
    type: "up" | "down"
  ): Promise<ApiResponse<Question>> => {
    const { data } = await apiClient.post<ApiResponse<Question>>(
      `/questions/${id}/vote`,
      { type }
    );
    return data;
  },

  // ---------------- Tags ----------------
  getPopularTags: async (): Promise<ApiResponse<PopularTag[]>> => {
    const { data } = await apiClient.get<ApiResponse<PopularTag[]>>(
      "/questions/tags"
    );
    return data;
  },

  // ---------------- Stats ----------------
  getStats: async (): Promise<QuestionStats> => {
    const { data } = await apiClient.get<QuestionStats>("/questions/stats");
    return data;
  },
};
