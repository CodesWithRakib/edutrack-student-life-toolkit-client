// src/hooks/useQuestions.ts
"use client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { questionService } from "@/services/questionService";
import type {
  Question,
  QuestionsResponse,
  QuestionResponse,
  ApiResponse,
  PopularTag,
  QuestionStats,
} from "@/types/question";

type GetQuestionsParams = {
  subject?: string;
  tags?: string[];
  search?: string;
  sort?: "newest" | "most-voted" | "most-viewed";
  page?: number;
  limit?: number;
};

// ----------------- Queries -----------------
// Fetch list of questions with filters
export const useQuestions = (params: GetQuestionsParams = {}) => {
  return useQuery<QuestionsResponse, Error>({
    queryKey: ["questions", params],
    queryFn: () => questionService.getQuestions(params),
    placeholderData: keepPreviousData,
    select: (data) => data, // The response is already in the correct format
  });
};

// Fetch single question by ID
export const useQuestion = (id: string) => {
  return useQuery<QuestionResponse, Error>({
    queryKey: ["question", id],
    queryFn: () => questionService.getQuestionById(id),
    enabled: !!id, // only fetch if id exists
    select: (data) => data, // The response is already in the correct format
  });
};

// Fetch popular tags
export const usePopularTags = () => {
  return useQuery<ApiResponse<PopularTag[]>, Error>({
    queryKey: ["popular-tags"],
    queryFn: questionService.getPopularTags,
    select: (data) => data, // The response is already in the correct format
  });
};

// Fetch question stats
export const useQuestionStats = () => {
  return useQuery<QuestionStats, Error>({
    queryKey: ["question-stats"],
    queryFn: questionService.getStats,
    select: (data) => data, // The response is already in the correct format
  });
};

// ----------------- Mutations -----------------
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionService.createQuestion,
    onSuccess: (response) => {
      // Extract the question from the response
      const question = response.data;

      // Invalidate the questions query
      queryClient.invalidateQueries({ queryKey: ["questions"] });

      // Also invalidate the specific question if needed
      queryClient.invalidateQueries({ queryKey: ["question", question._id] });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Question> }) =>
      questionService.updateQuestion(id, updates),
    onSuccess: (response) => {
      const question = response.data;

      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", question._id] });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionService.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

export const useVoteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: "up" | "down" }) =>
      questionService.voteQuestion(id, type),
    onSuccess: (response) => {
      const question = response.data;

      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", question._id] });
    },
  });
};
